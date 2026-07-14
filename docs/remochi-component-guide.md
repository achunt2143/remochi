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
  Badge,
  Dropdown,
  Dialog,
  Divider,
  NubbinDivider,
  Header,
  Subheader,
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

The demo keeps the app inside `ThemeWrapper` and reads `theme` plus `toggleTheme` from `useTheme()` for a light/dark switch.

## Recommended app structure

A simple pattern is to keep a themed inner app and mount shared overlays outside layout shifters when needed. The demo does this by rendering `SlidingMenu.ContentShifter` around the main page content, then rendering `PopupPanel` outside that shifter so the popup stays fixed while the rest of the layout moves.

## Buttons and selection controls

### Button

`Button` is the primary clickable action surface. The demo uses the default button for regular actions, `type="warning"` for destructive or cautionary actions, and `type="disabled"` for non-interactive states.

Props used in the demo:
- `type`: visual intent, including normal, warning, disabled, dropdown
- `onClick`: handler for click events
- `ref`: used when anchoring a `PopupPanel` to this button

Example:

```jsx
<Button onClick={() => addLog('Button: normal')}>Normal</Button>
<Button type="warning" onClick={() => addLog('Button: warning')}>Warning</Button>
<Button type="disabled">Disabled</Button>
<Button ref={dropdownBtnRef} type="dropdown" onClick={openPopup}>Open Popup ▾</Button>
```

### Radio

`Radio` renders a single radio option; group by sharing the same `name`. The demo binds `checked` to a local state value and calls `onChange` to update that state and log the selection.

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
    {v}
  </Radio>
))}
```

### ViewSelectButton

`ViewSelectButton` is a compact segmented control for switching between named views — a group of buttons with decorative brackets and an animated underline bar marking the active one. It accepts an `items` array (`{ content, active?, disabled? }`) and an `onSelect(item, index)` callback; only one item can be active at a time.

`items` is used to derive the *initial* active item (whichever has `active: true`, or the first item if none do) — after that, the component tracks selection internally and calls `onSelect` on every click, so a controlled parent should update whichever item's `active` flag it passes in on the next render (see the demo pattern below, which keys `active` off its own `viewMode` state).

Example:

```jsx
<ViewSelectButton
  items={[
    { content: '⊞ Grid', value: 'grid', active: viewMode === 'grid' },
    { content: '☰ List', value: 'list', active: viewMode === 'list' },
  ]}
  onSelect={(item) => setViewMode(item.value)}
/>
```

### Toggle and Checkbox

`Toggle` is a switch-style boolean control, while `Checkbox` is a box-style boolean. Both bind `checked` to a boolean state and use `onChange` to flip it.

Example:

```jsx
<Toggle
  checked={toggleOn}
  onChange={() => setToggleOn((v) => !v)}
/>
<Checkbox
  checked={checked}
  onChange={() => setChecked((v) => !v)}
>
  Checkbox {checked ? '☑' : '☐'}
</Checkbox>
```

## Inputs and forms

### Input, TextArea, RichText

`Input` is a single-line text field with support for `type`, `placeholder`, and `disabled`. `TextArea` provides multiline editing. `RichText` is a formatted rich text editor in the same visual family.

Example:

```jsx
<Input placeholder="Text input" />
<Input placeholder="Search…" type="search" />
<Input placeholder="Password" type="password" />
<Input placeholder="Disabled" disabled />
<TextArea
  placeholder="TextArea — multiline input"
  rows={3}
  style={{ marginTop: 8, width: '100%' }}
/>
<RichText placeholder="RichText editor" />
```

### NumberInput and DateInput

`NumberInput` and `DateInput` provide structured input with consistent Mochi styling. Both take `value` and `onChange` props; the demo stores these values in `useState()` and logs updates to an activity log.

Example:

```jsx
<NumberInput
  value={numVal}
  onChange={(v) => setNumVal(v)}
/>
<DateInput
  value={dateVal}
  onChange={(v) => setDateVal(v)}
/>
```

### Dropdown

`Dropdown` renders a styled select input. It receives an `options` array of `{ label, value }`, the current `value`, an optional `placeholder`, and `onChange` for selection changes.

Example:

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
  onChange={setDropdownVal}
/>
```

## Status, layout, and content

### Badge

`Badge` displays small status tags and optional counts. The demo shows semantic `variant` values like `success`, `warning`, `error`, and `info`, plus a `count` variant for notification pills.

Example:

```jsx
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge count={7}>Notifications</Badge>
```

### Header and Subheader

`Header` and `Subheader` provide consistent section titles. The demo uses them at the top of the page to introduce the sampler and section-level content.

Example:

```jsx
<Header>Header Component</Header>
<Subheader>Subheader Component — sits below a Header</Subheader>
```

### Divider and NubbinDivider

`Divider` separates sections with a straight rule, while `NubbinDivider` adds a visual “nubbin” accent between larger blocks. Use them to break up long forms and component groups.

### Item

`Item` is a simple label/value display row for read-only fields.

Example:

```jsx
<Item label="Full Name" value="Alice Johnson" />
<Item label="Role" value="Senior Engineer" />
<Item label="Status" value="Active" />
```

### List, ListItem, ListHeader, GridList

These components render vertical or grid lists in the Mochi style. `List` wraps a group of `ListItem` elements, optionally with a `ListHeader`. `GridList` renders a uniform grid of items with click handling.

Example:

```jsx
<List>
  <ListHeader>Team Members</ListHeader>
  <ListItem>Alice — Engineer</ListItem>
  <ListItem>Bob — Designer</ListItem>
  <ListItem>Carol — PM</ListItem>
</List>

<GridList
  items={['React', 'Rust', 'TypeScript']}
  onItemClick={(item) => addLog(`GridList: ${item}`)}
/>
```

### Table

`Table` renders a simple data table from a `columns` array and `rows` of values. The demo uses `onRowClick` to log which row was activated.

Example:

```jsx
const columns = ['Name', 'Role', 'Status'];
const rows = [
  ['Alice', 'Engineer', 'Active'],
  ['Bob', 'Designer', 'Away'],
];

<Table
  columns={columns}
  rows={rows}
  onRowClick={(row) => addLog(`Row: ${row[0]}`)}
/>
```

## Panels, popups, and dialogs

### Repanel and FloatingPanel

`Repanel` is a full-height panel with a rounded left edge and flush right edge — used standalone as a percentage-width layout column (`width` is a percentage of its row, e.g. `25`), or as the stackable card surface rendered inside `RepanelStack` below. `style` can be `"default"` or `"shadow"` for a raised, inset-shadow look. `FloatingPanel` is the same surface but fills its container with rounded corners on all sides, for use outside a row layout.

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
```

### RepanelStack

`RepanelStack` is a webOS/Mochi master-detail workspace: the active (front) panel takes the remaining width, while earlier panels stay revealed to its left as real, independently-scrollable columns — not dimmed peeking slivers. Children are plain `Repanel`s read dynamically via `React.Children`, so there's no fixed panel count.

Every panel but the first gets a nubbin **grabber** at its bottom-left edge:
- On a parent panel, dragging it reveal-adjusts — grows or shrinks how many panels are shown behind the active one, all the way back to panel 0 if dragged far enough.
- The active panel's own grabber does the same reveal-adjust in either direction, as long as there's more of the stack left to reveal — that's the only way back once the stack has been collapsed all the way down to just the front panel.
- Once nothing is left to reveal, dragging the active grabber right instead becomes **swipe-to-close**: release past ~45% dragged, a fast flick, or a double-click commits it, handing the front to whatever panel was behind it. Release short of that and it springs back open.

Useful props: `defaultActiveIndex`/`activeIndex` (controlled), `defaultReveal`/`reveal` (controlled), `onActiveIndexChange(index, detail)`, `onRevealChange(reveal, detail)`, `snapPoints`, `maxVisiblePanels`. An imperative ref exposes `next()`, `prev()`, `expand()`, `collapse()`, `setActiveIndex()`, and `setReveal()`.

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

`PopupPanel` is an anchored popup for quick actions. It receives `isOpen`, `onClose`, an `anchorRect` (from `getBoundingClientRect()`), an optional `title`, and an `actions` array with button definitions. Render it near the root so it stays fixed on screen.

Example:

```jsx
const dropdownBtnRef = useRef(null);
const [popupOpen, setPopupOpen] = useState(false);
const [anchorRect, setAnchorRect] = useState(null);

const openPopup = () => {
  if (dropdownBtnRef.current) {
    setAnchorRect(dropdownBtnRef.current.getBoundingClientRect());
    setPopupOpen(true);
  }
};

<Button ref={dropdownBtnRef} type="dropdown" onClick={openPopup}>Open Popup ▾</Button>

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

`Dialog` is a centered modal with a `title`, `isOpen` flag, `onClose` callback, and an `actions` array describing footer buttons. The demo wires these actions to log and close the dialog.

Example:

```jsx
<Dialog
  isOpen={dialogOpen}
  title="Confirm Action"
  onClose={() => setDialogOpen(false)}
  actions={[
    { label: 'Cancel', onClick: handleCancel, type: 'warning' },
    { label: 'Confirm', onClick: handleConfirm },
  ]}
>
  <p>Are you sure you want to proceed with this action?</p>
</Dialog>
```

## Progress, motion, and feedback

### ProgressBar and Slider

`ProgressBar` visualizes completion, taking `value` and optional `color`, `width`, and `height`. `Slider` lets users set numeric values interactively and can also be styled with `color` and `width`. The demo keeps `Slider` and a live `ProgressBar` in sync via shared state.

Example:

```jsx
const [sliderVal, setSliderVal] = useState(50);

<ProgressBar value={sliderVal} />
<Slider
  value={sliderVal}
  onChange={setSliderVal}
/>
```

### Spinner

`Spinner` shows transient loading indicators. The demo uses `active`, `styleType` (light/dark), and `size` (normal/large) combinations.

Example:

```jsx
<Spinner active={true} styleType="light" size="normal" />
<Spinner active={true} styleType="dark" size="large" />
```

## Menus, wizards, and media

### SlidingMenu

The demo’s `SlidingMenu` component is local to `remochi-demo` but illustrates how Remochi buttons and badges behave in a sliding navigation tray. Items support `icon`, `badge`, `isActive`, and `onClick` props, and the menu can appear from any side.

### Wizard

`Wizard` renders step indicators for multi-step flows. It accepts a `steps` array and `currentStep` index, and renders children as the step content.

Example:

```jsx
const steps = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Review' }];

<Wizard steps={steps} currentStep={wizardStep}>
  <div>Step {wizardStep + 1} of {steps.length}</div>
</Wizard>
```

### Video

`Video` is a simple media player wrapper that takes `src`, optional `poster`, and layout props like `width`.

Example:

```jsx
<Video
  src="https://www.w3schools.com/html/mov_bbb.mp4"
  poster="https://www.w3schools.com/html/pic_trulli.jpg"
  width="100%"
/>
```
