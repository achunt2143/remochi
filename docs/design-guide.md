# Remochi design guide

How to build an app that feels like remochi. This is the one place to start. It states the decisions plainly and gives the real values, with the components and tokens that carry them.

Remochi carries forward the Mochi look: the library's name and its font families (Mochi Light, Mochi Bold and the rest) come from it. This guide is about how to make remochi apps feel right today.

For props, examples and the token reference, see the [component guide](./remochi-component-guide.md).

---

## 1. What remochi feels like

Remochi is soft, friendly and typographic. The screen is a quiet grey ground with panels sliding over it. A panel has a thin edge and one curved corner. There are no cards, no heavy shadows and no icons on circles. Type does the organising: a light capital nameplate says where you are, an italic line says what this is about, and actions sit in brackets: `( Save )`.

Colour is rare and means something. Amber means on. Sky blue means you can touch this. Green means yes, red means this destroys something, and grey is everything else. Light is the first theme, and dark is an equal, not an afterthought.

If you remember one thing: **every motion, accent and shape points at something.** Nothing is there just to look busy.

---

## 2. Principles

Eight rules. Each says why, then how.

### Short visits: make the few common things the fastest

People use apps in short bursts. They want the thing they do most, in the fewest steps, with no waiting.

How: put the most common path first at every screen size. Leave a feature out before you let it complicate that path. Let peeks (section 6) turn the likely next step into one tap. Keep animations short: nothing that blocks input runs longer than 260ms.

### Type is structure

A screen is organised by its type, not by boxes. A label names a section, a header names a panel, and space separates the rest.

How: use `Header`, `Subheader`, `Label` and the four voices in section 3. Do not draw a card around something a label can name. Do not draw a rule between sections a label already separates.

### Panels on a time line

Panels sit on one horizontal line, and that line is time. Left is where you came from. Right is where you are going.

How: use `RepanelStack`. A new panel arrives from the right and the earlier ones stay open to its left as real columns. Closing sends the front panel back out to the right. Never enter forward content from the left, the top or the bottom.

### Pointed, not loud

Remochi is recognisable by being precise, not by being bold. Every motion, accent and shape points at what you just did or what you can do next. The nubbin, the small bump on a popup or a panel's grabber, is the model: it points at its source.

How: spend emphasis once per view. One display line at most. One accent target, the next action. One choreographed move per transition. When everything is emphasised, nothing is.

### Light, not chrome

Add a small point of light before you add a border, an outline or a shadow. Colour arrives in small points: a pressed underline, a checked dot, a tinted selected row. Never a filled banner or a coloured card.

How: panels draw a 1px edge on one side and no shadow. Rows are flat, with no separators. A selected row is tinted and its title goes bold. It is never outlined.

### Shapes carry meaning

Every state must read in greyscale. Colour is a bonus, never the only cue.

How: pair a colour with a word, a tick, a position or a shape. A checked Checkbox has a tick. A Toggle has a knob position and the words ON and OFF. A selected `Item` has a bold title. An error says "Error". Check every view in greyscale before you ship it.

### Motion answers a question

Where did this come from? Where did it go? If a motion answers neither, remove it.

How: things travel, they do not cut or fade in on the spot. A popup grows out of its nubbin. A dialog rises over the scrim. Every motion has three forms (Full, Reduced, Off). See section 7.

### One design, every screen

The language stays the same on every screen. The controls change with the space you have. A phone held in one hand and a wide monitor with a mouse need different ways to get around, not different systems.

How: decide by the width a panel actually has, not by the device. Give every gesture a visible equal. See section 8.

### Say it plainly

Copy tells people what will happen. It does not apologise, hedge or sell.

How: see section 9.

---

## 3. Type

### The four voices

Every line of text is one of four voices. Its shape tells people which before they read a word.

| Voice | Shape | Says | Components |
|---|---|---|---|
| Nameplate | UPPERCASE, light or bold | Where you are. One or two words, never a sentence. | `Header`, `Label`, Table column heads, `SlidingMenu` group labels |
| Voice | *Italic*, sentence case | What this is about. One line. | `Subheader`, `ListHeader`, list rows |
| Content | Roman, sentence case | The thing itself. | Panel text, Dialog body, `Input`, Table cells |
| Action | ***Bold oblique***, title case | Something you can press. | `Button`, `ViewSelectButton` |

If you cannot say which voice a line is, it does not belong on the screen yet.

Uppercase is only ever a nameplate. A sentence in capitals, an uppercase button or an uppercase body line breaks the system. Bold oblique is for actions. Outside a Button, use it at most once per view, on the one word that matters.

### The ladder

Five sizes carry the structure. Each is about half the one above, so the jump between rungs does the work and nothing needs a colour or border to stand out.

| Rung | Size / line | Face | Component | Use |
|---|---|---|---|---|
| Display | 72 / 64 | Mochi Light, uppercase | `<Header size="display">` | The one word that names a whole screen. At most once per screen. |
| Header | 36 / 32 | Mochi Light, uppercase | `<Header>` | Names a panel. Exactly one per panel, first thing in it. |
| Subheader | 18 / 26 | Mochi Medium italic | `<Subheader>` | Context under a Header: a count, a status, a date. |
| Body | 14 / 21 | Mochi Medium (list rows bold italic) | `ListItem`, panel text | Content. |
| Label | 12 / 16 | Mochi Bold, uppercase, 0.05em | `<Label>` | Names a section inside a panel. One per section. |

Helper text (`caption`) is 12px roman. It is the same size as a label but never uppercase: case, not size, tells them apart.

If the Mochi faces are not installed, remochi falls back to the bundled Lato. `ThemeWrapper fontFamily="Lato"` skips the lookup and uses Lato only.

### Case rules

Write nameplates in title case in your source and let the style uppercase them. Pass `'Albums'`, not `'ALBUMS'`. Screen readers then read the word, not the letters.

Keep nameplates to one or two words: `ALBUMS`, `QUICK SETTINGS`, `RECENTLY ADDED`. Headers that do not fit truncate with an ellipsis. They never wrap. Do not centre a nameplate.

### The 32px edge

Everything in a panel hangs from one vertical line, 32px in from the panel's left edge. The Header, Subheader, ListHeader and list rows already sit on it. Align every label, paragraph, field and list to the same line and let text run ragged on the right.

### Space is the divider

A Header stands on the bottom of its 64px bar, so its baseline is the line between the name and what it names. Do not add a rule under it.

A `Label` has 32px above and 8px below built in. That gap is the section break. Use `Divider` and `NubbinDivider` only for seams that are physical, such as between a Dialog's title and body.

### Rank without colour

Rank comes from size, weight and case. Nameplates and content use the full text colour. Subheaders and captions use a muted ink that holds 6.8:1 on light grounds. Never set a heading in the accent, amber or a status colour. Blue and amber mean "you can touch this" and "this is on". They do not mean "important".

```jsx
<Repanel>
  <Header>Albums</Header>
  <Subheader>Synced today, 312 albums</Subheader>
  <Label>Recently Added</Label>
  {/* rows */}
  <Label>All Albums</Label>
  {/* rows */}
</Repanel>
```

---

## 4. Colour

### Each colour has one job

| Colour | Token | Means | Used for |
|---|---|---|---|
| Sky blue (accent) | `--mochi-accent` | You can go here | Button press bar, Slider knob and fill, ProgressBar fill, focused field border, Toggle/Radio/Checkbox accents when a host sets it. Never text. |
| Primary blue | `--mochi-primary` | A link or a choice | Links, Dropdown labels and chevrons, the `blue` Button. Safe for text. |
| Amber | `--mochi-selected` (`#ffb80d`) | This is on | Checked Radio and Checkbox, the on Toggle, warning Badges and bars. The same in both themes. |
| Green | `affirmative` Button, `--mochi-success` | Yes, do it | The positive choice in a decision. |
| Red | `warning` Button, `--mochi-error` | This destroys something | Destructive choices only. |
| Grey | `--color-*`, `--mochi-*` greys | Everything else | Ground, panels, text, off states. |

Rules that follow:

- **One accent target per view.** The one thing that moves you on carries the accent: the focused field, the press bar, the next event. If two things compete for it, one of them is wrong.
- **Never use the accent for text.** At 1.8:1 on a light ground, it fails. Text that must be blue uses primary (`#357099` in light, 5.3:1 on white).
- **Never use amber for text on a light ground.** It is 1.59:1. Text on an amber fill, such as a warning Badge, is the dark `--mochi-on-selected-ink`, never white.
- **Decisions follow the colours.** Green for the positive choice, red only for a destructive one, and a plain Button for Cancel. `Dialog` does this by default; pass `confirmType="warning"` when the confirm action deletes something.
- **Selected is amber, not blue.** Unless a host sets `--mochi-accent`, blue never means selected.
- **The spinner's red, blue and yellow are fixed.** Do not recolour them.

### Grounds and panels

Grounds come in layers: `--color-background` is the page (`#f5f5f5` in light, `#1a1a1a` in dark), `--color-surface` is menus and cards, and `--color-surface-elevated` sits above that. Panels use `--mochi-panel-bg`. Floating surfaces use `--mochi-surface-material`. The Dialog card sits on `--mochi-dialog-bg` over the `--mochi-overlay` scrim.

`ThemeWrapper ground="vignette"` adds a soft shade at the edges of the area it covers. The default, `plain`, draws nothing.

### Text colours

| Token | Use |
|---|---|
| `--color-text` | Content and nameplates |
| `--color-text-secondary` | The italic voice and captions |
| `--color-text-muted` | Disabled text only. It is under 4.5:1 in both themes. |

Inside a Repanel, muted lines and normal Buttons read `--mochi-panel-text-muted` and `--mochi-panel-button-text`, which are tuned to hold 4.5:1 on the dark panel.

### Status

`--color-success`, `--color-warning`, `--color-error` and `--color-info` each have a `-bg` tint for message strips. Error and success differ mostly by hue, so always add a word or icon.

### Contrast floors

| What | At least |
|---|---|
| Text on its ground | 4.5:1 |
| Text over anything translucent (a material, a scrim) | 7:1 |
| Focus rings and borders you need to see | 3:1 |

Off states are grey: Radio, Checkbox and Toggle share one set of off tokens, and the Slider's unfilled track is its own grey.

### Retheme through tokens

A host app can change remochi's colour and shape through `ThemeWrapper tokens`. Remochi does this for every component at once, and no component picks a brand colour of its own.

```jsx
<ThemeWrapper defaultTheme="light" tokens={{ '--mochi-accent': '#3a8fd0' }}>
  <App />
</ThemeWrapper>
```

The accent is a light, not a text colour. If your app has a brand colour, map it onto `--mochi-accent` (bars, knobs, fills, focus borders). Do not map it onto `--mochi-primary`. Most bright colours fail text contrast on a light ground. To restyle a whole theme, override the `--color-*` tokens. Override `--mochi-*` only to retune one surface.

Write tokens through the `tokens` prop, not on `<html>` alone. The prop writes to both the wrapper and `:root`, so portals such as Dialog and Dropdown menus see them too. Always wrap the app in `ThemeWrapper`; outside it, components fall back to light defaults.

---

## 5. Shape

### The corner ladder

Keep new surfaces on this ladder so a host can reshape them all.

| Token | Value | Used by |
|---|---|---|
| `--mochi-corner-xs` | 4px | List and GridList rows, a Dropdown option |
| `--mochi-corner-sm` | 10px | `Item` |
| `--mochi-corner` | 16px | Table, `FloatingPanel`, the `drop` Button |
| `--mochi-corner-field` | 24px | `Input`, `PopupPanel`, `ProgressBar`, the Dropdown menu |
| `--mochi-corner-pill` | 9999px | Toggle, Slider, Badge, Dropdown trigger |

### The scallop

A panel anchored to an edge has one curved corner at its top left: the scallop, `45px 0 0 0` (`--mochi-scallop`). The curve of the panel in front reveals the panel behind it. A panel is 365px wide, and 45px of it runs under the next panel, so each revealed column shows 320px.

Only panels anchored to an edge get the scallop. Do not put it on floating things.

### The waterdrop

The waterdrop is round on every corner except the top right, which is nearly sharp: `16px 4px 16px 16px` (`--mochi-drop-radius`). It is an accent, and it is reserved:

- `Avatar`
- `Dialog` (the one interruption; its phone sheet keeps the drop's top corners)
- `FloatingPanel shape="drop"`

Reserve it because a signature that appears everywhere stops being one. Do not invent another corner. A `PopupPanel` already points with its nubbin, so it keeps the 24px field corner.

The drop scales down with size so small things do not look blobby. A 40px avatar gets `12 3 12 12`, a 20px one `7 2 7 7`, and from about 56px up it is the full drop. No corner is bigger than half the short side of its box. `waterdropRadius(size)` returns the scaled corner for your own surfaces.

### Full-bleed is square

A surface that fills its container is square on every corner and casts no shadow. Corners and shadows belong to things that sit on something. Use `<FloatingPanel fullBleed>` when a panel is the whole surface.

### Nubbins point at their source

`PopupPanel` and `NubbinDivider` carry a small bump toward the thing they relate to. A `PopupPanel` grows out of its nubbin's tip. In a `RepanelStack`, the nubbin at a panel's bottom left is its drag grabber.

### Depth

Panels get depth from an inset edge, not from drop shadows: a 1px `--mochi-pane-edge` (`#cccccc` in light, `#333333` in dark) on the leading side. Use `shadow-sm` to `shadow-xl` only for things that float, from small raised controls to drawers.

---

## 6. Panels and navigation

### Panels

Use `RepanelStack` for any flow that goes deeper: master and detail, drill-down, a wizard. Children are `Repanel`s. Open **every** panel with a `Header`. The revealed columns then spell the path left to right: LIBRARY, ALBUMS, TRACKS. As a column narrows its Header truncates, and the first word stays legible.

The base panel is square, has no edge, and is the ground. Every panel after it draws the edge and the scallop, and gets a grabber.

### Navigation goes right

Forward moves right. Back is the front panel leaving to the right, with the panel behind it growing to fill the space. Vertical motion is for interruptions only: a `Dialog` rises, a phone sheet slides up, a `SlidingMenu` enters from its edge. Do not navigate vertically.

### Peeks: a step in each direction

The screen should never leave people alone at an edge. A little of where they came from shows on the left. When the app can tell where they are going, a little of that shows on the right, with a clue.

- **The past peeks from the left.** When the stack is collapsed to its front panel (a narrow screen, or after closing columns), the panel you came from stays as an 80px sliver: its curve and the start of its Header. `keepPast` is on by default.
- **The future peeks from the right.** `upcoming` takes one keyed `Repanel` (or `null`). It waits as an 80px sliver at the right edge (20px on narrow screens) with its corner and a cropped Header.
- **A peek is a door, not a second panel.** It shows a Header and, on the right, one short clue. No buttons, fields or images.

A peek is a promise, so it must be right:

- **One panel, never a menu.** Show the single most likely next step.
- **Peek what the person's own action points to.** The detail of the row they just selected, the next step of a Wizard, the next item in a sequence.
- **When unsure, nothing peeks.** An empty right edge is honest. A wrong guess teaches people to ignore the edge for good.
- **The right edge belongs to the person's path.** No promotions, no "you might also like".
- **Follow intent, not the pointer.** The prediction changes when selection or focus changes, never on hover.

The clue is one short word or number, about eight characters: `17`, `3 NEW`, `STEP 2`. It must match what opens: if the sliver says `17`, the panel's Subheader says "17 songs". In a sequence, use `sequence` to show the position as numerals, such as `04`, above a short label.

Peeks stay crisp: full opacity, real colours, no blur. A dimmed sliver reads as disabled. The Header is cropped, not shrunk, so it grows into the full Header in the same place when the peek opens.

```jsx
<RepanelStack
  activeIndex={open ? 1 : 0}
  onActiveIndexChange={(i) => setOpen(i === 1)}
  upcoming={
    !open && selected ? (
      <Repanel key="tracks" hint="17" peekLabel="Abbey Road">
        <Header>Abbey Road</Header>
      </Repanel>
    ) : null
  }
  onUpcomingOpen={() => setOpen(true)}
>
  <Repanel key="albums">
    <Header>Albums</Header>
    {/* rows that set `selected` */}
  </Repanel>
  {open && (
    <Repanel key="tracks">
      <Header>Abbey Road</Header>
      <Subheader>17 songs</Subheader>
    </Repanel>
  )}
</RepanelStack>
```

When the peek opens, append the panel with the same `key` to your children, as above.

Each sliver is a real button at least 44px tall, named by where it goes ("Open Abbey Road, 17 songs", "Back to Library"). Set `peekLabel` so it reads well; it falls back to the Header's text.

### The grabber

The nubbin at a panel's bottom left is its grabber. Drag it to reveal or hide parent columns. On the front panel, once nothing is left to reveal, dragging it right closes the panel: release past about 45%, flick, or double-click to commit. Release short of that and it springs back. The grabber also answers Enter and Space, so it works from the keyboard.

### Every gesture has a visible equal

A swipe, a drag or an edge path is never the only way to do something. In a `RepanelStack` the equals are the left sliver (back), the right peek (forward) and the grabber. On wide screens the visible control comes first and the gesture is the shortcut. On phones it is the other way round.

---

## 7. Motion

### What moves, and why

Motion points. It shows where something came from or where it went, and it leaves the person ready for what comes next.

- **Forward arrives from the right.** Entrances start fast and land soft on `--mochi-ease-forward` (`cubic-bezier(0.16, 1, 0.3, 1)`): most of the travel happens at once, then a long, gentle settle.
- **Overlays arrive a little quicker.** A `Dialog` rises 8px and scales up from 0.97 on `--mochi-ease-arrive` (`cubic-bezier(0.22, 1, 0.36, 1)`) while its scrim fades in.
- **Things travel, they do not cut.** A peek's cropped Header grows into the full Header. A `ViewSelectButton` bar slides from the old view to the new one. A Button's press bar grows out from under the label.
- **The direction is the meaning.** Choose a segment to the right of the current one and the new content should arrive from the right. `ViewSelectButton`'s `onSelect` reports `detail.direction` (`'forward'`, `'back'` or `null`) so your content can enter from that side.
- **One move, many parts.** A transition is one gesture: the panel leads, its type lands in ladder order (nameplate, then the italic line, then content), and anything that must make way gets out quickly. Many small moves on separate timers read as noise.
- **Pressing is anticipation.** A held Button spreads its brackets 4px, grows its accent bar and scales to 1.05, then settles back on release.
- **Drags track the finger.** Anything you can drag follows the pointer exactly, in every motion mode, and commits only when the person lets go.
- **Nothing happens on hover.** Buttons show nothing on hover. Rows on transparent grounds take a hover wash, and opaque controls take an opaque one. Never put a translucent wash over an opaque fill.
- **No loops, except the spinner.** The spinner means "wait". Do not loop motion to attract attention.

### Durations

| Token | Value | For |
|---|---|---|
| `--mochi-duration-focus` | 120ms | A focus ring easing in |
| `--mochi-duration-control` | 200ms | A small control changing state |
| `--mochi-duration-arrive` | 220ms | A Dialog or popup arriving |
| `--mochi-duration-stack` | 260ms | A panel arriving or leaving the stack |
| `--mochi-duration-press` | 300ms | A held Button's accent bar |
| `--mochi-duration-reduced` | 150ms | The most any fade lasts under Reduced |

Nothing that blocks input runs longer than the arrival. Precise is impressive; slow is not.

### Full, Reduced, Off

Every motion has three forms. The person, or their system setting, chooses.

| Mode | What happens |
|---|---|
| Full | As described above: travel, rise and scale, the press lean. |
| Reduced | Opacity only. A fade in place of at most 150ms, with no travel, scale, blur or stagger. |
| Off | Nothing animates. State changes at once. |

Layout still tells the story with less motion: the new panel is simply there on the right, and the past is still on the left. Static styling (corners, edges, shadows, materials) is drawn in every mode. Only the change between states follows the mode. The spinner crossfades its shapes in 150ms under Reduced and shows a still circle under Off.

Set the mode with the `motion` prop on `ThemeWrapper` (`'system'`, `'full'`, `'reduced'` or `'off'`), or with `data-motion="full|reduced|off"` on `<html>`. A wrapper's mode beats `<html>`'s. With neither, the operating system's reduced-motion setting applies, and it means Reduced.

```jsx
<ThemeWrapper defaultTheme="light" motion="reduced">
  <App />
</ThemeWrapper>
```

Tune timing through tokens (`--mochi-ease-forward`, `--mochi-duration-stack` and the rest), not by writing your own transitions. Do not add a new motion language. Remochi moves along the time line, rises for interruptions and leans in on press. Build new effects from those.

---

## 8. Screens

### One design, every screen

Remochi is one design, not one design stretched. Nameplates, colour jobs, the time line and pointed motion stay the same at every width. The way you get around changes with the space you have.

| Width | Up to | Layout | Getting around |
|---|---|---|---|
| Narrow | 768px (`SCREEN_NARROW`) | One panel at a time. Peeks are 20px (the curve only, no clue). Dialog becomes a bottom sheet. | Swipe and tap the peeks. Gestures lead. |
| Medium | 768 to 1280px | The front panel plus one or two revealed parents. Peeks are 80px. | Peeks, grabbers and in-panel controls together. |
| Wide | from 1280px (`SCREEN_WIDE`) | More columns revealed. | Visible controls lead. Gestures are shortcuts. |

### The rules

- **The common path first, at every width.** Extra width adds reach, never extra steps.
- **Scale the reach, not just the size.** A path that costs a thumb flick should not cost an arm across a monitor. If it does, turn it into a control where the pointer already is.
- **Show more, do not stretch.** Use extra width to reveal more of the path (more parent columns, a week instead of a day, a wider peek), never to make a panel wider than its content.
- **Nothing hides in an edge.** If an action matters, it is on screen at every width. Edges hold peeks, which are visible doors.
- **Decide by the space you have.** Switch on the width the panel actually has, so a narrow window on a wide screen behaves as narrow.

### In code

`RepanelStack` decides narrow from its own width (`narrowFitWidth`, default 768), not the window's. For your own layouts, `useWidthClass(ref)` returns `'narrow' | 'medium' | 'wide'` for an element's own width.

```jsx
function Day() {
  const ref = useRef(null);
  const width = useWidthClass(ref);
  return (
    <div ref={ref}>
      <Header>Tuesday</Header>
      {width === 'wide' ? <WeekView /> : <DayView />}
    </div>
  );
}
```


---

## 9. Writing

- **Case is role.** Uppercase is only for nameplates. Write them in title case and let the style uppercase them. Never type capitals into a string.
- **Actions are short and in title case.** "Confirm", "Cancel", "Next", "Quick Actions". Buttons are one or two words. The brackets come from the component, not the label.
- **Sentences are plain and in the second person.** "Choose an action to proceed." "Delete this playlist?" Say "you". Do not say "we".
- **Subheaders and captions are sentence case with no full stop.** "Synced today, 312 albums".
- **Placeholders are hints, not labels.** "Select an option…", "Select date…". Use an ellipsis when the field is waiting for a choice.
- **Name states with words,** not colour alone: "Active", "Away", "Error".
- **Say what happens next, and for how long.** "Enter your password to allow this for 5 minutes."
- **Errors say what went wrong and what to try.** No codes in the headline, no "Oops", no apology.
- **No marketing words.** Not "seamless", "powerful" or "magical". Describe a feature flatly, by what it does.
- **No emoji as decoration.** Glyphs such as ◀ ▶ ✓ may sit inside labels where they carry meaning.
- **A Dialog asks a question,** and a question is not a place. Its title stays in title or sentence case, not the nameplate style.
- **Name things by who they are.** Use the product's or app's own name. Never write "the user" or "the system" in copy people read.

---

## 10. Accessibility

Most of this is built in. These are the parts that are yours.

- **Contrast.** Text is at least 4.5:1 on its ground, 7:1 over anything translucent, and focus rings and borders at least 3:1. Use tokens and the colour jobs in section 4 and you keep this for free. Never put essential text in `--color-text-muted`.
- **Greyscale test.** Look at every view with colour removed. If a state or a rank disappears, add a word, a tick, a position or a weight.
- **Tap targets.** Checkbox, Radio, Toggle, the Slider knob and track, and the panel grabber have invisible 54px hit areas. Peek slivers are at least 44px tall. Keep your own controls at least as large.
- **One focus ring.** Every focused control shows `--mochi-focus-ring`. It is the accent in dark and the primary blue in light, because the light accent is too pale to meet 3:1. Fields turn the accent with a soft halo. Do not remove focus styles.
- **Keyboard paths.** Everything works without a pointer. The grabber answers Enter and Space. Peek slivers are real buttons that come after the panel's own content in tab order. Dialogs close with Escape.
- **Labels for icon-only controls.** Give every icon-only control an `aria-label`. Every component forwards `aria-*` and `data-*` to its root. Name peeks with `peekLabel`.
- **Motion.** Honour the person's choice. See section 7. Do not add motion that ignores `data-motion`.
- **Contrast and transparency modes.** `ThemeWrapper contrast="more"` takes ink to pure black or white, edges to full ink, and materials and the Dialog scrim solid with no blur. `transparency="reduced"` makes the scrim and materials solid. Both follow the operating system by default (`'system'`); `'standard'` opts out.

```jsx
<ThemeWrapper
  defaultTheme="system"
  motion="system"
  contrast="system"
  transparency="system"
>
  <App />
</ThemeWrapper>
```

---

## 11. Do and don't

Do:

- Open every panel with a `Header`, and name every section with a `Label`.
- Write nameplates in title case and let the style uppercase them.
- Hold the 32px edge. Let size and case carry rank, and space carry grouping.
- Give each view one accent target and one choreographed move.
- Peek only the one panel the person is most likely to open. When unsure, peek nothing.
- Give every gesture a visible equal.
- Use tokens, never bare hex colours, wherever a token exists.
- Check every view in greyscale, at narrow and wide widths, and in all three motion modes.
- Use green for yes, red only for destroy, and a plain Button for Cancel.

Don't:

- Type capitals into strings, or uppercase a sentence, a button or a field label.
- Use two Headers in one panel, or a display line on a screen that already has one.
- Draw a rule, a box or a tint behind a heading to make it stand out.
- Set text in the accent or in amber.
- Use blue for selected.
- Put the waterdrop on things it is not reserved for, or invent another corner.
- Add cards, coloured tiles or filled banners.
- Fade things in on the spot, bounce them for fun, or loop motion to attract attention.
- Animate parts of one change on separate timers.
- Hide an important action behind an edge swipe.
- Put promotions or "you might also like" on the right edge.
- Dim or blur a peek.
- Apologise in copy, or use marketing words.

---

## 12. Quick start

Install, import the stylesheet once, and wrap your app in `ThemeWrapper`. A root wrapper starts in dark unless you pass `defaultTheme`, so pass `defaultTheme="light"` (or `'system'`).

```jsx
import 'remochi/css';
import {
  ThemeWrapper,
  RepanelStack,
  Repanel,
  Header,
  Subheader,
  Label,
  Item,
  Button,
} from 'remochi';

export default function App() {
  return (
    <ThemeWrapper defaultTheme="light">
      <div style={{ height: '100vh' }}>
        <RepanelStack>
          <Repanel key="library">
            <Header>Library</Header>
            <Subheader>3 collections</Subheader>
            <Label>Recent</Label>
            <Item title="Abbey Road" subtitle="17 songs" />
          </Repanel>
          <Repanel key="album">
            <Header>Abbey Road</Header>
            <Subheader>17 songs</Subheader>
            <Button type="affirmative">Play</Button>
          </Repanel>
        </RepanelStack>
      </div>
    </ThemeWrapper>
  );
}
```

A few notes:

- `RepanelStack` fills its container, so give it a height.
- By default the last panel is in front. Pass `defaultActiveIndex` to start elsewhere.
- `Button`'s `type` is only its look. A Button never submits a form unless you pass `htmlType="submit"`.
- Remochi's interface icons come from `react-icons`. Use the same set for new icons, in the surrounding text colour.
- To set a different look for your app (an accent colour, a different corner for floating surfaces), pass `tokens` to `ThemeWrapper`. A host app can retheme remochi this way without touching components.

### Where to go next

- [Component guide](./remochi-component-guide.md): props and examples for every component, and the full token tables.
- [README](../README.md): installation and overview.
