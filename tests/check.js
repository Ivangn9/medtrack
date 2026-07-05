// Smoke tests de MedTrack — correr con: node tests/check.js
// Valida invariantes que romperían producción si se pierden.
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var root = path.join(__dirname, '..');
var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
var fails = [];

function check(name, ok, detail) {
  console.log((ok ? '  ✅ ' : '  ❌ ') + name + (ok ? '' : ' — ' + detail));
  if (!ok) fails.push(name);
}

console.log('MedTrack smoke tests\n');

// ── 1. Los 4 campos de versión deben coincidir ──
var mComment = html.match(/<!-- (v\d{4}\.\d{2}\.\d{2}\.\d+) -->/);
var mMeta = html.match(/<meta name="app-version" content="(v\d{4}\.\d{2}\.\d{2}\.\d+)">/);
var mDisplay = html.match(/var APP_DISPLAY_VERSION="([\d.]+)";/);
var mBuild = html.match(/var APP_BUILD="([^"]+)";/);
check('HTML comment de versión presente', !!mComment, 'no se encontró <!-- vAAAA.MM.DD.NNN -->');
check('meta app-version presente', !!mMeta, 'no se encontró el meta tag');
check('APP_DISPLAY_VERSION presente', !!mDisplay, 'no se encontró la variable');
check('APP_BUILD presente', !!mBuild, 'no se encontró la variable');
if (mComment && mMeta) {
  check('comment y meta coinciden (' + mComment[1] + ')', mComment[1] === mMeta[1],
    mComment[1] + ' != ' + mMeta[1] + ' — checkForUpdates() no detectará la versión');
}

// ── 2. ES5 estricto en scripts inline (regla del proyecto) ──
var scripts = [];
var re = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g, m;
while ((m = re.exec(html)) !== null) scripts.push(m[1]);
var js = scripts.join('\n');
// Falsos positivos comunes: => dentro de strings es raro en este codebase; chequeo directo.
check('sin arrow functions', !/=>/.test(js), 'hay "=>" en un script inline');
check('sin template literals', js.indexOf('`') === -1, 'hay backticks en un script inline');
var jsSinComentarios = js.split('\n').map(function (l) { return l.replace(/\/\/.*$/, ''); }).join('\n');
check('sin const/let', !/\b(const|let)\s+[a-zA-Z_$]/.test(jsSinComentarios), 'hay const/let en un script inline');

// ── 3. Sintaxis JS válida ──
var tmp = path.join(require('os').tmpdir(), 'mt-check-' + Date.now() + '.js');
fs.writeFileSync(tmp, scripts.join('\n;\n'));
try {
  cp.execSync('node --check ' + JSON.stringify(tmp), { stdio: 'pipe' });
  check('sintaxis JS válida (node --check)', true);
} catch (e) {
  check('sintaxis JS válida (node --check)', false, String(e.stderr || e.message).slice(0, 300));
}
fs.unlinkSync(tmp);

// ── 4. Invariantes críticos ──
check('_reportCSS intacto', html.indexOf('_reportCSS') !== -1, 'desapareció la variable _reportCSS');
check('espejo público definido', html.indexOf('_publicSnapshot') !== -1, 'falta _publicSnapshot (seguridad QR)');
check('el espejo no incluye técnicos', !/_publicSnapshot[\s\S]{0,2000}tecnico/.test(html), 'el snapshot público expone "tecnico"');
check('el espejo no incluye costos', !/_publicSnapshot[\s\S]{0,2000}(costo|gasto|presupuesto)/i.test(html), 'el snapshot público expone costos');

// ── 5. eq-public.html no debe mostrar datos internos ──
var pub = fs.readFileSync(path.join(root, 'eq-public.html'), 'utf8');
check('eq-public sin técnico', pub.indexOf('lastMant.tecnico') === -1, 'eq-public muestra el técnico');
check('eq-public sin empresa', pub.indexOf('lastMant.empresa') === -1, 'eq-public muestra la empresa de servicio');
check('eq-public sin nº de contrato', pub.indexOf('servicioContratoNumero') === -1, 'eq-public muestra el contrato');
check('eq-public lee el doc espejo', pub.indexOf("doc('public')") !== -1, 'eq-public no usa el doc público');

// ── 6. manifest de insumos intacto ──
var manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest-insumos.json'), 'utf8'));
check('manifest-insumos start_url correcto', manifest.start_url === 'stock-insumos.html',
  'start_url es "' + manifest.start_url + '"');

console.log('\n' + (fails.length ? '❌ ' + fails.length + ' test(s) fallaron' : '✅ Todos los tests pasaron'));
process.exit(fails.length ? 1 : 0);
