# Remochi Component Guide

This guide shows the core Remochi components in practical use, based on the `remochi-demo` app. The demo imports the main component set from `remochi`, applies global styles with `remochi/css`, and wraps the app in `ThemeWrapper` so components can respond to the current theme through `useTheme()` [cite:20].

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

The demo keeps the app inside `ThemeWrapper` and reads `theme` plus `toggleTheme` from `useTheme()` for a light/dark switch [cite:20].

## Recommended app structure

A simple pattern is to keep a themed inner app and mount shared overlays outside layout shifters when needed. The demo does this by rendering `SlidingMenu.ContentShifter` around the main page content, then rendering `PopupPanel` outside that shifter so the popup stays fixed while the rest of the layout moves [cite:20].

## Buttons and selection controls

Use `Button` for standard actions, and reserve `type="warning"` or `type="disabled"` for stateful variants. The demo also shows `Radio` groups for mutually exclusive choices and `ViewSelectButton` for compact view switching between values like grid and list [cite:20].

Example:

```jsx
<Button onClick={handleOpen}>Open</Button>
<Button type="warning" onClick={handleDelete}>Delete</Button>
<ViewSelectButton
  value={viewMode}
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
  ]}
  onChange={setViewMode}
/>
```

## Inputs and forms

For text entry, the demo uses `Input`, `TextArea`, and `RichText`, plus specialized controls like `NumberInput` and `DateInput` for structured data [cite:20]. `Dropdown` works well for option lists, while `Checkbox`, `Toggle`, and `Radio` cover boolean and exclusive states [cite:20].

Example:

```jsx
<Input placeholder="Search..." />
<TextArea rows={3} />
<DateInput value={dateVal} onChange={setDateVal} />
<NumberInput value={numVal} onChange={setNumVal} />
```

## Status, layout, and content

Use `Badge` for compact status markers, `Header` and `Subheader` for hierarchy, and `Divider` or `NubbinDivider` to separate sections [cite:20]. For content display, the demo uses `Item`, `List`, `ListHeader`, `ListItem`, `GridList`, and `Table` to present structured data consistently [cite:20].

## Panels, popups, and dialogs

The demo shows several ways to build screen structure: `Panel` for width-based panel layouts, `FloatingPanel` for inset surfaces, and `StackedPanels` with `StackedPanel` for navigable panel stacks [cite:20]. For overlays, `PopupPanel` handles anchored quick actions, and `Dialog` handles confirm/cancel flows with explicit action buttons [cite:20].

Example:

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

## Progress, motion, and feedback

Use `ProgressBar` to show task completion and `Slider` for interactive numeric input. The demo pairs those with `Spinner` for loading states so the UI can show both steady progress and transient activity [cite:20].

## Menus, wizards, and media

The demo’s `SlidingMenu` example shows a side menu with grouped items, badges, and position switching across left, right, top, and bottom placements [cite:20]. It also includes `Wizard` for step-based flows and `Video` for simple embedded media playback [cite:20].

## Practical usage tips

- Keep overlay state and anchor measurements local to the component that opens them, as the demo does with `useRef` and `getBoundingClientRect()` for popup anchoring [cite:20].
- Use the global `log` pattern from the demo to verify component events while building new screens [cite:20].
- Wrap every screen in `ThemeWrapper` early so theme-sensitive styling stays consistent across components [cite:20].

If you want, this guide can be expanded into a fuller README-style manual with per-component props and copy-paste examples.