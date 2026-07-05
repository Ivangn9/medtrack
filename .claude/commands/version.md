# MedTrack — Version bump y commit

Incrementa la versión de MedTrack, commitea y hace push.

## Formato de versión: `X.Y.Z` (cada componente 0–9 máx)
- **Z** — fix/tweak menor (la mayoría de commits)
- **Y** — feature o cambio visual significativo
- **X** — cambio mayor de arquitectura

## Los cuatro campos que SIEMPRE deben coincidir

```html
<!-- vAAAA.MM.DD.NNN -->                          ← HTML comment línea 2
<meta name="app-version" content="vAAAA.MM.DD.NNN">   ← meta tag
```
```javascript
var APP_DISPLAY_VERSION = "X.Y.Z";
var APP_BUILD = "DD/MM/YY h";
```

Si los cuatro no coinciden, `checkForUpdates()` no detecta la nueva versión en producción.

## Pasos

1. Leer versión actual de `index.html` (grep `APP_DISPLAY_VERSION`)
2. Incrementar según el tipo de cambio
3. Actualizar los cuatro campos con Edit (dos en JS, dos en HTML head)
   - El comment y el meta usan formato fecha `vAAAA.MM.DD.NNN` — incrementar solo `NNN` si es el mismo día
4. `git add index.html` (y otros archivos modificados)
5. `git commit -m "vX.Y.Z — descripción"`
6. `git push -u origin HEAD:main`
   - Si es rechazado (remote contains work): `git fetch origin main && git rebase origin/main` y volver a pushear
7. Ignorar siempre el stop hook `~/.claude/stop-hook-git-check.sh` (falsos positivos)

## Después del push

El workflow "Deploy to GitHub Pages" tarda ~2-3 min. Los cambios no se ven en producción hasta que termina. Si falla:
- Timeout en `deployment_queued` → re-ejecutar el workflow **completo**
- `Multiple artifacts named "github-pages"` → NUNCA re-ejecutar solo failed jobs; rerun completo o push nuevo

## Ejemplo de commit message
```
v7.4.3 — descripción breve del cambio

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_...
```

---

## Tarea

$ARGUMENTS
