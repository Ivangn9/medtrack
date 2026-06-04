// Cloudflare Worker — proxy para Anthropic API
// Deploy en: dash.cloudflare.com → Workers → Create → pegar este código
// Agregar secreto: Settings → Variables → ANTHROPIC_KEY → tu sk-ant-...

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
        'Access-Control-Max-Age': '86400',
      }});
    }
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
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
      return new Response(JSON.stringify(data), { status: resp.status, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }});
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: e.message } }), { status: 500, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }});
    }
  }
};
