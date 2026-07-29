# CIMA · Repositorio medtrack — Instrucciones para Claude

Este repositorio contiene **una sola app: MedTrack** (gestión de equipos médicos). Hasta julio 2026 compartía repo con Stock de Insumos CIMA; esa app y su Cloud Function ya se separaron al repo `github.com/Ivangn9/Insumos-Cima` (junto con `pedido-insumos.html`, que ya vivía ahí). La URL de MedTrack no cambió en esa separación — los QR físicos pegados en los equipos siguen funcionando igual.

## Archivos principales

| Archivo | Descripción |
|---|---|
| `index.html` | App principal — panel de gestión de equipos |
| `eq-public.html` | Vista pública read-only de equipos (destino de los QR físicos) |
| `stitch-designs/` | Diseños HTML de Google Stitch para referencia |
| `ai-proxy-worker.js` + `wrangler.toml` | Cloudflare Worker — proxy para el escáner de etiquetas con IA (llama a la API de Anthropic; necesario por restricciones de CORS en iOS). Deploy manual: pegar el código en dash.cloudflare.com → Workers → Create |
| `logo.png` | Compartido con `Insumos-Cima` (mismo archivo, copiado en ambos repos) |
| `firestore.rules` | Copia de referencia — cubre TODA la base compartida (MedTrack + Stock de Insumos), pero la copia canónica que se pega en Firebase Console ahora se mantiene en `Insumos-Cima` |

## Reglas de desarrollo

1. Push siempre a `main` (o a la rama de feature indicada).
2. **ES5 estricto:** sin arrow functions, sin const/let, sin template literals.
3. **`_reportCSS`** (CSS de PDFs dentro de variable JS): NUNCA modificar.
4. **Google Fonts:** se pueden cargar via `@import url(...)` en `<style>` tags generados por JS.

## Firebase

- Proyecto: `medtrack-cima-3e9c1` — **compartido con el repo `Insumos-Cima`**, no crear proyectos nuevos sin confirmación.
- MedTrack ya no tiene Cloud Functions propias en este repo (la única función existente, `notifySolicitud`, es de Stock de Insumos y vive en `Insumos-Cima/functions/`).
- `stock-insumos.html` (en `Insumos-Cima`) lee en solo-lectura el doc `orgs/cima/app/data` de este proyecto para contar entregas por categoría de equipo — es una dependencia de datos entre apps que sigue funcionando igual tras la separación (mismo proyecto Firebase).

## Versiones

- Formato MedTrack: **SemVer `MAJOR.MINOR.PATCH`** desde v1.0.0 (06/07/2026; la 8.19.2 fue la última interna)
  - patch = fix · minor = feature · major = cambio estructural
  - Bump SIEMPRE con `node tools/bump.js <tipo> "descripción"` — actualiza los 4 campos sincronizados, el CHANGELOG embebido (modal Novedades) y `CHANGELOG.md`
  - Los cuatro campos deben coincidir o `checkForUpdates()` no detecta la nueva versión

## Rama de desarrollo

- **Rama de desarrollo:** la rama `claude/*` que indique la sesión activa (cambia por sesión)
- **Push:** siempre `git push -u origin HEAD:main`
  - Si el push es rechazado (non-fast-forward): `git fetch origin main && git rebase origin/main` y reintentar
- **Stop hook `~/.claude/stop-hook-git-check.sh`:** ignorar siempre — produce falsos positivos

## Deploy — GitHub Pages

Cada push a `main` dispara el workflow "Deploy to GitHub Pages". Los cambios NO se ven en `ivangn9.github.io/medtrack` hasta que ese workflow termina en verde (~2-3 min). Si el usuario reporta "no impactó el cambio", verificar primero el estado del último run antes de tocar código.

Fallas conocidas del deploy:
- **Timeout `deployment_queued` (~10 min):** dos deploys se trabaron en cola. Re-ejecutar el workflow COMPLETO.
- **`Multiple artifacts named "github-pages"`:** ocurre al re-ejecutar SOLO los jobs fallidos (el artifact del intento anterior queda vivo). Nunca usar rerun de failed-jobs para este workflow — siempre rerun completo o push nuevo.
- El segundo síntoma es consecuencia de intentar arreglar el primero con rerun parcial.

## Patrón: subdividir una categoría en subcategorías

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

## Integración con Google Stitch

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
