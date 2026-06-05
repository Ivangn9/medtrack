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

### App 2 — MedTrack (NO TOCAR)
| Archivo | Descripción |
|---|---|
| `index.html` | ❌ **NUNCA modificar — pertenece a la app MedTrack** |
| Cualquier otro archivo no listado arriba | ❌ No tocar sin confirmación explícita del usuario |

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

- Formato: `X.YY` (ej: `4.27`)
- Cada push significativo incrementa el número menor
- Última versión estable: **V4.27**
