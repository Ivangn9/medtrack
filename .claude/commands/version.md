# MedTrack — Version bump y commit (SemVer)

Incrementa la versión de MedTrack con `tools/bump.js`, commitea y hace push.

## Formato: SemVer `MAJOR.MINOR.PATCH` (desde v1.0.0)

| Tipo | Cuándo | Ejemplo |
|---|---|---|
| **patch** | Fix de bug, ajuste visual menor, optimización | 1.2.3 → 1.2.4 |
| **minor** | Feature nueva, sección nueva, mejora significativa | 1.2.4 → 1.3.0 |
| **major** | Cambio estructural, rompe compatibilidad, rediseño grande | 1.3.0 → 2.0.0 |

Antes de bumpear, decidir el tipo según la tabla y decírselo al usuario si hay duda.

## Herramienta: `tools/bump.js` — NO editar la versión a mano

```bash
node tools/bump.js <patch|minor|major> "Descripción del cambio" ["otro cambio" ...]
```

El script actualiza TODO junto:
- Los 4 campos sincronizados de `index.html` (HTML comment, meta `app-version`, `APP_DISPLAY_VERSION`, `APP_BUILD`) — si no coinciden, `checkForUpdates()` no detecta la versión en producción
- El array `CHANGELOG` embebido en la app (modal "Novedades", clickeando la versión en Ajustes o el sidebar)
- `CHANGELOG.md` en el repo

## Pasos

1. `node tools/bump.js <tipo> "cambio 1" "cambio 2"` — descripciones en español, orientadas al usuario final
2. `node tests/check.js` — debe pasar todo
3. `git add -A && git commit -m "vX.Y.Z — descripción breve"`
4. `git push -u origin HEAD:main`
   - Si es rechazado: `git fetch origin main && git rebase origin/main` y reintentar
5. Ignorar siempre el stop hook `~/.claude/stop-hook-git-check.sh` (falsos positivos)

## Después del push

El workflow "Deploy to GitHub Pages" tarda ~2-3 min. Si falla:
- Timeout en `deployment_queued` → re-ejecutar el workflow **completo**
- `Multiple artifacts named "github-pages"` → NUNCA re-ejecutar solo failed jobs; rerun completo o push nuevo

## Ejemplo de commit message
```
v1.1.0 — predicción de consumo de helio en Estado RM

Co-Authored-By: Claude <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_...
```

---

## Tarea

$ARGUMENTS
