// The three screen widths: narrow up to SCREEN_NARROW, wide from
// SCREEN_WIDE, medium between. The CSS custom properties
// --mochi-screen-narrow / --mochi-screen-wide (declared by the theme)
// mirror these values; media queries can't read custom properties, so
// stylesheets that need a breakpoint repeat the number and JS reads these.
export const SCREEN_NARROW = 768;
export const SCREEN_WIDE = 1280;
