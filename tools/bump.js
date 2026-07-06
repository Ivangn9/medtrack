#!/usr/bin/env node
// Bump de versión SemVer para MedTrack.
// Uso:  node tools/bump.js <patch|minor|major> "Descripción del cambio" ["otro cambio" ...]
//
// Actualiza los 4 campos sincronizados de index.html, agrega la entrada al
// CHANGELOG embebido en la app y a CHANGELOG.md. Después: git add + commit + push.
//
// Guía rápida:
//   patch → fix de bug, ajuste visual menor, optimización        (1.2.3 → 1.2.4)
//   minor → feature nueva, sección nueva, mejora significativa   (1.2.4 → 1.3.0)
//   major → cambio estructural / rompe compatibilidad            (1.3.0 → 2.0.0)

var fs = require('fs');
var path = require('path');

var tipo = process.argv[2];
var cambios = process.argv.slice(3);
if (['patch','minor','major'].indexOf(tipo) === -1 || !cambios.length) {
  console.error('Uso: node tools/bump.js <patch|minor|major> "descripción" ["otra" ...]');
  process.exit(1);
}

var idx = path.join(__dirname, '..', 'index.html');
var src = fs.readFileSync(idx, 'utf8');

// ── versión SemVer ──
var m = src.match(/var APP_DISPLAY_VERSION="(\d+)\.(\d+)\.(\d+)";/);
if (!m) { console.error('No se encontró APP_DISPLAY_VERSION'); process.exit(1); }
var MA = +m[1], MI = +m[2], PA = +m[3];
if (tipo === 'major') { MA++; MI = 0; PA = 0; }
else if (tipo === 'minor') { MI++; PA = 0; }
else { PA++; }
var nueva = MA + '.' + MI + '.' + PA;

// ── fechas ──
var now = new Date();
function p2(n){ return ('0'+n).slice(-2); }
var fechaCorta = p2(now.getDate()) + '/' + p2(now.getMonth()+1) + '/' + String(now.getFullYear()).slice(-2);
var fechaLarga = p2(now.getDate()) + '/' + p2(now.getMonth()+1) + '/' + now.getFullYear();
var hoy = now.getFullYear() + '.' + p2(now.getMonth()+1) + '.' + p2(now.getDate());

// ── date-version (meta + comment): si es el mismo día incrementa NNN, si no arranca en 001 ──
var dv = src.match(/<!-- v(\d{4}\.\d{2}\.\d{2})\.(\d+) -->/);
var nnn = (dv && dv[1] === hoy) ? ('00' + (+dv[2] + 1)).slice(-3) : '001';
var dateVer = 'v' + hoy + '.' + nnn;

// ── aplicar los 4 campos ──
src = src.replace(/<!-- v\d{4}\.\d{2}\.\d{2}\.\d+ -->/, '<!-- ' + dateVer + ' -->');
src = src.replace(/<meta name="app-version" content="v[\d.]+">/, '<meta name="app-version" content="' + dateVer + '">');
src = src.replace(/var APP_DISPLAY_VERSION="[\d.]+";/, 'var APP_DISPLAY_VERSION="' + nueva + '";');
src = src.replace(/var APP_BUILD="[^"]+";/, 'var APP_BUILD="' + fechaCorta + ' h";');

// ── entrada en el CHANGELOG embebido ──
var entrada = "  {v:'" + nueva + "',fecha:'" + fechaLarga + "',tipo:'" + tipo + "',cambios:[\n" +
  cambios.map(function(c){ return "    '" + c.replace(/'/g, "\\'") + "'"; }).join(',\n') +
  '\n  ]},\n';
src = src.replace('var CHANGELOG=[\n', 'var CHANGELOG=[\n' + entrada);

fs.writeFileSync(idx, src);

// ── CHANGELOG.md ──
var mdPath = path.join(__dirname, '..', 'CHANGELOG.md');
var md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '# Changelog — MedTrack\n\n';
var bloque = '## v' + nueva + ' — ' + fechaLarga + ' (' + tipo + ')\n\n' +
  cambios.map(function(c){ return '- ' + c; }).join('\n') + '\n\n';
md = md.replace(/^(# Changelog[^\n]*\n\n)/, '$1' + bloque);
fs.writeFileSync(mdPath, md);

console.log('✅ ' + m[1] + '.' + m[2] + '.' + m[3] + ' → ' + nueva + ' (' + tipo + ') · ' + dateVer);
console.log('   index.html (4 campos + changelog embebido) y CHANGELOG.md actualizados.');
console.log('   Siguiente: node tests/check.js && git add -A && git commit && git push -u origin HEAD:main');
