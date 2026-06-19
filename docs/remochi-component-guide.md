# Remochi Component Guide

This guide shows the core Remochi components in practical use, based on the `remochi-demo` app. The demo imports the main component set from `remochi`, applies global styles with `remochi/css`, and wraps the app in `ThemeWrapper` so components can respond to the current theme through `useTheme()`.

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
  Panel,
  FloatingPanel,
  StackedPanels,
  StackedPanel,
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

`Button` is the primary clickable action surface. At the type level it uses the `variant` prop (`'normal' | 'warning' | 'affirmative' | 'blue'`) and supports children for the label, but the demo is still using the older `type` prop at runtime (`"warning"`, `"disabled"`, `"dropdown"`) [cite:20][cite:28]. When writing new code, prefer `variant` over `type` so you stay aligned with the typings.

Example (aligned with typings):

```jsx
<Button onClick={() => addLog('Button: normal')}>
  Normal
</Button>
<Button variant="warning" onClick={() => addLog('Button: warning')}>
  Warning
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

`ViewSelectButton` takes an `items` array, not `value`/`options`. Each item is `{ content, active?, disabled? }`, and `onSelect` receives the item plus its index [cite:28]. The demo expresses view state via `value` and `options`; for new code, wire it like this:

```jsx
const viewItems = [
  { content: '⊞ Grid', active: viewMode === 'grid' },
  { content: '☰ List', active: viewMode === 'list' },
];

<ViewSelectButton
  items={viewItems}
  onSelect={(item, index) => {
    const mode = index === 0 ? 'grid' : 'list';
    setViewMode(mode);
    addLog(`View: ${mode}`);
  }}
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

### Badge

`Badge` typings expose `content`, `background`, and `color`; there is no `variant` or `count` anymore [cite:28]. To show a status, pass the text via `content` or children and use `background`/`color` to style.

```jsx
<Badge content="Default" />
<Badge content="Success" background="#2e7d32" color="#fff" />
<Badge content="Warning" background="#ffb300" color="#000" />
<Badge content="Error" background="#c62828" color="#fff" />
```

### Header and Subheader

`Header` supports `content` and `children`; `Subheader` uses `content` only in the current typings [cite:28]. Using children keeps JSX readable and is consistent with the demo.

```jsx
<Header>Header Component</Header>
<Subheader content="Subheader Component — sits below a Header" />
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

### Panel and FloatingPanel

`Panel`/`FloatingPanel` use the `PanelProps` and `FloatingPanelProps` types: `width?: number` and `style?: 'default' | 'shadow'` plus `children` and `className` [cite:28].

```jsx
<div style={{ display: 'flex', height: 120 }}>
  <Panel width={25} style="default">
    <div>25% Sidebar</div>
  </Panel>
  <Panel width={50} style="default">
    <div>50% Main</div>
  </Panel>
  <Panel width={25} style="default">
    <div>25% Detail</div>
  </Panel>
</div>

<FloatingPanel style="shadow">
  <div style={{ padding: 16 }}>Shadowed content</div>
</FloatingPanel>
```

### StackedPanels and StackedPanel

`StackedPanels` typings expose an optional controlled `index` plus callbacks and control methods; `StackedPanel` itself is just a shell for `children` and extra props [cite:28]. A simple uncontrolled stack looks like:

```jsx
<StackedPanels>
  <StackedPanel title="Panel One">Content inside panel one.</StackedPanel>
  <StackedPanel title="Panel Two">Content inside panel two.</StackedPanel>
  <StackedPanel title="Panel Three">Content inside panel three.</StackedPanel>
</StackedPanels>
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

`Dialog` typings use `type`, `onConfirm`, `onCancel`, `confirmText`, and `cancelText` rather than an `actions` array [cite:28]. A type-safe confirm dialog would be:

```jsx
<Dialog
  isOpen={dialogOpen}
  title="Confirm Action"
  type="confirm"
  confirmText="Confirm"
  cancelText="Cancel"
  onConfirm={() => {
    addLog('Dialog: confirmed');
    setDialogOpen(false);
  }}
  onCancel={() => {
    addLog('Dialog: cancelled');
    setDialogOpen(false);
  }}
>
  <p>Are you sure you want to proceed with this action?</p>
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

`Spinner` props are `active`, `styleType: 'light' | 'dark'`, and `size: 'normal' | 'large'` with an optional `alt` text [cite:28].

```jsx
<Spinner active styleType="light" size="normal" />
<Spinner active styleType="dark" size="large" />
```

## Menus, wizards, and media

### Wizard

`Wizard` typings expect a `steps` array of `WizardStep` objects (`label`, optional `title`/`description`/`content`/`skippable`/`onNext`) and optional callbacks for `onComplete`/`onCancel` [cite:28]. A minimal usage just needs `label` and delegates the actual content to children.

```jsx
const steps: WizardStep[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Review' },
];

<Wizard steps={steps}>
  <div>Step content goes here.</div>
</Wizard>
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
