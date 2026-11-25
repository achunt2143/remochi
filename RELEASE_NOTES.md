# Remochi v0.6.0 — 2026-11-25

This release brings remochi in line with the Mochi / webOS design guide and the Pyxis identity: a lighter pane, peeks and width classes on `RepanelStack`, signature corners (the waterdrop as an accent), a new `Avatar` and `Label`, colour jobs with contrast floors and greyscale cues, three motion modes (Full, Reduced, Off), and high-contrast and reduced-transparency modes. It also carries the work from the fix branch that 0.5.1 never shipped: nubbins, divider caps and the grabber are drawn in code, and the `Spinner` is an SVG. The PNG and GIF sprites are gone from `src`.

**This release has visible and behavior changes — see [Upgrading from 0.5.x](#upgrading-from-05x) before bumping.**

## Highlights

### Design system alignment

- **A lighter Mochi pane.** Panes draw a 1px left edge in the new `--mochi-pane-edge`; `--mochi-pane-edge-width` sets the width. `RepanelStack` casts no shadow by default (`--mochi-stack-shadow`, `--mochi-stack-shadow-front`). The base pane in a stack is full-bleed: square, no edge, no shadow.
- **Screen tokens and width classes.** New `SCREEN_NARROW` (768), `SCREEN_WIDE` (1280) and `useWidthClass(ref)`, which classes an element by its own width. `RepanelStack` decides narrow from its own width. `--mochi-screen-narrow` and `--mochi-screen-wide` mirror the constants.

### Panels and peeks

- **Peeks.** `RepanelStack` `upcoming` / `onUpcomingOpen` show the predicted next panel as a right sliver (`--mochi-peek-width`, 80px; `--mochi-peek-width-narrow`, 20px). `keepPast` (default `true`) keeps a left sliver of the panel you came from when it collapses. `Repanel` takes `hint`, `sequence` and `peekLabel` for one clue while peeking. Slivers are buttons with an accessible name and are at least 44px tall.
- **A peek is a door, not a second panel.** The right peek shows only its corner, its cropped `Header` and one clue; the left sliver shows its corner and the start of its `Header`; on a narrow stack both are only the curve. The `Header` stays the same node when a peek opens.
- **Peeks overlap the front panel the Mochi way.** The right peek lies over the front panel's right edge by the 45px scallop, and the front panel's curve lies over the left sliver, each showing the surface beneath. The front panel pads its content clear of the peek, and the left sliver clips its `Header` to the visible part.
- **Keyboard grabber.** The grabber answers Enter and Space like a double-click, and its label says what it does.

### Shape and corners

- **The waterdrop is an accent.** `--mochi-drop-radius` (`16px 4px 16px 16px`, top-right nearly sharp) is reserved for special purposes: the new `Avatar`, the `Dialog` (the one interruption; its phone sheet keeps the drop's top corners) and `FloatingPanel` `shape="drop"`. `PopupPanel` already points with its nubbin, so it and the `Dropdown` menu keep the 24px field corner; `FloatingPanel` keeps its 16px corner; the `SlidingMenu` rounds the side facing the page at 24px.
- **`--mochi-floating-radius`.** It has no default, like `--mochi-accent`. Set it (for example to `var(--mochi-drop-radius)`, as Pyxis does) and every floating surface follows. `PopupPanel` corner nubbins take the radius of the corner they sit on; with the default radius that corner is square.
- **`waterdropRadius(size)` and the SCSS `waterdrop($size)`** scale the drop with size. The remaining off-ladder radii moved onto the corner ladder, with a new `--mochi-corner-xs` (4px).
- **`FloatingPanel` `shape`.** `shape="round"` (default) or `"drop"`; `fullBleed` still wins.
- **Nubbins, divider caps and the grabber drawn in code.** From the fix branch: there is no bitmap chrome, so it follows a radius or a stroke width. The grabber draws its stroke at the pane's edge width and casts no shadow, so its line matches the straight edge exactly; the popup and divider nubbins keep their shadow, which now paints outside the shape only and scales with the stroke.

### Colour and contrast

- **Colour jobs.** One `--mochi-focus-ring` for every focused control. Light `--color-primary` darkens to `#357099` (text is 5.3:1 on white), and the light focus ring is the primary rather than the accent blue.
- **Contrast floors.** `--mochi-panel-text-muted` and panel-scoped button ink pass 4.5:1 on dark panels; `GridList` captions meet 7:1 over imagery; warning `Badge`s use dark ink.
- **Greyscale cues.** A selected `Item`, `Dropdown` option and `Pagination` page carry a cue that reads in greyscale (weight, a check, an accent bar) instead of a primary outline or a white-on-blue chip.
- **No bare hex colours remain in components**, and `var()` fallbacks match the light theme. `SlidingMenu` drops its foreign palette for the `mochi-*` aliases.

### Motion

- **Full, Reduced, Off.** Motion tokens (`--mochi-ease-forward`, `--mochi-duration-stack`, `--mochi-ease-arrive`, `--mochi-duration-arrive`, `--mochi-duration-press`, `--mochi-duration-control`, `--mochi-duration-focus`, `--mochi-duration-reduced`) replace the literals, and the phone sheet no longer exits slower than it arrives. The mode is `data-motion="full|reduced|off"` on `<html>` (as Pyxis sets it) or on a `ThemeWrapper`, else `prefers-reduced-motion`. Reduced is an opacity fade of at most 150ms with no travel, scale or stagger; Off is instant; drags always track exactly. The theme crossfade follows the mode too.
- **Controls animate state changes** over `--mochi-duration-control` (200ms) or the arrive duration, never longer than 220ms. `Checkbox` (the fill grows in and the tick draws), `Radio` (the fill grows, and shrinks away when another is chosen), `Toggle` (the label crossfades and the knob squishes while held), `Slider` (the value bubble rises from the knob), `Pagination` (one accent bar slides between pages), `Dropdown` (the menu grows from the trigger edge, the chevron turns), `Collapsable`, `Item` / `ListItem` / `GridList` tints, `Input` / `TextArea` / `RichText` focus halos, `Wizard` (the tick draws and the progress fills) and the `DateInput` selected day. `RichText` now shows the same 3px focus halo as `Input`.
- **Directional change.** `NumberInput`'s figure rises in on increment and drops in on decrement; the `DateInput` day grid and `Wizard` step content slide a short way in from the side you moved toward; the `Table` sort arrow turns over; a `Badge` fades and scales in from 0.9 and its count crossfades; `ProgressBar` eases on `--mochi-ease-forward`. Every focus ring eases in over `--mochi-duration-focus` (120ms), and disabled controls ease their dimming.
- **A held `Button`** follows the guide: the accent bar grows in over 300ms (`--mochi-duration-press`), the brackets spread over 220ms, the scale to 1.05 takes 150ms, and release settles back over 220ms. The stray `transition: all` and hard-coded timings are on the motion tokens.
- **Pointed motion.** `PopupPanel` grows from its nubbin tip. `ViewSelectButton`'s bar travels between segments, and `onSelect` gets a third argument, `{ direction: 'forward' | 'back' | null, from, to }`.
- **Stack panels animate as they collapse.** A column's surface no longer snaps to a fixed width when its role changes, so opening, closing and collapsing all move on the forward curve. A closing front panel stays opaque while it slides out and fades only at the end.
- **`Spinner`.** It crossfades in 150ms and shows a still mark under Off. Under Reduced it runs a calm cycle.

### Type

- **`Label`.** Mochi Bold 12/16, uppercase, on the 32px edge, with `role="heading"` unless rendered as an `h1`–`h6`. `Table` column headers and `SlidingMenu` group labels take the label style.
- **`SlidingMenu` face lift.** Panel material with a 1px `--mochi-pane-edge` and a softer shadow (`--mochi-drawer-shadow-color`), 320px wide; optional `title`, `subtitle` and `showCloseButton`; 54px list-voice rows with muted icons, a `Badge`, and one 3px accent bar that slides to the active row (`aria-current="page"`); Label-voice group labels with 32px of space between groups (a hairline only with `divider`); top and bottom menus are sheets of rows; the panel and backdrop fade out as well as in, Reduced fades, Off is instant. With a backdrop it is a modal dialog: focus moves in and returns, Tab stays inside. New `--mochi-panel-error` and `--mochi-panel-success` for danger and success rows. The `ContentShifter` `menuWidth` default is now `min(320px, 85vw)`.
- **`Header size="display"`.** Mochi Light 72/64, uppercase. `Header` tracking stays `normal`.

### New components

- **`Avatar`.** A person's or app's picture in the waterdrop shape, scaling with size (`sm` 24, `md` 40, `lg` 56, `xl` 96, or a number of px; 12/3 at 40px, the full 16/4 from about 56px). Props: `src`, `alt`, `name` (initials fallback and accessible name) and `icon`. It falls back to the initials or icon when the image fails to load, and the image fades in. Initials are uppercase, in Mochi Bold with 0.05em tracking below 56px and Mochi Light at normal tracking from 56px up (the `Label` and `Header` voices). New `--mochi-avatar-bg` (the panel hover grey) and `--mochi-avatar-ring` (none).
- **`Label`.** See Type.

### Accessibility modes

- **`ThemeWrapper` gains `motion`, `contrast` and `transparency`.** `contrast` is `'system' | 'standard' | 'more'`; `transparency` is `'system' | 'standard' | 'reduced'`.
- **High contrast** (`prefers-contrast: more` or `data-mochi-contrast="more"`) takes ink to pure black or white and surfaces solid, and the scrim is solid with no blur.
- **Reduced transparency** (`prefers-reduced-transparency` or `data-mochi-transparency="reduced"`) makes the scrim and `--mochi-surface-material` solid.

### Theming

- **Portaled surfaces use the wrapper's font.** `Dialog`, `PopupPanel` and the `Dropdown` menu render outside the `ThemeWrapper`, so they read `--mochi-font-body` (Prelude by default) instead of the host page's body font. The wrapper writes `data-font-family` on `<html>` so `fontFamily` reaches them.
- **Ground.** `ThemeWrapper` `ground="vignette"` shades the edges of the area it covers with `--mochi-vignette` (an inset shadow, 30% black in light and 50% in dark). The default, `plain`, changes nothing.

### Build and tooling

- **`npm run check:tokens`.** Fails on a bare hex in `src`, warns when a `var()` fallback disagrees with the light theme, and checks the guide's contrast floors (4.5:1 text, 7:1 over translucent grounds, 3:1 focus rings and control borders) and that the spinner's base fills equal the `--mochi-spinner-*` constants.
- **`scripts/nubbin-diff` and `scripts/spinner-diff`** are the pixel-diff harnesses that compare the drawn nubbins and the SVG `Spinner` with the old sprites and GIFs, with cases for the 1px grabber, the waterdrop corner caps and divider joints. `npm run nubbin-diff` and `npm run spinner-diff` run them.
- **Sprites removed.** The PNG sprites and spinner GIFs are no longer used at runtime; they live on as the harnesses' fixtures. The `Spinner` is drawn as SVG from the traced GIFs, so `SpinnerProps` now extends SVG attributes.
- **`forwardRef`.** `Button`, `Dropdown` and `Toggle` forward their ref to the root element.
- **Copy.** Default copy uses a real ellipsis ("Loading…", "Select an option…", "Select date…").
- **Updated TypeScript declarations.** `Label`, `Avatar`, `Header.size`, `ThemeWrapper` `motion` / `contrast` / `transparency` / `ground`, `FloatingPanel.fullBleed` / `shape`, `RepanelStack` `upcoming` / `onUpcomingOpen` / `keepPast`, `Repanel` `hint` / `sequence` / `peekLabel`, the `ViewSelectButton` `onSelect` detail, ref types, `useWidthClass`, `SCREEN_*` and `waterdropRadius`, with doc comments on the main 0.6.0 tokens. The unused `src/Button/Button.jsx` stub is deprecated and goes in 0.7.

### Fixes

- **`PopupPanel` actions** now pass `type` to `Button`. It passed `$type`, which was never read, so every action was `normal`.
- **`Item` ARIA.** A clickable `Item` sets `aria-pressed` from `selected`.
- **Focus rings.** `Input` and the `Dropdown` trigger show the focus ring on keyboard focus.
- **`PopupPanel` position.** It derives `right` and `bottom` from `anchorRect` when they are missing; horizontal and corner placements computed a `NaN` left.
- **Portal fonts.** Portaled surfaces no longer fall back to the host page's font (see Theming).
- **`NubbinDivider` joints.** The nubbin and caps are positioned from a measured, rounded offset instead of flexing, so the stroke and the caps' bars meet on the same device pixel at any width and pixel ratio. `nubbinOffset`, which the flex layout ignored, is honored.
- **Crisp nubbins.** The nubbin shadow was sized for the sprites' 2px stroke and also fell inside the stroke, so the 1px grabber curve and `NubbinDivider` read as a smear. It now paints outside the shape only and scales with the stroke width, and the popup nubbin joins its border without a sub-pixel step.
- **`Toggle` On position.** A `Toggle` released after a held press no longer rests its On knob 4px short of the track's end.
- **Collapse animation.** Collapsing panels animate instead of snapping (see Motion).
- **`Label`** no longer shrinks inside a `Repanel`'s flex column.
- **`Dropdown` and `DateInput`; typings.** The `Dropdown` menu closes on a click outside it (its overlay was commented out); `DateInput` follows later changes to `value` (string or `Date`) without calling `onChange`. `DropdownOption` gains `divider`, `sectionLabel` and `disabled`, `Table` `columns` accepts plain strings, and the `SlidingMenu` `duration` default reads `--mochi-duration-stack` (260ms). The never-implemented `Dropdown` `searchable` prop is removed from the typings.
- **Escape and stacked overlays.** Escape closes only the topmost overlay, so a `Dropdown` menu or `DateInput` calendar open inside a `Dialog` closes first and a second Escape closes the `Dialog`. A scrim press with a menu open closes only the menu.
- **`DateInput` dates.** `'YYYY-MM-DD'` strings in `value`, `minDate` and `maxDate` are read as local calendar days, so they no longer show the previous day west of UTC. `minDate` and `maxDate` strings now disable days as they should.

## Upgrading from 0.5.x

| Change | What to do |
| --- | --- |
| Panes draw a 1px left-only edge (it was 2px on the top and left in #666), and `RepanelStack` casts no shadow. The base pane is square with no edge. | To restore the old look: `--mochi-pane-edge-width: 2px; --mochi-pane-edge: #666;` and `--mochi-stack-shadow: drop-shadow(-6px 0 14px rgba(0, 0, 0, 0.14)); --mochi-stack-shadow-front: drop-shadow(-10px 0 26px rgba(0, 0, 0, 0.22));`. |
| The waterdrop corner is an accent (`--mochi-drop-radius`): the `Dialog` and the new `Avatar` wear it, and `FloatingPanel` can with `shape="drop"`. The `Dropdown` menu, `PopupPanel` and `FloatingPanel` keep their 0.5 corners; the `SlidingMenu` rounds the page side at 24px. | Nothing. To put the drop on every floating surface, set `--mochi-floating-radius: var(--mochi-drop-radius)` through `tokens`; pass `fullBleed` to `FloatingPanel` for square. |
| `RepanelStack` keeps a left sliver of the panel you came from when a panel collapses (`keepPast` defaults to `true`). | Pass `keepPast={false}` for the old collapse to 0 width. |
| Light `--color-primary` is darker, `#357099` (text now 5.3:1 on white), and the light focus ring is the primary rather than the accent blue. | Override `--color-primary` / `--mochi-focus-ring` through `tokens` to restore. |
| Selected `Item` is no longer outlined: it gets an accent tint and bold title. The `Dropdown` selected option gets a check, and the `Pagination` current page is ink with an accent bar instead of white on blue. `GridList` selection uses `--mochi-accent`. | None, unless you styled these selectors. |
| `Badge` `variant="warning"` uses dark ink (`#404040`) instead of white on amber. | Pass `color` to choose the ink. |
| Reduced motion now fades (opacity, at most 150ms) instead of switching animation off, and `data-motion` is read from `<html>` as well as a `ThemeWrapper`. | Use `motion="off"` (or `data-motion="off"`) for instant, or `motion="full"` to ignore `prefers-reduced-motion`. |
| Controls animate their state changes, and a held `Button` animates over 300ms (`--mochi-duration-press`). | Set `motion="off"` or override the `--mochi-duration-*` tokens. |
| `Table` column headers use the label style (Mochi Bold 12, uppercase), and `SlidingMenu` group labels are Mochi Bold. The `SlidingMenu` active row, success and error colours come from the `mochi-*` tokens. | Override the tokens, or the `.mochi-table-header` styles. |
| Copy changed: "Loading…" (a real ellipsis), "Select an option…", and one wording for the `DateInput` placeholder ("Select date…"). | Update any text matching on the old strings. |
| The PNG and GIF sprites are removed from `src` (nubbins, divider caps and the grabber are drawn in code), and `Spinner` renders an `<svg>`, not an `<img>`. | Nothing, unless you deep-imported the images or styled the spinner as an `img`. |
| `npm run check:tokens` is new. | Run it in CI to keep bare hex colours out of `src`. |

Notes for integrators:

- `RepanelStack` and `Repanel` pass their children through `React.Children.map`, so children remount once on the first render after you upgrade (local state in them resets once).
- `ThemeWrapper` writes `data-font-family` on `<html>`, as well as the motion and accessibility attributes, and restores the previous value on unmount.
- `data-motion`, `data-mochi-contrast` and `data-mochi-transparency` on `<html>` are read by every component, not only inside a `ThemeWrapper`. A `<html data-motion>` you set yourself survives `motion="system"`.
- `SpinnerProps` extends SVG attributes, not `<img>` attributes.
- `Avatar`, `Label`, `useWidthClass`, `SCREEN_NARROW`, `SCREEN_WIDE` and `waterdropRadius` are new exports. `onSelect` on `ViewSelectButton` gets a third argument; existing handlers keep working.

---

# Remochi v0.5.1 — 2026-11-15

This patch release adds dark-mode `--mochi-*` dialog tokens and `Dialog.tone`, fixes `Repanel` / `FloatingPanel` corner clipping while keeping the grabber nubbin unclipped, and moves `Header` and `Subheader` to pure CSS-flex sizing without stale JS resize state.

## Highlights

- **`Dialog` dark-mode tokens, `tone`, and focus/a11y fixes.** `ThemeWrapper` now defines `--mochi-dialog-bg`, `--mochi-dialog-ring`, `--mochi-overlay`, `--mochi-warning`, and `--mochi-font-display` across light and dark themes (synced onto `:root` for portaled dialogs). `Dialog` adds `tone?: 'normal' | 'warning' | 'error'` (default `'normal'`, applying `.mochi-dialog--warning` / `.mochi-dialog--error` and `data-tone`), updates scrim/ring/bottom-sheet styling, falls back to focusing the dialog element itself (`dialogRef.current`) when no focusable child is present, and sets `type="button"` and `aria-hidden="true"` on the close button glyph.
- **`Repanel` curve clipping without clipping `.mochi-panel-handle-nubbin`.** `Repanel` now wraps `{children}` in `.mochi-panel-body` (`border-radius: inherit; overflow: hidden;`) while keeping `.mochi-panel-handle-nubbin` outside it, and `RepanelStack` delegates vertical scrolling to `.mochi-panel-body` so scrolled content stays clipped to the panel's 45px top-left curve.
- **`FloatingPanel` corner clipping.** `.mochi-floating-panel` sets `display: block` and `overflow: hidden` so child content clips to its rounded corners.
- **CSS-flex `Header` and `Subheader` sizing.** Removed `useState`/`adjustContent()` `window` resize listeners and inline width/`maxWidth` styles from `Header` and `Subheader` in favor of CSS flex truncation (`flex: 1 1 auto; min-width: 0;` / `width: 100%; min-width: 0;`), and switched `Header`'s control check to `React.Children.toArray(children).length > 0`.
- **TypeScript declarations.** Added `DialogProps['tone']`, widened `RepanelProps['width']` to `number | string`, and added `StackedPanelsProps['style']` in `remochi.d.ts` and `dist/` declarations.

---

# Remochi v0.5.0 — 2026-11-12

This release exposes theme and surface/shape customization tokens, adds shaped `Button` and controlled `Wizard.step` options, ensures `...rest` DOM prop forwarding across components, and guards `MochiButton` text measurement in headless test environments.

## Highlights

- **Theme token overrides on `ThemeWrapper`.** New `tokens?: Record<string, string | number>` prop applies `--*` CSS custom properties to the wrapper element and syncs them onto `:root` (cleaning up removed keys on update/unmount) whenever `syncHtml` is enabled.
- **Surface, geometry, and typography tokens.** Added `--mochi-surface-material` (overriding panel/surface material on `PopupPanel`, `Dialog`, `Dropdown`, `Repanel`, `FloatingPanel`), shape tokens `--mochi-corner` (`16px`), `--mochi-corner-sm` (`10px`), `--mochi-corner-field` (`24px`), `--mochi-corner-pill` (`9999px`), and `--mochi-scallop` (`45px 0 0 0`), `Header` letter-spacing token `--mochi-header-tracking`, and shaped-button tokens `--mochi-button-bg`, `--mochi-button-radius`, and `--mochi-button-ink`.
- **`Button.appearance`.** New `'caps' | 'drop'` prop (`'caps'` default keeps classic Mochi brackets and press bar; `'drop'` renders a pill/drop shaped button).
- **Controlled `Wizard.step`.** Pass `step` (0-based index) with `onStepChange` to control the active wizard step externally while keeping uncontrolled mode as the default.
- **`Header` customization & consistent `...rest` forwarding.** `Header` now merges `className`, keeps `customClasses` on `.mochi-header-content`, and spreads `...rest` attributes onto its root element; `...rest` attributes (`aria-*`, `data-*`, event handlers, `style`, etc.) now forward cleanly across Remochi components.
- **Headless/jsdom test safety.** `MochiButton` guards `canvas.getContext?.('2d')` so renders don't throw in jsdom environments without a 2D canvas context.
- **Updated TypeScript declarations.** `remochi.d.ts` and `dist/` declarations cover `ButtonProps['appearance']`, `HeaderProps['customClasses']`, `ThemeWrapperProps['tokens']`, `WizardProps['step']`, and rest-attribute forwarding.

---

# Remochi v0.4.0 — 2026-10-28

This release pulls Remochi back toward what Mochi and webOS actually looked like, and fixes a long list of bugs found in a full audit. The headline changes: Mochi's real typography and accent color, a redesigned `Dialog`, a restyled `SlidingMenu`, a rebuilt `Wizard`, a corrected CommonJS build, and a number of correctness fixes (Buttons no longer submit forms, Toggle and Slider no longer misfire, keyboard focus is visible).

**This release has behavior changes — see [Upgrading from 0.3.0](#upgrading-from-030) before bumping.**

## Highlights

- **Mochi typography.** The Mochi font families are defined for real now, backed by a bundled Lato fallback. Buttons are bold oblique in every state, headers are light, list items are bold italic.
- **Redesigned `Dialog`.** A centered Mochi card on wide screens, a one-handed bottom sheet with left-aligned buttons on phones (< 768px).
- **Restyled `SlidingMenu`.** Same chrome as the Dialog and Popup.
- **`Wizard` rebuilt.** Stack-style completion tracking, with an optional override so the app can own completion state.
- **Dark popup nubbins.** `PopupPanel`'s nubbins now match in dark mode, like Repanel's.
- **Fixed CommonJS build.** `require('remochi')` works again.
- **Buttons no longer submit forms**, plus `affirmative` and `blue` Button types from Mochi.

## Upgrading from 0.3.0

| Change | What to do |
| --- | --- |
| `Button`'s `type` is now only the visual variant. The native `<button type>` is always `"button"` unless you pass `htmlType`. | Add `htmlType="submit"` to buttons that should submit a form. |
| `Dialog` no longer shows a × by default. `size` now sets width (320 / 420 / 600px), not height. Built-in confirm dialogs have a green confirm button and a plain Cancel (it used to be red). | Pass `showCloseButton` to keep the ×. Pass `confirmType="warning"` for destructive confirms. |
| `RepanelStack`'s `peek` default is now `320` (was `240`). `overlap` is now a 0–1 fraction of Mochi's 45px pane overlap, default `1` (it was a cosmetic shadow strength, default `0.5`). | If you passed `overlap`, re-check the spacing. |
| The Google Fonts `<link>` for Lato is gone. Lato now ships inside the package (`dist/fonts/`). | Nothing, as long as your bundler resolves the `url(fonts/…)` references in `remochi/css`. See [Fonts](#fonts). |
| The CommonJS entry is now `dist/index.cjs`, and `remochi/styles` points at `dist/index.css`. | Nothing, if you import by package name. Don't deep-import `dist/index.cjs.js` or `dist/index.cjs.css`. |
| Components rendered without a `ThemeWrapper` now use their light fallbacks again (a bare dark `:root` default was removed). | Wrap your app in `ThemeWrapper`, as before. |
| Disabled `Button` and `Input` no longer grey out their text color — only opacity (0.4) changes. | None. |

## Typography

- The Mochi families — `Mochi Light`, `Mochi Medium` (with real bold and italic faces), `Mochi Bold`, `Mochi Bold Italic`, `Mochi Bold Oblique`, `Mochi Med Oblique` — are now actually defined (several were referenced in the SCSS but never declared). Each tries an installed Prelude first, then the bundled Lato, exactly as Mochi did.
- **Button** is "Mochi Bold Oblique" in every state, disabled included (it was upright, italic only when disabled — the inverse of Mochi). Its brackets are upright "Mochi Bold".
- **Header** is "Mochi Light"; **Subheader** "Mochi Medium" italic; **Badge** "Mochi Bold Italic"; **ListItem / ListHeader** now render real bold italic.
- Regular text was silently rendering in the 500 weight: weight-400 text measured identical to Segoe UI Semibold. It now renders as Lato Regular.
- Mochi's own Lato `.woff` files draw several letters out of place in current browsers (regular "g"/"8", bold "b"/"p", bold-italic "3"). The bundled faces are re-encoded from Mochi's `.ttf` copies, which render correctly.

## Dialog

- **Wide screens:** a centered card over a scrim, in the same chrome as `PopupPanel` — 2px `#646464` border, 24px radius, soft drop shadow, Mochi Bold title, centered buttons, and the Remochi `Divider` between title and body. Opens with the same fade-in as PopupPanel.
- **Phones (< 768px):** a bottom sheet — full width, rounded top corners, slides up from the bottom edge, with buttons left-aligned toward the thumb and room for the home indicator (Palm's one-handed rule).
- Button colors follow the webOS guidelines: Cancel is a plain button, the built-in confirm is green (`affirmative`). New `confirmType` prop lets a destructive confirm use `'warning'`.
- Prompt dialogs use Remochi's own `Input`.
- Each dialog gets a unique title id (two open dialogs no longer clash on `aria-labelledby`).
- `showCloseButton` is opt-in; the × is a bare glyph with a 44px hit area.
- Removed the bottom-sheet drag-handle pill on phones: it suggested swipe-to-dismiss, which isn't implemented.

## SlidingMenu

- Restyled to match the Dialog sheet: theme surface, 2px Mochi popup border on the edge facing the page, 24px corners on that side, drop shadow cast away from the docked edge. Docked at the bottom, it's identical to the phone Dialog.
- Menu colors now come from the theme tokens, so dark mode follows `ThemeWrapper` automatically.
- **Fixed:** an OS-level `prefers-color-scheme: dark` rule ignored the app's own theme, making menu items nearly invisible in light mode on computers set to dark. It now only applies when no ThemeWrapper has set a theme.
- Item hover uses the theme's subtle hover tint instead of a solid color.
- **Fixed:** a `SlidingMenu` inside a `ThemeWrapper` no longer wraps itself in a second, dark-by-default wrapper that rewrote `<html data-mochi-theme>` and could flip a light app to dark.
- Short aliases `SlidingMenu`, `SlidingMenuItem`, `SlidingMenuItemGroup`, `SlidingMenuContentShifter` added.

## Wizard

- **Completion tracking now works like a stack:** Next marks the step you're leaving as completed; going back (Back, or tapping an earlier step) un-completes the step returned to and everything after it.
- **Optional override:** pass `completedSteps` to manage completion yourself — the wizard then shows exactly that list. `onCompletedStepsChange(next, { reason, from, to })` reports what the default tracking would have produced, whether or not you control it, so you can take it, adjust it, or ignore it.
- New `onStepChange(step, { reason, from, to })`, where `reason` is `next | finish | back | skip | jump`.
- A second click on Next while an async `step.onNext` is pending is ignored (it used to advance, and mark completed, twice).
- Cleaned up a stray `variant="secondary"` prop that was landing on the page as a DOM attribute.
- Wizard background uses the panel tone (`#f5f5f5` light / `#404040` dark), like Repanel — a pure white block on the `#f5f5f5` page glared in light mode.
- The component guide's Wizard section documented props that never existed; it now describes the real API.

## Popup

- **Dark-mode nubbins.** All 12 nubbin images (up/down/left/right and the eight corner variants) now have dark versions, built the way Repanel's `left-shadow.png` was: transparency untouched, fill remapped to the dark surface (`#2a2a2a`), stroke kept at the popup border `#646464`, shadow kept black. They switch via the `<html>` theme attribute, because the popup renders at the end of `<body>`.

## Panels (`Repanel` / `RepanelStack`)

- **Mochi geometry:** 45px top-left corner radius (the first panel in a stack stays square), 320px parent columns, each running 45px under the next pane's corner, with matching right padding so content isn't hidden. Follows Mochi's `Panels.less` and the webOS HIG's 320px panes.
- **Narrow-screen fixes:**
  - Swipe-to-close on narrow screens now slides the closing panel out to the right under your finger (it used to crossfade). Panels ahead of the active one wait off to the right, so `next()` slides in from the right too.
  - Fixed: a swipe released before the close threshold, and a double-click, could close more than one panel.
  - The narrow grabber's hit area no longer reaches into the panel's bottom-left content and steals taps from footer controls.
- Dark nubbin selection uses `isDark`, so it follows the resolved theme when the mode is `'system'`.

## ThemeWrapper

- New props: `theme` (controlled), `onThemeChange`, `storageKey` (persist to localStorage), `syncHtml`; `defaultTheme` accepts `'system'`, which follows the OS and updates live.
- Context now exposes `resolvedTheme`, `setTheme`, `isDark`, `isLight`, `colors`.
- New exports: `ThemeContext`, `DARK_THEME_COLORS`, `LIGHT_THEME_COLORS`.
- **Nested wrappers:** only the outermost wrapper syncs `<html>` and gets `min-height: 100vh` (via a new `mochi-theme-wrapper--root` class). A nested wrapper with no theme follows its parent live; `defaultTheme="dark"` under a light parent works.
- **Light fallbacks restored:** a bare `:root` selector had made every component rendered *without* a ThemeWrapper use dark colors, defeating each component's light `var()` fallback. Removed.
- The Google Fonts runtime fetch was removed (see Typography).

## Mochi accent, disabled state, and tap targets

- New `--mochi-accent: #69cdff` (Mochi's accent), used for the Button press bar, ViewSelectButton bar, Slider knob and fill, ProgressBar fill, and focused field border. `--mochi-primary` stays `#4a8bc2` for text.
- New Button types `affirmative` (`#00dd11`) and `blue` (`#35A8EE`) from Mochi's `ButtonColors.less`.
- One `--mochi-disabled-opacity: 0.4` token replaces the scattered 0.7 / 0.5 / 0.48 values (Wizard's 0.6 on completed-step connectors is intentionally unchanged).
- New `--mochi-slider-track` (`#a2a2a2` light, `#646464` dark) — the slider track was a nearly invisible 4% black.
- **Tap targets:** invisible 54px hit areas (the webOS TouchPad standard) on Checkbox, Radio, Toggle, the slider knob and track, and the panel grabber. Visuals are unchanged.

## Fixes

**Button**
- `type` is no longer passed to the native element. An unrecognized value falls back to `submit`, so every Button inside a `<form>` submitted it. New `htmlType` prop (default `"button"`); boolean `disabled` works alongside `type="disabled"`.
- Bracket spread (±4px) and underline now show on press only (`:active:hover`) or with an `active` class, as in Mochi. They were firing on hover, and on touch screens hover sticks after a tap. Removed an unused `bounce` keyframe.

**ViewSelectButton**
- The selection bar no longer stays wide after the press animation: it measured the button while its letter-spacing was still expanded. It now sizes from the resting width (as Mochi's `calcBarValue` did) and re-measures when items resize, fonts load, or the font size changes at < 640px.

**Toggle**
- Honors `checked` as an alias for `value` (the demo already passed it), and `onChange` receives `{ value, checked, target }`.
- `onChange` fires once per actual change. A drag used to fire it on every pointer move, so a toggle that flips state in its handler ended on a random state. A pointer-up after a press that started elsewhere is ignored.
- `canAnimate={false}` now truly disables the knob's transition.

**Slider**
- Keyboard support: arrows, PageUp/PageDown, Home, End.
- Follows `value` prop changes; `onChange` fires only when the value changes.
- Dropped the overshoot easing and turned transitions off while dragging (closer to Mochi).

**ListItem**
- Rows were 65px with the label stuck to the top and 48px of dead space below (a literal copy of Mochi's padding, which assumes the row supplies its own content). Rows are now 54px with the label vertically centered; the 32px left inset is kept.
- Passes `onClick`, `className`, `id`, `aria-*` and other props through to the row — it was silently dropping everything except its three own props, so `onClick` never ran.

**Focus and warnings**
- Visible keyboard focus rings added to `MochiButton`, `ViewSelectButton`, `Dialog`, `Dropdown`, `RichText`, `TextArea`, `PopupPanel` (each had `outline: none` with no replacement). Removed an inline `outline: none` in `RichText` that overrode the stylesheet's focus ring.
- `Spinner`: `active` is now a transient `$active` prop. It was leaking to the `<img>` as a boolean attribute and logging a React warning on every render.

## Package, build, and types

- **CommonJS build fixed.** `package.json` has `"type": "module"`, so Node read the old `dist/index.cjs.js` as ESM and `require('remochi')` failed. The CJS bundle is now `dist/index.cjs`.
- Separate type declarations for each entry: `dist/index.d.ts` for `import`, `dist/index.d.cts` for `require`. `"types"` now comes first inside each condition, as TypeScript requires. Verified with TypeScript 5.9 on both a `.mts` and a `.cts` consumer.
- The CJS stylesheet is now `dist/index.css` (`remochi/styles`); it has identical rules to `index.esm.css` (`remochi/css`).
- The old `dist/index.cjs.js*` and `dist/index.cjs.css*` outputs are removed.
- **Type fixes:** `ButtonProps` now matches the real component (`type`, `htmlType`, `disabled`, plus native button attributes); `DialogProps` adds `confirmType` and the previously missing `actions`; `WizardProps` adds the new props; `ListItemProps` accepts normal div props.
- Runtime exports and type declarations now match exactly (55 names, none missing on either side).
- The README example uses the short component names.

## Fonts

`remochi/css` references the bundled Lato faces as `url(fonts/…)`, relative to the stylesheet. Bundlers (Vite, webpack, etc.) resolve this automatically when you `import 'remochi/css'`. If you load `dist/index.css` by hand, serve `dist/fonts/` next to it. The faces are Lato under the SIL Open Font License (`OFL.txt` is included in `dist/fonts/`).

## Known issues and follow-ups

- `Button` has no `forwardRef`, so a `ref` on it only works on React 19.
- On narrow screens there's no keyboard way to close a panel from its grabber (its arrow keys only adjust reveal depth, which does nothing there).
- The slider's value bubble keeps Mochi's white text on `#69cdff`, which is low contrast.
- Pagination's first/last glyphs (⟨ ⟩) aren't in Lato or Prelude and fall back to a system font.
- `RichText` renders its `value` prop as raw HTML — don't pass unsanitized user content.
- `ListItem` rows have no separator lines (as in Mochi); an Onyx-style rule is possible.

---

# Remochi v0.3.0 — 2026-07-14

This release is primarily a **dark mode pass** across the entire component library, plus a panel-system rename/rewrite and a fix for a completely non-functional component.

## Highlights

- **Full dark mode support.** Every component now responds correctly to `ThemeWrapper`'s theme, with consistent, legible colors — this was previously broken or partial for most components.
- **`Panel`/`StackedPanels`/`StackedPanel` renamed to `Repanel`/`RepanelStack`**, with a redesigned drag gesture (reveal-adjust vs. swipe-to-close).
- **`ViewSelectButton` fixed.** It was entirely non-functional — see below.

## Dark mode

The core fix: components that render via `ReactDOM.createPortal` (`Dialog`, `Dropdown`'s menu, `Popup`) sit outside `ThemeWrapper` in the actual DOM, so CSS custom properties scoped to a class on the wrapper `<div>` never reached them — they were stuck on whatever fallback color their own CSS declared, regardless of the selected theme. Theme color tokens are now scoped to `:root[data-mochi-theme='dark'|'light']` instead, an attribute kept in sync on `<html>`, so every themed value is reachable from anywhere in the document, portals included.

With that fixed, every component's actual colors got a pass:

- **Button** — text color is now theme-aware via a new `--mochi-button-text` token (preserves the exact original `#333333` in light mode).
- **Radio / Checkbox / Toggle** —
  - Fixed a recurring bug where the checked-state fill's fallback color implied amber but the live CSS variable actually resolved to blue (`--mochi-primary`). Both now correctly read a dedicated `--mochi-selected` amber token.
  - Unselected/unchecked fill and border now share one consistent look — a light-grey fill (`--mochi-mark`) inside a dark border (`--mochi-toggle-track`) — instead of Radio's previous too-dark dark-mode fill or Checkbox's border-matches-fill invisibility.
  - The checkmark (Radio/Checkbox) and Toggle's "on" label text now use a dedicated dark accent (`--mochi-toggle-knob`, `#404040`) that stays legible against the amber "selected" fill — a plain light grey there was nearly invisible (~1:1 contrast).
  - Toggle's sliding knob no longer stays plain white in dark mode.
- **Input / TextArea / RichText** — new `--mochi-field-*` tokens give dark mode a distinct, legible field surface, with a dedicated placeholder color fixing contrast that dropped to ~2.4:1 after the new field background landed (now ~3.6:1).
- **Item / Dropdown trigger** — fixed a hover bug where these elements' opaque background was replaced by a translucent overlay meant for elements without their own background, letting the much-darker page background flash through instead of a subtle highlight. New opaque `--mochi-panel-hover` token instead.
- **Dropdown menu** — background no longer sits too close to the page background in dark mode; fixed the same amber-vs-blue selected-color bug as Radio.
- **Repanel / RepanelStack** — panel content had no explicit text color at all, relying on inherited/hardcoded colors that were nearly invisible against the new dark panel background; `Repanel` also now correctly points at the shadow-variant nubbin asset.
- **Badge / ProgressBar** — warning color now matches the amber "selected" accent (previously an unrelated orange); error matches the warning Button's red; all variant colors adjust with theme via new `--mochi-success`/`--mochi-info` aliases.
- **NubbinDivider** — cap stroke recolored to match the nubbin's own bolder stroke via a CSS mask instead of a mismatched, blurry PNG.
- **Demo app background** — the demo's own page shell (`.App`, section borders, headings, captions) was hardcoded light-only and left a bright box around the properly-themed components; now fully theme-aware.

## Panels: `Repanel` / `RepanelStack`

- `Panel` → `Repanel`, `StackedPanels`/`StackedPanel` → `RepanelStack` (a single component; children are plain `Repanel`s).
- New drag gesture model:
  - A parent panel's grabber reveal-adjusts — grows/shrinks how many panels are shown behind the active one.
  - The active panel's own grabber does the same reveal-adjust in either direction as long as there's more to reveal — the only way back once the stack is collapsed to just the front panel.
  - Once nothing's left to reveal, dragging the active grabber right becomes swipe-to-close instead: release past ~45%, a fast flick, or a double-click commits it.
- Added corner-nubbin support to `NubbinDivider` (single end-cap instead of a middle bump) for marking the end of a stack visually.

## Fixed: `ViewSelectButton`

`ViewSelectButton` rendered as empty brackets — `( )` — with no buttons inside at all. Three separate bugs, found and fixed together:

1. Its actual API is `items`/`onSelect`; nothing in the codebase was calling it with those prop names (some call sites used `options`/`value`/`onChange`, which this component doesn't accept), so it always received the default empty `items` array.
2. Each button tried to size itself via a circular measurement: read its own rendered width, then set that measurement back as its own explicit `width`. On first render this always read back `0`, permanently locking every button at zero width. Removed — plain CSS (`inline-block` + padding) already sizes it correctly.
3. The sliding underline bar's position was computed against the *outer* container, which also includes the `(` decorator bracket before it, instead of the actual positioned wrapper the bar sits inside — offsetting the bar to the right by the bracket's width every time. Now measured against the correct element.

## New theme tokens

For consumers customizing colors via CSS custom properties:

| Token | Purpose |
| --- | --- |
| `--mochi-selected` / `--mochi-selected-soft` | The amber "checked/on" accent (Radio, Toggle, Checkbox) |
| `--mochi-mark` | Light-grey fill for Radio/Checkbox's unchecked state |
| `--mochi-toggle-track` | Dark border/track color shared by Radio, Checkbox, and Toggle's "off" state |
| `--mochi-toggle-knob` | Dark accent used for Toggle's knob and anything else shown against the amber "selected" fill |
| `--mochi-button-text` | Button's normal-state text color |
| `--mochi-field-bg` / `--mochi-field-border` / `--mochi-field-text` / `--mochi-field-placeholder` | Input/TextArea/RichText surface colors |
| `--mochi-panel-bg` / `--mochi-panel-border` / `--mochi-panel-shadow-bg` / `--mochi-panel-shadow-tint` | Repanel's default/shadow variants |
| `--mochi-panel-hover` | Opaque hover highlight for Item and Dropdown's trigger |
| `--mochi-success` / `--mochi-info` | Aliases for the existing success/info colors, for consistency with the other `--mochi-*` tokens |

## Miscellaneous

- Fixed a Vite/PostCSS `@import must precede all other statements` build warning by loading the Lato Google Font via a JS-injected `<link>` tag instead of a CSS `@import` (Rollup bundles every component's SCSS into one file, and `@import` is only valid as that final file's literal first statement).
