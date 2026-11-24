import React, { useState, useRef, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import './StackedMochiPanels.scss';
import { Repanel } from './Repanel';
import Header from '../Headers/Header';
import { SCREEN_NARROW } from '../shared/screens';
import { useWidthClass } from '../shared/useWidthClass';
import {
  DEFAULT_SNAP_POINTS,
  DEFAULT_MAX_VISIBLE_PANELS,
  DEFAULT_PEEK,
  DEFAULT_OVERLAP,
  resolveLayoutConfig,
  revealBounds,
  stepSnap,
  clampIndex,
  getPanelDescriptor,
  resolveReveal,
  clampRevealExtended,
  getClosePreviewDescriptor,
  getOverlapPx,
} from './stackedPanelsLayout';

// Swiping the ACTIVE panel's own grabber closes it (goes back one panel).
// Past this fraction of the active panel's width, releasing commits the
// close; short of it, it cancels and springs back open.
const CLOSE_COMMIT_THRESHOLD = 0.45;
// A fast enough short drag ("flick") commits the close regardless of how
// far it got, so a quick touch swipe doesn't need to travel the full
// distance — tuned for quick touch flows on wider devices.
const FLICK_MAX_DURATION_MS = 300;
const FLICK_MIN_DISTANCE_PX = 24;
const FLICK_VELOCITY_PX_MS = 0.5;

// Dragging a peek's sliver this far toward its panel opens it (right) or
// steps back to it (left); a tap does the same.
const PEEK_DRAG_PX = 24;
// How long a replaced prediction stays mounted while it leaves to the right
// (a little over --mochi-duration-stack; Off and Reduced cut it sooner).
const PEEK_LEAVE_MS = 300;
// --mochi-peek-width / --mochi-peek-width-narrow, if the theme isn't there.
const PEEK_PX = 80;
const PEEK_PX_NARROW = 20;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// The sliver's px width: the stack's own token (a host can tune it), by the
// stack's width class.
function usePeekPx(ref, narrow) {
  const fallback = narrow ? PEEK_PX_NARROW : PEEK_PX;
  const [px, setPx] = useState(fallback);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    const v = el ? parseFloat(getComputedStyle(el).getPropertyValue(narrow ? '--mochi-peek-width-narrow' : '--mochi-peek-width')) : NaN;
    setPx(v > 0 ? v : fallback);
  }, [ref, narrow, fallback]);
  return px;
}

// What the right sliver opens, for its accessible name: the Repanel's
// `peekLabel`, else the Header's content if it is plainly in the element.
function peekPanelName(element) {
  const props = element.props || {};
  if (props.peekLabel) return props.peekLabel;
  const header = React.Children.toArray(props.children).find(
    (c) => React.isValidElement(c) && c.type === Header && typeof c.props.content === 'string' && c.props.content
  );
  return header ? header.props.content : null;
}

// One sliver's door: a real button, tap or drag toward its panel (`dir`: -1
// drags left, +1 drags right), over the panel's full height (so well over 44px).
function PeekSliver({ side, label, onActivate }) {
  const startX = useRef(null);
  const dragged = useRef(false);
  const dir = side === 'past' ? 1 : -1;
  return (
    <button
      type="button"
      className={`repanel__peek-button repanel__peek-button--${side}`}
      aria-label={label}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        startX.current = e.clientX;
        dragged.current = false;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {
          /* no-op */
        }
      }}
      onPointerMove={(e) => {
        if (startX.current == null || (e.clientX - startX.current) * dir < PEEK_DRAG_PX) return;
        startX.current = null;
        dragged.current = true;
        onActivate('drag');
      }}
      onPointerUp={() => { startX.current = null; }}
      onPointerCancel={() => { startX.current = null; }}
      onClick={() => {
        // The click after a drag has already been acted on.
        if (dragged.current) dragged.current = false;
        else onActivate('tap');
      }}
    />
  );
}

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

const RepanelStack = React.forwardRef(function RepanelStack(props, ref) {
  const {
    children,
    activeIndex: activeIndexProp,
    defaultActiveIndex,
    onActiveIndexChange,
    reveal: revealProp,
    defaultReveal,
    onRevealChange,
    snapPoints = DEFAULT_SNAP_POINTS,
    maxVisiblePanels = DEFAULT_MAX_VISIBLE_PANELS,
    overlap = DEFAULT_OVERLAP,
    peek = DEFAULT_PEEK,
    grabber = true,
    wrap = false,
    animate = true,
    narrowFit = true,
    narrowFitWidth = SCREEN_NARROW,
    narrowBehavior = 'single',
    upcoming = null,
    onUpcomingOpen,
    keepPast = true,
    className = '',
    style: rootStyle,
    ...rest
  } = props;

  const panels = useMemo(() => React.Children.toArray(children), [children]);
  const panelCount = panels.length;

  const config = useMemo(
    () => resolveLayoutConfig({ snapPoints, maxVisiblePanels, peek, overlap }),
    [snapPoints, maxVisiblePanels, peek, overlap]
  );
  const bounds = useMemo(() => revealBounds(config.snapPoints), [config.snapPoints]);

  // ---- Active index (controlled / uncontrolled) --------------------------
  const isIndexControlled = activeIndexProp != null;
  const [indexState, setIndexState] = useState(() =>
    clampIndex(defaultActiveIndex != null ? defaultActiveIndex : panelCount - 1, panelCount, wrap)
  );
  const activeIndex = clampIndex(isIndexControlled ? activeIndexProp : indexState, panelCount, wrap);

  // ---- Reveal (controlled / uncontrolled) --------------------------------
  const isRevealControlled = revealProp != null;
  const [revealState, setRevealState] = useState(() =>
    resolveReveal(
      defaultReveal != null ? defaultReveal : Math.min(config.maxVisiblePanels, bounds.max),
      config.snapPoints,
      Math.max(0, activeIndex)
    )
  );
  // resolveReveal (not a plain snapReveal) so a value that legitimately
  // exceeds the configured snapPoints — from a grabber drag, or an
  // explicit controlled/defaultReveal beyond the default — isn't clamped
  // back down to the configured max on every render.
  const committedReveal = resolveReveal(
    isRevealControlled ? revealProp : revealState,
    config.snapPoints,
    Math.max(0, activeIndex)
  );

  // Continuous reveal while dragging a PARENT panel's grabber; overrides the
  // committed value for display. Uncapped by the configured snapPoints —
  // see resolveReveal — so a drag can reveal parents beyond the default.
  const [dragReveal, setDragReveal] = useState(null);
  const reveal = dragReveal != null ? dragReveal : committedReveal;

  // Live preview of the ACTIVE panel's "swipe to close" gesture: while
  // dragging, every panel's layout is blended between the current active
  // index and (activeIndex - 1) by `progress` (0 = fully open, 1 = fully
  // closed) — see blendPanelDescriptors. null when not closing.
  const [closeDrag, setCloseDrag] = useState(null);

  // ---- Transient gesture state -------------------------------------------
  const [isRevealDragging, setIsRevealDragging] = useState(false);

  const rootRef = useRef(null);
  const grabRef = useRef(null);
  const closeRef = useRef(null);

  // ---- Narrow detection (the stack's own width, not the window's) --------
  // Narrow is up to narrowFitWidth.
  const widthClass = useWidthClass(rootRef, { narrow: narrowFitWidth });
  const isNarrow = narrowFit && widthClass === 'narrow';
  const peekPx = usePeekPx(rootRef, widthClass === 'narrow');
  const pastPx = keepPast ? peekPx : 0;

  // ---- Whether the wholly first child is among the currently-visible -----
  // panels. It never carries a nubbin (see the map loop below), so when
  // it's the leftmost visible panel there's nothing to reserve room for and
  // the viewport can sit flush — see .repanel__viewport's
  // data-first-child-visible rule. When narrow, index 0 has no grabber (flush),
  // but index > 0 has its own grabber and requires the 20px inset so the nubbin
  // isn't clipped by root's overflow:hidden.
  const isFirstChildVisible = useMemo(() => {
    if (panelCount === 0) return true;
    // Mid-close-drag, use whichever endpoint (before/after the close) the
    // gesture is currently closer to, so the inset doesn't jump ahead of
    // the visual blend. Narrow single-column mode keeps the closing panel's
    // endpoint for the whole drag: that panel stays in front, under the
    // finger, so flipping the inset halfway would jerk it sideways.
    const singleColumn = isNarrow && narrowBehavior !== 'stack';
    const forActiveIndex = closeDrag
      ? closeDrag.progress < 0.5 || singleColumn
        ? closeDrag.fromIndex
        : closeDrag.toIndex
      : activeIndex;
    return getPanelDescriptor({
      index: 0,
      activeIndex: forActiveIndex,
      panelCount,
      reveal,
      config,
      isNarrow,
      narrowBehavior,
      pastPx,
    }).visible;
  }, [isNarrow, panelCount, activeIndex, closeDrag, reveal, config, narrowBehavior, pastPx]);

  // ---- Commit helpers ----------------------------------------------------
  const commitActiveIndex = useCallback(
    (next, reason) => {
      const clamped = clampIndex(next, panelCount, wrap);
      if (clamped === activeIndex) return;
      if (!isIndexControlled) setIndexState(clamped);
      onActiveIndexChange?.(clamped, {
        previousIndex: activeIndex,
        reason,
        panelCount,
        isNarrow,
      });
    },
    [activeIndex, panelCount, wrap, isNarrow, isIndexControlled, onActiveIndexChange]
  );

  const commitReveal = useCallback(
    (value, reason) => {
      // resolveReveal (not a plain snapReveal) so a grabber-driven value
      // that legitimately exceeds the configured snapPoints — because the
      // drag revealed more of the stack than the default covers — isn't
      // discarded back down to the configured max on commit.
      const snapped = resolveReveal(value, config.snapPoints, Math.max(0, activeIndex));
      if (!isRevealControlled) setRevealState(snapped);
      if (snapped !== committedReveal) {
        onRevealChange?.(snapped, {
          previousReveal: committedReveal,
          reason,
          snapPoints: config.snapPoints,
          isNarrow,
        });
      }
      return snapped;
    },
    [committedReveal, config.snapPoints, activeIndex, isRevealControlled, isNarrow, onRevealChange]
  );

  // ---- Peeks -------------------------------------------------------------
  // The right sliver shows only from the last panel (there is nothing to
  // peek at when the stack isn't at its end). Its key is the one the
  // consumer's panel will carry once appended, so the same node continues.
  const upcomingShown =
    !!upcoming && React.isValidElement(upcoming) && !wrap && panelCount > 0 && activeIndex === panelCount - 1;
  const peekKey = upcoming && upcoming.key != null ? `.$${upcoming.key}` : '.$__peek';
  const peekConsumed = (key) => panels.some((p) => p.key === key);
  const peekLive = upcomingShown && !peekConsumed(peekKey);

  // A replaced prediction stays mounted for a moment, leaving to the right.
  const [leaving, setLeaving] = useState([]);
  const [shownKey, setShownKey] = useState(null);
  const shownPeekRef = useRef(null);
  const liveKey = peekLive ? peekKey : null;
  if (liveKey !== shownKey) {
    // Adjusted during render (not in an effect) so the old sliver is never
    // unmounted and remounted: it is the same node, now leaving.
    setShownKey(liveKey);
    const gone = shownPeekRef.current;
    if (shownKey && gone && !peekConsumed(shownKey)) setLeaving((l) => [...l, gone]);
  }
  useEffect(() => {
    shownPeekRef.current = peekLive ? { key: peekKey, element: upcoming } : null;
  });
  useEffect(() => {
    if (!leaving.length) return undefined;
    const t = setTimeout(() => setLeaving([]), PEEK_LEAVE_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  // Opening the right sliver: ask the consumer to append the panel; once it
  // is there, it becomes the front panel (uncontrolled index).
  const [opening, setOpening] = useState(null);
  const [openedFrom, setOpenedFrom] = useState(null);
  if (opening != null && panelCount > opening) {
    setOpening(null);
    if (!isIndexControlled) {
      setIndexState(clampIndex(panelCount - 1, panelCount, wrap));
      setOpenedFrom(activeIndex);
    }
  }
  useEffect(() => {
    if (openedFrom == null) return;
    setOpenedFrom(null);
    onActiveIndexChange?.(activeIndex, { previousIndex: openedFrom, reason: 'peek', panelCount, isNarrow });
  }, [openedFrom, activeIndex, panelCount, isNarrow, onActiveIndexChange]);

  const openUpcoming = useCallback(
    (reason) => {
      setOpening(panelCount);
      onUpcomingOpen?.({ upcoming, reason, previousIndex: activeIndex, panelCount, isNarrow });
    },
    [panelCount, upcoming, activeIndex, isNarrow, onUpcomingOpen]
  );

  // Forward is the same path whoever asks (next(), →, the sliver).
  const goForward = useCallback(
    (reason) => {
      if (peekLive) openUpcoming(reason);
      else commitActiveIndex(activeIndex + 1, reason);
    },
    [peekLive, openUpcoming, commitActiveIndex, activeIndex]
  );

  // ---- Imperative API ----------------------------------------------------
  React.useImperativeHandle(
    ref,
    () => ({
      setActiveIndex: (index) => commitActiveIndex(index, 'method'),
      next: () => goForward('method'),
      prev: () => commitActiveIndex(activeIndex - 1, 'method'),
      setReveal: (value) => commitReveal(value, 'method'),
      expand: () => commitReveal(bounds.max, 'method'),
      collapse: () => commitReveal(bounds.min, 'method'),
      getState: () => ({ activeIndex, reveal: committedReveal, panelCount, isNarrow }),
    }),
    [commitActiveIndex, goForward, commitReveal, activeIndex, committedReveal, panelCount, isNarrow, bounds]
  );

  // ---- Grabber: a PARENT panel's nubbin adjusts reveal only — grow/shrink
  // how many parents are shown, never touching which panel is active. The
  // ACTIVE panel's own nubbin does double duty:
  //   - Dragging it LEFT is the same plain reveal-adjust as any parent's
  //     grabber. This is the only way back once the stack has been
  //     collapsed all the way down to just the active panel — every
  //     parent's own grabber goes non-interactive once its panel collapses
  //     to 0 width, so this one grabber has to stay able to reopen them.
  //   - Dragging it RIGHT *also* does the same reveal-adjust, for as long
  //     as there's more of the stack left to reveal (decided once at
  //     pointerdown — see onGrabberPointerDown's structuralMax check).
  //     Only once nothing is left to reveal does dragging right become a
  //     "swipe to close" gesture instead — it continuously shrinks while
  //     the panel behind grows to fill the space (see
  //     blendPanelDescriptors); past CLOSE_COMMIT_THRESHOLD, a fast flick,
  //     or a double-click, releasing commits it as a plain `prev()` — the
  //     closed panel doesn't come back on its own, only an explicit
  //     forward action (setActiveIndex/next, e.g. triggered from inside
  //     the new active panel) reopens it.
  //
  // Move/up are tracked on `window` (attached imperatively for the
  // gesture's duration) rather than relying only on JSX handlers + pointer
  // capture on the grabber itself — the nubbin's hitbox is small, and this
  // guarantees the drag keeps following the cursor even once it travels
  // outside those bounds. setPointerCapture is still attempted alongside
  // it (harmless, helps on some touch browsers), but nothing here depends
  // on it succeeding. --------------------------------------------------------
  const dragListenersRef = useRef(null);

  const endDragListeners = useCallback(() => {
    const l = dragListenersRef.current;
    if (!l) return;
    window.removeEventListener('pointermove', l.move);
    window.removeEventListener('pointerup', l.up);
    window.removeEventListener('pointercancel', l.up);
    dragListenersRef.current = null;
  }, []);

  // Belt-and-suspenders: drop any listeners left behind if the component
  // unmounts mid-drag.
  useEffect(() => endDragListeners, [endDragListeners]);

  const onGrabberPointerMove = useCallback(
    (e) => {
      const c = closeRef.current;
      if (c) {
        const dx = e.clientX - c.startX;
        if (dx > 0) {
          // Dragging right: closing. Continuous preview via blendPanelDescriptors.
          setDragReveal(null);
          setCloseDrag({ fromIndex: c.fromIndex, toIndex: c.toIndex, progress: Math.min(1, dx / c.panelWidth), containerWidth: c.containerWidth });
        } else {
          // Dragging left: the active panel's nubbin doubles as a plain
          // reveal-adjust grabber too (same as any parent's) — there's
          // nothing further right to reveal from here (it's already the
          // front), but collapsing the stack behind it should still work.
          if (isNarrow) {
            setCloseDrag(null);
            setDragReveal(null);
          } else {
            setCloseDrag(null);
            const deltaUnits = dx / Math.max(1, config.peek);
            setDragReveal(clampRevealExtended(c.startReveal + deltaUnits, config.snapPoints, Math.max(0, activeIndex)));
          }
        }
        return;
      }
      const g = grabRef.current;
      if (!g) return;
      // Dragging right pushes the active panel over, revealing more parents
      // — uncapped by the configured snapPoints, so this can walk all the
      // way back to panel 0 given enough drag distance. Clamp only, no
      // snapping, here — the live preview needs a continuous/fractional
      // value so the column grows/shrinks smoothly under the cursor
      // instead of jumping between discrete stops (snapping happens once,
      // on release, in onGrabberPointerUp).
      const deltaUnits = (e.clientX - g.startX) / Math.max(1, config.peek);
      setDragReveal(clampRevealExtended(g.startReveal + deltaUnits, config.snapPoints, Math.max(0, activeIndex)));
    },
    [config.peek, config.snapPoints, activeIndex, isNarrow]
  );

  const onGrabberPointerUp = useCallback(
    (e) => {
      endDragListeners();
      const c = closeRef.current;
      if (c) {
        closeRef.current = null;
        try {
          c.el.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* no-op */
        }
        const dx = e.clientX - c.startX;
        setIsRevealDragging(false);
        setCloseDrag(null);
        setDragReveal(null);
        if (dx > 0) {
          const elapsed = Math.max(
            1,
            (typeof performance !== 'undefined' ? performance.now() : Date.now()) - c.startTime
          );
          const progress = Math.min(1, dx / c.panelWidth);
          const isFlick = dx > FLICK_MIN_DISTANCE_PX && elapsed < FLICK_MAX_DURATION_MS && dx / elapsed > FLICK_VELOCITY_PX_MS;
          if (progress >= CLOSE_COMMIT_THRESHOLD || isFlick) {
            commitActiveIndex(c.toIndex, 'grabber');
          }
        } else if (!isNarrow) {
          const deltaUnits = dx / Math.max(1, config.peek);
          const next = resolveReveal(c.startReveal + deltaUnits, config.snapPoints, Math.max(0, activeIndex));
          commitReveal(next, 'grabber');
        }
        return;
      }

      const g = grabRef.current;
      if (!g) return;
      grabRef.current = null;
      try {
        g.el.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }
      const deltaUnits = (e.clientX - g.startX) / Math.max(1, config.peek);
      const next = resolveReveal(g.startReveal + deltaUnits, config.snapPoints, Math.max(0, activeIndex));
      setIsRevealDragging(false);
      setDragReveal(null);
      commitReveal(next, 'grabber');
    },
    [config.peek, config.snapPoints, activeIndex, isNarrow, commitActiveIndex, commitReveal, endDragListeners]
  );

  const onGrabberPointerDown = useCallback(
    (idx) => (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.stopPropagation();
      const grabberEl = e.currentTarget;

      if (idx === activeIndex) {
        if (activeIndex <= 0) return; // nothing behind it to close into
        // In narrow mode, parents are not multi-column reveals, so dragging the
        // active panel's grabber to the right is always a swipe-to-close gesture.
        // On desktop, dragging right adjusts reveal until fully expanded, then
        // switches to swipe-to-close.
        const structuralMax = bounds.min + Math.max(0, activeIndex);
        if (!isNarrow && committedReveal < structuralMax) {
          grabRef.current = { el: grabberEl, startX: e.clientX, startReveal: committedReveal };
          setDragReveal(committedReveal);
        } else {
          const panelEl = grabberEl.closest('.repanel__panel');
          const viewportEl = rootRef.current ? rootRef.current.querySelector('.repanel__viewport') : null;
          const panelWidth = panelEl ? panelEl.getBoundingClientRect().width : 1;
          const containerWidth = viewportEl ? viewportEl.getBoundingClientRect().width : panelWidth;
          closeRef.current = {
            el: grabberEl,
            startX: e.clientX,
            startTime: typeof performance !== 'undefined' ? performance.now() : Date.now(),
            panelWidth: Math.max(1, panelWidth),
            fromIndex: activeIndex,
            toIndex: activeIndex - 1,
            containerWidth,
            startReveal: committedReveal,
          };
          setCloseDrag({ fromIndex: activeIndex, toIndex: activeIndex - 1, progress: 0, containerWidth });
        }
      } else {
        grabRef.current = { el: grabberEl, startX: e.clientX, startReveal: committedReveal };
        setDragReveal(committedReveal);
      }
      setIsRevealDragging(true);

      try {
        grabberEl.setPointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }

      endDragListeners();
      const move = (ev) => onGrabberPointerMove(ev);
      const up = (ev) => onGrabberPointerUp(ev);
      dragListenersRef.current = { move, up };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    },
    [committedReveal, activeIndex, isNarrow, bounds.min, endDragListeners, onGrabberPointerMove, onGrabberPointerUp]
  );

  // Double-click a nubbin to instantly close as if fully swiped away —
  // desktop/mouse shortcut for the same gesture. On the active panel's own
  // nubbin this closes it (activeIndex - 1); on a parent's nubbin it jumps
  // straight to making that parent active (closing everything ahead of it).
  const onGrabberDoubleClick = useCallback(
    (idx) => (e) => {
      e.stopPropagation();
      const target = idx === activeIndex ? activeIndex - 1 : idx;
      if (target < 0 || target === activeIndex) return;
      commitActiveIndex(target, 'grabber');
    },
    [activeIndex, commitActiveIndex]
  );

  const onGrabberKeyDown = useCallback(
    (idx) => (e) => {
      // Enter / Space is the keyboard equal of the double-click: close the
      // active panel, or jump back to a parent.
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        const target = idx === activeIndex ? activeIndex - 1 : idx;
        if (target >= 0 && target !== activeIndex) commitActiveIndex(target, 'grabber');
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        commitReveal(stepSnap(committedReveal, config.snapPoints, +1), 'method');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        commitReveal(stepSnap(committedReveal, config.snapPoints, -1), 'method');
      }
    },
    [committedReveal, config.snapPoints, commitReveal, activeIndex, commitActiveIndex]
  );

  // ---- Root keyboard navigation (panels) ---------------------------------
  const onRootKeyDown = useCallback(
    (e) => {
      // Ignore keys typed inside panel content or handled by a grabber.
      if (e.target.closest('.repanel__surface') || e.target.closest('.repanel__grabber')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goForward('method');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        commitActiveIndex(activeIndex - 1, 'method');
      }
    },
    [activeIndex, commitActiveIndex, goForward]
  );

  // ---- Render ------------------------------------------------------------
  // The right sliver(s): the live prediction, and any replaced one on its
  // way out. Each is the panel's real width (what it will have once open),
  // set so far right that only `peekPx` of it shows, cropped by the root.
  const peekShells = [];
  if (peekLive || leaving.length) {
    const open = getPanelDescriptor({
      index: panelCount,
      activeIndex: panelCount,
      panelCount: panelCount + 1,
      reveal: committedReveal,
      config,
      isNarrow,
      narrowBehavior,
      pastPx,
    });
    const entries = leaving.filter((l) => l.key !== peekKey).map((l) => ({ ...l, gone: true }));
    if (peekLive) entries.push({ key: peekKey, element: upcoming });
    entries.forEach(({ key, element, gone }) => {
      const name = peekPanelName(element);
      const clue = typeof element.props.hint === 'string' || typeof element.props.hint === 'number' ? element.props.hint : null;
      const label = `${name ? `Open ${name}` : 'Open next panel'}${clue != null && clue !== '' ? `, ${clue}` : ''}`;
      const content =
        element.type === Repanel ? React.cloneElement(element, { key, peeking: true, handle: true }) : React.cloneElement(element, { key });
      peekShells.push(
        <div
          key={key}
          className="repanel__panel"
          data-role="peek"
          data-leaving={gone ? 'true' : undefined}
          style={{
            left: `calc(100% - ${peekPx}px)`,
            width: open.width,
            opacity: 1,
            zIndex: panelCount + 30,
            pointerEvents: gone ? 'none' : 'auto',
          }}
          aria-hidden={gone ? true : undefined}
        >
          <div className="repanel__surface" ref={(el) => { if (el) el.inert = true; }}>{content}</div>
          {!gone && <PeekSliver side="future" label={label} onActivate={openUpcoming} />}
        </div>
      );
    });
  }

  return (
    <div
      ref={rootRef}
      className={`repanel ${className}`.trim()}
      data-animate={animate ? 'true' : 'false'}
      data-narrow={isNarrow ? 'true' : undefined}
      data-narrow-behavior={isNarrow ? narrowBehavior : undefined}
      data-dragging={isRevealDragging ? 'true' : undefined}
      data-first-child-visible={isFirstChildVisible ? 'true' : 'false'}
      data-width-class={widthClass}
      data-peek={peekLive ? 'true' : undefined}
      role="group"
      aria-roledescription="stacked panels"
      onKeyDown={onRootKeyDown}
      {...rest}
      // How far each parent column runs beneath the next one; the
      // stylesheet pads parent Repanels by this much so their content
      // isn't hidden there.
      // --repanel-column is a parent's full width (peek plus that overlap),
      // which its surface keeps while only a sliver of it shows.
      style={{
        '--repanel-overlap': `${getOverlapPx(config)}px`,
        '--repanel-column': `${config.peek + getOverlapPx(config)}px`,
        '--repanel-peek-px': `${peekPx}px`,
        ...rootStyle,
      }}
    >
      <div className="repanel__viewport">
        {[...panels.map((child, idx) => {
          let d;
          let isActive;
          if (closeDrag) {
            d = getClosePreviewDescriptor({
              index: idx,
              fromIndex: closeDrag.fromIndex,
              toIndex: closeDrag.toIndex,
              progress: closeDrag.progress,
              containerWidth: closeDrag.containerWidth,
              panelCount,
              reveal: committedReveal,
              config,
              isNarrow,
              narrowBehavior,
              pastPx,
            });
            isActive = closeDrag.progress < 0.5 ? idx === closeDrag.fromIndex : idx === closeDrag.toIndex;
          } else {
            d = getPanelDescriptor({ index: idx, activeIndex, panelCount, reveal, config, isNarrow, narrowBehavior, pastPx });
            isActive = idx === activeIndex;
          }
          const noTransition = isRevealDragging || !!closeDrag;

          const style = {
            left: typeof d.left === 'number' ? `${d.left}px` : d.left,
            width: typeof d.width === 'number' ? `${d.width}px` : d.width,
            opacity: d.opacity,
            zIndex: d.zIndex,
            pointerEvents: d.interactive ? 'auto' : 'none',
          };

          // The right peek sits beside the front panel, not over it: the
          // front panel is laid out up to the peek's left edge.
          if (peekLive && !closeDrag && d.role === 'active') {
            style.width = `calc(${typeof d.width === 'number' ? `${d.width}px` : d.width} - ${peekPx}px)`;
          }

          // The wholly first child (array index 0, the base of the stack —
          // nothing behind it to reveal) never gets a nubbin grabber. This
          // is fixed to the child's position in the `children` array, not
          // whatever is currently visible/active/narrow-collapsed.
          const isFirstChild = idx === 0;
          const showGrabber = !isFirstChild && grabber;
          // The nubbin is visual and lives on the panel itself (see
          // Repanel.jsx / MochiPanel.scss) — only a Repanel child knows how
          // to render it, so it's only cloned onto those, and never onto
          // the first child.
          // The nearest parent, collapsed: the left sliver, a button back to it.
          // Its Repanel shows only its surface, scallop and Header (`door`).
          const isPast = !closeDrag && d.role === 'past';
          const doorProps = isPast && child.type === Repanel ? { door: true } : null;
          const content =
            showGrabber && child.type === Repanel
              ? React.cloneElement(child, { handle: true, ...doorProps })
              : doorProps
                ? React.cloneElement(child, doorProps)
                : child;
          const pastName = isPast ? peekPanelName(child) : null;

          return (
            <div
              key={child.key != null ? child.key : idx}
              className="repanel__panel"
              data-role={d.role}
              data-active={isActive ? 'true' : undefined}
              data-first-child={isFirstChild ? 'true' : undefined}
              data-no-transition={noTransition ? 'true' : undefined}
              style={style}
              aria-hidden={!d.visible && !isActive ? true : undefined}
            >
              <div className="repanel__surface" ref={(el) => { if (el) el.inert = isPast; }}>{content}</div>

              {showGrabber && (
                <div
                  className="repanel__grabber"
                  role="slider"
                  aria-label={idx === activeIndex ? 'Close panel' : 'Show more panels'}
                  aria-orientation="horizontal"
                  aria-valuemin={bounds.min}
                  aria-valuemax={bounds.max}
                  aria-valuenow={committedReveal}
                  tabIndex={0}
                  onPointerDown={onGrabberPointerDown(idx)}
                  onKeyDown={onGrabberKeyDown(idx)}
                  onDoubleClick={onGrabberDoubleClick(idx)}
                  // No tap-to-close: the grabber holds pointer capture, so
                  // the browser fires `click` after every drag (including a
                  // below-threshold swipe that should spring back) and after
                  // each half of a double-click. Closing is swipe or
                  // double-click only, in narrow mode as on desktop.
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {isPast && (
                <PeekSliver
                  side="past"
                  label={`Back to ${pastName || 'previous panel'}`}
                  onActivate={() => commitActiveIndex(activeIndex - 1, 'peek')}
                />
              )}
            </div>
          );
        }), ...peekShells]}
      </div>
    </div>
  );
});

RepanelStack.displayName = 'RepanelStack';

// Public aliases — same component under Mochi-legacy names.
const MochiStackedPanels = RepanelStack;
const StackedMochiPanels = RepanelStack;

export { RepanelStack, MochiStackedPanels, StackedMochiPanels };
