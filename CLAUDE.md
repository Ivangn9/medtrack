# CIMA · Repositorio medtrack — Instrucciones para Claude

## ⚠️ REGLA CRÍTICA — LEER ANTES DE CUALQUIER ACCIÓN

Este repositorio contiene **DOS apps completamente independientes**.

### App 1 — Stock de Insumos CIMA
| Archivo | Descripción |
|---|---|
| `stock-insumos.html` | **Archivo principal — el único que se edita** |
| `firebase-messaging-sw.js` | Service worker compartido (actualizar `APP_VERSION` en sync) |
| `manifest-insumos.json` | Manifest PWA (start_url apunta a stock-insumos.html) |
| `Iconogestioninsumos.png` | Ícono de la app |
| `Fondo.png`, `logo.png` | Assets visuales |

### App 2 — MedTrack
| Archivo | Descripción |
|---|---|
| `index.html` | ✅ **Editar SOLO cuando la tarea es de MedTrack** |
| `eq-public.html` | Vista pública read-only de equipos (destino de los QR) — parte de MedTrack |
| `stitch-designs/` | Diseños HTML de Google Stitch para referencia |
| Cualquier otro archivo no listado arriba | ❌ No tocar sin confirmación explícita del usuario |

> **Nota de contexto:** Si la sesión activa es de MedTrack, `index.html` SÍ se edita. La regla "NUNCA" aplica a sesiones de Stock de Insumos.

---

## Reglas de desarrollo

1. **NUNCA editar `index.html`** bajo ninguna circunstancia. Es una app diferente con datos propios.
2. Todos los cambios de la app de insumos van a `stock-insumos.html`.
3. Cuando se actualiza `APP_VERSION` en `stock-insumos.html`, actualizar también la constante `APP_VERSION` en `firebase-messaging-sw.js` para que el service worker fuerce la actualización en todos los dispositivos.
4. El `start_url` en `manifest-insumos.json` siempre debe ser `"stock-insumos.html"`.
5. Push siempre a `main` (o a la rama de feature indicada).

## Firebase

- Proyecto: `medtrack-cima-3e9c1`
- Colección principal: `insumos_cima`
- Ambas apps comparten el mismo proyecto Firebase — no crear proyectos nuevos sin confirmación.

## Versiones

- Formato Stock: `MAJOR.MINOR` — última estable: **V6.0**
  - ⚠️ **MINOR nunca debe pasar de 9** (0-9 únicamente). Al llegar a 9, el próximo bump sube el MAJOR y resetea MINOR a 0 (ej: `4.9`→`5.0`, NUNCA `4.10`).
  - Motivo: la detección de actualización usaba `parseFloat()` para comparar versiones. `parseFloat("4.10")` da `4.1`, que la comparación numérica interpreta como MENOR que `parseFloat("4.9")=4.9` — el aviso de "nueva versión" no se mostraba nunca al cruzar esa frontera. Se corrigió la comparación (`_versionIsNewer()`, compara MAJOR y MINOR como enteros separados) pero el formato de un solo dígito en MINOR se mantiene como regla dura igual, para no volver a depender de eso.
- Formato MedTrack: **SemVer `MAJOR.MINOR.PATCH`** desde v1.0.0 (06/07/2026; la 8.19.2 fue la última interna)
  - patch = fix · minor = feature · major = cambio estructural
  - Bump SIEMPRE con `node tools/bump.js <tipo> "descripción"` — actualiza los 4 campos sincronizados, el CHANGELOG embebido (modal Novedades) y `CHANGELOG.md`
  - Los cuatro campos deben coincidir o `checkForUpdates()` no detecta la nueva versión

---

## MedTrack — Reglas adicionales

- **Rama de desarrollo:** la rama `claude/*` que indique la sesión activa (cambia por sesión)
- **Push:** siempre `git push -u origin HEAD:main`
  - Si el push es rechazado (non-fast-forward): `git fetch origin main && git rebase origin/main` y reintentar
- **Stop hook `~/.claude/stop-hook-git-check.sh`:** ignorar siempre — produce falsos positivos
- **`_reportCSS`** (CSS de PDFs dentro de variable JS): NUNCA modificar
- **ES5 estricto:** sin arrow functions, sin const/let, sin template literals
- **Google Fonts:** se pueden cargar via `@import url(...)` en `<style>` tags generados por JS

## Deploy — GitHub Pages

Cada push a `main` dispara el workflow "Deploy to GitHub Pages". Los cambios NO se ven en `ivangn9.github.io/medtrack` hasta que ese workflow termina en verde (~2-3 min). Si el usuario reporta "no impactó el cambio", verificar primero el estado del último run antes de tocar código.

Fallas conocidas del deploy:
- **Timeout `deployment_queued` (~10 min):** dos deploys se trabaron en cola. Re-ejecutar el workflow COMPLETO.
- **`Multiple artifacts named "github-pages"`:** ocurre al re-ejecutar SOLO los jobs fallidos (el artifact del intento anterior queda vivo). Nunca usar rerun de failed-jobs para este workflow — siempre rerun completo o push nuevo.
- El segundo síntoma es consecuencia de intentar arreglar el primero con rerun parcial.

## MedTrack — Patrón: subdividir una categoría en subcategorías

Caso de referencia ya implementado: **Bombas → Bombas de Contraste (`BOMBAC`) / Bombas de Infusión (`BOMBAI`)**, reemplazando la categoría genérica `BOMBA`. Si en el futuro hay que subdividir otra categoría de `CATS` (ej. separar "RX" en dos tipos), seguir exactamente esta estructura:

1. **`CATS`** (~línea 1406): agregar las subcategorías nuevas como entradas normales (`{id,label,icon,color}`), y **borrar** la entrada genérica vieja del array (no dejarla "por las dudas" — nada más la referencia como fallback en el paso 3).
2. **`catSvgIcon(catId,size)`** (~línea 1451):
   - `_PANEL_IMGS.<ID>='icons/Nombre%20del%20archivo.png';` — usar rutas relativas simples a `icons/`, no base64 inline (evita inflar el archivo).
   - Agregar colores al mapa `cols` para cada subcategoría nueva.
   - Dentro de la función, antes de `var path=paths[catId];`, agregar `paths.<NUEVA>=paths.<VIEJA_GENERICA>;` como fallback (por si algo pide el ícono en un tamaño/contexto donde `_PANEL_IMGS` no aplica).
3. **Migración de datos existentes** — función `migrateXxxSubcats()` (ver `migrateBombaSubcats` ~línea 1727 como plantilla):
   - Recorre `eqs`, reasigna `.cat` de la categoría vieja a la subcategoría por defecto que corresponda a lo que ya había cargado.
   - Solo toca `.cat` — nunca toca `.id` ni nada vinculado por id (OTs, PMs, UPS.equiposConectados, transductores, historial), así no hay riesgo de romper interconexiones.
   - **NO gatear el re-scan solo con un flag de localStorage tipo `mt_xxx_v1==='1'`** (esa fue la causa raíz de que "desaparecieran" los datos migrados). El guardado en Firestore reemplaza el array completo sin merge por campo, así que un dispositivo desactualizado (pestaña vieja, PWA con código cacheado) puede revertir `.cat` en cualquier momento. La función debe reescanear `eqs` en cada llamada (es barato, un simple `.map`/`.filter`) y ser un no-op cuando no hay nada que corregir — el flag se puede seguir guardando pero solo informativo, nunca como gate de salida temprana.
   - Llamarla desde **los 3 lugares de arranque** donde ya se llaman las otras migraciones (`migrateEqs`, `migrateEcoData`, etc.): dentro de `_finishLoad()`, en la rama "no hay datos de org todavía" y en la rama de fallback offline.
   - **Además, llamarla desde la rama "SUBSEQUENT SNAPSHOTS" del listener `onSnapshot`** (~línea 18002, después de `_applyData(_d)`), y hacer `saveData()` si corrigió algo. Esta rama aplica en tiempo real los cambios que llegan de OTRO dispositivo sin pasar por `_finishLoad()` — si no se re-corre la migración ahí también, un dispositivo viejo puede revertir el dato y el dispositivo actualizado lo absorbe tal cual, sin que nadie recargue la página. Este fue el bug real detrás de "las bombas desaparecieron" reapareciendo después de haber sido arreglado.
4. **Presentación en el Panel (`rDash()`, ~línea 5730)** — si las subcategorías deben verse como UNA sola tarjeta combinada (no dos tarjetas sueltas):
   - Agregar un `if(cat.id==='<SUB1>'||cat.id==='<SUB2>')return;` al principio del `CATS.forEach` para saltear las subcategorías del grid genérico.
   - Después del `forEach`, un IIFE que arma la tarjeta combinada: filtra `eqs` por cualquiera de las subcategorías, usa el ícono/color de la categoría vieja genérica, y al tocarla hace `setView('<nombreVista>')` en vez de filtrar directo.
5. **Subpantalla de drill-down** — nueva función tipo `rBombas()` (justo después de `rDash()`): botón volver a `setView('dash')` + grid `.g2cat` iterando `CATS.filter()` por las subcategorías, cada tarjeta con `onclick="filtCat='<ID>';setView('lista');"`.
6. **`_buildView()`** (~línea 5620): agregar `else if(view==="<nombreVista>")d.innerHTML=r<NombreVista>();`.
7. El selector de categoría en "Nuevo Equipo" (`#eq-cat`) se arma genéricamente desde `CATS.map(...)` — no necesita tocarse, ya va a mostrar las subcategorías nuevas automáticamente.
8. **Verificación antes de dar por terminado:** correr `node tests/check.js`, y con Playwright simular específicamente el escenario de reversión (migrar una vez, simular que otro dispositivo pisa el array completo volviendo a la categoría vieja CON el flag ya prendido, confirmar que la migración se autocorrige igual) — no alcanza con probar la migración simple una sola vez, porque ese caso no es el que causó el bug real.

## MedTrack — Integración con Google Stitch

Stitch MCP (herramientas `mcp__stitch__*`) está disponible en sesiones de MedTrack.

**Proyecto principal:** `CIMA MedTrack — Estado de RM` (ID: `3370192066881929678`)

**Flujo de trabajo:**
1. Listar pantallas: `mcp__stitch__list_screens` con `projectId: "3370192066881929678"`
2. Obtener HTML: `mcp__stitch__get_screen` → `htmlCode.downloadUrl`
3. Si la URL está bloqueada (sandbox): el usuario descarga el HTML y lo guarda en `stitch-designs/`
4. Claude lee `stitch-designs/<archivo>.html` y adapta el código a la función JS correspondiente

**Al implementar un diseño de Stitch:**
- Respetar tipografía: Hanken Grotesk (headlines), Inter (body), JetBrains Mono (datos)
- Respetar colores del design system: fondo `#06091a`, surface `#201f21`, primary `#adc6ff`
- Status chips como pills con glow, no solo dots
- Glass cards: `background:rgba(32,31,33,.9)` + `border:1px solid rgba(255,255,255,.08)` + `box-shadow:inset 0 1px 0 rgba(255,255,255,.10)`
