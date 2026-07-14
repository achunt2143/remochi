import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import './StackedMochiPanels.scss';
import { Repanel } from './Repanel';
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
  blendPanelDescriptors,
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
    narrowFitWidth = 768,
    narrowBehavior = 'single',
    className = '',
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
  const [isNarrow, setIsNarrow] = useState(false);
  const [isRevealDragging, setIsRevealDragging] = useState(false);

  const rootRef = useRef(null);
  const grabRef = useRef(null);
  const closeRef = useRef(null);

  // ---- Narrow detection (observe the root width) -------------------------
  useEffect(() => {
    if (!narrowFit) {
      setIsNarrow(false);
      return undefined;
    }
    const el = rootRef.current;
    if (!el) return undefined;

    const check = () => setIsNarrow(el.getBoundingClientRect().width <= narrowFitWidth);
    check();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(check);
      ro.observe(el);
      return () => ro.disconnect();
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
    return undefined;
  }, [narrowFit, narrowFitWidth]);

  // ---- Whether the wholly first child is among the currently-visible -----
  // panels. It never carries a nubbin (see the map loop below), so when
  // it's the leftmost visible panel there's nothing to reserve room for and
  // the viewport can sit flush — see .repanel__viewport's
  // data-first-child-visible rule. While narrow, no nubbins render at all
  // (showGrabber below is unconditionally false), so there's likewise
  // nothing to reserve room for.
  const isFirstChildVisible = useMemo(() => {
    if (isNarrow || panelCount === 0) return true;
    // Mid-close-drag, use whichever endpoint (before/after the close) the
    // gesture is currently closer to, so the inset doesn't jump ahead of
    // the visual blend.
    const forActiveIndex = closeDrag ? (closeDrag.progress < 0.5 ? closeDrag.fromIndex : closeDrag.toIndex) : activeIndex;
    return getPanelDescriptor({
      index: 0,
      activeIndex: forActiveIndex,
      panelCount,
      reveal,
      config,
      isNarrow,
      narrowBehavior,
    }).visible;
  }, [isNarrow, panelCount, activeIndex, closeDrag, reveal, config, narrowBehavior]);

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

  // ---- Imperative API ----------------------------------------------------
  React.useImperativeHandle(
    ref,
    () => ({
      setActiveIndex: (index) => commitActiveIndex(index, 'method'),
      next: () => commitActiveIndex(activeIndex + 1, 'method'),
      prev: () => commitActiveIndex(activeIndex - 1, 'method'),
      setReveal: (value) => commitReveal(value, 'method'),
      expand: () => commitReveal(bounds.max, 'method'),
      collapse: () => commitReveal(bounds.min, 'method'),
      getState: () => ({ activeIndex, reveal: committedReveal, panelCount, isNarrow }),
    }),
    [commitActiveIndex, commitReveal, activeIndex, committedReveal, panelCount, isNarrow, bounds]
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
          setCloseDrag(null);
          const deltaUnits = dx / Math.max(1, config.peek);
          setDragReveal(clampRevealExtended(c.startReveal + deltaUnits, config.snapPoints, Math.max(0, activeIndex)));
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
    [config.peek, config.snapPoints, activeIndex]
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
        } else {
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
    [config.peek, config.snapPoints, activeIndex, commitActiveIndex, commitReveal, endDragListeners]
  );

  const onGrabberPointerDown = useCallback(
    (idx) => (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.stopPropagation();
      const grabberEl = e.currentTarget;

      if (idx === activeIndex) {
        if (activeIndex <= 0) return; // nothing behind it to close into
        // If there's still more of the stack to reveal (e.g. it was
        // previously collapsed all the way to just this panel), the
        // active grabber behaves exactly like a parent's — plain
        // bidirectional reveal-adjust — so there's always a way back to a
        // fully-collapsed panel's parents, even though every parent's own
        // grabber became non-interactive once it collapsed to 0 width.
        // Only once nothing is left to reveal does dragging right switch
        // to the swipe-to-close gesture.
        const structuralMax = bounds.min + Math.max(0, activeIndex);
        if (committedReveal < structuralMax) {
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
    [committedReveal, activeIndex, bounds.min, endDragListeners, onGrabberPointerMove, onGrabberPointerUp]
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
    (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        commitReveal(stepSnap(committedReveal, config.snapPoints, +1), 'method');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        commitReveal(stepSnap(committedReveal, config.snapPoints, -1), 'method');
      }
    },
    [committedReveal, config.snapPoints, commitReveal]
  );

  // ---- Root keyboard navigation (panels) ---------------------------------
  const onRootKeyDown = useCallback(
    (e) => {
      // Ignore keys typed inside panel content or handled by a grabber.
      if (e.target.closest('.repanel__surface') || e.target.closest('.repanel__grabber')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        commitActiveIndex(activeIndex + 1, 'method');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        commitActiveIndex(activeIndex - 1, 'method');
      }
    },
    [activeIndex, commitActiveIndex]
  );

  // ---- Render ------------------------------------------------------------
  return (
    <div
      ref={rootRef}
      className={`repanel ${className}`.trim()}
      data-animate={animate ? 'true' : 'false'}
      data-narrow={isNarrow ? 'true' : undefined}
      data-narrow-behavior={isNarrow ? narrowBehavior : undefined}
      data-dragging={isRevealDragging ? 'true' : undefined}
      data-first-child-visible={isFirstChildVisible ? 'true' : 'false'}
      role="group"
      aria-roledescription="stacked panels"
      onKeyDown={onRootKeyDown}
      {...rest}
    >
      <div className="repanel__viewport">
        {panels.map((child, idx) => {
          let d;
          let isActive;
          if (closeDrag) {
            const dFrom = getPanelDescriptor({
              index: idx,
              activeIndex: closeDrag.fromIndex,
              panelCount,
              reveal: committedReveal,
              config,
              isNarrow,
              narrowBehavior,
            });
            const dTo = getPanelDescriptor({
              index: idx,
              activeIndex: closeDrag.toIndex,
              panelCount,
              reveal: committedReveal,
              config,
              isNarrow,
              narrowBehavior,
            });
            d = blendPanelDescriptors(dFrom, dTo, closeDrag.progress, closeDrag.containerWidth);
            isActive = closeDrag.progress < 0.5 ? idx === closeDrag.fromIndex : idx === closeDrag.toIndex;
          } else {
            d = getPanelDescriptor({ index: idx, activeIndex, panelCount, reveal, config, isNarrow, narrowBehavior });
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

          // The wholly first child (array index 0, the base of the stack —
          // nothing behind it to reveal) never gets a nubbin grabber. This
          // is fixed to the child's position in the `children` array, not
          // whatever is currently visible/active/narrow-collapsed.
          const isFirstChild = idx === 0;
          const showGrabber = !isFirstChild && grabber && !isNarrow;
          // The nubbin is visual and lives on the panel itself (see
          // Repanel.jsx / MochiPanel.scss) — only a Repanel child knows how
          // to render it, so it's only cloned onto those, and never onto
          // the first child.
          const content =
            showGrabber && child.type === Repanel ? React.cloneElement(child, { handle: true }) : child;

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
              <div className="repanel__surface">{content}</div>

              {showGrabber && (
                <div
                  className="repanel__grabber"
                  role="slider"
                  aria-label={idx === activeIndex ? 'Reveal depth or close panel' : 'Reveal depth'}
                  aria-orientation="horizontal"
                  aria-valuemin={bounds.min}
                  aria-valuemax={bounds.max}
                  aria-valuenow={committedReveal}
                  tabIndex={0}
                  onPointerDown={onGrabberPointerDown(idx)}
                  onKeyDown={onGrabberKeyDown}
                  onDoubleClick={onGrabberDoubleClick(idx)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

RepanelStack.displayName = 'RepanelStack';

// Public aliases — same component under Mochi-legacy names.
const MochiStackedPanels = RepanelStack;
const StackedMochiPanels = RepanelStack;

export { RepanelStack, MochiStackedPanels, StackedMochiPanels };
