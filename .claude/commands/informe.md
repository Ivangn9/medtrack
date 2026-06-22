# MedTrack — Informes HTML

Reglas para crear o modificar informes HTML en `index.html`. Todos los informes pasan por `openHTMLViewer(html, título)` y `printReport()`.

## Restricciones críticas
- **ES5 estricto:** `var` únicamente, sin arrow functions, sin const/let, sin template literals (usar `+`)
- **`_reportCSS` NUNCA se modifica** — es la variable CSS larga de los PDFs
- Los estilos de layout/color/logo se inyectan vía inline JS en `openHTMLViewer`, no en el HTML generado

## Estructura base de un informe

```javascript
var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width">' +
  '<title>Título del informe</title>' +
  '<style>' + _reportCSS + '</style></head><body>';
html += '<div class="nav-bar"><button class="btn-print" onclick="window.print()">🖨 Imprimir / Guardar PDF</button></div>';
html += '<div class="page">';
// — contenido: informe-box, sections, footer —
html += '</div></body></html>';
openHTMLViewer(html, 'Título del informe');
```

## Cabecera del informe (`.informe-box`)

Siempre va primero dentro de `.page`. El logo CIMA lo inyecta `openHTMLViewer` automáticamente — **no incluir logo-area ni img en el HTML generado**.

```javascript
html += '<div class="informe-box">';
html += '<div class="informe-title">NOMBRE DEL INFORME</div>';
html += '<div class="informe-row"><span class="informe-label">FECHA:</span><span class="informe-value">' + fechaStr + '</span></div>';
html += '<div class="informe-row"><span class="informe-label">DE:</span><span class="informe-value">Lic. García Núñez Iván</span></div>';
html += '<div class="informe-row"><span class="informe-label">PARA:</span><span class="informe-value">Comité Ejecutivo</span></div>';
html += '</div>';
```

## Secciones

```javascript
html += '<div class="section">';
html += '<div class="section-title">1. Nombre de la sección</div>';
html += '<div class="narrative"><p>Texto con <strong>énfasis</strong>.</p></div>';
html += '</div>';
```

## Tablas resumen (`.sum`)

```javascript
html += '<table class="sum"><thead><tr>';
html += '<th>Columna A</th><th style="text-align:right;">Valor</th>';
html += '</tr></thead><tbody>';
// filas...
html += '<tr><td>Item</td><td style="text-align:right;" class="sok">OK</td></tr>';
html += '</tbody></table>';
// Clases de estado: .sok (verde), .swarn (naranja), .sbad (rojo)
```

## Footer

```javascript
html += '<div class="footer">';
html += '<div class="footer-meta">CIMA Investigaciones Avanzadas · CIMA Hub · Generado: ' + new Date().toLocaleString('es-AR') + '</div>';
html += '<div class="sig-row">';
html += '<div class="sig-block"><div class="sig-line">Lic. García Núñez Iván</div><div class="sig-title">Responsable de Equipos Biomédicos</div></div>';
html += '</div></div>';
```

## Cabecera con logo (inyectada automáticamente)

`openHTMLViewer` ya inyecta en cada `.page`:
- **Logo CIMA** a 52px (extraído del DOM via canvas, base64)
- Subtítulo "Investigaciones Avanzadas · Diagnóstico por Imagen"
- Separador `border-bottom: 1.5px solid #e2e8f0`
- `paddingLeft/Right: 2.5cm`, `paddingTop: 1.5cm`

`printReport` hace lo mismo en el HTML exportado con `@page{margin:25mm 25mm 20mm 25mm}`.

## Fondo letterhead

- **`_cimaB64`** — SVG A4 decorativo (sin logo): barra navy top, líneas verticales izquierda, arcos top-right, siluetas tenues de equipos (RM, TC, RX, ecógrafo), monograma CIMA vertical, footer
- Se repite por página en el viewer (`repeat-y`, `100% 29.7cm`)
- En print: `position:fixed` div `.cima-lh` con `background-size:210mm 297mm`

## Paleta para informes (tema claro, impresión)

```
Títulos:      #1a3a6b (navy)
Texto:        #1e293b
Subtexto:     #64748b
Borde suave:  #e2e8f0
Azul accent:  #2563eb
Fondo card:   linear-gradient(135deg, #eff6ff, #fafcff)
Section bar:  linear-gradient(90deg, #1a3a6b, #2563eb)
```

## Obtener logo en funciones de informe

```javascript
var logoSync = null;
try {
  var imgs = document.querySelectorAll('img');
  for (var ii = 0; ii < imgs.length; ii++) {
    if (imgs[ii].src && imgs[ii].src.indexOf('logo.png') !== -1 && imgs[ii].complete && imgs[ii].naturalWidth > 0) {
      var cv = document.createElement('canvas');
      cv.width = imgs[ii].naturalWidth;
      cv.height = imgs[ii].naturalHeight;
      cv.getContext('2d').drawImage(imgs[ii], 0, 0);
      logoSync = cv.toDataURL('image/png');
      break;
    }
  }
} catch(e) {}
// usar logoSync como src de img si se necesita en el HTML
```

---

## Tarea

$ARGUMENTS
