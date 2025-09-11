# Remochi — A React UI Library Inspired by Enyo Mochi

A modern React component library that brings the charming, nostalgic **Mochi** UI style into your React projects. Remochi recreates classic Mochi components like buttons, radios, sliders, popups, and more — all rebuilt with React and styled-components for modern development workflows and accessibility.

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

```import React, { useState } from "react";
import {
MochiButton,
MochiRadio,
MochiInput,
MochiSlider,
MochiProgressBar,
MochiSpinner,
MochiPopupPanel
} from "remochi";

function Example() {
const [value, setValue] = useState(50);
return (
<>
<MochiButton onClick={() => alert("Clicked!")}>Click me</MochiButton>
  <MochiRadio name="choice" value="alpha" checked onChange={() => {}}>Alpha</MochiRadio>

  <MochiInput placeholder="Enter text here" />

  <MochiSlider value={value} onChange={setValue} />

  <MochiProgressBar value={value} />

  <MochiSpinner active size="large" styleType="dark" />

  <MochiPopupPanel
    isOpen
    title="Example"
    actions={[
      { label: "Cancel", onClick: () => alert("Cancelled") },
      { label: "OK", onClick: () => alert("Confirmed") }
    ]}
  >
    Popup content here
  </MochiPopupPanel>
</>
);
}```


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
