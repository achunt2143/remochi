// Every sprite the drawn nubbins replace, with the drawing that stands in
// for it. Colours are the sprite's own (sampled), so the diff measures the
// shape; in the components the colours come from theme tokens instead.

// Popup sprites and their NubbinDivider twins share file names and shapes.
const SHAPES = {
  'up':                       { shape: 'bump', direction: 'up' },
  'down':                     { shape: 'bump', direction: 'down', length: 72 },
  'left':                     { shape: 'bump', direction: 'left' },
  'right':                    { shape: 'bump', direction: 'right' },
  'top-left-corner-up':       { shape: 'corner', direction: 'up',    side: 'start' },
  'top-right-corner-up':      { shape: 'corner', direction: 'up',    side: 'end' },
  'bottom-left-corner-down':  { shape: 'corner', direction: 'down',  side: 'start' },
  'bottom-right-corner-down': { shape: 'corner', direction: 'down',  side: 'end' },
  'top-left-corner-left':     { shape: 'corner', direction: 'left',  side: 'start' },
  'bottom-left-corner-left':  { shape: 'corner', direction: 'left',  side: 'end' },
  'top-right-corner-right':   { shape: 'corner', direction: 'right', side: 'start' },
  'bottom-right-corner-right':{ shape: 'corner', direction: 'right', side: 'end' },
};

const LIGHT_BG = '#f5f5f5';
const DARK_BG = '#1a1a1a';

export const CASES = [
  ...Object.entries(SHAPES).flatMap(([name, nub]) => [
    {
      id: `popup/${name}`, sprite: `src/Popup/nubbinImages/${name}.png`, theme: 'light', bg: LIGHT_BG,
      nubbin: { ...nub, stroke: '#666666', fill: '#ffffff', shadow: true },
    },
    {
      id: `popup/dark/${name}`, sprite: `src/Popup/nubbinImages/dark/${name}.png`, theme: 'dark', bg: DARK_BG,
      nubbin: { ...nub, stroke: '#646464', fill: '#2a2a2a', shadow: true },
    },
    // NubbinDivider's copies are outlines (transparent inside) with no dark
    // variant, so they're compared over both themes' backgrounds.
    ...[['light', LIGHT_BG], ['dark', DARK_BG]].map(([theme, bg]) => ({
      id: `divider/${name}`, sprite: `src/Divider/div-img/${name}.png`, theme, bg,
      nubbin: { ...nub, stroke: '#666666', fill: 'none', shadow: true },
    })),
  ]),
  {
    id: 'repanel/left', sprite: 'src/Panels/nubbins/left.png', theme: 'light', bg: LIGHT_BG,
    nubbin: { shape: 'bump', direction: 'left', length: 43, stroke: '#666666', fill: '#f5f5f5', shadow: true },
  },
  {
    id: 'repanel/left-shadow', sprite: 'src/Panels/nubbins/left-shadow.png', theme: 'dark', bg: DARK_BG,
    nubbin: { shape: 'bump', direction: 'left', length: 43, stroke: '#383838', fill: '#3f3f3f', shadow: true },
  },
  ...[['light', LIGHT_BG], ['dark', DARK_BG]].flatMap(([theme, bg]) => [
    { id: 'divider/div-left', sprite: 'src/Divider/div-img/div-left.png', theme, bg, taper: { end: 'start', w: 320 } },
    { id: 'divider/div-right', sprite: 'src/Divider/div-img/div-right.png', theme, bg, taper: { end: 'end', w: 320 } },
    // div-mid.png isn't used by any component; it's the groove's unfaded
    // middle, compared against the drawn groove's inner end.
    { id: 'divider/div-mid', sprite: 'src/Divider/div-img/div-mid.png', theme, bg, taper: { end: 'mid', w: 1 } },
  ]),
];
