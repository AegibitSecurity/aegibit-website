# AEGIBIT — Brand Assets

Master brand identity for AEGIBIT Security. All assets are SVG (infinite scale, free, hand-tuned).

## Files

| File | Use case |
|------|----------|
| `aegibit-mark.svg` | The "A" mark, full color (white + orange legs, soft halo). Use anywhere — social profile pics, hero sections, large display |
| `aegibit-mark-mono.svg` | Same mark, single-color. Inherits `currentColor` — set color via CSS for any context (white on dark, black on light, brand orange) |
| `aegibit-logo.svg` | Horizontal lockup: mark + wordmark side-by-side. Use in site headers, email signatures |
| `aegibit-logo-stacked.svg` | Vertical lockup: mark above wordmark. Use in square spaces, social cards |
| `aegibit-wordmark.svg` | Text only (AEGI white / BIT orange). Use when the mark is unnecessary or too small |
| `icon.svg` | Favicon / app-icon source: the mark on a black rounded square. Mirrors `src/app/icon.tsx` + `apple-icon.tsx` |

## Brand colors

| Token | Hex | Use |
|-------|-----|-----|
| **AEGIBIT Orange (primary)** | `#F97316` | Primary brand color, CTAs, links, the right leg of the mark, "BIT" in the wordmark. Tailwind orange-500 |
| **AEGIBIT Orange Light (gradient top)** | `#FB923C` | Top of vertical gradients on the orange leg. Tailwind orange-400 |
| **AEGIBIT Orange Dark (hover)** | `#EA580C` | Hover state for primary buttons. Tailwind orange-600 |
| **Mark White** | `#FFFFFF` | The left leg of the mark, "AEGI" in the wordmark |
| **Mark White (gradient bottom)** | `#C7C7CC` | Bottom of the subtle sheen on the white leg |
| **Surface 0 (deepest)** | `#000000` | Page background, favicon tile |
| **Surface 1** | `#0A0A0A` | Card / section backgrounds |
| **Surface 2** | `#0D0D0D` | Raised cards |
| **Border faint** | `rgba(255,255,255,0.06)` | Hairline borders on dark |
| **Text primary** | `#FFFFFF` | Headings on dark |
| **Text secondary** | `#A1A1AA` | Body on dark |
| **Text tertiary / disabled** | `#71717A` | Captions (meets WCAG AA on `#000`) |

> Canonical orange is **`#F97316`**. The legacy `#FF6A00` / `#FF5A1F` / `#FF8533` values were unified out of the codebase — do not reintroduce them.

## The mark

**The "A"** — two offset blades forming a dynamic, asymmetric letterform. No crossbar.

- **White left blade.** The dominant stroke. Rises with a chiselled top to the apex. Clarity, the human side, the operator. Subtle white→soft-grey gradient gives it a glossy, dimensional sheen.
- **Orange right blade.** Shorter, set lower-right, splaying from a notch just below the peak down to the base. The brand, the security layer, the system. Light-orange→deep-orange gradient.

The two blades don't meet at a symmetric point — the white reaches higher and the orange offsets below it, leaving a fine diagonal gap. That asymmetry is the signature; it reads as forward motion, not a static peak. Scales from a 16px favicon to a billboard without losing legibility.

## Typography

- **Display / wordmark:** Geist (already a project dep). Regular-to-Medium weight (400–500), wide letter-spacing (~0.22em). The wordmark is deliberately light and airy — never bold/black.
- **Body:** Geist or system-ui fallback.
- **Mono / code:** Geist Mono.

The wordmark splits color: **AEGI** in white, **BIT** in `#F97316`.

## Usage rules

✅ **Do**
- Use `aegibit-mark.svg` (white + orange legs) as the primary positive-color mark.
- Use `aegibit-mark-mono.svg` with white fill on dark surfaces, black fill on light.
- Keep the wordmark light-weight with generous letter-spacing.
- Maintain clear-space equal to the width of one leg around all sides.
- Scale uniformly. Width 24px is the smallest sensible size for the mark; below that, use the favicon tile (`icon.svg`).

❌ **Don't**
- Re-color the blades. White stays white, orange stays `#F97316`. Use the mono variant for single-ink contexts.
- Add a crossbar to the "A", close the notch, or make the two blades symmetric.
- Flatten the gradients — the white→grey and orange→deep-orange sheen is intrinsic to the mark, not an added effect.
- Stretch or skew non-uniformly.
- Add drop-shadows beyond the built-in halo + the subtle UI glow used in the navbar lockup.
- Set the wordmark in a bold/heavy weight.
- Re-create the mark by hand with different proportions. Use the SVG; it's the source of truth (geometry on a 512 viewBox: white blade `M286 100 L224 130 L124 426 L196 426 Z`, orange blade `M272 162 L328 182 L388 426 L322 426 Z`, both with `stroke-width="16"` + `stroke-linejoin="round"` for the soft corners).

## Example usage

```jsx
// In a Next.js component
import Image from "next/image";

export function BrandLockup() {
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
