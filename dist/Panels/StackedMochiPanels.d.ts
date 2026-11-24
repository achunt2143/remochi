/**
 * RepanelStack — a webOS/Mochi stacked panel workspace.
 *
 * Renders dynamic child panels as overlapping, fully interactive columns —
 * a master-detail layout in the spirit of the classic webOS email app.
 * The active (front) panel is the rightmost column and takes the remaining
 * width; earlier panels stay revealed to its left as real, readable
 * columns — not dimmed peeking slivers. Every panel except the first (the
 * base of the stack, which has nothing behind it to reveal) gets its own
 * nubbin grabber at its bottom-left edge, and it does one of two things
 * depending on which panel it's attached to:
 *   - A PARENT panel's grabber adjusts reveal — grows/shrinks how many
 *     parents are shown behind the active panel, all the way back to
 *     panel 0 if dragged far enough. Never changes which panel is active.
 *   - The ACTIVE panel's own grabber does the same reveal-adjust when
 *     dragged left (so a stack collapsed all the way down to just the
 *     active panel can always be reopened from the one grabber still
 *     visible) or when dragged right while there's still more of the
 *     stack left to reveal. Only once the active panel's grabber is
 *     dragged right with nothing left to reveal does it become a
 *     "swipe to close" gesture instead: it continuously shrinks while the
 *     panel behind it grows to fill the space — no abrupt cut. Release
 *     past ~45% dragged, with a fast flick, or double-click it, and the
 *     close commits (the active panel becomes the one behind it); release
 *     short of that and it springs back open. A closed panel doesn't come
 *     back on its own — only an explicit forward action
 *     (`next`/`setActiveIndex`, typically triggered from inside the new
 *     active panel) reopens it.
 * There is no separate header gesture zone — the nubbin is the only
 * interactive surface a panel adds on top of its own content.
 *
 * `Repanel` and `FloatingPanel` remain plain presentational surfaces — this
 * wrapper owns all layout and gestures. Children are read dynamically via
 * `React.Children.toArray`, so there is no fixed panel count. The one
 * exception: the nubbin grabber is visual and lives on the `Repanel` child
 * itself (its `handle` prop) — this wrapper only clones that prop onto
 * every child but the first and provides an invisible hitbox over each one.
 *
 * Where you came from, where you're going. The stack never leaves the person
 * alone at an edge:
 *   - The PAST peeks from the left. With `keepPast` (default), the panel
 *     behind the front one stays as a sliver (--mochi-peek-width, 80px;
 *     --mochi-peek-width-narrow, 20px on a narrow stack) when the stack is
 *     collapsed to the front panel, instead of leaving at 0 width: its
 *     scallop corner, the start of its nameplate and the leading edge of its
 *     rows. Its grabber stays live, and the sliver is a button named "Back
 *     to <name>": tap it or drag it right and it steps back, as `prev()`.
 *   - The FUTURE peeks from the right. When the app passes `upcoming` (one
 *     Repanel, or null for nothing), it waits as a sliver at the right edge
 *     over the front panel: its scallop corner, its real Header cropped by
 *     the edge, and the Repanel's `hint` or `sequence`. The sliver is a button
 *     named "Open <name>, <hint>". Tapping it, dragging it left, or `next()`
 *     opens it the same way `next()` moves forward. A new prediction slides
 *     the old sliver off to the right and the new one in from the right.
 *     Peeks are crisp: full opacity, no blur.
 *
 * The stack can't own your list of panels, so opening is a hand-off:
 * `onUpcomingOpen` is called, and you append the panel to your children, with
 * the same `key` as `upcoming` so the very panel you saw (and its Header)
 * carries on from the sliver instead of being rebuilt. The stack then makes
 * it the front panel, and it slides in from where the sliver was.
 *
 *   const [panels, setPanels] = useState([list]);
 *   const next = predict(selection); // a Repanel with a key, or null
 *   <RepanelStack
 *     upcoming={next}
 *     onUpcomingOpen={() => setPanels((p) => [...p, next])}
 *   >
 *     {panels}
 *   </RepanelStack>
 *
 * (With a controlled `activeIndex`, also set it to the new last index in
 * `onUpcomingOpen`; the stack only moves an uncontrolled index itself.) The
 * peek shows only while the front panel is the last child.
 */
export const RepanelStack: any;
export const MochiStackedPanels: any;
export const StackedMochiPanels: any;
