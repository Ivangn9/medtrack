// Cloudflare Worker — proxy para Anthropic API, con verificación de sesión
// Deploy en: dash.cloudflare.com → Workers → Create → pegar este código
// Agregar secreto: Settings → Variables → ANTHROPIC_KEY → tu sk-ant-...
//
// FIX DE SEGURIDAD (auditoría 2026-07-29): antes este Worker reenviaba
// cualquier POST a Anthropic sin chequear nada — cualquiera que descubriera
// la URL (queda guardada en localStorage del navegador) podía usarla gratis
// e ilimitadamente a costa de la API key. Ahora exige un ID token de Firebase
// válido (header Authorization: Bearer <token>) de una cuenta NO anónima del
// proyecto medtrack-cima-3e9c1, verificado con la clave pública de Google
// (RS256) — no requiere ninguna librería externa, solo Web Crypto (nativo de
// Cloudflare Workers).

const PROJECT_ID = 'medtrack-cima-3e9c1';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let _jwksCache = null, _jwksCacheAt = 0;
async function getJwks() {
  if (_jwksCache && (Date.now() - _jwksCacheAt) < 3600000) return _jwksCache;
  const resp = await fetch(JWKS_URL);
  if (!resp.ok) throw new Error('No se pudieron obtener las claves públicas de Google');
  const data = await resp.json();
  _jwksCache = data.keys || [];
  _jwksCacheAt = Date.now();
  return _jwksCache;
}

function b64urlToBytes(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Verifica un Firebase ID Token: firma RS256 contra las claves públicas de
// Google + claims (aud/iss/exp/proveedor no-anónimo). Lanza si algo no cierra.
async function verifyFirebaseIdToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Token con formato inválido');
  const [headerB64, payloadB64, sigB64] = parts;
  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(headerB64)));
  const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));

  if (header.alg !== 'RS256') throw new Error('Algoritmo de firma inesperado');
  if (payload.aud !== PROJECT_ID) throw new Error('Token de otro proyecto');
  if (payload.iss !== 'https://securetoken.google.com/' + PROJECT_ID) throw new Error('Emisor inválido');
  if (!payload.exp || payload.exp * 1000 < Date.now()) throw new Error('Token expirado');
  if (!payload.sub) throw new Error('Token sin usuario');
  if (payload.firebase && payload.firebase.sign_in_provider === 'anonymous') {
    throw new Error('Sesión anónima no autorizada');
  }

  const jwks = await getJwks();
  const jwk = jwks.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('Clave de firma desconocida (token viejo o de otro proyecto)');

  const key = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );
  const signedData = new TextEncoder().encode(headerB64 + '.' + payloadB64);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(sigB64), signedData);
  if (!valid) throw new Error('Firma inválida');

  return payload;
}

function corsJson(body, status) {
  return new Response(JSON.stringify(body), { status: status, headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }});
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      }});
    }
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return corsJson({ error: { message: 'Falta el token de autenticación' } }, 401);
    try {
      await verifyFirebaseIdToken(token);
    } catch (e) {
      return corsJson({ error: { message: 'No autorizado: ' + e.message } }, 403);
    }

    try {
      const body = await request.json();
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      return corsJson(data, resp.status);
    } catch (e) {
      return corsJson({ error: { message: e.message } }, 500);
    }
  }
};
