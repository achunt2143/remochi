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
 */
export const RepanelStack: any;
export const MochiStackedPanels: any;
export const StackedMochiPanels: any;
