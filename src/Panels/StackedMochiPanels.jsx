import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import './StackedMochiPanels.scss';
import {
  DEFAULT_SNAP_POINTS,
  DEFAULT_MAX_VISIBLE_PANELS,
  DEFAULT_PEEK,
  DEFAULT_OVERLAP,
  resolveLayoutConfig,
  revealBounds,
  clampReveal,
  snapReveal,
  stepSnap,
  clampIndex,
  getPanelDescriptor,
} from './stackedPanelsLayout';

/**
 * Repanel — a webOS/Mochi stacked panel workspace.
 *
 * Renders dynamic child panels as an overlapping stack. The active (front)
 * panel is prominent; earlier panels fan out to the left as overlapping
 * spines. A header-only horizontal swipe changes which panel is at the front,
 * and a bottom grabber on the active panel drags the reveal depth, snapping to
 * fixed `snapPoints` (default 1, 2, 3) on release.
 *
 * `Panel` and `FloatingPanel` remain plain presentational surfaces — this
 * wrapper owns all layout, gestures and stacking. Children are read
 * dynamically via `React.Children.toArray`, so there is no fixed panel count.
 */

const SWIPE_DISTANCE = 60; // px — header swipe distance threshold
const SWIPE_VELOCITY = 0.4; // px/ms — header swipe velocity threshold
const GESTURE_SLOP = 6; // px — movement before a header gesture is claimed

const Repanel = React.forwardRef(function Repanel(props, ref) {
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
    headerSwipe = true,
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
    snapReveal(
      defaultReveal != null ? defaultReveal : Math.min(config.maxVisiblePanels, bounds.max),
      config.snapPoints
    )
  );
  const committedReveal = snapReveal(isRevealControlled ? revealProp : revealState, config.snapPoints);

  // Continuous reveal while dragging the grabber; overrides the committed value.
  const [dragReveal, setDragReveal] = useState(null);
  const reveal = dragReveal != null ? dragReveal : committedReveal;

  // ---- Transient gesture state -------------------------------------------
  const [isNarrow, setIsNarrow] = useState(false);
  const [swipeDX, setSwipeDX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isRevealDragging, setIsRevealDragging] = useState(false);

  const rootRef = useRef(null);
  const swipeRef = useRef(null);
  const grabRef = useRef(null);

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
      const snapped = snapReveal(value, config.snapPoints);
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
    [committedReveal, config.snapPoints, isRevealControlled, isNarrow, onRevealChange]
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

  // ---- Header swipe (active panel only) ----------------------------------
  const onHeaderPointerDown = useCallback(
    (idx) => (e) => {
      // Parent spines are selected by click; only the active header swipes.
      if (!headerSwipe || idx !== activeIndex) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      swipeRef.current = {
        idx,
        startX: e.clientX,
        startY: e.clientY,
        startTime: e.timeStamp || Date.now(),
        active: false,
      };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {
        /* pointer capture unsupported — window listeners not needed here */
      }
    },
    [headerSwipe, activeIndex]
  );

  const onHeaderPointerMove = useCallback(
    (idx) => (e) => {
      const s = swipeRef.current;
      if (!s || s.idx !== idx) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (!s.active) {
        if (Math.abs(dx) < GESTURE_SLOP && Math.abs(dy) < GESTURE_SLOP) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          s.active = true;
          setIsSwiping(true);
        } else {
          // Vertical intent — bail out, let the surface scroll.
          swipeRef.current = null;
          return;
        }
      }
      setSwipeDX(dx);
    },
    []
  );

  const onHeaderPointerUp = useCallback(
    (idx) => (e) => {
      const s = swipeRef.current;
      if (!s || s.idx !== idx) return;
      swipeRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }
      if (!s.active) return;

      const dx = e.clientX - s.startX;
      const dt = Math.max(1, (e.timeStamp || Date.now()) - s.startTime);
      const velocity = dx / dt;
      setIsSwiping(false);
      setSwipeDX(0);

      if (dx <= -SWIPE_DISTANCE || velocity <= -SWIPE_VELOCITY) {
        commitActiveIndex(activeIndex + 1, 'swipe');
      } else if (dx >= SWIPE_DISTANCE || velocity >= SWIPE_VELOCITY) {
        commitActiveIndex(activeIndex - 1, 'swipe');
      }
    },
    [activeIndex, commitActiveIndex]
  );

  // ---- Grabber reveal drag (active panel) --------------------------------
  const onGrabberPointerDown = useCallback(
    (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.stopPropagation();
      grabRef.current = { startX: e.clientX, startReveal: committedReveal };
      setIsRevealDragging(true);
      setDragReveal(committedReveal);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }
    },
    [committedReveal]
  );

  const onGrabberPointerMove = useCallback(
    (e) => {
      const g = grabRef.current;
      if (!g) return;
      // Dragging right pushes the active panel over, revealing more parents.
      const raw = g.startReveal + (e.clientX - g.startX) / Math.max(1, config.peek);
      setDragReveal(clampReveal(raw, config.snapPoints));
    },
    [config.peek, config.snapPoints]
  );

  const onGrabberPointerUp = useCallback(
    (e) => {
      const g = grabRef.current;
      if (!g) return;
      grabRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* no-op */
      }
      const raw = g.startReveal + (e.clientX - g.startX) / Math.max(1, config.peek);
      setIsRevealDragging(false);
      setDragReveal(null);
      commitReveal(raw, 'grabber');
    },
    [config.peek, config.snapPoints, commitReveal]
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
      // Ignore keys typed inside panel content or handled by the grabber.
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
      data-dragging={isSwiping || isRevealDragging ? 'true' : undefined}
      role="group"
      aria-roledescription="stacked panels"
      onKeyDown={onRootKeyDown}
      {...rest}
    >
      <div className="repanel__viewport">
        {panels.map((child, idx) => {
          const d = getPanelDescriptor({
            index: idx,
            activeIndex,
            panelCount,
            reveal,
            config,
            isNarrow,
            narrowBehavior,
          });
          const isActive = idx === activeIndex;
          const extraX = isActive && isSwiping ? swipeDX : 0;
          const noTransition = (isActive && isSwiping) || isRevealDragging;

          const style = {
            left: typeof d.left === 'number' ? `${d.left}px` : d.left,
            width: d.width,
            transform: `translate3d(${d.translateX + extraX}px, 0, 0) scale(${d.scale})`,
            opacity: d.opacity,
            zIndex: d.zIndex,
            pointerEvents: d.interactive ? 'auto' : 'none',
            '--repanel-dim': d.dim,
          };

          const showGrabber = isActive && grabber && !isNarrow && panelCount > 0;

          return (
            <div
              key={child.key != null ? child.key : idx}
              className="repanel__panel"
              data-role={d.role}
              data-active={isActive ? 'true' : undefined}
              data-no-transition={noTransition ? 'true' : undefined}
              style={style}
              aria-hidden={!d.visible && !isActive ? true : undefined}
              onClick={!isActive && d.interactive ? () => commitActiveIndex(idx, 'select') : undefined}
            >
              <div className="repanel__surface">{child}</div>

              <div className="repanel__scrim" aria-hidden="true" />

              <div
                className="repanel__header"
                onPointerDown={onHeaderPointerDown(idx)}
                onPointerMove={onHeaderPointerMove(idx)}
                onPointerUp={onHeaderPointerUp(idx)}
                onPointerCancel={onHeaderPointerUp(idx)}
                role={isActive ? undefined : 'button'}
                aria-label={isActive ? undefined : `Bring panel ${idx + 1} forward`}
              >
                <span className="repanel__grip" aria-hidden="true" />
              </div>

              {showGrabber && (
                <div
                  className="repanel__grabber"
                  role="slider"
                  aria-label="Reveal depth"
                  aria-orientation="horizontal"
                  aria-valuemin={bounds.min}
                  aria-valuemax={bounds.max}
                  aria-valuenow={committedReveal}
                  tabIndex={0}
                  onPointerDown={onGrabberPointerDown}
                  onPointerMove={onGrabberPointerMove}
                  onPointerUp={onGrabberPointerUp}
                  onPointerCancel={onGrabberPointerUp}
                  onKeyDown={onGrabberKeyDown}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="repanel__grabber-bar" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

Repanel.displayName = 'Repanel';

// Public aliases — same component under the Mochi / legacy-friendly names.
const MochiStackedPanels = Repanel;
const StackedMochiPanels = Repanel;

export { Repanel, MochiStackedPanels, StackedMochiPanels };
