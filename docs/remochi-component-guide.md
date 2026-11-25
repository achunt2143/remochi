# Remochi Component Guide

This guide shows the core Remochi components in practical use, based on the `remochi-demo` app. The demo imports the main component set from `remochi`, applies global styles with `remochi/css`, and wraps the app in `ThemeWrapper` so components can respond to the current theme through `useTheme()`.

Every component in the library supports both light and dark mode out of the box — just render your app inside `ThemeWrapper` and call `toggleTheme()` (from `useTheme()`) to switch. No per-component theme props are needed. See [RELEASE_NOTES.md](../RELEASE_NOTES.md) for details on the color tokens this uses under the hood if you want to customize the palette.

## Getting started

Start by importing the pieces you need from the library and the global CSS bundle:

```jsx
import React, { useRef, useState } from 'react';
import 'remochi/css';
import {
  ThemeWrapper,
  useTheme,
  Button,
  Input,
  PopupPanel,
  ProgressBar,
  Slider,
  Spinner,
  Toggle,
  Checkbox,
  Radio,
  Avatar,
  Badge,
  Dropdown,
  Dialog,
  Divider,
  NubbinDivider,
  Header,
  Subheader,
  Label,
  Item,
  List,
  ListItem,
  ListHeader,
  GridList,
  Table,
  Pagination,
  Repanel,
  RepanelStack,
  FloatingPanel,
  Wizard,
  Video,
  DateInput,
  NumberInput,
  Collapsable,
  RichText,
  TextArea,
  ViewSelectButton,
} from 'remochi';
```

The demo keeps the app inside `ThemeWrapper` and reads `theme` plus `toggleTheme` from `useTheme()` for a light/dark switch. `ThemeWrapper` also accepts controlled `theme` (`'dark' | 'light' | 'system'`), `defaultTheme`, `onThemeChange`, `storageKey`, `syncHtml`, `fontFamily` (`'Prelude' | 'Lato'`), the accessibility modes `motion` (`'system' | 'full' | 'reduced' | 'off'`), `contrast` (`'system' | 'standard' | 'more'`) and `transparency` (`'system' | 'standard' | 'reduced'`), `ground` (`'plain' | 'vignette'`, default `'plain'`; the vignette is an inset edge shade from `--mochi-vignette`), and `tokens` (`Record<string, string | number>`) for CSS custom property overrides (such as `--mochi-surface-material`, `--mochi-corner`, `--mochi-corner-sm`, `--mochi-corner-field`, `--mochi-corner-pill`, `--mochi-scallop`, `--mochi-header-tracking`, `--mochi-button-bg`, `--mochi-button-radius`, `--mochi-button-ink`, `--mochi-accent`, `--mochi-floating-radius`, `--mochi-sheet-radius`, `--mochi-pane-edge`, `--mochi-pane-edge-width`, `--mochi-stack-shadow`, `--mochi-focus-ring`), which are applied to the wrapper and mirrored onto `:root` when `syncHtml` is enabled.

### Motion, contrast, and transparency

Every motion has three forms. **Full** is as designed. **Reduced** is opacity only: a fade of at most `--mochi-duration-reduced` (150ms), with no travel, scale, blur or stagger. **Off** is instant. Drags always track exactly. The mode comes from the `motion` prop, a `data-motion="full|reduced|off"` attribute on `<html>` or a wrapper (a host such as Pyxis can set it), else `prefers-reduced-motion: reduce` (which means Reduced). Timing lives in tokens: `--mochi-ease-forward`, `--mochi-duration-stack` (260ms), `--mochi-ease-arrive`, `--mochi-duration-arrive` (220ms), `--mochi-duration-press` (300ms, a held `Button`'s accent bar).

What animates in Full (all within 220ms; small state changes use `--mochi-duration-control`, 200ms):

- `Checkbox`: the fill grows from the centre and the tick draws left to right; a held press leans to 0.92. `Radio`: the fill grows in and shrinks away when another is chosen; same press lean.
- `Toggle`: the knob and track colour travel together, the On/Off labels crossfade and the knob squishes 4px toward its travel while held. `Slider`: the knob grows while held and the value bubble rises from it; the fill and knob track the pointer exactly, and key steps ease.
- `Pagination`: one accent bar slides to the current page. `ViewSelectButton`: its bar travels between segments.
- `Dropdown`: the chevron turns 180 degrees, the menu grows from the trigger edge and the selected check fades in. `Collapsable`: the chevron turns and the content eases open on grid rows. `DateInput`: the selected day's fill grows in.
- `Item`, `ListItem` and `GridList`: press and selection tints fade, and the `GridList` ring eases in. `Input`, `TextArea` and `RichText`: the focus border and 3px halo ease in.
- `Wizard`: a completed step's tick draws and the progress between steps fills, and a step's content enters from the right going forward (Next, Skip) and from the left going back, 12px with a fade.
- `NumberInput`: the figure moves with the change, rising in from 4px below on increment (the old one fades up and out) and the reverse on decrement. `DateInput`: changing month slides the day grid in 12px from the side of the arrow used, with a fade.
- `Table`: the sort arrow turns over when the direction flips, the active header's colour eases, and the row tint fades. `Badge`: it fades and scales in from 0.9 when it appears, and a changed count crossfades (no bounce). `ProgressBar`: the fill eases on `--mochi-ease-forward`, 200ms for a short change and 220ms for a long one.
- Focus rings (`Button`, `Toggle`, `Checkbox`, fields, `Dropdown`, `GridList`, menu rows and the rest) ease in over `--mochi-duration-focus` (120ms), and a control becoming enabled or disabled eases its opacity over the control duration. A `SlidingMenu` row's active tint fades while its hover tint stays instant.

Under Reduced these become opacity fades with no scale or travel, and under Off they are instant.

`contrast="more"` (or `prefers-contrast: more`) takes ink to pure black or white and surfaces solid. `transparency="reduced"` (or `prefers-reduced-transparency`) makes the Dialog scrim and `--mochi-surface-material` solid. High contrast makes scrims solid as well. `"standard"` opts out of the OS preference; the default `"system"` follows it.

Portaled surfaces (`Dialog`, `PopupPanel`, the `Dropdown` menu) follow the wrapper's font through `--mochi-font-body`, which `fontFamily` sets and the root wrapper syncs to `<html>`.

Run `npm run check:tokens` to keep bare hex colours out of component styles and to check the contrast floors.

```jsx
<ThemeWrapper motion="reduced" contrast="system" transparency="system">
  <App />
</ThemeWrapper>
```

Screen widths are `SCREEN_NARROW` (768) and `SCREEN_WIDE` (1280), exported with `useWidthClass(ref)`, which returns `'narrow' | 'medium' | 'wide'` for an element's own width. `waterdropRadius(size)` returns the waterdrop corner scaled to a surface's short side.

Corners: the waterdrop (`--mochi-drop-radius`, `16px 4px 16px 16px`, top-right nearly sharp) is an accent for special purposes, not the corner of every floating surface: the `Avatar`, the `Dialog` and `FloatingPanel shape="drop"` wear it. `PopupPanel` and the `Dropdown` menu keep the 24px field corner, `FloatingPanel` its 16px corner, and `SlidingMenu` rounds its page side at 24px. `--mochi-floating-radius` is unset by default; a host that sets it (for example to `var(--mochi-drop-radius)`) retunes every floating surface.

## Recommended app structure

A simple pattern is to keep a themed inner app and mount shared overlays outside layout shifters when needed. The demo does this by rendering `SlidingMenu.ContentShifter` around the main page content, then rendering `PopupPanel` outside that shifter so the popup stays fixed while the rest of the layout moves.

## Buttons and selection controls

### Button

`Button` is the primary clickable action surface. It takes `type` (`'normal' | 'warning' | 'affirmative' | 'blue' | 'disabled' | 'dropdown'`) for the visual variant, `htmlType` (`'button' | 'submit' | 'reset'`, default `'button'`) for the native `<button type>`, `appearance` (`'caps' | 'drop'`, default `'caps'`) for Mochi bracket-caps vs. shaped pill/drop framing, `disabled`, and `children` for the label (forwarding standard button attributes to the underlying `<button>`).

```jsx
<Button onClick={() => addLog('Button: normal')}>
  Normal
</Button>
<Button type="warning" onClick={() => addLog('Button: warning')}>
  Warning
</Button>
<Button appearance="drop" type="affirmative" onClick={() => addLog('Button: drop')}>
  Confirm
</Button>
<Button disabled>
  Disabled
</Button>
```

### Radio

`Radio` renders a single radio option; group by sharing the same `name`. It matches the typings (`name`, `value`, `checked`, `onChange`, `disabled`) and the demo usage [cite:20][cite:28].

Example:

```jsx
{['alpha', 'beta', 'gamma'].map((v) => (
  <Radio
    key={v}
    name="demo"
    value={v}
    checked={radioVal === v}
    onChange={() => setRadioVal(v)}
  >
    {v.charAt(0).toUpperCase() + v.slice(1)}
  </Radio>
))}
```

### ViewSelectButton

`ViewSelectButton` is a compact segmented control for switching between named views — a group of buttons with decorative brackets and an animated underline bar marking the active one. It accepts an `items` array (`{ content, active?, disabled? }`) and an `onSelect(item, index, detail)` callback, where `detail` is `{ direction: 'forward' | 'back' | null, from, to }` so content can enter from the side of the segment chosen; only one item can be active at a time.

`items` is used to derive the *initial* active item (whichever has `active: true`, or the first item if none do) — after that, the component tracks selection internally and calls `onSelect` on every click, so a controlled parent should update whichever item's `active` flag it passes in on the next render (see the demo pattern below, which keys `active` off its own `viewMode` state).

Example:

```jsx
const viewItems = [
  { content: '⊞ Grid', active: viewMode === 'grid' },
  { content: '☰ List', active: viewMode === 'list' },
];

<ViewSelectButton
  items={[
    { content: '⊞ Grid', value: 'grid', active: viewMode === 'grid' },
    { content: '☰ List', value: 'list', active: viewMode === 'list' },
  ]}
  onSelect={(item) => setViewMode(item.value)}
/>
```

### Toggle and Checkbox

`Toggle` uses the standard HTML `onChange` event signature (`React.ChangeEventHandler<HTMLInputElement>`), while `Checkbox` receives a custom `{ checked, value }` object in its `onChange` handler [cite:28].

Examples:

```jsx
// Toggle: event-style onChange
<Toggle
  checked={toggleOn}
  onChange={(e) => {
    const next = !toggleOn;
    setToggleOn(next);
    addLog(`Toggle: ${next ? 'on' : 'off'}`);
  }}
/>

// Checkbox: custom event payload
<Checkbox
  checked={checked}
  onChange={({ checked: next }) => {
    setChecked(next);
    addLog(`Checkbox: ${next}`);
  }}
/>
```

## Inputs and forms

### Input, TextArea, RichText

`Input` is typed as `React.InputHTMLAttributes<HTMLInputElement>`, so all standard HTML input props are valid. `TextArea` and `RichText` follow their respective prop interfaces with `value`/`onChange` pairs and optional layout props like `rows`, `width`, and `minHeight` [cite:28].

Examples:

```jsx
<Input placeholder="Text input" />
<Input placeholder="Search…" type="search" />
<Input placeholder="Password" type="password" />
<Input placeholder="Disabled" disabled />

<TextArea
  placeholder="TextArea — multiline input"
  rows={3}
  className="mochi-textarea"
/>

<RichText
  placeholder="RichText editor"
  allowFormatting
  minHeight={120}
/>
```

### NumberInput and DateInput

`NumberInput` exposes `value`, `onChange(value)`, `min`, `max`, `step`, and optional `label`/`unit` props [cite:28]. `DateInput` uses `value?: string | Date` and `onChange(date: Date)` with optional label/placeholder/minDate/maxDate [cite:28].

Examples:

```jsx
<NumberInput
  value={numVal}
  min={0}
  max={100}
  step={1}
  label="Volume"
  unit="%"
  onChange={(value) => {
    setNumVal(value);
    addLog(`Number: ${value}`);
  }}
/>

<DateInput
  value={dateVal}
  placeholder="Select a date"
  onChange={(date) => {
    setDateVal(date.toISOString());
    addLog(`Date: ${date.toDateString()}`);
  }}
/>
```

### Dropdown

`Dropdown` takes `options: { value, label }[]`, `value`, and `onChange(value)` as declared in `DropdownProps` [cite:28].

```jsx
const dropdownOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

<Dropdown
  options={dropdownOptions}
  value={dropdownVal}
  placeholder="Select an option…"
  onChange={(value) => {
    setDropdownVal(value);
    addLog(`Dropdown: ${value}`);
  }}
/>
```

## Status, layout, and content

### Avatar

`Avatar` is a person's or app's picture in the waterdrop shape, which scales with the size (`waterdropRadius`: 12/3 at 40px, the full 16/4 from about 56px). `size` is `'sm'` (24), `'md'` (40, default), `'lg'` (56), `'xl'` (96) or a number of px. Pass `src` (with `alt`) for a picture; `name` gives the initials (first letters of up to two words, uppercase: Mochi Bold with 0.05em tracking below 56px, Mochi Light at normal tracking from 56px up, like the `Label` and the `Header`) and the accessible name, and `icon` is shown when there is neither. If the image fails to load it falls back to the initials or icon. The ref goes to the root.

```jsx
<Avatar src="/ada.png" alt="Ada Lovelace" size="lg" />
<Avatar name="Ada Lovelace" />
<Avatar icon={<MailIcon />} size="sm" />
```

### Badge

`Badge` typings expose `content`, `background`, and `color`; there is no `variant` or `count` anymore [cite:28]. To show a status, pass the text via `content` or children and use `background`/`color` to style.

```jsx
<Badge content="Default" />
<Badge content="Success" background="#2e7d32" color="#fff" />
<Badge content="Warning" background="#ffb300" color="#000" />
<Badge content="Error" background="#c62828" color="#fff" />
```

### Header and Subheader

`Header` supports `size` (`'header'`, the default, or `'display'`: Mochi Light 72/64, uppercase, at most once per screen), `content`, `children` (for right-aligned controls), `customClasses` (applied to `.mochi-header-content`), and `className` / HTML attributes on the root element; `Subheader` takes `content` and `className` / HTML attributes.

```jsx
<Header customClasses="app-header-title">Header Component</Header>
<Subheader content="Subheader Component — sits below a Header" />
```

`Label` names a section inside a panel (Mochi Bold 12, uppercase via CSS, on the 32px edge). Write the text in title case and pass it as `content` or `children`; it renders with `role="heading"` (`level` sets `aria-level`, default 3) or as a real heading with `as="h2"`, and forwards other props.

```jsx
<Label content="Recent Albums" />
```

### Divider and NubbinDivider

`Divider` and `NubbinDivider` props match their interfaces (`orientation`, `width`/`height`, `thickness`, etc.) and can be used without extra props for defaults [cite:28].

```jsx
<Divider />
<NubbinDivider orientation="horizontal" side="top" />
```

### Item

`Item` typings do not include `label`/`value`; instead they expose `title`, `subtitle`, `icon`, and `rightContent` [cite:28]. To express label/value, use `title` and `rightContent`:

```jsx
<Item title="Full Name" rightContent="Alice Johnson" />
<Item title="Role" rightContent="Senior Engineer" />
<Item title="Status" rightContent="Active" />
```

### List, ListItem, ListHeader, GridList

`List`/`ListItem`/`ListHeader` all take `children` (with optional `content` on `ListHeader`), and `GridList` uses `children`, not `items`/`onItemClick`, at the type level [cite:28]. A type-safe pattern is:

```jsx
<List>
  <ListHeader content="Team Members" />
  <ListItem onSelect={() => addLog('List: Alice')}>
    Alice — Engineer
  </ListItem>
  <ListItem onSelect={() => addLog('List: Bob')}>
    Bob — Designer
  </ListItem>
</List>

<GridList columns={3} gap={12}>
  <GridListImageItem src="/img/react.png" caption="React" />
  <GridListImageItem src="/img/rust.png" caption="Rust" />
</GridList>
```

### Table

`Table` uses `columns` and `data` rather than `columns`/`rows`. Each `TableColumn` has a `key` and `label`, and `data` is an array of rows keyed by those column keys [cite:28].

```jsx
type UserRow = { name: string; role: string; status: string };

const columns: TableColumn<UserRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const data: UserRow[] = [
  { name: 'Alice', role: 'Engineer', status: 'Active' },
  { name: 'Bob', role: 'Designer', status: 'Away' },
];

<Table<UserRow>
  columns={columns}
  data={data}
/>
```

## Panels, popups, and dialogs

### Repanel and FloatingPanel

`Repanel` is a full-height panel with a rounded left edge and flush right edge — used standalone as a percentage-width layout column (`width` is a percentage of its row, e.g. `25`), or as the stackable card surface rendered inside `RepanelStack` below. `style` can be `"default"` or `"shadow"` for a raised, inset-shadow look. `FloatingPanel` is the same surface but fills its container with a 16px corner (`--mochi-floating-radius`, else `--mochi-corner`), for use outside a row layout; `shape="drop"` gives it the waterdrop accent (`--mochi-drop-radius`), and `fullBleed` makes it square with no shadow when it is the whole surface (it wins over `shape`). Panes draw a 1px left edge (`--mochi-pane-edge`).

Example:

```jsx
<div style={{ display: 'flex', height: 120 }}>
  <Repanel width={25} style="default">Sidebar</Repanel>
  <Repanel width={50} style="default">Main</Repanel>
  <Repanel width={25} style="default">Detail</Repanel>
</div>

<FloatingPanel style="shadow">
  <div style={{ padding: 16 }}>Shadowed content</div>
</FloatingPanel>

<FloatingPanel shape="drop">
  <div style={{ padding: 16 }}>Waterdrop corner</div>
</FloatingPanel>
```

### RepanelStack

`RepanelStack` is a webOS/Mochi master-detail workspace: the active (front) panel takes the remaining width, while earlier panels stay revealed to its left as real, independently-scrollable columns — not dimmed peeking slivers. Children are plain `Repanel`s read dynamically via `React.Children`, so there's no fixed panel count.

Every panel but the first gets a nubbin **grabber** at its bottom-left edge:
- On a parent panel, dragging it reveal-adjusts — grows or shrinks how many panels are shown behind the active one, all the way back to panel 0 if dragged far enough.
- The active panel's own grabber does the same reveal-adjust in either direction, as long as there's more of the stack left to reveal — that's the only way back once the stack has been collapsed all the way down to just the front panel.
- Once nothing is left to reveal, dragging the active grabber right instead becomes **swipe-to-close**: release past ~45% dragged, a fast flick, or a double-click commits it, handing the front to whatever panel was behind it. Release short of that and it springs back open.

Useful props: `defaultActiveIndex`/`activeIndex` (controlled), `defaultReveal`/`reveal` (controlled), `onActiveIndexChange(index, detail)`, `onRevealChange(reveal, detail)`, `snapPoints`, `maxVisiblePanels`.

The stack also shows where you came from and where you're going. `keepPast` (default `true`) keeps a left sliver of the panel you came from when the stack is collapsed. `upcoming` (one keyed `Repanel`, or `null`) waits as a right sliver (`--mochi-peek-width`, 80px; 20px narrow), opened by tap, a drag left or `next()`; `onUpcomingOpen` reports it and you append the panel to your children. A peeking `Repanel` takes `hint` (one short clue), `sequence` (`{ index, label }`) and `peekLabel` (its accessible name). A peek is a door: the right peek shows only its corner, cropped Header and clue, the left sliver its corner and the start of its Header (only the curve when narrow), and the surfaces overlap the front panel by the 45px scallop (the peek over it, it over the sliver) while content never does. The stack decides narrow from its own width, not the window's. An imperative ref exposes `next()`, `prev()`, `expand()`, `collapse()`, `setActiveIndex()`, and `setReveal()`.

Example:

```jsx
const repanelRef = useRef(null);

<div style={{ display: 'flex', gap: 8 }}>
  <Button onClick={() => repanelRef.current?.prev()}>◀ Prev</Button>
  <Button onClick={() => repanelRef.current?.next()}>Next ▶</Button>
  <Button onClick={() => repanelRef.current?.expand()}>Expand</Button>
  <Button onClick={() => repanelRef.current?.collapse()}>Collapse</Button>
</div>

<div style={{ height: 380 }}>
  <RepanelStack
    ref={repanelRef}
    defaultActiveIndex={3}
    defaultReveal={3}
    onActiveIndexChange={(index, detail) => addLog(`front → ${index} (${detail.reason})`)}
  >
    <Repanel><div style={{ padding: 20 }}>Library</div></Repanel>
    <Repanel><div style={{ padding: 20 }}>Albums</div></Repanel>
    <Repanel><div style={{ padding: 20 }}>Tracks</div></Repanel>
    <Repanel><div style={{ padding: 20 }}>Now Playing</div></Repanel>
  </RepanelStack>
</div>
```

### PopupPanel

`PopupPanelProps` are `isOpen`, `title`, `children`, `actions`, `onClose`, and `anchorRect` (DOMRect-like) [cite:28]. The example remains valid, but `actions` entries should match `PopupAction` (`label`, `onClick`, optional `type`).

```jsx
<PopupPanel
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  anchorRect={anchorRect}
  title="Quick Actions"
  actions={[
    { label: 'Cancel', onClick: () => setPopupOpen(false), type: 'warning' },
    { label: 'Confirm', onClick: () => setPopupOpen(false) },
  ]}
>
  <p>Choose an action to proceed.</p>
</PopupPanel>
```

### Dialog

`Dialog` is a centered Mochi modal card over a scrim, with the same chrome as `PopupPanel`. It takes a `title`, an `isOpen` flag, an `onClose` callback, and either a `type` (`'alert'`, `'confirm'`, `'prompt'`) for built-in buttons or an `actions` array for custom ones. It closes via its buttons, the scrim, or Escape; pass `showCloseButton` for a ×.

Follow the webOS button colors: green (`'affirmative'`) for the positive choice in a decision, red (`'warning'`) only for a destructive one, and a plain button for Cancel. Built-in confirm dialogs do this by default; set `confirmType="warning"` when the confirm action deletes something.

Example:

```jsx
<Dialog
  isOpen={dialogOpen}
  title="Confirm Action"
  onClose={() => setDialogOpen(false)}
  actions={[
    { label: 'Cancel', onClick: handleCancel },
    { label: 'Confirm', onClick: handleConfirm, type: 'affirmative' },
  ]}
>
  <p>Are you sure you want to proceed with this action?</p>
</Dialog>
```

Or let the built-in buttons handle it with a `type`:

```jsx
<Dialog
  isOpen={dialogOpen}
  title="Delete project?"
  type="confirm"
  confirmText="Delete"
  confirmType="warning"
  onConfirm={() => { deleteProject(); setDialogOpen(false); }}
  onCancel={() => setDialogOpen(false)}
>
  <p>This can't be undone.</p>
</Dialog>
```

## Progress, motion, and feedback

### ProgressBar and Slider

`ProgressBarProps` and `SliderProps` in the types match the sampler pattern: `value`, optional `color`/`width`/`height`, and `onChange(value)` for `Slider` [cite:28].

```jsx
const [sliderVal, setSliderVal] = useState(50);

<ProgressBar value={sliderVal} />
<Slider
  value={sliderVal}
  onChange={(value) => {
    setSliderVal(value);
    addLog(`Slider: ${value}`);
  }}
/>
```

### Spinner

`Spinner` props are `active`, `styleType: 'light' | 'dark'`, and `size: 'normal' | 'large'` with an optional `alt` text [cite:28]. It is drawn in code as an SVG. Under Reduced motion it holds each of its three shapes with a 150ms crossfade, and under Off it shows a still circle.

```jsx
<Spinner active styleType="light" size="normal" />
<Spinner active styleType="dark" size="large" />
```

## Menus, wizards, and media

### Wizard

`Wizard` renders step indicators and Back / Next / Finish controls for multi-step flows. Each entry in `steps` supplies its own `label`, optional `title` and `description`, and the `content` shown while that step is active. A step's `onNext` can return `false` (or a promise of `false`) to block moving on. Pass `step` (0-based index) alongside `onStepChange(nextStep, detail)` to control the active step externally, or omit `step` to track navigation internally.

Completion is tracked like a stack: Next marks the step being left as completed, and going back (Back, or tapping an earlier step in the header) un-completes the step returned to and everything after it.

Example:

```jsx
const [step, setStep] = useState(0);
const steps = [
  { label: 'Account', content: <AccountForm /> },
  { label: 'Profile', content: <ProfileForm /> },
  { label: 'Review', content: <Review /> },
];

<Wizard steps={steps} step={step} onComplete={submit} onStepChange={(next) => setStep(next)} />
```

To manage completion yourself, pass `completedSteps`. The wizard then shows exactly that list, and `onCompletedStepsChange(next, { reason, from, to })` tells you what its default tracking would have done, so you can take it, adjust it, or ignore it:

```jsx
const [done, setDone] = useState([]);

<Wizard
  steps={steps}
  completedSteps={done}
  onCompletedStepsChange={(next) => setDone(next)}
/>
```

### Video

`Video` consumes `VideoProps` (`src`, `poster`, `autoPlay`, `loop`, `muted`, `controls`, etc.) [cite:28].

```jsx
<Video
  src="https://www.w3schools.com/html/mov_bbb.mp4"
  poster="https://www.w3schools.com/html/pic_trulli.jpg"
  controls
/>
```
