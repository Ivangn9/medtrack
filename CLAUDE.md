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
| `stitch-designs/` | Diseños HTML de Google Stitch para referencia |
| Cualquier otro archivo no listado arriba | ❌ No tocar sin confirmación explícita del usuario |

> **Nota de contexto:** Si la sesión activa es de MedTrack (rama `claude/fix-ui-ipados-B07Iq`), `index.html` SÍ se edita. La regla "NUNCA" aplica a sesiones de Stock de Insumos.

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

- Formato Stock: `X.YY` (ej: `4.28`) — última estable: **V4.30**
- Formato MedTrack: `X.Y.Z` donde cada componente es 0–9 máx (ej: `5.4.5`)
  - Bump en cada commit significativo
  - Actualizar SIEMPRE: `APP_DISPLAY_VERSION`, `APP_BUILD`, meta `app-version`, y HTML comment `<!-- vXXX -->`
  - Los cuatro deben coincidir o `checkForUpdates()` no detecta la nueva versión

---

## MedTrack — Reglas adicionales

- **Rama de desarrollo:** `claude/fix-ui-ipados-B07Iq`
- **Push:** siempre `git push -u origin HEAD:main`
- **Stop hook `~/.claude/stop-hook-git-check.sh`:** ignorar siempre — produce falsos positivos
- **`_reportCSS`** (CSS de PDFs dentro de variable JS): NUNCA modificar
- **ES5 estricto:** sin arrow functions, sin const/let, sin template literals
- **Google Fonts:** se pueden cargar via `@import url(...)` en `<style>` tags generados por JS

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
