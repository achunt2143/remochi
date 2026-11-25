# Remochi Component Guide

The API and behaviour reference for Remochi 0.6.0: every exported component, hook and helper, with props, defaults, examples and the behaviour you need to build with them. For the principles behind the look (when to use which surface, corners, type, colour) read [design-guide.md](./design-guide.md); this guide says what each piece does and how to call it. Release history is in [RELEASE_NOTES.md](../RELEASE_NOTES.md).

Contents: [Setup](#setup) · [Theming](#theming) · [Motion, contrast and transparency](#motion-contrast-and-transparency) · [Corners and screens](#corners-and-screens) · [Token reference](#token-reference) · [Buttons and selection](#buttons-and-selection) · [Inputs and forms](#inputs-and-forms) · [Status, text and layout](#status-text-and-layout) · [Lists and tables](#lists-and-tables) · [Panels](#panels) · [Overlays](#overlays) · [Menus](#menus) · [Progress and feedback](#progress-and-feedback) · [Flows and media](#flows-and-media)

## Setup

Import the global CSS once and wrap the app in `ThemeWrapper`. Every component supports light and dark with no per-component props.

```jsx
import React from 'react';
import 'remochi/css';
import { ThemeWrapper, useTheme, Button, Header } from 'remochi';

function Shell() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <>
      <Header content="Settings" />
      <Button onClick={toggleTheme}>{isDark ? 'Light' : 'Dark'}</Button>
    </>
  );
}

export default function App() {
  return (
    <ThemeWrapper>
      <Shell />
    </ThemeWrapper>
  );
}
```

`remochi/css` is the stylesheet for ES module builds; `remochi/styles` is the plain CSS file. React 18 or 19 is required.

Everything is exported from `remochi`: Avatar, Badge, Button, Radio, ViewSelectButton, Checkbox, Collapsable (with CollapsableHeader, CollapsableItem, CollapsableFooter), DateInput, Dialog, Divider, NubbinDivider, Dropdown, Header, Subheader, Label, Input, TextArea, RichText, Item, List, ListItem, ListHeader, GridList, GridListImageItem, Video, SlidingMenu (with `.ContentShifter`), SlidingMenuItem, SlidingMenuItemGroup, NumberInput, Pagination, Repanel, RepanelStack, FloatingPanel, PopupPanel, ProgressBar, Slider, Spinner, Table, ThemeWrapper, Toggle, Wizard, plus `useTheme`, `ThemeContext`, `DARK_THEME_COLORS`, `LIGHT_THEME_COLORS`, `useWidthClass`, `SCREEN_NARROW`, `SCREEN_WIDE` and `waterdropRadius`. The `Mochi*` names (`MochiAvatar`, `MochiBadge`, `MochiSlidingMenu`, `MochiSlidingMenuItem`, `MochiSlidingMenuItemGroup`, `MochiSlidingMenuContentShifter`, `MochiFloatingPanel`, `MochiStackedPanels`, `StackedMochiPanels`, `SlidingMenuContentShifter`) are aliases of the same components.

Most components pass unknown props (`className`, `style`, `aria-*`, handlers) to their root element, and call a handler you pass for keyboard or click events before their own, so `preventDefault()` on it opts out of the built-in behaviour.

## Theming

### ThemeWrapper

Provides the light/dark theme, the accessibility modes and the token overrides. Put one at the root; a nested one themes a subtree.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `theme` | `'dark' \| 'light' \| 'system'` | – | Controlled theme. |
| `defaultTheme` | same | – | Initial theme when uncontrolled. A nested wrapper without it follows its parent; a root wrapper without it starts `'dark'`. |
| `onThemeChange` | `(theme, resolvedTheme) => void` | – | Called by `setTheme` / `toggleTheme`. |
| `storageKey` | `string \| null` | `null` | `localStorage` key that remembers the choice. |
| `syncHtml` | `boolean` | `true` for the root wrapper, `false` for nested | Mirrors theme, modes, font and `tokens` onto `<html>` so portaled components pick them up, and fills the viewport. |
| `fontFamily` | `'Prelude' \| 'Lato'` | `'Prelude'` | Body typeface. Prelude uses the locally installed webOS Prelude, else bundled Lato; `'Lato'` forces bundled Lato. |
| `motion` | `'system' \| 'full' \| 'reduced' \| 'off'` | `'system'` | See [Motion](#motion-contrast-and-transparency). |
| `contrast` | `'system' \| 'standard' \| 'more'` | `'system'` | |
| `transparency` | `'system' \| 'standard' \| 'reduced'` | `'system'` | |
| `ground` | `'plain' \| 'vignette'` | `'plain'` | `'vignette'` shades the edges of the area the wrapper covers with an inset shadow (`--mochi-vignette`). |
| `tokens` | `Record<string, string \| number>` | – | CSS custom property overrides, applied inline on the wrapper and mirrored onto `<html>` when `syncHtml` is on. Keys must start with `--`. |

`useTheme()` returns `{ theme, resolvedTheme, setTheme, toggleTheme, isDark, isLight, colors }`. `colors` is `DARK_THEME_COLORS` or `LIGHT_THEME_COLORS` (type `ThemeColors`) for reading palette values in JS; the CSS tokens below are the source for styling.

```jsx
<ThemeWrapper
  defaultTheme="system"
  storageKey="app-theme"
  fontFamily="Lato"
  ground="vignette"
  tokens={{
    '--mochi-accent': '#ff7a45',
    '--mochi-floating-radius': 'var(--mochi-drop-radius)',
  }}
>
  <App />
</ThemeWrapper>
```

Colour tokens versus shape tokens:

- **Colour tokens** (`--mochi-accent`, `--mochi-panel-bg`, `--mochi-text`, `--mochi-focus-ring`, ...) are defined per theme, so set one only if you mean it for both themes, or set it from `theme`-aware code. `--mochi-accent` and `--mochi-accent-soft` have no default: set `--mochi-accent` alone and Slider, Toggle, Checkbox, Radio, Input, Button and ProgressBar retint together.
- **Shape tokens** (`--mochi-corner*`, `--mochi-drop-radius`, `--mochi-scallop`, `--mochi-pane-edge-width`, `--mochi-header-tracking`, ...) are constant across themes.

Portaled surfaces (`Dialog`, `PopupPanel`, the `Dropdown` menu, the `DateInput` calendar) render into `document.body`, outside the wrapper. They read tokens from `<html>`, so keep `syncHtml` on for the root wrapper. They take their font from `--mochi-font-body`, which `fontFamily` sets and the root wrapper mirrors onto `<html>`. A nested wrapper with `syncHtml={false}` does not retheme portals opened from inside it.

Run `npm run check:tokens` to keep bare hex colours out of component styles and to check contrast floors.

## Motion, contrast and transparency

Every motion has three forms:

- **Full**: as designed.
- **Reduced**: opacity only. A fade of at most `--mochi-duration-reduced` (150ms), with no travel, scale, blur or stagger.
- **Off**: instant.

Drags always track the pointer exactly in every mode. The mode comes from the `motion` prop, a `data-motion="full|reduced|off"` attribute on `<html>` or a wrapper (a host app can set it), else `prefers-reduced-motion: reduce`, which means Reduced. `'system'` writes nothing, so the host attribute or the OS decides.

```jsx
<ThemeWrapper motion="reduced" contrast="system" transparency="system">
  <App />
</ThemeWrapper>
```

Durations and curves are tokens:

| Duration | Token | Used for |
| --- | --- | --- |
| 120ms | `--mochi-duration-focus` | Focus rings easing in |
| 150ms | `--mochi-duration-reduced` | The longest a Reduced fade runs |
| 200ms | `--mochi-duration-control` | A small control changing state: tick, toggle, chevron, tint, enabled/disabled |
| 220ms | `--mochi-duration-arrive` (`--mochi-ease-arrive`) | Things arriving: Dialog, popups, Button bracket spread, step content |
| 260ms | `--mochi-duration-stack` (`--mochi-ease-forward`) | Forward travel: RepanelStack, SlidingMenu, ViewSelectButton and Pagination bars |
| 300ms | `--mochi-duration-press` | A held `Button`'s accent bar growing in |

What animates in Full (nothing runs longer than 260ms):

- `Checkbox`: the fill grows from the centre and the tick draws left to right; a held press leans to 0.92. `Radio`: the fill grows in and shrinks away when another is chosen; same lean.
- `Toggle`: knob and track colour travel together, the On/Off labels crossfade, and the knob squishes 4px toward its travel while held. `Slider`: the knob grows while held and the value bubble rises from it; fill and knob track the pointer exactly, and key steps ease.
- `Pagination`: one accent bar slides to the current page. `ViewSelectButton`: its bar travels between segments.
- `Dropdown`: the chevron turns 180 degrees, the menu grows from the trigger edge and the selected check fades in. `Collapsable`: the chevron turns and the content eases open. `DateInput`: the selected day's fill grows in, and changing month slides the day grid in 12px from the side of the arrow used.
- `Item`, `ListItem`, `GridList`: press and selection tints fade; the `GridList` ring eases in. `Input`, `TextArea`, `RichText`: the focus border and 3px halo ease in.
- `Wizard`: a completed step's tick draws and the progress between steps fills; step content enters 12px from the right going forward (Next, Skip) and from the left going back, with a fade.
- `NumberInput`: the figure rises in from 4px below on increment (the old one fades up and out) and the reverse on decrement; typing does not animate.
- `Table`: the sort arrow turns over when the direction flips, the active header colour eases, the row tint fades. `Badge`: fades and scales in from 0.9, and a changed count crossfades (no bounce). `ProgressBar`: the fill eases, 200ms for a short change and 220ms for a long one.
- `Button`: a held press scales to 1.05, the brackets spread and the accent bar grows in.
- Focus rings on every control ease in over 120ms; a control becoming enabled or disabled eases its opacity over 200ms.
- `Spinner`: draws its shape morph. Under Reduced it holds each of its three shapes with a 150ms crossfade; under Off it shows a still circle.

Under Reduced these become opacity fades; under Off they are instant.

**Contrast.** `contrast="more"` (or `prefers-contrast: more`) takes ink to pure black or white, edges to full ink and surfaces solid, and makes scrims solid. `"standard"` opts out of the OS preference; the default `"system"` follows it.

**Transparency.** `transparency="reduced"` (or `prefers-reduced-transparency`) makes the Dialog scrim and `--mochi-surface-material` solid and drops the scrim's blur. `"standard"` opts out; `"system"` follows the OS.

Both modes are written as `data-mochi-contrast` and `data-mochi-transparency` (on `<html>` too with `syncHtml`).

## Corners and screens

Corners follow a ladder, set by size and role:

| Token | Value | Used by |
| --- | --- | --- |
| `--mochi-corner-xs` | 4px | Small marks and focus edges (`Collapsable` header) |
| `--mochi-corner-sm` | 10px | Rows (`Item`) |
| `--mochi-corner` | 16px | `FloatingPanel`, drop-shaped `Button` |
| `--mochi-corner-field` | 24px | Text fields (`Input`, `TextArea`, `RichText`), `PopupPanel`, the `Dropdown` menu |
| `--mochi-corner-pill` | 9999px | `Badge`, `Dropdown` trigger, slider tracks |
| `--mochi-scallop` | `45px 0 0 0` | The rounded left edge of an edge-anchored pane (`Repanel`); `SlidingMenu` rounds its page side at 24px |

The **waterdrop** (`--mochi-drop-radius`, `16px 4px 16px 16px`, top-right nearly sharp) is an accent for special purposes, not the corner of every floating surface. It appears on the `Avatar`, the `Dialog` and `FloatingPanel shape="drop"`. `--mochi-dialog-radius` defaults to it, so a drop set on a wrapper reaches the Dialog.

`--mochi-floating-radius` has no default. `PopupPanel`, the `Dropdown` menu and `FloatingPanel` each keep their own ladder corner until a host sets it (for example to `var(--mochi-drop-radius)`), which retunes all of them at once.

Screens: `SCREEN_NARROW` (768) and `SCREEN_WIDE` (1280) are numbers mirroring `--mochi-screen-narrow` and `--mochi-screen-wide`. Narrow is up to 768, wide from 1280, medium between. Media queries cannot read custom properties, so stylesheets repeat the numbers and JavaScript reads the constants.

### useWidthClass

`useWidthClass(ref, options?)` returns `'narrow' | 'medium' | 'wide'` for an element's own width (not the window's), so a narrow pane on a wide screen counts as narrow. `options` is `{ narrow?: number; wide?: number }` (defaults 768 and 1280). It reads `'medium'` until measured, measures on mount, and follows resizes.

```jsx
function Pane({ children }) {
  const ref = useRef(null);
  const size = useWidthClass(ref);
  return <div ref={ref} data-size={size}>{children}</div>;
}
```

### waterdropRadius

`waterdropRadius(size)` returns the waterdrop as a `border-radius` string for a surface whose short side is `size` px. Corners follow size: `7px 2px 7px 7px` at 20, `12px 3px 12px 12px` at 40, the full `16px 4px 16px 16px` from about 56 up, interpolated between, and never more than half the short side. Use it for waterdrop surfaces smaller than 56px.

```jsx
<div style={{ width: 40, height: 40, borderRadius: waterdropRadius(40) }} />
```

## Token reference

Public `--mochi-*` tokens, with values per theme from `MochiThemeWrapper.scss`. "Both" means one value for both themes.

**Ink and surfaces**

| Token | Dark | Light |
| --- | --- | --- |
| `--mochi-text` | `#ffffff` | `#1a1a1a` |
| `--mochi-text-muted` | `#a0a0a0` | `#555555` |
| `--mochi-text-faint` | `#666666` | `#888888` |
| `--mochi-bg` | `#1a1a1a` | `#f5f5f5` |
| `--mochi-surface` | `#2a2a2a` | `#ffffff` |
| `--mochi-border` | `#646464` | `rgba(0,0,0,0.12)` |
| `--mochi-hover` / `--mochi-active` / `--mochi-stripe` | white at 6% / 10% / 3% | black at 4% / 8% / 2% |
| `--mochi-primary` | `#5ab8f5` | `#357099` |
| `--mochi-primary-hover` | `#6ba5db` | `#2f6490` |
| `--mochi-primary-text` | `#ffffff` | `#ffffff` |
| `--mochi-primary-soft` | `rgba(91,157,217,0.18)` | `rgba(53,112,153,0.12)` |
| `--mochi-success` / `--mochi-warning` / `--mochi-error` / `--mochi-info` | `#4caf50` / `#ff9800` / `#ef5350` / `#2196f3` | `#388e3c` / `#e65100` / `#c62828` / `#1565c0` |

**Panels, fields and controls**

| Token | Dark | Light |
| --- | --- | --- |
| `--mochi-panel-bg` | `#404040` | `#f5f5f5` |
| `--mochi-panel-border` | `#333333` | `#666666` |
| `--mochi-pane-edge` | `#333333` | `#cccccc` |
| `--mochi-panel-shadow-bg` | `#1a1a1a` | `#f5f5f5` |
| `--mochi-panel-shadow-tint` | `#606060` | `rgba(0,0,0,0.3)` |
| `--mochi-panel-text-muted` | `#c0c0c0` | `var(--mochi-text-muted)` |
| `--mochi-panel-button-text` | `#b4b4b4` | `var(--mochi-button-text)` |
| `--mochi-panel-hover` | `#4d4d4d` | `#ececec` |
| `--mochi-surface-material` | `var(--mochi-panel-bg)` | `var(--mochi-panel-bg)` |
| `--mochi-field-bg` | `#606060` | `var(--mochi-surface)` |
| `--mochi-field-border` | `#404040` | `var(--mochi-border)` |
| `--mochi-field-text` | `#eeeeee` | `var(--mochi-text)` |
| `--mochi-field-placeholder` | `#c4c4c4` | `var(--mochi-text-faint)` |
| `--mochi-popup-border` | `#646464` | `#646464` |
| `--mochi-button-text` | `#a0a0a0` | `#333333` |
| `--mochi-toggle-knob` | `#404040` | `#ffffff` |
| `--mochi-mark` (unchecked Radio/Checkbox fill) | `#c4c4c4` | `#ffffff` |
| `--mochi-slider-track` | `#646464` | `#a2a2a2` |
| `--mochi-avatar-bg` | `var(--mochi-panel-hover)` | `var(--mochi-panel-hover)` |
| `--mochi-dialog-bg` | `#333333` | `#f5f5f5` |
| `--mochi-dialog-ring` | `rgba(255,255,255,0.14)` | `rgba(0,0,0,0.10)` |
| `--mochi-overlay` (Dialog scrim) | `rgba(4,6,14,0.56)` | `rgba(8,10,24,0.36)` |
| `--mochi-vignette` | `inset 0 0 169px rgba(0,0,0,0.5)` | `inset 0 0 169px rgba(0,0,0,0.3)` |
| `--mochi-focus-ring` | `var(--mochi-accent, #69cdff)` | `var(--mochi-primary)` |

The light ring follows primary because the accent is only 1.64:1 on a light ground. Hosts that set `--mochi-focus-ring` get it in both themes.

**Constants (both themes)**

| Token | Value |
| --- | --- |
| `--mochi-selected` / `--mochi-selected-soft` | `#ffb80d` / `rgba(255,184,13,0.35)` |
| `--mochi-on-selected-ink` | `#404040` |
| `--mochi-overlay-ink` | `#ffffff` |
| `--mochi-media-bg` | `#000000` |
| `--mochi-toggle-track` | `#646464` |
| `--mochi-accent`, `--mochi-accent-soft` | not declared; components fall back to `#69cdff` and `rgba(105,205,255,0.15)` to `0.3` |
| `--mochi-corner-xs`, `-sm`, `--mochi-corner`, `-field`, `-pill` | 4px, 10px, 16px, 24px, 9999px |
| `--mochi-scallop` | `45px 0 0 0` |
| `--mochi-drop-radius` | `16px 4px 16px 16px` |
| `--mochi-dialog-radius`, `--mochi-floating-radius` | not declared (see [Corners](#corners-and-screens)) |
| `--mochi-pane-edge-width` | `1px` |
| `--mochi-stack-shadow`, `--mochi-stack-shadow-front` | `none` |
| `--mochi-avatar-ring` | `none` |
| `--mochi-header-tracking` | `normal` (Header letter spacing) |
| `--mochi-button-bg`, `--mochi-button-radius`, `--mochi-button-ink` | not declared; the drop-shaped Button falls back to `--mochi-panel-bg`, `--mochi-corner` and the variant ink |
| `--mochi-font-body` | `'Prelude', sans-serif` (`'Mochi Lato', sans-serif` with `fontFamily="Lato"`) |
| `--mochi-font-display` | `"Mochi Light", "Prelude", sans-serif` |
| `--mochi-disabled-opacity` | `0.4` |
| `--mochi-ease-forward` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--mochi-ease-arrive` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--mochi-duration-focus`, `-reduced`, `-control`, `-arrive`, `-stack`, `-press` | 120ms, 150ms, 200ms, 220ms, 260ms, 300ms |
| `--mochi-peek-width`, `--mochi-peek-width-narrow` | 80px, 20px (RepanelStack slivers) |
| `--mochi-screen-narrow`, `--mochi-screen-wide` | 768px, 1280px (informational) |
| `--mochi-spinner-circle`, `-square`, `-triangle` and their `-outline` values | `#ff4a4a`, `#69cdff`, `#ffb80d`; `#a12c2c`, `#33647c`, `#5d4305`. Fixed constants from the webOS guide, not for retheming |

Panes draw a 1px left edge (`--mochi-pane-edge`, `--mochi-pane-edge-width`) with no shadow between stacked panes. For the heavier 0.5 look set `--mochi-pane-edge-width: 2px`, `--mochi-pane-edge: #666666`, `--mochi-stack-shadow: drop-shadow(-6px 0 14px rgba(0,0,0,0.14))` and `--mochi-stack-shadow-front: drop-shadow(-10px 0 26px rgba(0,0,0,0.22))`.

## Buttons and selection

### Button

The primary clickable action. Use it for actions; use `ViewSelectButton` to switch views and `Toggle` or `Checkbox` for settings. Forwards `ref` to the root `<button>`.

| Prop | Type | Default |
| --- | --- | --- |
| `type` | `'normal' \| 'warning' \| 'affirmative' \| 'blue' \| 'disabled' \| 'dropdown'` | `'normal'` |
| `appearance` | `'caps' \| 'drop'` | `'caps'` |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `disabled` | `boolean` | `false` |
| `children` | `ReactNode` | `'Button'` |

Other `<button>` attributes are forwarded. `type` is the visual variant, not the native type; use `htmlType="submit"` to submit a form (the default `'button'` keeps a Button inside a `<form>` from submitting it). `type="disabled"` is the same as `disabled`. `type="dropdown"` adds a chevron. `appearance="caps"` is the classic bracketed label with an accent bar; `"drop"` is a shaped button (`--mochi-button-radius`, `--mochi-button-bg`, `--mochi-button-ink`).

Colour carries meaning: `affirmative` (green) for the positive choice in a decision, `warning` (red) only for a destructive one, `blue` sparingly, plain for Cancel.

```jsx
const ref = useRef(null);

<Button ref={ref} onClick={save}>Save</Button>
<Button type="warning" onClick={remove}>Delete</Button>
<Button appearance="drop" type="affirmative" htmlType="submit">Confirm</Button>
<Button type="dropdown">Sort by</Button>
<Button disabled>Unavailable</Button>
```

A native button: Enter and Space activate, focus shows the shared ring. Motion: the press animation is in [Motion](#motion-contrast-and-transparency).

### Radio

A single radio option; group options by sharing `name`. Radio is controlled: you own `checked`.

Props: `name`, `value` (string), `checked`, `onChange` (a standard `ChangeEventHandler<HTMLInputElement>`), `disabled`, `children` (the label). Other label attributes are forwarded to the root `<label>`.

```jsx
{['alpha', 'beta', 'gamma'].map((v) => (
  <Radio
    key={v}
    name="choice"
    value={v}
    checked={choice === v}
    onChange={() => setChoice(v)}
  >
    {v}
  </Radio>
))}
```

Notes: the real `<input>` is hidden and the label is the click target (a 54px tap area around the 30px circle), so Radio is not reachable by keyboard Tab as styled. If keyboard operation matters in your flow, prefer `ViewSelectButton` or a list of `Checkbox`es that you manage.

### ViewSelectButton

A segmented control for switching between named views: a bracketed group of segments with an animated bar under the active one. Use it for 2 to 4 peer views; not for actions.

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ content: string; active?: boolean; disabled?: boolean }[]` | `[]` |
| `onSelect` | `(item, index, detail) => void` | – |
| `variant` | `'normal' \| 'warning' \| 'affirmative' \| 'blue'` | `'normal'` |
| `decoratorLeft` / `decoratorRight` | `string` | `'('` / `')'` |
| `barClasses` / `decoratorClasses` | `string` | `''` |

`detail` is `{ direction: 'forward' | 'back' | null; from: number; to: number }`. `direction` says which way the choice moved (`null` when the active segment is chosen again), so content can enter from that side.

`items` only sets the *initial* active segment (the one with `active: true`, else the first). After that the component tracks the selection itself and calls `onSelect` on each click; changing `active` flags later does not move it. To change it from outside, give the component a `key` that changes.

```jsx
const views = ['grid', 'list'];

<ViewSelectButton
  items={[{ content: 'Grid' }, { content: 'List' }]}
  onSelect={(item, index, detail) => {
    setView(views[index]);
    setSlideFrom(detail.direction); // 'forward' | 'back' | null
  }}
/>
```

Keyboard: each segment is `role="radio"` and focusable; Enter or Space selects. Disabled segments are skipped.

### Toggle

An on/off switch for a setting that takes effect immediately. Forwards `ref` to the root `<div>` (the track).

| Prop | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | – (wins over `value`) |
| `value` | `boolean` | `false` |
| `onChange` | `(event: { value: boolean; checked: boolean; target?: { value; checked } }) => void` | – |
| `disabled` | `boolean` | `false` |
| `canAnimate` | `boolean` | `true` |
| `onContent` / `offContent` | `string` | `'On'` / `'Off'` |
| `colorActive` / `colorInactive` | `string` | accent (else selected amber) / `--mochi-toggle-track` |

The handler gets a plain `{ checked, value }` object, not a DOM event.

```jsx
<Toggle checked={wifi} onChange={({ checked }) => setWifi(checked)} />
```

Notes: `role="switch"` with `aria-checked`. Space or Enter flips it; Right Arrow turns it on and Left Arrow off. The knob can also be dragged.

### Checkbox

A tick box. Controlled through `checked`; the displayed state resyncs whenever `checked` changes.

| Prop | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | `false` |
| `onChange` | `({ checked, value }: CheckboxChangeEvent) => void` | – |
| `disabled` | `boolean` | `false` |
| `canAnimate` | `boolean` | `true` |
| `colorActive`, `colorInactive`, `colorActiveDisabled`, `colorInactiveDisabled` | `string` | accent or selected amber / `--mochi-mark` |

```jsx
<Checkbox checked={agreed} onChange={({ checked }) => setAgreed(checked)} />
```

Notes: it has no label of its own; put it in a row with text (and give the row an `aria-label` or `aria-labelledby` on the Checkbox). `role="checkbox"`, Space or Enter toggles.

## Inputs and forms

### Input

A single-line text field. All `<input>` attributes are valid. Forwards `ref` to the `<input>`. Corner is the field corner (24px); placeholder is italic; focus shows an accent border and a 3px halo, and a visible ring for keyboard focus.

```jsx
const inputRef = useRef(null);

<Input ref={inputRef} placeholder="Search" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
<Input placeholder="Disabled" disabled />
```

### TextArea

A multi-line field. Props: `value` (default `''`), `onChange`, `onFocus`, `onBlur`, `disabled`, `placeholder`, `defaultFocus` (focus on mount, default `false`), `rows` (4), `minHeight` (px, 50), plus other `<textarea>` attributes.

```jsx
<TextArea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes" />
```

### RichText

A contenteditable field with basic formatting. Props: `value` (HTML string, default `''`), `onChange` (a `FormEventHandler<HTMLDivElement>`, read the content from `e.currentTarget.innerHTML`), `onFocus`, `onBlur`, `disabled`, `placeholder`, `defaultFocus` (`false`), `width` (`'100%'`), `minHeight` (px, 50), `allowFormatting` (`true`).

```jsx
<RichText
  value={html}
  onChange={(e) => setHtml(e.currentTarget.innerHTML)}
  placeholder="Write something"
  minHeight={120}
/>
```

Notes: `value` is HTML, so sanitise anything you did not write before passing it in.

### NumberInput

A stepper with minus and plus buttons around the figure.

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `number` | `0` |
| `onChange` | `(value: number) => void` | – |
| `min` / `max` | `number` | none |
| `step` | `number` | `1` |
| `label` / `unit` | `string` | – |
| `disabled` | `boolean` | `false` |
| `showControls` | `boolean` | `true` |

```jsx
<NumberInput label="Volume" unit="%" value={volume} min={0} max={100} step={5} onChange={setVolume} />
```

Notes: the buttons have `aria-label` "Decrement" and "Increment" and disable at the limits. The figure follows the `value` prop when it changes.

### DateInput

A read-only field that opens a calendar popup (portaled) to pick a day.

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `string \| Date` | – |
| `onChange` | `(date: Date) => void` | – |
| `label` | `string` | – |
| `placeholder` | `string` | `'Select date…'` |
| `minDate` / `maxDate` | `string \| Date` | none |
| `disabled` | `boolean` | `false` |

```jsx
<DateInput
  label="Due"
  value={due}
  minDate={new Date()}
  onChange={(date) => setDue(date.toISOString())}
/>
```

Notes: `value` seeds the initial selection; later changes to the prop do not update the field, so use a `key` to reset it. Days outside `minDate`/`maxDate` are disabled. The calendar has Previous/Next month buttons (labelled) and each day is a button labelled with its ISO date.

### Dropdown

A select-style trigger that opens a menu (portaled, below the trigger, flipping above when space is tight). Forwards `ref` to the root `<div>`.

| Prop | Type | Default |
| --- | --- | --- |
| `options` | `{ value: string \| number; label: string }[]` | `[]` |
| `value` | `string \| number` | – |
| `onChange` | `(value: string \| number) => void` | – |
| `label` | `string` | – (rendered above the trigger) |
| `placeholder` | `string` | `'Select an option…'` |
| `disabled` | `boolean` | `false` |
| `maxHeight` | `number` | `200` (menu height in px, then it scrolls) |

```jsx
<Dropdown
  label="Sort by"
  options={[
    { label: 'Name', value: 'name' },
    { label: 'Date', value: 'date' },
  ]}
  value={sort}
  onChange={(value) => setSort(String(value))}
/>
```

Notes: the trigger is `role="combobox"`; Space or Enter opens it and Escape closes it. The menu is a `listbox` of `option`s with a check on the selected one; Escape, choosing an option or clicking the trigger again closes it. The menu also accepts `{ divider: true }`, `{ sectionLabel: true, label }` and `disabled: true` entries at runtime, but these are not in the TypeScript `DropdownOption` type, so cast them in TS. The typings list a `searchable` prop that is not implemented; it has no effect.

## Status, text and layout

### Avatar

A person's or app's picture in the waterdrop shape, which scales with size ([waterdropRadius](#waterdropradius)). Forwards `ref` to the root `<span>`.

| Prop | Type | Default |
| --- | --- | --- |
| `src` | `string` | – |
| `alt` | `string` | `name` |
| `name` | `string` | – (initials and accessible name) |
| `icon` | `ReactNode` | – (shown with no image and no `name`) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` |

Sizes: `sm` 24px, `md` 40px, `lg` 56px, `xl` 96px, or a number of px. Initials are the first letters of up to two words, uppercase. Below 56px they are Mochi Bold with 0.05em tracking; from 56px up, Mochi Light at normal tracking. If the image fails to load, it falls back to the initials, then the icon.

```jsx
<Avatar src="/ada.png" alt="Ada Lovelace" size="lg" />
<Avatar name="Ada Lovelace" />
<Avatar icon={<MailIcon />} size="sm" />
```

Notes: with no image it is `role="img"` named by `alt` or `name`; with neither it is hidden from assistive tech, so pass a name when it carries meaning. The ground is `--mochi-avatar-bg`; `--mochi-avatar-ring` adds a ring.

### Badge

A small status pill or round count. Renders nothing when there is no label and no `count`.

| Prop | Type | Default |
| --- | --- | --- |
| `children` / `content` | `ReactNode` / `string \| number` | – (children win) |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'danger' \| 'info'` | `'default'` |
| `count` | `number` | – (shows a count pill after the label) |
| `background` / `color` | `string` | variant colour / white (dark ink on `warning`) |

```jsx
<Badge variant="success">Active</Badge>
<Badge content="42" />
<Badge variant="error" count={3}>Failed</Badge>
```

Notes: labels of one or two characters are round; longer ones are ovals. `background` overrides the variant; if you set it, set `color` to keep contrast.

### Header and Subheader

`Header` is the title of a panel or screen: Mochi Light, with optional controls on its right.

| Prop | Type | Default |
| --- | --- | --- |
| `content` | `string` | `''` |
| `children` | `ReactNode` | – (right-aligned controls) |
| `size` | `'header' \| 'display'` | `'header'` |
| `customClasses` | `string` | – (added to `.mochi-header-content`) |

`'header'` is Mochi Light 36/32. `'display'` is Mochi Light 72/64 in uppercase; use it at most once per screen. Other attributes and `className` go to the root.

`Subheader` takes `content` and sits under a Header.

```jsx
<Header content="Albums">
  <Button appearance="drop">Add</Button>
</Header>
<Subheader content="Sorted by date" />
```

### Label

The label rung of the type ladder: Mochi Bold 12/16, uppercase through CSS, on the 32px edge. Use it to name a section inside a panel; it is not a form `<label>`.

| Prop | Type | Default |
| --- | --- | --- |
| `content` | `string` | `''` (children used when empty) |
| `children` | `ReactNode` | – |
| `as` | `ElementType` | `'div'` |
| `level` | `number` | `3` (`aria-level`, when `as` is not h1 to h6) |

Write the text in title case; CSS uppercases it. It renders with `role="heading"`, or as a real heading with `as="h2"`.

```jsx
<Label content="Recent Albums" />
<Label as="h2">Settings</Label>
```

### Divider and NubbinDivider

`Divider` is a two-cap line that fades in from each outer edge. Props: `orientation` (`'horizontal' | 'vertical'`, default `'horizontal'`), `thickness` (px, default `4`).

`NubbinDivider` is a line with a nubbin (a small pointer) in it, for linking a section to the control above or beside it. Props: `nubbin` (`'up' | 'down' | 'left' | 'right'` or one of eight corner variants such as `'top-left-up'`, default `'up'`), `nubbinOffset` (CSS left value, default `'50%'`), `orientation` (`'horizontal'`), `thickness` (px of the lines either side, default `2`; the nubbin image is a fixed size). A corner variant draws one cap, on the side it trails toward.

```jsx
<Divider />
<NubbinDivider nubbin="up" nubbinOffset="120px" />
```

### Item

A single row: icon, title, subtitle, a body and right-hand content. Use it for settings and detail rows; use `List` and `ListItem` for scrolling lists with press highlights.

| Prop | Type | Default |
| --- | --- | --- |
| `title` / `subtitle` | `string` | – |
| `icon` | `ReactNode \| string` | – |
| `rightContent` | `ReactNode` | – |
| `children` | `ReactNode` | – (body under the subtitle) |
| `onClick` | `MouseEventHandler` | – |
| `onIconClick` | `MouseEventHandler` | – (stops propagation to the row) |
| `selected` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `hoverable` | `boolean` | `true` |
| `variant` | `'default' \| 'compact' \| 'detailed'` | `'default'` |

```jsx
<Item title="Full name" rightContent="Alice Johnson" />
<Item title="Wi-Fi" subtitle="Home network" selected onClick={openWifi} />
```

Notes: with `onClick` the row becomes `role="button"` with `aria-pressed`, is focusable, and Enter or Space activates it.

### Collapsable

An expandable section with a titled header. Controlled with `isOpen` and `onToggle`, or uncontrolled with `defaultExpanded`.

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | – |
| `isOpen` | `boolean` | – (controlled when set) |
| `defaultExpanded` | `boolean` | `false` |
| `onToggle` | `(isExpanded: boolean) => void` | – |
| `children` | `ReactNode` | – |

`CollapsableItem` (a styled content row), `CollapsableHeader` and `CollapsableFooter` are exported for custom layouts; children are rendered as given, with no automatic wrapping.

```jsx
<Collapsable title="Advanced" defaultExpanded>
  <CollapsableItem>Proxy settings</CollapsableItem>
  <CollapsableItem>Certificates</CollapsableItem>
</Collapsable>
```

Notes: the header is `role="button"`, Enter or Space toggles. Collapsed content is `aria-hidden`.

## Lists and tables

### List, ListItem, ListHeader

`List` is a scroll container that shows a fade at the edge you are scrolling toward. `ListItem` is a row with a press highlight. `ListHeader` is a group heading.

| Component | Props |
| --- | --- |
| `List` | `children`, `onScrollStart`, `onScrollStop` (called during and 150ms after a scroll) |
| `ListItem` | `children`, `tapHighlight` (`true`), `onSelect(highlighted: boolean)` |
| `ListHeader` | `content` (`string`), `children` |

`onSelect` reports the *press highlight*: it fires with `true` on mouse down and `false` on mouse up or leave, not once per choice. For an action, use `onClick` on the `ListItem` (it forwards standard div attributes).

```jsx
<List>
  <ListHeader content="Team" />
  <ListItem onClick={() => open('alice')}>Alice, Engineer</ListItem>
  <ListItem onClick={() => open('bob')}>Bob, Designer</ListItem>
</List>
```

Notes: `ListItem` has `role="option"` and handles mouse highlight only. It is not focusable, so for keyboard access add `tabIndex={0}` and an `onKeyDown` yourself, or use `Item` with `onClick`.

### GridList and GridListImageItem

`GridList` lays children out in a grid. Props: `columns` (default `3`), `gap` (px, default `12`, also used as padding), `children`.

`GridListImageItem` is a captioned picture tile. Props: `src`, `caption` (also the image `alt`), `selected` (`false`), `onSelect(selected: boolean)`, called with the toggled value on click.

```jsx
<GridList columns={3} gap={12}>
  <GridListImageItem
    src="/img/react.png"
    caption="React"
    selected={picked === 'react'}
    onSelect={(next) => setPicked(next ? 'react' : null)}
  />
  <GridListImageItem src="/img/rust.png" caption="Rust" />
</GridList>
```

Notes: tiles are `role="button"`, focusable, Enter or Space toggles; selection draws an accent ring.

### Table

A sortable table. Pass `columns` and `data`. Click a header to sort; the next click flips the direction.

```jsx
type UserRow = { name: string; role: string; status: string };

const columns: TableColumn<UserRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role', width: 160 },
  { key: 'status', label: 'Status', render: (value) => <Badge content={value} /> },
];

const data: UserRow[] = [
  { name: 'Alice', role: 'Engineer', status: 'Active' },
  { name: 'Bob', role: 'Designer', status: 'Away' },
];

<Table<UserRow> columns={columns} data={data} striped onRowClick={(row) => open(row.name)} />
```

| Prop | Type | Default |
| --- | --- | --- |
| `columns` | `TableColumn<T>[]` (`{ key, label, width?, render?(value, row) }`) | `[]` |
| `data` | `T[]` | `[]` |
| `rows` | `any[][]` | – (array-of-arrays form; takes precedence over `data`) |
| `onRowClick` | `(row: T) => void` | – |
| `sortable` | `boolean` | `true` |
| `hoverable` | `boolean` | `true` |
| `striped` | `boolean` | `false` |

At runtime `columns` may also be plain strings paired with `rows` (`columns={['Name', 'Role']} rows={[['Alice', 'Engineer']]}`); the typings only declare the object form.

## Panels

### Repanel and FloatingPanel

Two surfaces that hold content.

`Repanel` is a full-height panel with the scalloped (rounded) left edge and a flush right edge. Use it as a layout column in a row, or as a child of `RepanelStack`.

| Prop | Type | Default |
| --- | --- | --- |
| `width` | `number \| string` | – (a number is a percentage; or any CSS width) |
| `style` | `'default' \| 'shadow' \| CSSProperties` | `'default'` (`'shadow'` is the raised, inset-shadow look) |
| `handle` | `boolean` | `false` (nubbin grabber at the bottom-left; `RepanelStack` sets it) |
| `hint` | `ReactNode` | – (the peek clue, see below) |
| `sequence` | `{ index: number; label?: string }` | – (peek number and label, see below) |
| `peekLabel` | `string` | – (the panel's accessible name for its peek) |

`FloatingPanel` is the same surface filling its container, with rounded corners on all four sides, for use outside a row layout.

| Prop | Type | Default |
| --- | --- | --- |
| `style` | `'default' \| 'shadow' \| CSSProperties` | `'default'` |
| `shape` | `'round' \| 'drop'` | `'round'` (`--mochi-floating-radius`, else 16px; `'drop'` is the waterdrop accent) |
| `fullBleed` | `boolean` | `false` (square, no edge, no shadow, for a panel that is the whole surface; wins over `shape`) |

Panes draw a 1px left edge (`--mochi-pane-edge`).

```jsx
<div style={{ display: 'flex', height: 160 }}>
  <Repanel width={25}>Sidebar</Repanel>
  <Repanel width={50}>Main</Repanel>
  <Repanel width={25} style="shadow">Detail</Repanel>
</div>

<FloatingPanel style="shadow"><div style={{ padding: 16 }}>Raised content</div></FloatingPanel>
<FloatingPanel shape="drop"><div style={{ padding: 16 }}>Waterdrop corner</div></FloatingPanel>
<FloatingPanel fullBleed>Whole-surface panel</FloatingPanel>
```

Use `shape="drop"` sparingly: it is an accent, not the default floating corner.

### RepanelStack

A master-detail workspace of stacked `Repanel`s. The front panel takes the remaining width; earlier panels stay revealed on its left as real, scrollable columns. Children are plain `Repanel`s, read dynamically, so there is no fixed count. Give it a height (it fills its container).

Every panel but the first gets a nubbin grabber at its bottom-left edge:

- On a parent panel, dragging it grows or shrinks how many panels show behind the front one, back to panel 0 if dragged far enough.
- The front panel's grabber does the same in either direction while there is more of the stack to reveal. That is how you reopen a stack collapsed to just the front panel.
- Once nothing is left to reveal, dragging the front grabber right becomes swipe-to-close: release past about 45%, with a fast flick, or double-click, and the panel behind it takes the front; release short and it springs back.
- Keyboard on a grabber: Arrow keys step the reveal, Enter or Space closes the front panel or jumps back to a parent. With focus on the stack itself, Left and Right Arrow move back and forward.

| Prop | Type | Default |
| --- | --- | --- |
| `activeIndex` / `defaultActiveIndex` | `number` | controlled / last panel |
| `onActiveIndexChange` | `(index, detail) => void` | – |
| `reveal` / `defaultReveal` | `number` | controlled / – |
| `onRevealChange` | `(reveal, detail) => void` | – |
| `snapPoints` | `number[]` | `[1, 2, 3]` (reveal depths for Expand/Collapse and keys; a grabber drag is not limited to them) |
| `maxVisiblePanels` | `number` | `3` (shown at once on mount; not a hard cap) |
| `overlap` | `number` | `1` (0 to 1: how far each parent runs under the next, of the 45px overlap) |
| `peek` | `number` | `320` (visible width in px of each revealed parent) |
| `grabber` | `boolean` | `true` |
| `wrap` | `boolean` | `false` (wrap at the ends; hides `upcoming`) |
| `animate` | `boolean` | `true` |
| `narrowFit` / `narrowFitWidth` | `boolean` / `number` | `true` / `768` (narrow mode at or below this root width) |
| `narrowBehavior` | `'single' \| 'stack' \| 'overlay'` | `'single'` |
| `keepPast` | `boolean` | `true` |
| `upcoming` | `ReactElement \| null` | `null` |
| `onUpcomingOpen` | `(detail) => void` | – |

`onActiveIndexChange` detail: `{ previousIndex, reason: 'grabber' | 'method' | 'peek', panelCount, isNarrow }`. `onRevealChange` detail: `{ previousReveal, reason: 'grabber' | 'method', snapPoints, isNarrow }`. `onUpcomingOpen` detail: `{ upcoming, reason, previousIndex, panelCount, isNarrow }`.

The imperative `ref` (`StackedPanelsMethods`) exposes `next()`, `prev()`, `expand()`, `collapse()`, `setActiveIndex(i)`, `setReveal(n)` and `getState()` (`{ activeIndex, reveal, panelCount, isNarrow }`).

**Past and future peeks.** The stack shows where you came from and where you are going:

- With `keepPast`, the panel you came from stays as a left sliver (`--mochi-peek-width`, 80px; 20px narrow) when the stack is collapsed to the front panel. Tapping it or dragging it right steps back, as `prev()`.
- `upcoming` is one keyed `Repanel` (or `null`) that waits as a right sliver over the front panel. A tap, a drag left or `next()` opens it and calls `onUpcomingOpen`. You then append that same panel, with the same `key`, to your children so it carries on from the sliver instead of being rebuilt. The peek shows only while the front panel is the last child. With a controlled `activeIndex`, also set it to the new last index in `onUpcomingOpen`.
- A peeking `Repanel` takes `hint` (one short word or number, about 8 characters; `'12'` rather than `'12 albums'`), or `sequence` (`{ index, label }`: the index as zero-padded Mochi Light numerals above the label), and `peekLabel` for its accessible name ("Open <peekLabel>, <hint>"; falls back to the panel's `Header` content). The left sliver is named "Back to <name>".
- A peek is a door: the right peek shows its corner, a cropped Header and the clue; the left sliver shows its corner and the start of its Header (only the curve when narrow). The surfaces overlap the front panel by the 45px scallop; content never does.
- The stack decides narrow from its own width, not the window's.

```jsx
function Browser() {
  const ref = useRef(null);
  const [panels, setPanels] = useState([
    <Repanel key="library"><Header content="Library" /></Repanel>,
  ]);
  const next = (
    <Repanel key="albums" hint="12" peekLabel="Albums">
      <Header content="Albums" />
    </Repanel>
  );

  return (
    <div style={{ height: 380 }}>
      <Button onClick={() => ref.current?.prev()}>Back</Button>
      <RepanelStack
        ref={ref}
        upcoming={panels.length === 1 ? next : null}
        onUpcomingOpen={() => setPanels((p) => [...p, next])}
        onActiveIndexChange={(index, detail) => console.log(index, detail.reason)}
      >
        {panels}
      </RepanelStack>
    </div>
  );
}
```

A stack with fixed panels:

```jsx
<div style={{ height: 380 }}>
  <RepanelStack defaultActiveIndex={2} defaultReveal={2}>
    <Repanel><Header content="Library" /></Repanel>
    <Repanel><Header content="Albums" /></Repanel>
    <Repanel><Header content="Tracks" /></Repanel>
  </RepanelStack>
</div>
```

Notes: the stack is `role="group"` with `aria-roledescription="stacked panels"`; each grabber is a `role="slider"` named "Close panel" (front) or "Show more panels". Under Reduced motion panel travel becomes a fade; under Off it is instant.

## Overlays

### PopupPanel

A contextual popup with a nubbin pointing at its anchor, portaled to `document.body` and positioned to stay on screen. Use it for quick actions tied to a control; use `Dialog` for an interruption.

| Prop | Type | Default |
| --- | --- | --- |
| `isOpen` | `boolean` | required |
| `title` | `string` | – |
| `children` | `ReactNode` | – |
| `actions` | `{ label: string; onClick: () => void; type?: 'normal' \| 'warning' }[]` | `[]` |
| `onClose` | `() => void` | – |
| `anchorEl` | `RefObject<HTMLElement \| null>` | – |
| `anchorRect` | `DOMRect \| { top, left, bottom, width, height } \| null` | – (wins over `anchorEl`) |

```jsx
const btnRef = useRef(null);

<Button ref={btnRef} onClick={() => setOpen(true)}>Actions</Button>
<PopupPanel
  isOpen={open}
  anchorEl={btnRef}
  onClose={() => setOpen(false)}
  title="Quick Actions"
  actions={[
    { label: 'Cancel', onClick: () => setOpen(false) },
    { label: 'Delete', onClick: remove, type: 'warning' },
  ]}
>
  <p>Choose an action.</p>
</PopupPanel>
```

Notes: it closes on Escape or a click on the surrounding overlay, only by calling `onClose`; actions do not close it for you. It is `role="dialog"` with `aria-modal` and takes focus when opened. Corner is the field corner (24px) unless `--mochi-floating-radius` is set. Mount it outside any `SlidingMenu.ContentShifter` so it stays fixed while the layout moves.

### Dialog

A centred modal card over a scrim; the one interruption. It wears the waterdrop corner. Portaled to `document.body`.

| Prop | Type | Default |
| --- | --- | --- |
| `isOpen` | `boolean` | `false` |
| `onClose` | `() => void` | – |
| `title` | `string` | – |
| `children` | `ReactNode` | – |
| `type` | `'default' \| 'alert' \| 'confirm' \| 'prompt'` | `'default'` |
| `actions` | `{ label: ReactNode; onClick?: () => void; type?: ButtonProps['type'] }[]` | – (replaces the built-in buttons) |
| `onConfirm` | `(value: boolean \| string) => void` | – (`true`, or the text for `prompt`) |
| `onCancel` | `() => void` | – |
| `confirmText` / `cancelText` | `string` | `'OK'` / `'Cancel'` |
| `confirmType` | `ButtonProps['type']` | `'affirmative'` |
| `showCloseButton` | `boolean` | `false` |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` (320, 420, 600px, capped to the viewport) |
| `tone` | `'normal' \| 'warning' \| 'error'` | `'normal'` |
| `promptValue` / `onPromptChange` | `string` / `(value: string) => void` | `''` / – |

Built-in buttons by `type`: `alert` has one confirm button; `confirm` and `prompt` have Cancel and a confirm button; `default` has none unless you pass `actions`. Buttons call your handler and then `onClose`; custom `actions` call only their own `onClick`, so close the dialog there.

Follow the button colours: green (`affirmative`) for the positive choice, red (`warning`) only for a destructive one, plain for Cancel. Set `confirmType="warning"` when the confirm action deletes something.

```jsx
<Dialog
  isOpen={open}
  title="Delete project?"
  type="confirm"
  confirmText="Delete"
  confirmType="warning"
  onConfirm={() => deleteProject()}
  onClose={() => setOpen(false)}
>
  <p>This cannot be undone.</p>
</Dialog>

<Dialog
  isOpen={saveOpen}
  title="Save changes"
  onClose={() => setSaveOpen(false)}
  actions={[
    { label: 'Discard', onClick: () => setSaveOpen(false) },
    { label: 'Save', type: 'affirmative', onClick: () => { save(); setSaveOpen(false); } },
  ]}
>
  <p>Save before leaving?</p>
</Dialog>
```

Notes: it closes via its buttons, a click on the scrim or Escape, each by calling `onClose`. `role="dialog"`, `aria-modal`, labelled by the title; the first focusable element is focused on open, and page scroll is locked while open. The scrim is solid under `transparency="reduced"` or `contrast="more"`.

## Menus

### SlidingMenu

An edge-anchored navigation drawer, with a content shifter that slides your page aside as it opens. Aliases: `MochiSlidingMenu`.

| Prop | Type | Default |
| --- | --- | --- |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'left'` |
| `isOpen` | `boolean` | `false` |
| `onOpenChange` | `(open: boolean) => void` | – |
| `duration` | `number` (ms) | `--mochi-duration-stack` (260ms) |
| `closeOnEscape` | `boolean` | `true` |
| `closeOnBackdropClick` | `boolean` | `true` |
| `showBackdrop` | `boolean` | `true` |
| `backdropColor` | `string` | theme-aware |

The menu is controlled when you pass `onOpenChange` (then you own `isOpen`); without it the menu keeps its own state. `SlidingMenu.ContentShifter` takes `position`, `isMenuOpen`, `menuWidth` (`'280px'`), `menuHeight` (`'auto'`), `duration`.

`SlidingMenuItem`: `children`, `icon`, `onClick`, `href` (renders a link), `isActive`, `badge` (`string | number`), `disabled`, `variant` (`'default' | 'danger' | 'success'`). `SlidingMenuItemGroup`: `children`, `label` (uppercase section heading), `divider` (rule below, default `false`).

```jsx
function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SlidingMenu isOpen={open} onOpenChange={setOpen}>
        <SlidingMenuItemGroup label="Navigate" divider>
          <SlidingMenuItem icon={<HomeIcon />} isActive>Home</SlidingMenuItem>
          <SlidingMenuItem badge={3} onClick={() => go('inbox')}>Inbox</SlidingMenuItem>
        </SlidingMenuItemGroup>
        <SlidingMenuItem variant="danger" onClick={signOut}>Sign out</SlidingMenuItem>
      </SlidingMenu>

      <SlidingMenu.ContentShifter isMenuOpen={open}>
        <Header content="Home"><Button onClick={() => setOpen(true)}>Menu</Button></Header>
      </SlidingMenu.ContentShifter>
    </>
  );
}
```

Notes: the drawer is a `<nav>` that is `aria-hidden` while closed; Escape and the backdrop close it. An item's active tint fades while its hover tint stays instant. Render overlays such as `PopupPanel` outside the shifter.

## Progress and feedback

### ProgressBar

A fill bar for a value from 0 to 100 (values outside are clamped). `role="progressbar"` with `aria-valuenow`.

Props: `value` (`0`), `color` (`'blue' | 'yellow' | 'red'` or any CSS colour, default `'blue'`), `width` (CSS, default `'100%'`), `height` (CSS, default `'12px'`).

```jsx
<ProgressBar value={uploaded} color="yellow" />
```

### Slider

A draggable value control with a bubble that shows the value while held.

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `number` | `50` |
| `onChange` | `(value: number) => void` | – (called only when the value changes) |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` |
| `color` | `string` | accent |
| `width` | `string` | `'320px'` |

```jsx
<Slider value={volume} min={0} max={100} step={5} onChange={setVolume} />
```

Notes: `role="slider"` with `aria-valuenow`. Arrow keys step, PageUp or PageDown move a tenth of the range, Home or End jump to the ends. The `value` prop is followed when changed, except mid-drag, so a progress tick will not pull the knob from the pointer.

### Spinner

An indeterminate loading indicator drawn in code as an SVG that morphs through its three shapes.

Props: `active` (`true`), `styleType` (`'light' | 'dark'`, default `'light'`, for the ground it sits on), `size` (`'normal' | 'large'`, default `'normal'`), `alt` (accessible label, default `'Loading…'`). Other SVG attributes are forwarded.

```jsx
<Spinner active={loading} styleType="dark" size="large" />
```

Notes: `role="img"` labelled by `alt`. It follows the motion mode of the nearest `data-motion` ancestor (see [Motion](#motion-contrast-and-transparency)).

### Pagination

Page buttons with an accent bar that slides to the current page.

| Prop | Type | Default |
| --- | --- | --- |
| `currentPage` | `number` | `1` (1-based) |
| `totalPages` | `number` | `1` |
| `onPageChange` | `(page: number) => void` | – |
| `showFirstLast` | `boolean` | `true` |
| `showPrevNext` | `boolean` | `true` |
| `maxVisible` | `number` | `7` |

```jsx
<Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
```

Notes: it is controlled by `currentPage`. The current page has `aria-current="page"`; the arrows are labelled "First page", "Previous page", "Next page" and "Last page" and disable at the ends.

## Flows and media

### Wizard

A multi-step flow with a step indicator and Back, Skip, Next and Finish buttons.

| Prop | Type | Default |
| --- | --- | --- |
| `steps` | `WizardStep[]` | `[]` |
| `step` | `number` | – (controlled, 0-based; omit for internal navigation) |
| `onStepChange` | `(step: number, detail) => void` | – |
| `onComplete` | `() => void` | – (Finish on the last step) |
| `onCancel` | `() => void` | – (a Cancel button shows only when set) |
| `completedSteps` | `number[]` | – (manage completion yourself) |
| `onCompletedStepsChange` | `(completed: number[], detail) => void` | – |
| `showStepNumbers` | `boolean` | `true` |
| `allowSkip` | `boolean` | `false` |

A `WizardStep` is `{ label, title?, description?, content, skippable?, onNext? }`. `onNext` may return `false` (or a promise of `false`) to block moving on; a second Next while an async `onNext` is pending is ignored. `skippable: false` hides Skip for that step. `detail` is `{ reason: 'next' | 'finish' | 'back' | 'skip' | 'jump'; from: number; to: number }`.

Completion is tracked like a stack by default: Next marks the step being left as completed, and going back (Back, or tapping an earlier step in the header) un-completes the step returned to and everything after it. Pass `completedSteps` to take over: the wizard then shows exactly that list, and `onCompletedStepsChange` tells you what the default tracking would have produced (it fires either way), so you can take, adjust or ignore it.

```jsx
const [step, setStep] = useState(0);
const [done, setDone] = useState([]);

const steps = [
  { label: 'Account', content: <AccountForm /> },
  { label: 'Profile', content: <ProfileForm />, onNext: () => validateProfile() },
  { label: 'Review', content: <Review /> },
];

<Wizard
  steps={steps}
  step={step}
  onStepChange={(next) => setStep(next)}
  completedSteps={done}
  onCompletedStepsChange={(next) => setDone(next)}
  onComplete={submit}
  onCancel={close}
/>
```

### Video

A video player with Mochi-styled controls (play and pause, a seek slider, mute, fullscreen).

Props: `src`, `poster`, `autoPlay` (`false`), `loop` (`false`), `muted` (`false`), `controls` (`true`), `onPlay`, `onPause`, `onEnded`, `onTimeUpdate(currentTime: number)`. Other div attributes are forwarded to the root.

```jsx
<Video src="/media/intro.mp4" poster="/media/intro.jpg" onEnded={() => setWatched(true)} />
```

Notes: controls are labelled (Play, Pause, Mute, Unmute, Fullscreen, Exit fullscreen) and the seek bar is `role="slider"` named "Seek".
