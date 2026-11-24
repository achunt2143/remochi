/**
 * Repanel
 *
 * A full-height panel with a rounded left edge and flush right edge — the
 * basic "stackable card" surface. Used standalone as a percentage-width
 * layout column inside a flex/grid row, or as the child surface rendered by
 * `RepanelStack`.
 *
 * Props:
 *   width    {number|string}  Width as a percentage number (e.g. 30) or any
 *                             valid CSS width string (e.g. '30%', '320px').
 *                             Default: 100 (100%)
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   handle   {boolean}        Marks the bottom-left edge as a grabber with a
 *                              wavy nubbin accent, laid directly over the
 *                              panel's own edge and coloured from the theme
 *                              tokens. On a 'shadow' panel the panel's inset
 *                              halo carries on into it. `RepanelStack` sets
 *                              this on every
 *                              child but the first (the base of the stack,
 *                              which has nothing behind it to reveal).
 *                              Default: false
 *   hint      {ReactNode}     The clue shown while this panel is the stack's
 *                              `upcoming` peek (RepanelStack's right sliver):
 *                              one short word or number in the label voice,
 *                              about 8 characters at most ("17", "3 NEW").
 *                              It must match what opens. Not shown otherwise.
 *   sequence  {{ index: number, label?: string }}
 *                              For panels in a sequence (steps, pages, items):
 *                              the peek shows `index` as Mochi Light numerals
 *                              (zero-padded to 2, "04") above a short label,
 *                              instead of `hint`. Not shown otherwise.
 *   peekLabel {string}        The panel's name for the peek's accessible name
 *                              ("Open <peekLabel>, <hint>"). Falls back to the
 *                              Header's `content`, else "Open next panel".
 *   peeking   {boolean}       Set by RepanelStack while this panel is the
 *                              right peek; shows the clue. Default: false
 *   door      {boolean}       Set by RepanelStack while this panel is the left
 *                              sliver (keepPast). A peek (`peeking` or `door`)
 *                              is a door, not a second panel: only its Header
 *                              (cropped by the edge) is rendered, and the rest
 *                              of the content appears, fading in, when the
 *                              panel becomes the front panel. Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
export function Repanel({ width, style: variant, handle, hint, sequence, peekLabel, peeking, door, className, children, ...rest }: {
    [x: string]: any;
    width?: number | undefined;
    style?: string | undefined;
    handle?: boolean | undefined;
    hint: any;
    sequence: any;
    peekLabel: any;
    peeking?: boolean | undefined;
    door?: boolean | undefined;
    className?: string | undefined;
    children: any;
}): any;
