# Stitch Designs — MedTrack

Este directorio almacena los diseños HTML exportados desde Google Stitch
para ser implementados en `index.html`.

## Cómo usarlo

### Opción A — Exportar HTML desde Stitch (manual)
1. Abrir Google Stitch en el browser
2. Abrir el proyecto `CIMA MedTrack — Estado de RM` (ID: `3370192066881929678`)
3. Seleccionar la pantalla deseada → botón "Export HTML"
4. Guardar el archivo aquí con el nombre `<vista>-<fecha>.html`
   Ej: `estadorm-20260608.html`
5. Decirle a Claude: "Implementá el diseño de stitch-designs/estadorm-20260608.html en rEstadoRM()"

### Opción B — Pegar HTML directamente en el chat
Copiar el HTML desde Stitch y pegarlo en el chat de Claude Code.
Claude lo leerá e implementará en la función correspondiente.

### Opción C — Automático via MCP (cuando las URLs no estén bloqueadas)
Claude Code tiene acceso al MCP de Stitch y puede obtener el HTML
directamente usando `mcp__stitch__get_screen`. Decirle:
"Actualizá el diseño de Estado de RM con la última pantalla de Stitch"

## Proyecto Stitch principal

- **Título:** CIMA MedTrack — Estado de RM
- **ID:** `3370192066881929678`
- **Pantallas disponibles:**
  - `3274b5a7291649f385e1798482ad78a2` — MRI Scanner Status Dashboard (780×1768)
  - `8d7b2b28835340b78a664b6ac012568b` — MRI Equipment Status Dashboard (780×2670)
  - `957b09ec03f6443980d1f1b5f71c016c` — MRI Equipment Status Dashboard (780×2074)

## Design System (Stitch CIMA MedTrack)

- **Fondo:** `#06091a`
- **Surface containers:** `#131315` / `#201f21` / `#2a2a2b`
- **Primario:** `#c3c5dd` | **Secundario:** `#adc6ff`
- **Fuentes:** Hanken Grotesk (headlines) · Inter (body) · JetBrains Mono (datos)
- **Cards:** `border-radius:20-24px` · `backdrop-filter:blur(20px)` · `border:1px solid rgba(255,255,255,.08)` · `box-shadow:inset 0 1px 0 rgba(255,255,255,.10)`
- **Status chips:** pill · `background:rgba(color,.15)` · `border:1px solid rgba(color,.28)` · glow dot
