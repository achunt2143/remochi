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
