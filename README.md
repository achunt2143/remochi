# Remochi — A React UI Library Inspired by Enyo Mochi

A modern React component library that brings the charming, nostalgic **Mochi** UI style into your React projects. Remochi recreates classic Mochi components like buttons, radios, sliders, popups, and more — all rebuilt with React and styled-components for modern development workflows and accessibility.

See [RELEASE_NOTES.md](./RELEASE_NOTES.md) for what's new in the latest release, and [docs/remochi-component-guide.md](./docs/remochi-component-guide.md) for usage examples of every component.

To make an app built with remochi feel right, start with the [design guide](./docs/design-guide.md): type, colour, shape, panels, motion, screens and writing.

## Features

- Authentic **Mochi visual style**: Rounded shapes, smooth animations, bright blues and warm yellows. A light pane, the scallop on edge-anchored panes and the waterdrop as an accent (the `Avatar`, the `Dialog`, `FloatingPanel` `shape="drop"`)
- **Motion that answers a question**: Full, Reduced (a fade of 150ms at most) and Off, set by `ThemeWrapper`'s `motion` prop, `data-motion` on `<html>` or the OS, with high-contrast and reduced-transparency modes to match
- Clean React components built with **functional components** and **hooks**
- Fully **accessible** with keyboard support and ARIA attributes
- Flexible customization of colors, sizes, and behaviors via props and styles
- Components included:
  - Buttons (normal, warning, disabled)
  - Radio buttons and checkboxes with faithful checked states
  - Inputs with elegant focus styles and disabled variants
  - Sliders with animated bubble popups and smooth dragging
  - Progress bars with fluid fill animations and color options
  - Popups with dynamic nubbin styling and positioning
  - Spinners (light and dark variants, small and large sizes), drawn in code
  - Headers, subheaders and labels, the type ladder from display down to section labels
  - Stacked panels with a peek of the past on the left, the predicted next panel on the right

## Theming

Wrap your app in `ThemeWrapper` for light and dark themes. Its `tokens` prop overrides `--mochi-*` custom properties, such as `--mochi-accent`, `--mochi-drop-radius`, `--mochi-floating-radius` (unset by default; set it to `var(--mochi-drop-radius)` for waterdrop floating surfaces), `--mochi-pane-edge` and `--mochi-focus-ring`. `motion`, `contrast` and `transparency` set the accessibility modes. Run `npm run check:tokens` to keep bare hex colours out of component styles. See the [component guide](./docs/remochi-component-guide.md) and [IDENTITY.md](./IDENTITY.md).

## Installation

Install the package from npm:

```npm install remochi```
or
```yarn add remochi```


## Usage

Import and use the components as you would with any React library:

```
import React, { useState } from "react";
import {
Button,
Radio,
Input,
Slider,
ProgressBar,
Spinner,
PopupPanel
} from "remochi";

function Example() {
const [value, setValue] = useState(50);
return (
<>
<Button onClick={() => alert("Clicked!")}>Click me</Button>
  <Radio name="choice" value="alpha" checked onChange={() => {}}>Alpha</Radio>

  <Input placeholder="Enter text here" />

  <Slider value={value} onChange={setValue} />

  <ProgressBar value={value} />

  <Spinner active size="large" styleType="dark" />

  <PopupPanel
    isOpen
    title="Example"
    actions={[
      { label: "Cancel", onClick: () => alert("Cancelled") },
      { label: "OK", onClick: () => alert("Confirmed") }
    ]}
  >
    Popup content here
  </PopupPanel>
</>
);
}
```


## Development

Clone the repository and start the development environment:

git clone https://github.com/yourusername/remochi.git
cd remochi
yarn install
yarn start


## Contributing

Contributions, bug reports, and feature requests are always welcome! Please open issues or pull requests on GitHub.

## License

MIT License © 2025 Andrew Hunt

## Acknowledgments

Thanks to the creators of the original [Enyo Mochi Framework](https://github.com/enyojs/mochi) for inspiring this work.

---

Build delightful UIs the **Mochi** way, with React — get started with **Remochi** today!
