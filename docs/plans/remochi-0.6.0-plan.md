# remochi 0.6.0 plan

Written 2026-11-24, revised the same day after the guide's Pyxis update.
The design reference is the saved **Remochi design system** (claude.ai
artifact `FqTrodoa5qrTUzsDjurm7z`, version of 2026-11-24 20:33, "Pyxis
identity folded in").

What the guide puts first:

1. **Mochi**
2. **The Zen of Palm**
3. **remochi's hard points**: caps Button, uppercase nameplates, scallop
   panes with the nubbin, amber for on and sky blue for interaction, light
   first
4. **Pyxis**: "one identity at two sizes". remochi is the material; Pyxis
   is the shape and the light. Pyxis's six principles are the guide's too.
   Its shell features (wallpaper tint, frost, Lumen) reach remochi only
   through tokens.
5. **Influences** (Metro)

Its sections, and what each asks of the code:

| Section | Asks |
|---|---|
| README: Principles shared with Pyxis | Light, not chrome. Signature corners only (scallop on edge-anchored panes, waterdrop on floating surfaces). Colour comes from the host. Shapes carry meaning (greyscale test). Motion answers a question (Full / Reduced / Off). Say it plainly. |
| README: Visual foundations | Corners follow size. Full-bleed is square, with no shadow. Contrast floors: 4.5:1 for text, 7:1 for text over anything translucent. Accessibility settings beat materials. Spinner colours are sampled and fixed. |
| 1 Type is structure | Four voices, a five-rung ladder, the 32 px edge, space as divider. |
| 2 Motion moves forward | The time line. Full / Reduced / Off: Reduced is opacity only within `duration-reduced` (150 ms), with no travel or stagger. A host can force Off. Drags always track exactly. |
| 3 Where you came from, where you're going | Left sliver of the past, right peek of the predicted next panel, one clue. |
| 4 Pointed | Things travel from their source. One accent target per view. Check every view in greyscale. |
| 5 One design, every screen | Narrow / medium / wide. Every gesture has a visible equal. Decide by the panel's own width. |

The work below comes from each section's "Bringing the code along" list,
the "Not synced" list and the "Against Mochi" component notes.

## 0. Baseline and branching

| | |
|---|---|
| **Base** | `fix/nubbin-and-spinner` @ `bdeba64` (the local fix branch, same as origin). It already contains `release/0.5.1` (`f0442de`, merged in `6cd4f05`). |
| **Branch** | `release/0.6.0`, cut from `bdeba64`. This plan is its first file. |
| **Also merge** | `origin/docs/identity` (`eed0bfe`, `IDENTITY.md`). |
| **Not merged** | `origin/feat/panel-types` (July). It predates the Repanel rework. Recommendation: drop it. |
| **main** | Still at 0.5.0. The 0.6.0 PR brings 0.5.1, the fix branch and 0.6.0 to `main` together. |

The fix branch already gives 0.6.0:

- Nubbins, divider caps and the Repanel grabber drawn in code
  (`src/shared/nubbin.jsx`), matched to the sprites. The guide now says to
  use the sprites "until it merges"; 0.6.0 is that merge.
- The Spinner drawn as SVG from the traced GIFs.
- Pixel-diff harnesses `scripts/nubbin-diff` and `scripts/spinner-diff`.

Because the chrome is now drawn rather than bitmap, it can follow a radius
or a stroke width. Sections 1 and 2 depend on that.

---

## 1. The Mochi pane: light, not chrome

**Why.** The guide's first shared principle is to add light before
borders, outlines or shadows. Mochi's pane is the ground's grey with a 1 px
`mochi-pane-edge` on the left and the scallop. Full-bleed surfaces are
square and cast no shadow. Repanel draws a 2 px top and left edge in #666,
and RepanelStack adds drop shadows ("Against Mochi").

**What and where.**

- `src/Panels/MochiPanel.scss:32-34, 45-47`: `border-width: 0 0 0
  var(--mochi-pane-edge-width, 1px)`, colour `var(--mochi-pane-edge)`. Add
  `--mochi-pane-edge` to the theme (`#cccccc` light, `#333333` dark).
- `src/Panels/StackedMochiPanels.scss:72-76`: the drop shadows go behind
  `--mochi-stack-shadow`, default `none`.
- The base pane in a stack is full-bleed: square, no edge, no shadow.
- `src/shared/nubbin.jsx`: redraw the grabber's edge for a 1 px stroke in
  `mochi-pane-edge`, reading the stroke width from the same token.
- A host can bring the 0.5 look back with `--mochi-pane-edge-width: 2px`,
  `--mochi-pane-edge: #666` and the old shadow.

**Check.** `npm run nubbin-diff` with a new 1 px grabber case, and no joint
step over 0.2 px. Compare with the StructurePanel and StructureStack cards.

---

## 2. Signature corners

**Why.** The guide allows two signature corners: the scallop on panes
anchored to an edge, and the waterdrop `16 4 16 16` on floating surfaces.
Everything else sits on the corner ladder. Corners follow size: a 40 px
thing is `12 3 12 12`, a 20 px thing `7 2 7 7`, the full drop from about
56 px. No corner is bigger than half the short side. Today only the Dialog
is a waterdrop.

**What and where.**

- **`--mochi-floating-radius`**, default `16px 4px 16px 16px`, declared on
  `:root` (shape tokens work from `<html>`). Read by:
  - the Dropdown menu panel (`src/Dropdown/MochiMenu.scss`, now
    `--mochi-corner-field` 24 px)
  - PopupPanel (`src/Popup/MochiPopupPanel.styles.jsx`, now 24 px)
  - `--mochi-dialog-radius` defaults to it, so all floating surfaces
    change together
- **PopupPanel corner nubbins.** The corner caps are drawn for a uniform
  24 px radius. Now that they are drawn in code, make `nubbin.jsx`'s corner
  caps take the radius of the corner they sit on, so a top-right placement
  meets the 4 px corner cleanly. Add these cases to the nubbin-diff joint
  check.
- **Edge-anchored sheets.** The phone Dialog sheet
  (`src/Dialog/MochiDialog.scss:200`, hardcoded `16px 4px 0 0`) and
  SlidingMenu (24 px on the side facing the page) take the waterdrop's
  corners on the side facing the page, from a shared
  `--mochi-sheet-radius`.
- **Corners follow size.** Add a `waterdrop($size)` SCSS function and a
  `waterdropRadius(size)` JS export in `src/shared/`, using the guide's
  scale and the half-short-side cap. The Slider value bubble is the only
  small floating thing today; it uses the function.
- **The ladder for everything else.** Move the off-ladder radii (Badge
  10 px, Checkbox 13 px, Collapsable 4 and 32 px, Pagination 8 px, Item 8 px,
  List and GridList 4 px, Dropdown option 4 px, StackedPanels 6 and 10 px,
  Toggle 10 px) onto `--mochi-corner-*`. Add `--mochi-corner-xs: 4px`.
  Circles stay `50%`.
- **FloatingPanel.** It "fills its container", so the full-bleed rule says
  square, while its name and the guide's floating rule say waterdrop.
  Recommendation: waterdrop (`--mochi-floating-radius`) when it sits on
  something, and a `fullBleed` prop for square with no shadow. Decision 2.

---

## 3. Type is structure

**Why.** Two rungs of the ladder (`display`, `label`) have no component.
Table headers are off the ladder.

**What and where.**

- **`Label`** (new, `src/Headers/Label.jsx` + `.scss`): Mochi Bold 12/16,
  uppercase via `text-transform`, 0.05em, `color-text`, 32 px inset, 32 px
  above and 8 px below. Takes `content` or `children` in title case.
  `role="heading"` with `aria-level`, and it forwards `...rest`.
- **`Header size="display"`**: Mochi Light 72/64, uppercase, normal
  tracking.
- **Table column headers** (`src/Table/MochiTable.scss`) take the `label`
  style.
- **SlidingMenu group labels**: weight 600 becomes Mochi Bold, to match
  `label`.
- **Header tracking** stays `normal`. Pyxis sets `0.14em` through the token,
  as the guide's "Where they meet" says.

---

## 4. Colour: jobs, floors and greyscale

**Why.** The colour jobs: accent for bars, knobs, fills and focus borders;
`mochi-primary` for text; amber for on. Colour comes from the host, so no
component picks a brand colour. The floors: 4.5:1 for text, 7:1 for text
over anything translucent. Shapes carry meaning: every state must read in
greyscale.

| Issue | Where | Change |
|---|---|---|
| Subheader `mochi-text-muted` #a0a0a0 is 3.96:1 on a dark Repanel | theme | Add `--mochi-panel-text-muted: #c0c0c0` (5.6:1), read inside `.mochi-panel`. |
| Dark `mochi-button-text` is 3.96:1 on a dark panel | theme | `#b4b4b4` within the panel scope. |
| GridList caption: white over `rgba(0,0,0,.6)` on imagery, about 5.9:1 over a white photo; text over translucent needs 7:1 | `src/Lists/GridList.scss:38` | Darken the gradient's text band to `.7` (8.5:1 worst case). |
| Selected Item: outlined in `mochi-primary` | `src/Item/MochiItem.scss:38-40` | No outline. Tint with `--mochi-accent-soft`. Add a non-colour cue for greyscale: the title in bold and `aria-selected`. |
| Dropdown selected option: colour only | `src/Dropdown/MochiDropdown.scss:141-144` | Add a ✓ glyph in ink. |
| Pagination current page: white on a primary fill (3.64:1 light, 2.19:1 dark) | `src/Pagination/MochiPagination.scss:14-15` | Number in ink with the accent bar under it. The bar is shape and colour together. |
| GridList selection: `mochi-primary` fill and ring | `src/Lists/GridList.scss:46-50` | `--mochi-accent`. |
| Badge warning: white on amber is 1.73:1 | `src/Badge/Badge.jsx` | Dark ink (`#404040`, 5.98:1) by default. |
| SlidingMenuItem: teal `#218080` and red `#c0152f` fallbacks from another palette | `src/Menu/MochiSlidingMenuItem.scss` | Accent tint for the active row; `mochi-*` aliases for success and error. |
| Focus rings: four different blues | Button, Popup, Dropdown, TextArea, Collapsable, Dialog | One `--mochi-focus-ring` (default the accent) on `:root`, at least 3:1 against its ground. |
| About 200 bare hex literals in 37 files | many | Theme tokens. A hex is allowed only as a `var()` fallback equal to the light default. |

Unchanged on purpose: `color-text-muted` (disabled only, as the guide
says), the Slider bubble's white on #69cdff (Mochi's own, flagged in its
guideline), and the amber and blue values.

**Guard.** `scripts/check-tokens.mjs` (`npm run check:tokens`) fails on a
bare hex in `src/**`, and checks the guide's contrast pairs from the theme
file: 4.5:1 for text, 7:1 for text on translucent grounds, 3:1 for focus
rings and control borders.

---

## 5. Accessibility settings beat materials

**Why.** The guide: under high contrast, ink goes to pure black or white
and surfaces go solid. Under reduced transparency,
`mochi-surface-material` and the scrim go solid. "Not synced" says
remochi has no mode for this; hosts set solid values through `tokens`.

**What and where.** Make it work without a host:

- In `MochiThemeWrapper.scss`, `@media (prefers-contrast: more)` and
  `[data-mochi-contrast=more]` set `color-text` to `#000` / `#fff`,
  `color-text-secondary` to the same, surfaces and material solid, and
  edges at full ink. Two components already have `prefers-contrast` rules
  (SlidingMenuItem, SlidingMenuItemGroup); fold those into this.
- `@media (prefers-reduced-transparency: reduce)` and
  `[data-mochi-transparency=reduced]` give `--mochi-overlay` a solid value,
  drop the Dialog scrim's blur, and make `mochi-surface-material` opaque.
- `ThemeWrapper` props `contrast` and `transparency`
  (`'system' | 'standard' | 'more'` and `'system' | 'standard' | 'reduced'`),
  written as data attributes on the wrapper and, with `syncHtml`, on
  `:root`. A host such as Pyxis can still override any value through
  `tokens`.

---

## 6. Motion: Full, Reduced, Off

**Why.** Section 2 and the shared principle say every motion has three
forms:

- **Full:** as designed.
- **Reduced:** opacity only, a fade of `duration-reduced` (150 ms) at most,
  with no travel, scale, blur or stagger.
- **Off:** instant.

Drags track the finger exactly in every mode. A host can force Off (Pyxis
sets `data-motion` on `<html>`). In the code today, reduced motion means
Off in three components, and the other animating files ignore it.

**What and where.**

- **Tokens on `:root`:** `--mochi-ease-forward`, `--mochi-duration-stack`
  (260 ms), `--mochi-ease-arrive`, `--mochi-duration-arrive` (220 ms),
  `--mochi-duration-reduced` (150 ms). Read them in
  `StackedMochiPanels.scss:28-29, 83-85`, `MochiDialog.scss:71-72, 203` and
  `MochiPopupPanel.styles.jsx:40`.
- **Exits never outlast entrances.** The phone sheet's 0.32 s exit against
  its 0.22 s arrival, and SlidingMenu's 300 ms, move onto the tokens.
- **One mode switch.** remochi reads `[data-motion=full|reduced|off]` on
  `<html>` or on a wrapper (the attribute Pyxis already sets), and
  `prefers-reduced-motion: reduce` when nothing is set. `ThemeWrapper`
  gets `motion?: 'system' | 'full' | 'reduced' | 'off'` (default
  `'system'`), writing `data-motion` (to `:root` with `syncHtml`, so
  portals follow).
- **Reduced, everywhere.** One global block in `MochiThemeWrapper.scss`
  turns every remochi transition and keyframe into an opacity fade of at
  most `--mochi-duration-reduced`: the stack, Dialog, sheet, PopupPanel,
  SlidingMenu, Collapsable, Toggle knob, Slider bubble, Button press,
  ViewSelectButton bar and ProgressBar fill. Off sets every duration to 0.
  Pointer-driven transforms (the stack while dragging, the Slider knob,
  the Toggle drag) are left alone in every mode.
- **Type lands in ladder order** (Full only): Header, then Subheader, then
  body, 40 ms apart on `ease-forward` when a panel arrives. None under
  Reduced or Off.
- **Spinner.** The guide asks that its reduced crossfades come within the
  cap. Change `CALM_FADE` in `src/Spinner/spinnerArt.js:80` from 250 to
  150 ms. Keep the 1 s holds: that is a status loop, not a transition.
  Under Off, show a still circle. The shapes and colours don't change.

---

## 7. Pointed

**Why.** Nothing appears from nowhere. Things travel; they don't cut.

- **PopupPanel grows from its nubbin.** It scales from its centre today
  (`MochiPopupPanel.styles.jsx:3-5`). Set `transform-origin` to the nubbin
  tip the component already computes. Under Reduced it fades only.
- **ViewSelectButton's bar slides** between segments on `ease-forward`.
- **Direction in `onSelect`**: ViewSelectButton reports
  `'forward' | 'back'` from the index change, so content can enter from the
  side of the segment chosen.
- **PopupPanel action `type` bug.** `MochiPopupPanel.jsx:264` passes `$type`,
  which Button never reads, so every action is `normal`. Pass `type`.

---

## 8. Where you came from, where you're going

Unchanged by the update. All in `src/Panels/`:

1. `RepanelStack` `upcoming` (a Repanel or `null`) is an 80 px right
   sliver, opened by tap, drag left or `next()`. `onUpcomingOpen` reports
   the open. A new prediction leaves to the right and the next one arrives
   from the right.
2. `Repanel` `hint` (label voice, about 8 characters) and `sequence`
   (`{ index, label }`, Mochi Light numerals) show only while the panel is
   a peek.
3. Keep the past: collapsed parents keep an 80 px sliver with their grabber
   live (`keepPast`).
4. Nameplate handoff: the peek's real 36 px Header stays on its baseline as
   the panel opens.
5. Peeks are crisp: full opacity, no blur.
6. Each sliver is a `<button>`, at least 44 px tall, named by its
   destination, after the panel's content in tab order.
7. `--mochi-peek-width` (80 px) and `--mochi-peek-width-narrow` (20 px).
8. A peek is a door, not a second panel. The right peek renders only its
   surface, scallop, cropped Header and the one clue (in clear space under
   the Header); the left sliver renders its surface, scallop and the start
   of its Header. On a narrow stack both are 20 px of surface and scallop.
   The front panel is laid out between the slivers, so no content sits
   under a sliver and none of a sliver sits under the front panel. The
   body appears as the peek becomes the front panel.

Under Reduced, a peek opening is a fade in place: no slide, and the
nameplate is simply there.

---

## 9. One design, every screen

Unchanged by the update.

- `--mochi-screen-narrow` (768) and `--mochi-screen-wide` (1280), plus JS
  `SCREEN_NARROW` and `SCREEN_WIDE`. They drive RepanelStack's
  `narrowFitWidth` default and the Dialog sheet.
- `useWidthClass(ref)` (new, `src/shared/`): a ResizeObserver returning
  `'narrow' | 'medium' | 'wide'`. RepanelStack switches on its own width,
  not the window's.
- RepanelStack stack controls (`controls`, ◀ ▶ caps Buttons) were dropped
  by the user's call. The visible equals are the left sliver (back), the
  right peek (forward) and the keyboard-operable grabber (Enter / Space).

---

## 10. Voice in default copy

**Why.** The guide's content rules: plain words, an ellipsis (…) when a
field waits for a choice, errors that say what went wrong and what to try,
no "Oops", and nothing apologetic.

**What and where.**

| String | Where | Change |
|---|---|---|
| `"Loading..."` (three dots) | `src/Spinner/Spinner.jsx:94, 104` | `"Loading…"` |
| `'Select an option'` | `src/Dropdown/MochiDropdown.jsx:30` | `'Select an option…'` |
| `'Select date…'` and `"Select a date"` (two wordings) | `src/DateInput/MochiDateInput.jsx:127, 202` | One wording, `'Select date…'` |
| `'OK'` / `'Cancel'` | `src/Dialog/MochiDialog.jsx:19` | Keep. The guide asks for short title-case labels. |

Also check aria labels and any error text in Input, NumberInput and
Wizard the same way.

---

## 11. Spinner colours and housekeeping

- **Spinner colour tokens.** Declare `--mochi-spinner-circle` (#ff4a4a),
  `-square` (#69cdff), `-triangle` (#ffb80d) and their `-outline` values on
  `:root` as constants, documented as not for retheming, so Pyxis and apps
  read one source. The drawn spinner keeps its traced fills: its frames
  carry about 40 in-between shades from the morph, so it can't read three
  tokens. Its three base fills must equal the tokens; `check:tokens`
  asserts that.
- **Spinner outline mismatch.** The guide gives each shape a dark outline
  of its own colour (`#a12c2c`, `#33647c`, `#5d4305`). The GIFs, and the
  drawn spinner traced from them, use one outline per theme (white on
  light, black on dark, via `--mochi-spinner-outline`). The guide says the
  code wins where they disagree. Decision 4.
- **Dead sprites.** Delete `src/Divider/div-img/`, `src/Panels/nubbins/` and
  `src/Popup/nubbinImages/`. Move `src/Spinner/spinners/*.gif` to
  `scripts/spinner-diff/fixtures/`. Add a `spinner-diff` npm script.
- **`forwardRef`** on Button, Input, Dropdown and Toggle.
- **`src/Button/Button.jsx`** (unused stub): mark it deprecated, and
  remove it in 0.7.
- **Types**: `Label`, `Header.size`, `ThemeWrapper.motion` / `contrast` /
  `transparency` / `ground`, `FloatingPanel.fullBleed`,
  `RepanelStack.upcoming` / `onUpcomingOpen` / `keepPast`,
  `Repanel.hint` / `sequence`, `useWidthClass`, `waterdropRadius`,
  `SCREEN_*`.
- **Ground.** `--mochi-vignette`, opt-in through `ThemeWrapper
  ground="vignette"`. Default `plain`, because inside Pyxis the colour
  comes from the host.
- **Version** `0.6.0`. Tag `release-0.5.0`, `release-0.5.1` and
  `release-0.6.0`.

---

## 12. Docs and the design system

- `RELEASE_NOTES.md` `v0.6.0`, with an "Upgrading from 0.5.x" section:
  - the lighter pane and no stack shadow (and the tokens that bring them
    back)
  - waterdrop corners on Dropdown, PopupPanel and the sheets
  - the Pagination, Item and Dropdown selection changes
  - the left sliver
  - the Badge warning ink
  - reduced motion now fading instead of switching off
  - the copy changes
- `README.md`, `docs/remochi-component-guide.md`, `IDENTITY.md`.
- **Re-sync the design system** from the 0.6.0 code (`/design-sync`). This
  clears "Not synced": Reduced is no longer Off, there are contrast and
  transparency modes, and the chrome is drawn. It replaces the sprite asset
  groups and turns each "Bringing the code along" into what shipped. It
  edits your saved design system, so it waits for your OK.

---

## 13. Order of work

One commit per step on `release/0.6.0`. Steps 1–7 are the foundations
(Mochi with Pyxis). Steps 8–9 are new behaviour and can move to 0.7 if they
run long.

1. Merge `docs/identity`, bump the version. Housekeeping (dead sprites,
   PopupPanel `type` bug, `forwardRef`), and copy (section 10).
2. `check:tokens` in report-only mode.
3. Colour jobs, floors and greyscale cues (section 4). Turn the guard to
   failing.
4. Motion modes and tokens, spinner fade (section 6). Accessibility modes
   (section 5).
5. The Mochi pane (section 1), then signature corners (section 2). Both
   change `nubbin.jsx`, so they go in this order.
6. Type (section 3). Pointed (section 7).
7. Width tokens and `useWidthClass` (section 9).
8. Peeks (section 8).
9. Types, docs, release notes. Rebuild `dist`. Re-sync the design system.

## 14. How it is checked

There is no unit test suite (`npm test` is a stub).

- `npm run build:lib` succeeds, and `dist` has no PNG or GIF.
- `npm run check:tokens` passes: no stray hex; contrast floors of 4.5, 7
  and 3:1; spinner base fills equal the tokens.
- `npm run nubbin-diff`: popup and divider nubbins 0 px changed at the old
  radius. New cases for the 1 px grabber and the waterdrop corner caps
  have no joint steps. The spinner diff shows 0 px changed apart from the
  reduced crossfade timing.
- In the browser pane, light and dark, at 375, 1024 and 1440 px:
  - in each motion mode (`data-motion` full, reduced and off on `<html>`,
    and the OS setting): Reduced shows no travel or scale anywhere, and
    drags still track exactly
  - with OS high contrast and reduced transparency on
  - a **greyscale pass** (CSS `filter: grayscale(1)` on the page): every
    selected, on, error and current state still reads
- With Pyxis-style tokens through `tokens` (an app accent on
  `--mochi-accent`, `--mochi-header-tracking: 0.14em`, `data-motion` set by
  the host): accent fills, rings and selection follow; amber stays amber;
  floating surfaces are waterdrops; edge panes keep the scallop.

## 15. Decisions needed

1. **Mochi pane by default** (1 px left edge, no stack shadow)?
   Recommended: yes. It is both Mochi and Pyxis's "light, not chrome".
2. **FloatingPanel:** waterdrop by default with a `fullBleed` prop for
   square (recommended), or square by default?
3. **Peeks in 0.6.0** (recommended), or the foundations first as 0.6.0 and
   peeks in 0.7.0?
4. **Spinner outline:** keep the traced white/black theme outline (the
   code, recommended, so the spinner stays as it is) and correct the
   guide's outline tokens to match? Or redraw with the guide's per-shape
   dark outlines?
5. **Accessibility modes in remochi** (section 5)? Recommended: yes, so
   apps get them without a host. Otherwise keep the guide's host-only
   approach through `tokens`.
6. **`feat/panel-types`:** drop it (recommended)?
7. **Stack controls** (`controls`, ◀ ▶): dropped by the user's call. The
   visible equals are the left sliver (back), the right peek (forward) and
   the keyboard-operable grabber.
