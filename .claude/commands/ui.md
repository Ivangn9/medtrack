# MedTrack UI — Design System

Cualquier elemento nuevo de interfaz en `index.html` debe respetar exactamente este sistema de diseño. ES5 estricto: `var`, sin arrow functions, sin const/let, sin template literals.

## Restricciones de código
- ES5 estricto: `var`, sin arrow functions, sin const/let, sin template literals (`+` para concatenar)
- Sin frameworks externos — todo vanilla JS + CSS inline o en `<style>`
- Cuando generes HTML desde JS: concatenación con `+`, comillas dobles dentro de strings JS con comillas simples

## Paleta de colores

### Modo claro (`:root`)
```
--bg: #e8eef6
--text: #1c1c1e  |  --text2: #3a3a3c  |  --text3: #8e8e93
--accent: #0071e3  |  --accent2: #0058b0
--sep: rgba(60,60,67,.08)
--glass: rgba(255,255,255,.07)
--glass2: rgba(255,255,255,.55)
--glass-border: rgba(255,255,255,.60)
--glass-border-top: rgba(255,255,255,.90)
--red: #ff3b30  |  --orange: #ff9500  |  --green: #34c759  |  --purple: #af52de
```

### Modo oscuro (`body.dark`)
```
--bg: #06091a
--text: #f2f2f7  |  --text2: #aeaeb2  |  --text3: #636366
--accent: #adc6ff  |  --accent2: #7ba7f0
--sep: rgba(84,84,88,.5)
--glass: rgba(30,32,56,.72)
--glass2: rgba(20,22,44,.88)
--glass-border: rgba(255,255,255,.10)
--gc-bg: rgba(22,21,34,.58)
--gc-border: rgba(255,255,255,.09)
--gc-border-top: rgba(255,255,255,.14)
```

## Tipografía
- **UI general:** `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif`
- **Valores / stats / headlines:** `'Hanken Grotesk', system-ui, sans-serif`
- **Datos / tiempo / mono:** `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`
- Tamaños: sección `0.65rem/600/uppercase/1px tracking`, valor `1.9rem/700`, botón `0.88–0.9rem/600–700`

## Radios
```
--r-sm: 14px  |  --r-md: 18px  |  --r-lg: 22px  |  --r-xl: 28px  |  --r-pill: 50px
```

## Easings
```
--spring:      cubic-bezier(0.34, 1.56, 0.64, 1)   /* bounce / overshoot */
--spring-fast: cubic-bezier(0.34, 1.4,  0.64, 1)
--ease-out:    cubic-bezier(0.16, 1,    0.3,  1)
```

## Glass card (`.gc`)
```css
background: var(--gc-bg);           /* rgba(22,21,34,.58) en dark */
backdrop-filter: blur(22px);
border: 1px solid var(--gc-border);
border-top-color: var(--gc-border-top);
border-radius: var(--r-lg);         /* 22px */
box-shadow: inset 0 1px 0 rgba(255,255,255,.10), inset 0 -0.5px 0 rgba(0,0,0,.03);
/* Gradiente especular encima del contenido (overlay, no background) */
::before: linear-gradient(180deg, rgba(255,255,255,.06) 0%, transparent 60%);
```
- Hover: ninguno (plano)
- Active/press: `transform: scale(.968)`, sombra reducida, `transition: transform .32s var(--spring)`

## Botones

### Primario
```css
background: var(--accent);
color: #fff;
border: none;
border-radius: var(--r-pill);
padding: 12px 22px;
font-weight: 600;
box-shadow: 0 2px 8px rgba(0,113,227,.3), inset 0 1px 0 rgba(255,255,255,.25);
transition: transform .2s var(--spring), box-shadow .2s var(--ease-out);
/* Active: */ transform: scale(.94);
```

### Secundario
```css
background: rgba(255,255,255,.55);
color: var(--accent);
border: 1px solid rgba(255,255,255,.72);
border-radius: var(--r-pill);
padding: 11px 18px;
box-shadow: 0 1px 4px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.9);
```

### Destructivo
```css
background: rgba(255,255,255,.35);
color: var(--red);
border: 1px solid rgba(255,59,48,.18);
```

## Chips / pills de estado
```css
padding: 9px 16px;
border-radius: var(--r-pill);
background: glass con saturate(180%) blur(14px);
border: 1.5px solid /* color del estado */;
border-top-color: más claro;
/* Gradiente especular encima */
/* Active: */ transform: scale(.92);
/* On: */ background: var(--accent); color: #fff;
```

## Sombras
```
--lg-shadow: 0 1px 2px rgba(0,0,0,.03), 0 4px 16px rgba(0,0,0,.06), 0 12px 40px rgba(0,0,0,.06),
             inset 0 1.5px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(0,0,0,.04)
--lg-shadow-float: 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.08), 0 24px 64px rgba(0,0,0,.08),
                   inset 0 1.5px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(0,0,0,.04)
```

## Animaciones estándar

### Entrada de card/vista
```css
@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px) scale(.97); }
  to   { opacity: 1; transform: none; }
}
animation: cardIn .46s var(--spring) both;
/* Stagger en listas: nth-child(1)→0.04s, (2)→0.10s, (3)→0.16s, (4)→0.22s, (5+)→0.28s */
```

### Entrada de vista/sección
```css
@keyframes viewEnter {
  from { opacity: 0; transform: translateY(18px) scale(.98); }
  to   { opacity: 1; transform: none; }
}
animation: viewEnter .38s var(--spring) both;
```

### Entrada de modal
```css
@keyframes modalSlideUp {
  from { transform: translateY(56px); opacity: 0.6; }
  to   { transform: none; opacity: 1; }
}
animation: modalSlideUp .42s var(--spring) both;
```

### Toast
```css
@keyframes toastIn {
  from { transform: translateX(-50%) translateY(-14px) scale(.92); opacity: 0; }
  to   { transform: translateX(-50%) scale(1); opacity: 1; }
}
animation: toastIn .4s var(--spring) both;
```

### Ítem de lista (staggered)
```css
@keyframes listItemIn {
  from { opacity: 0; transform: translateY(12px) scale(.97); }
  to   { opacity: 1; transform: none; }
}
```

### Salida de vista (navegación)
`render()` agrega `.slide-exit` (viewExit .14s) a la vista saliente antes de montar la nueva. El flag `_navTransition=true` se setea en `setView()`/`goDetalle()`/`goBack()` etc. — nuevas funciones de navegación deben setearlo también.

## Patrones de componentes existentes (reutilizar, no reinventar)

### Cring — borde de gradiente giratorio
Anillo cónico animado alrededor de una card. Estructura:
```html
<div class="cring-wrap" style="--cc:#f87171;">
  <div class="cring-el"></div>
  <div class="gc">…contenido…</div>
</div>
```
- `--cc` define el color del anillo; la animación `cring-spin` (5s linear) corre siempre
- `.cring-alert` se agrega en cards críticas (fuera-de-servicio/urgente) — hoy solo semántico
- El `.gc` interior necesita `position:relative;z-index:1` (ya lo da la regla `.cring-wrap>.gc`)

### Counters animados (KPI/Dashboard)
Números que cuentan de 0 al valor al montar la vista:
```html
<div class="stat-val" data-count="42">42</div>
```
`_runCounters(container)` los detecta vía `[data-count]` después de cada render. El texto final formateado se restaura al terminar. Para valores con formato (%, "d"), pasar el número crudo en `data-count` y el texto formateado como contenido.

### Skeleton loaders
`.skel` + `.skel-line` (variantes `.s`, `.xs`) con shimmer. Helpers JS: `_skelCard(lines)` y `_skelList(n)`.

### Empty states
Clase `.empty-state` con ícono + texto + CTA. Usar en toda sección/lista que pueda quedar vacía.

### Micro-interacción de éxito en botones
`.btn-success-pop` (scale 1.07, .38s spring). Patrón: agregar la clase + cambiar el texto, `setTimeout` ~360ms, recién ahí cerrar modal/render.

## Accesibilidad táctil
- Touch targets mínimo `min-height:44px` en botones de acción (iPadOS)
- Kanban y layouts anchos: scroll-snap horizontal en viewports <640px

## Fondo de la app
El fondo usa gradientes radiales + `linear-gradient` animados con `bgShift` (32s, hue-rotate + brightness + saturate). **Nunca reemplazar el fondo existente** — solo agregar capas encima si es necesario.

## Stack de z-index
```
Fondo:          0
Contenido/app:  1
Header:       100
Bottom bar:   200
Sidebar:       50
Modal bg:     500
Settings:     600
Update banner:700
PDF viewer:  2000
Toast:       9999
Login:      10000
Splash:     20000
```

## Fondo de app (dark mode)
```css
background: radial-gradient(ellipse 130% 70% at 50% -5%, rgba(30,60,180,.30) 0%, transparent 55%),
            radial-gradient(ellipse 90% 60% at -5% 100%, rgba(20,50,140,.20) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 105% 55%, rgba(40,30,120,.15) 0%, transparent 50%),
            linear-gradient(175deg, #06091a 0%, #07091e 35%, #060820 65%, #050718 100%);
```

---

## Tarea

$ARGUMENTS
