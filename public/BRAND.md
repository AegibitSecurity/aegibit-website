# AEGIBIT — Brand Assets

Master brand identity for AEGIBIT Security. All assets are SVG (infinite scale, free, hand-tuned).

## Files

| File | Use case |
|------|----------|
| `aegibit-mark.svg` | The icon, full color (gradient). Use anywhere — favicons, app icons, social profile pics, hero sections |
| `aegibit-mark-mono.svg` | Same icon, single-color. Inherits `currentColor` — set color via CSS for any context (white on dark, black on light, brand orange) |
| `aegibit-logo.svg` | Horizontal lockup: mark + wordmark side-by-side. Use in site headers, email signatures |
| `aegibit-logo-stacked.svg` | Vertical lockup: mark above wordmark. Use in square spaces, social cards |
| `aegibit-wordmark.svg` | Text only. Use when icon is unnecessary or too small |

## Brand colors

| Token | Hex | Use |
|-------|-----|-----|
| **AEGIBIT Orange (primary)** | `#FF6A00` | Primary brand color, CTAs, links, highlights |
| **AEGIBIT Orange Light (gradient top)** | `#FF8533` | Top of vertical gradients on the mark |
| **AEGIBIT Orange Dark (hover)** | `#CC5500` | Hover state for primary buttons |
| **Surface 0 (deepest)** | `#0A0A0A` | Page background |
| **Surface 1** | `#111111` | Card / section backgrounds |
| **Surface 2** | `#1A1A1A` | Hover surfaces |
| **Border faint** | `rgba(255,255,255,0.06)` | Hairline borders on dark |
| **Text primary** | `#FFFFFF` | Headings on dark |
| **Text secondary** | `#A1A1AA` | Body on dark |
| **Text tertiary / disabled** | `#52525B` | Captions, disabled |

## Concept

**The hexagonal shield** — security and the digital lattice (hex grid = encryption, blockchain, lock-pattern).
**The bold A** — Aegis, the Greek protective shield. Capital, declarative.
**The split crossbar** — the "BIT" — binary, digital. Two segments, not one — the moment of computation.

The whole mark in one breath: *"a digital aegis, structured by code."*

## Typography

- **Display / wordmark:** Geist (already a project dep). Bold (700) or Black (800) weight, letter-spacing tight to 0.04em.
- **Body:** Geist or system-ui fallback.
- **Mono / code:** Geist Mono.

## Usage rules

✅ **Do**
- Use the gradient `aegibit-mark.svg` as the primary positive-color mark.
- Use `aegibit-mark-mono.svg` with white fill on dark surfaces, black fill on light.
- Maintain clear-space equal to the height of the crossbar around all sides.
- Scale uniformly. Width 32px is the smallest sensible size.

❌ **Don't**
- Re-color the gradient. Use `aegibit-mark-mono.svg` for non-brand colors.
- Stretch or skew non-uniformly.
- Add drop-shadows, glows, or 3D effects beyond the built-in halo.
- Place the mark on busy photographic backgrounds without a solid container.
- Re-create the mark with different proportions. Use the SVG; it's the source.

## VoiceCore sub-brand

The existing `public/icon.svg` is the AEGIBIT VoiceCore product mark — same hexagon + A, plus sound-wave bars below the crossbar to denote voice. Do not modify; it represents that product specifically.

## Example usage

```jsx
// In a Next.js component
import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/aegibit-logo.svg"
      alt="AEGIBIT"
      width={240}
      height={60}
      priority
    />
  );
}
```

```html
<!-- Plain HTML -->
<img src="/aegibit-mark.svg" alt="AEGIBIT" width="48" height="48"/>
```

```css
/* Single-color via mono variant (white on dark) */
.logo-mono {
  color: #FFFFFF;          /* mono SVG uses currentColor */
  width: 48px;
  height: 48px;
}
```
