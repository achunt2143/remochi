# remochi identity

What remochi is, how it looks, and how it sits inside Pyxis. Written
2026-11-16 against remochi 0.5.1 and brought up to date for **0.6.0**
(`release/0.6.0`) on 2026-11-24, from the source in `src/` and the notes in
`RELEASE_NOTES.md`. Where this file and the code
disagree, the code is right.

Companion: `/home/andrew/geckos/geckos/docs/identity/pyxis-identity.md` (the
Pyxis identity, which remochi is the UI library for).

Source key:

| Tag | Path (in this repo) |
|---|---|
| `theme.scss` | `src/ThemeWrapper/MochiThemeWrapper.scss` |
| `ThemeWrapper.jsx` | `src/ThemeWrapper/MochiThemeWrapper.jsx` |
| `Button` | `src/Button/MochiButton.jsx` |
| `Dialog` | `src/Dialog/MochiDialog.scss` |
| `Panel` | `src/Panels/MochiPanel.scss` |
| `Popup` | `src/Popup/MochiPopupPanel.styles.jsx` |
| `Header` | `src/Headers/Header.scss` |
| `fonts` | `src/ThemeWrapper/fonts/` (copied to `dist/fonts/`) |

---

## 1. What remochi is

remochi is a React component library that rebuilds **Enyo Mochi**, the UI
kit of webOS, with modern tooling (functional components, hooks,
styled-components, SCSS, ARIA and keyboard support). Mochi was the face of
webOS on the Palm Pre and the HP TouchPad. remochi keeps what made it
recognisable and fixes what a modern browser and a modern audience need.

It is the user's own library, and it is deliberately not a neutral design
system. It has a point of view, and the point of view is a particular moment:
the late 2000s and early 2010s, when interfaces were soft, rounded, a little
glossy, and unashamedly friendly.

## 2. Character

In one paragraph: remochi is **soft, friendly and a little old-fashioned on
purpose**. Surfaces are rounded cards, not flat slabs. Buttons are words
wrapped in brackets. Type is a humanist sans with an oblique for emphasis.
Colour is quiet greys with two bright accents (a sky blue and a warm amber).
Panels have a distinctive curved corner. It looks like webOS, not like
Material, Fluent or iOS.

Traits:

- **Bracketed, typographic buttons.** The "( )" caps are the signature. A
  button is a bold oblique label between two upright brackets, with a thin
  coloured bar that appears under the label when you press it.
- **Soft rounded surfaces**, with generous radii (16, 24, even pill). The one
  exception is the **scallop**: a single large curve on a panel's top-left
  corner (45 px), and the **nubbin** grabber on the panel's edge.
- **Mochi type.** Light, uppercase headers; Medium body; Bold Oblique for
  buttons; Bold Italic for list items. See section 4.
- **Two accents.** `#69cdff` (blue) for interaction, `#ffb80d` (amber) for
  "on". Everything else is grey.
- **Friendly motion.** Short fades and gentle springs (the dialog rises 8 px
  and scales from 0.97 over 0.22 s). Nothing flashy.
- **webOS conventions kept:** affirmative (green) for the positive choice,
  warning (red) only for a destructive one, a plain button for Cancel.

What remochi is not: it is not a layout system, not an icon set and not a
brand. It has no opinion about a whole desktop. That is Pyxis's job.

---

## 3. Tokens

remochi's themes are CSS custom properties. Colour tokens are declared on
`:root[data-mochi-theme=...]` and on every `[data-mochi-theme=...]` wrapper
(`theme.scss`), so portaled components (Dialog, Dropdown menu, Popup) still
get them.

### 3.1 Colour

The two themes, light and dark (`theme.scss`):

| Token | Light | Dark |
|---|---|---|
| `--color-background` | `#f5f5f5` | `#1a1a1a` |
| `--color-surface` | `#ffffff` | `#2a2a2a` |
| `--color-surface-elevated` | `#fafafa` | `#333333` |
| `--color-text` | `#1a1a1a` | `#ffffff` |
| `--color-text-secondary` | `#555555` | `#a0a0a0` |
| `--color-text-muted` | `#888888` | `#666666` |
| `--color-primary` | `#357099` (was `#4a8bc2` before 0.6.0; 5.3:1 on white) | `#5ab8f5` |
| `--color-border` | `rgba(0,0,0,0.12)` | `#646464` |
| `--color-success` | `#388e3c` | `#4caf50` |
| `--color-warning` | `#e65100` | `#ff9800` |
| `--color-error` | `#c62828` | `#ef5350` |
| `--mochi-panel-bg` | `#f5f5f5` | `#404040` |
| `--mochi-panel-border` | `#666666` | `#333333` |
| `--mochi-pane-edge` (0.6.0) | `#cccccc` | `#333333` |
| `--mochi-panel-text-muted` (0.6.0) | the muted text | `#c0c0c0` (5.6:1 on a dark panel) |
| `--mochi-focus-ring` (0.6.0) | the primary (3:1 on light) | the accent |
| `--mochi-dialog-bg` | `#f5f5f5` | `#333333` |
| `--mochi-dialog-ring` | `rgba(0,0,0,0.10)` | `rgba(255,255,255,0.14)` |
| `--mochi-overlay` (scrim) | `rgba(8,10,24,0.36)` | `rgba(4,6,14,0.56)` |
| `--mochi-field-bg` | the surface | `#606060` |
| `--mochi-button-text` | `#333333` | `#a0a0a0` (`#b4b4b4` inside a panel) |
| `--mochi-surface-material` | `var(--mochi-panel-bg)` | `var(--mochi-panel-bg)` |

Constant across themes, on `:root`:

| Token | Value | Role |
|---|---|---|
| `--mochi-selected` | `#ffb80d` | The amber "on" fill: Toggle, Checkbox, Radio |
| `--mochi-selected-soft` | `rgba(255,184,13,0.35)` | |
| `--mochi-toggle-track` | `#646464` | The neutral "off" grey |
| `--mochi-accent` | no default (falls back to `#69cdff`) | One variable that retints Slider, Toggle, Checkbox, Radio, Input, Button press bar and ProgressBar |
| `--mochi-popup-border` | `#646464` | Contextual popup border, both themes |
| `--mochi-disabled-opacity` | `0.4` | Every disabled control, as in Mochi |
| `--mochi-spinner-circle`, `-square`, `-triangle` and their `-outline` values | `#ff4a4a`, `#69cdff`, `#ffb80d` | The spinner's shapes, fixed constants from the webOS guide. Not for retheming |

`--mochi-accent` deliberately has no default so un-overridden components keep
their 0.4.0 colours.

### 3.2 Shape (added in 0.5.0)

All on `:root`, all overridable (`theme.scss`):

| Token | Default | Read by |
|---|---|---|
| `--mochi-corner` | `16px` | Table and general surfaces; the Button's `drop` appearance |
| `--mochi-corner-sm` | `10px` | Item |
| `--mochi-corner-field` | `24px` | Input, Popup panel, Dropdown panel |
| `--mochi-corner-pill` | `9999px` | Dropdown trigger, menu items |
| `--mochi-scallop` | `45px 0 0 0` | Repanel and FloatingPanel's corner |
| `--mochi-corner-xs` (0.6.0) | `4px` | The smallest rung of the ladder: List, GridList, Dropdown option |
| `--mochi-floating-radius` (0.6.0) | `16px 4px 16px 16px` | The waterdrop on floating surfaces: Dialog, PopupPanel, Dropdown menu, FloatingPanel (built in; see 6.3) |
| `--mochi-dialog-radius` | `var(--mochi-floating-radius)` | Dialog card |
| `--mochi-sheet-radius` (0.6.0) | the waterdrop's corners on the side facing the page | Phone Dialog sheet, SlidingMenu |
| `--mochi-pane-edge-width` (0.6.0) | `1px` | A pane's left edge. `2px` with `--mochi-pane-edge: #666` is the 0.5 look |
| `--mochi-stack-shadow`, `--mochi-stack-shadow-front` (0.6.0) | `none` | RepanelStack's shadow between panes (the 0.5 look is a drop-shadow) |

### 3.3 Type, spacing, motion

| Group | Tokens |
|---|---|
| Type scale | `--font-size-xs` 11, `-sm` 12, `-base` 14, `-md` 16, `-lg` 18, `-xl` 20, `-2xl` 24, `-3xl` 30, `-4xl` 36 (px) |
| Weights | light 300, normal 400, medium 500, semibold 600, bold 700 |
| Spacing | `--spacing-xs` 4, `-sm` 8, `-md` 12, `-lg` 16, `-xl` 24, `-2xl` 32, `-3xl` 48 (px) |
| Shadows | `--shadow-sm` to `--shadow-xl` (0.1 to 0.25 black, 2 to 12 px down) |
| Transitions | `--transition-fast` 150 ms, `-base` 250 ms, `-slow` 350 ms |
| Motion (0.6.0) | `--mochi-ease-forward`, `--mochi-duration-stack` 260 ms, `--mochi-ease-arrive`, `--mochi-duration-arrive` 220 ms, `--mochi-duration-reduced` 150 ms (the longest a Reduced fade may run) |
| Screens (0.6.0) | `--mochi-peek-width` 80 px, `--mochi-peek-width-narrow` 20 px, `--mochi-screen-narrow` 768 px, `--mochi-screen-wide` 1280 px (the last two mirror `SCREEN_NARROW` / `SCREEN_WIDE`; media queries can't read them) |
| Header | `--mochi-header-tracking` (default `normal`), `--mochi-font-display` (`"Mochi Light", "Prelude", sans-serif`) |
| Button (`drop`) | `--mochi-button-bg`, `--mochi-button-radius`, `--mochi-button-ink` |

### 3.3a Motion, contrast and transparency modes (0.6.0)

Every motion has three forms. **Full** is as designed. **Reduced** is opacity
only: a fade of at most `--mochi-duration-reduced` (150 ms), with no travel,
scale, blur or stagger (it used to mean Off in three components and was
ignored by the rest). **Off** is instant. Drags always track exactly. The mode
is `data-motion="full|reduced|off"` on `<html>` (as Pyxis sets it) or on a
wrapper, else `prefers-reduced-motion`; `ThemeWrapper` has a `motion` prop.
`contrast="more"` (or `prefers-contrast: more`) takes ink to pure black or
white and surfaces solid; `transparency="reduced"` makes the scrim and
`--mochi-surface-material` solid. A host can still set solid values through
`tokens`. `npm run check:tokens` guards the contrast floors.

### 3.4 The `tokens` prop

`ThemeWrapper` takes `tokens?: Record<string, string | number>` (0.5.0). It
writes the given `--*` properties onto the wrapper element **and** onto
`:root` (with `syncHtml`), and cleans up removed keys. This is the supported
way to retheme: it reaches both the subtree and portaled components, which is
what the trap in section 7.3 is about.

---

## 4. Type

Mochi's faces, declared exactly as Mochi's `mochi-fonts.less` does
(`theme.scss`, `fonts`). **Prelude**, the webOS system face, cannot be
redistributed. So each Mochi face tries a locally installed Prelude first (it
is present on webOS devices) and falls back to the open-source **Lato**,
bundled in `dist/fonts/` as WOFF files (SIL OFL, `OFL.txt`).

| Family | Maps to (Lato fallback) | Where remochi uses it |
|---|---|---|
| Mochi Light | Lato Light | Headers (uppercase, 36 px; `size="display"` is 72 px), dialog titles |
| Mochi Medium | Lato Regular; real italic, bold and bold-italic | Body, list items (bold italic) |
| Mochi Bold | Lato Bold | Button brackets (upright), `Label`, Table headers |
| Mochi Bold Oblique | Lato Bold Italic | Button labels, in every state |
| Mochi Med Oblique | Lato Italic | Oblique medium text (declared; check a component before relying on it) |
| Prelude | Light 300, Medium 400, Bold 700 and their italics | The wrapper's body family |
| Mochi Lato | Lato only (`fontFamily="Lato"`) | When you want no Prelude |

Practical rules:

- **Headers are Mochi Light, uppercase, 36 px** (or 72 px as `size="display"`), flush bottom-left; `Label` (Mochi Bold 12 px, uppercase) names a section. Tracking is
  `normal` by default; Pyxis sets `0.14em` through `--mochi-header-tracking`.
- **A button label is Bold Oblique.** It is the only place the oblique is
  routine.
- The `.woff` files are fresh WOFF 1.0 encodings of the original TTFs because
  Mochi's own `.woff` builds render several glyphs displaced in current
  Chromium.

---

## 5. Components and their character

remochi ships about 25 groups of components. The ones that carry the identity:

| Component | Character |
|---|---|
| **Button** | `appearance="caps"` (default): "( )" brackets in upright Mochi Bold around a Bold Oblique label; pressing spreads the brackets and shows a bar in `--mochi-accent` (or the variant's colour). Variants: `normal`, `warning`, `affirmative`, `blue`, `disabled`, `dropdown`. Buttons never submit forms. |
| **Button `drop`** | `appearance="drop"` (0.5.0): a shaped pill, `--mochi-corner` radius, panel background, `8px 20px` padding. Not a Mochi thing; a modern alternative. Off by default. |
| **Repanel, RepanelStack, FloatingPanel** | The scallop: a 45 px top-left curve (`--mochi-scallop`), the nubbin grabber on the left edge, inset-shadow variant. In a stack the column behind runs 45 px under the one in front. The pane has a 1 px left edge (`--mochi-pane-edge`) and no stack shadow; the base pane is square. The nubbin is drawn in code over the panel edge, kept outside the clipped body. RepanelStack keeps a left sliver of the past and shows a right peek of the predicted next panel. |
| **Dialog** | A centred card over a scrim with a 6 px inset; a Mochi Light title (18 px), a divider, content, then centred buttons. `tone`: `normal`, `warning`, `error` (a 2 px coloured line along the top). Becomes a one-handed bottom sheet below 768 px. |
| **PopupPanel** | Contextual popup, 2 px `#646464` border, the waterdrop corner (`--mochi-floating-radius`), a drawn nubbin pointing at its anchor that the popup grows from, fade in 0.22 s (a plain fade under Reduced). |
| **Spinner** | Drawn in code as an SVG, traced from the original animation: a red circle, a blue square and a yellow triangle (light and dark, normal and large). Reduced holds each shape with a 150 ms crossfade; Off is a still circle. The mark Pyxis took its window controls from. |
| **Toggle, Checkbox, Radio** | Amber `--mochi-selected` when on, `--mochi-toggle-track` grey when off. |
| **Slider, ProgressBar** | `--mochi-accent` fill, a bubble popup on the slider knob. |
| **Input** | 24 px radius, accent border on focus. |
| **Header, Subheader, Label** | Header is Mochi Light, uppercase (`display` size in 0.6.0). Pure CSS flex sizing since 0.5.1. Label is the section nameplate. |
| **Item, List, ListItem, Wizard, Table, Dropdown, Menu, Pagination, Badge, Divider, NubbinDivider, Video, ...** | Same rules: soft radii, grey surfaces, bold-italic list items. |

---

## 6. remochi inside Pyxis

Pyxis builds its apps from remochi (through Duyo, `@duyojs/duyo` and its
Remochi pack) and builds its shell on the same fonts and the same spinner.
The relationship is: **remochi is the material; Pyxis is the shape and the
light.**

### 6.1 What Pyxis takes from remochi as it is

| Piece | Where it shows |
|---|---|
| **Caps buttons** | Apps keep them. The user decided on 2026-11-12 that the "( )" brackets stay remochi's default and the apps' look. The shell's dialogs use them too (`ShellPill` wraps `Button`: primary is blue, destructive is warning). The `drop` appearance is **not** used for Pyxis buttons yet. |
| **Dialog card** | Bloom's `ShellDialog` is the shell's own scrim and keyboard handling around remochi's dialog card (`mochi-dialog` header, title, `Divider`, content, actions; error tone is `mochi-dialog--error`). remochi's own `Dialog` cannot be used in the overlay: its overlay element takes no shell-region marker and its keyboard handling is not the overlay's. |
| **Inputs** | The shell's privilege prompt uses remochi's `Input`. |
| **Type** | Mochi Light, Medium and Bold Oblique, with Lato as the fallback, are Pyxis's three type roles. |
| **The spinner's shapes and colours** | Window controls and the busy mark. |
| **Light and dark themes** | Apps run remochi's themes; `data-mochi-theme` is the switch. |
| **Slider, Toggle, Checkbox, ProgressBar, Wizard, Table, lists** | Used by the eight apps as shipped. |

### 6.2 What Pyxis adds on top

remochi has no idea any of this exists, and should not.

| Pyxis adds | What it is |
|---|---|
| **The waterdrop corner** | `16 4 16 16`, top-right sharp, on windows, panels, toasts, cards and icons. remochi's floating surfaces have it built in since 0.6.0 (`--mochi-floating-radius`); the rest of remochi sits on the corner ladder (16, 24, pill), plus the scallop. |
| **Wallpaper tint** | The shell's panels, strip and launch bar take colour and ink from the wallpaper's palette (`--px-ink`, `--px-material`, `--px-edge-material`). remochi's greys never change with the time of day. |
| **Frost** | Title bars are real glass of the wallpaper, drawn by the compositor. remochi surfaces are opaque (or a fixed material). |
| **Lumen motion** | Bloom, Droplet, Evaporate, Recede, glint. remochi's motion is fades and short rises. |
| **Per-app accent** | Light, not text; remochi has one accent variable (`--mochi-accent`). |

### 6.3 Where they meet

The meeting points, and which way each was decided:

- **The scallop and the waterdrop.** User's call, 2026-11-12: the scallop is
  adjusted to align with the waterdrop where appropriate. In practice the
  waterdrop is the corner for floating surfaces (the guideline gains no fourth
  radius family), and the scallop keeps its place only where a panel is
  anchored to an edge (the Repanel's sliding panels), drawn with the same
  proportions as the waterdrop's large corner. `--mochi-scallop` is the token
  each surface uses to pick. Which surfaces keep the scallop is settled
  component by component, on device.
- **Floating surfaces are waterdrops.** Since 0.6.0
  `--mochi-floating-radius` (`16px 4px 16px 16px`) is read by Dialog,
  PopupPanel, the Dropdown menu and FloatingPanel (`fullBleed` for square),
  and `--mochi-dialog-radius` defaults to it, so a remochi surface and a shell
  panel have the same corner without any override. `waterdropRadius(size)`
  scales it down for small things.
- **The `drop` button.** remochi's pill shape can follow the waterdrop by
  setting `--mochi-button-radius: 16px 4px 16px 16px`. Not used in Pyxis, by the
  user's call.
- **The spinner is both projects'.** remochi draws it in code (0.6.0, no GIF);
  Pyxis draws its shapes at 14 px as window controls from sampled colours, and
  both read the fixed `--mochi-spinner-*` constants. The yellow
  `#ffb80d` is `--mochi-selected` too, so an app's "on" toggle and a window's
  minimize control are the same amber.
- **Headers and display type.** The shell's uppercase display heads are remochi's
  header voice with tracking: set `--mochi-header-tracking: 0.14em`.
- **Tokens are the front door.** Pyxis should retheme remochi through
  `ThemeWrapper`'s `tokens` prop (section 3.4), never by writing `--mochi-*`
  colours on `<html>` alone.

What to ask when something does not look right: is it a remochi component
using its own defaults (fix in the app or in a token), or a Pyxis surface
(fix in the shell)? Pyxis surfaces use `--px-*`; remochi components use
`--mochi-*`.

### 6.4 The known trap: theme-variable shadowing

remochi declares its colour variables on
`:root[data-mochi-theme=...], [data-mochi-theme=...]`, and the wrapper `div`
carries `data-mochi-theme` too. (Portals sit outside the wrapper, so the
variables had to reach `:root`.) The result:

- An override written on `<html>` (the way Pyxis's `applyShellTint` writes) reaches
  portals but is **shadowed inside the wrapper**, because the wrapper redeclares
  the variable on itself.
- An override written on the wrapper reaches the subtree but **not portals**.
- Only a stylesheet loaded after remochi's, using `[data-mochi-theme] { ... }`,
  wins in both places. Or, since 0.5.0, the **`tokens` prop**, which writes to
  both.

Exceptions that work from `:root` alone, because they are declared on `:root`
only: `--mochi-accent`, `--mochi-accent-soft`, `--mochi-selected`,
`--mochi-toggle-track`, the shape tokens (`--mochi-corner*`,
`--mochi-scallop`, `--mochi-floating-radius`, `--mochi-sheet-radius`), the pane
and motion tokens, and `--mochi-focus-ring`.

Practical rules for Pyxis code:

1. Colour overrides go through `tokens`, or a late `[data-mochi-theme] { }` rule.
2. Shape and accent overrides can go on `<html>`.
3. `--px-*` variables never collide with `--mochi-*`; they can be written
   anywhere.
4. The dialog card is portaled in apps (`Dialog`) and rendered in place in the
   shell (`ShellDialog`); test a colour change in both.

The trap's source is `docs/internal/pyxis-identity-upstream.md` (in the geckos
repo), "Where things stand" item 3. That document was written for 0.4.0 and
lists R1 to R7 as upstream to-dos; **0.5.0 and 0.5.1 shipped them** (corner
tokens, surface-material, `tokens`, `...rest` forwarding, `Button.appearance`,
header tracking, one accent variable). Items still open on the Pyxis side
(per-app accent in manifests, the app sweep to `waterdrop()`) are Pyxis's, not
remochi's.

---

## 7. Do and Don't (for remochi itself)

Do:

- Keep the bracketed caps as the default button. They are the identity.
- Keep radii on the token ladder (`--mochi-corner-sm`, `--mochi-corner`,
  `--mochi-corner-field`, pill) and the scallop token, so a host can reshape
  them.
- Add a token before adding a literal. Every new colour or radius is a
  `--mochi-*` variable with the old look as its default, so other users of
  remochi see no change.
- Respect `--mochi-disabled-opacity` (0.4) for every disabled state.
- Fall back to Lato when Prelude is missing; never ship Prelude.
- Forward `...rest` (`className`, `data-*`, `aria-*`) to each component's
  root.

Don't:

- Don't add Pyxis concepts (waterdrop, wallpaper tint, frost, Lumen) to
  remochi. They are Pyxis's, applied through tokens.
- Don't recolour the spinner or change its shapes; both projects lean on it.
- Don't replace the caps with the `drop` appearance as a default.
- Don't make a component read `--mochi-primary` for a decorative accent;
  `--mochi-primary` colours text (links, dropdown labels) and a pale accent
  fails contrast on light. Decorative accent is `--mochi-accent`.
- Don't hardcode a hex colour in a component when a theme token exists.
