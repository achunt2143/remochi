# Remochi — A React UI Library Inspired by Enyo Mochi

A modern React component library that brings the charming, nostalgic **Mochi** UI style into your React projects. Remochi recreates classic Mochi components like buttons, radios, sliders, popups, and more — all rebuilt with React and styled-components for modern development workflows and accessibility.

See [RELEASE_NOTES.md](./RELEASE_NOTES.md) for what's new in the latest release, and [docs/remochi-component-guide.md](./docs/remochi-component-guide.md) for usage examples of every component.

## Features

- Authentic **Mochi visual style**: Rounded shapes, smooth animations, bright blues and warm yellows
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
  - Spinners (light and dark variants, small and large sizes)

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
