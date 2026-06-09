---
name: Cyber-Medical Precision
colors:
  surface: '#11131c'
  surface-dim: '#11131c'
  surface-bright: '#373943'
  surface-container-lowest: '#0c0e17'
  surface-container-low: '#191b24'
  surface-container: '#1d1f29'
  surface-container-high: '#282933'
  surface-container-highest: '#32343e'
  on-surface: '#e1e1ef'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#e1e1ef'
  inverse-on-surface: '#2e303a'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#ffc080'
  on-secondary: '#4a2800'
  secondary-container: '#fe9800'
  on-secondary-container: '#643900'
  tertiary: '#faf9ff'
  on-tertiary: '#002d6c'
  tertiary-container: '#d1ddff'
  on-tertiary-container: '#005ccc'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#ffb86f'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#693c00'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#afc6ff'
  on-tertiary-fixed: '#001a43'
  on-tertiary-fixed-variant: '#004398'
  background: '#11131c'
  on-background: '#e1e1ef'
  surface-variant: '#32343e'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  status-label:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-point:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  section-gap: 32px
  data-row-height: 48px
---

## Brand & Style
The design system is engineered for mission-critical MRI (RM) monitoring environments. The aesthetic sits at the intersection of industrial precision and futuristic medical technology, prioritizing immediate cognitive processing of complex data.

The visual style utilizes a **High-Contrast Dark Mode** with **Glassmorphism** to create a sense of depth and focus. Semi-transparent containers with frosted-glass textures allow for multi-layered information display without visual clutter. The "Neon-Status" approach uses high-chroma greens and oranges to guide the eye toward system health markers, evoking a high-tech "command center" atmosphere that feels both authoritative and advanced.

## Colors
The palette is rooted in a deep, void-like background to eliminate glare in low-light medical control rooms.

- **Primary (Neon Green):** Represents "Operational" and "Optimal" states. It uses a high-luminescence green with an outer glow (2px to 8px) to simulate active hardware indicators.
- **Secondary (Caution Orange):** Represents "Warning" and "Low Pressure" states. This color must always be accompanied by a subtle pulse animation in critical zones.
- **Neutral:** A range of cool-toned slates and near-blacks. The primary surface is semi-transparent to facilitate the glassmorphic depth.
- **Data Visualization:** Blue and Cyan accents are used for secondary data metrics (e.g., helium levels, liquid cooling) that are active but not requiring immediate attention.

## Typography
The system employs a dual-font strategy to balance character and utility.

**Space Grotesk** is used for primary headings and equipment names. Its geometric, slightly technical construction provides a modern industrial feel.

**JetBrains Mono** is the workhorse for all data points, status readouts, and labels. The monospaced nature ensures that fluctuating numerical data (like PSI or percentage levels) remains stable on the screen without horizontal shifting, which is critical for real-time monitoring. All labels are set in uppercase with increased letter spacing to enhance legibility at a distance.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model on desktop to ensure data visualization remains in predictable positions for muscle memory. 

- **Grid:** 12-column layout with 16px gutters.
- **Modular Sections:** Each monitoring group (e.g., "Gradient System", "Machine Room") is housed in a distinct card module.
- **Density:** High density is favored. Vertically, the layout uses a 4px baseline grid. 
- **Z-Axis:** 3D MRI renders occupy the central "hero" area, while status panels are arranged peripherally, mirroring the physical layout of the MRI suite.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional shadows. 

- **Base Layer:** The deepest background is near-black (#050608).
- **Secondary Layer:** Large container cards use a 5% white opacity with a 20px backdrop blur and a 1px inner stroke to define edges.
- **Tertiary Layer:** Hover states and active status pills use a 10-15% white opacity to "lift" from the background.
- **Glow Effects:** Critical status indicators (Green/Orange) use `box-shadow` with no offset and a large blur radius (8px-12px) to simulate a light-emitting diode (LED) effect.

## Shapes
The shape language is "Soft-Industrial." Components use a consistent 0.25rem (4px) or 0.5rem (8px) radius to prevent the interface from feeling too aggressive while maintaining a structural, machine-like appearance. 

Status indicators are represented as "Pills" (fully rounded) to contrast against the rectangular structural grid of the data cards. Progress bars and graphs use flat, un-rounded ends to emphasize precision.

## Components
- **Status Pills:** Small, high-contrast badges containing a dot and a text label. The dot features a glow effect matching its state (Success/Warning).
- **Data Bars:** Linear progress indicators for cryogenic and pressure levels. The "fill" should have a subtle horizontal gradient and a high-glow tip to indicate the current value clearly.
- **Monitoring Cards:** Glassmorphic containers with a thin top-border color-coded to the overall health of that subsystem.
- **Action Buttons:** Large, outline-style buttons with 1px borders. The primary action uses the Neon Green stroke; secondary actions use the Neutral border.
- **Input Fields:** Dark, recessed wells with monospaced text. Focus states are indicated by a glowing Neon Green 1px border.
- **Real-time Graphs:** Thin, 1px vector lines with no area fill, using a high-contrast cyan or green.