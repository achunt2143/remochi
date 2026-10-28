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
