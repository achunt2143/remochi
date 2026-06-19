import React, { useState, useRef, useCallback, useEffect } from 'react';
import './StackedMochiPanels.scss';

/**
 * StackedMochiPanels - Enyo-inspired panel management with enhanced controls
 * 
 * Features:
 * - Navigation buttons (left/right) on active panel
 * - Expand button with single-click and long-press support
 * - Touch gestures (swipe left/right)
 * - Fullscreen mode (long-press expand)
 * - Drag-to-navigate with momentum
 * - Responsive narrow-fit behavior
 */

const StackedMochiPanels = React.forwardRef(
  (
    {
      children,
      index = 0,
      onIndexChange,
      animate = true,
      draggable = true,
      narrowFit = true,
      narrowFitWidth = 800,
      wrap = false,
      arrangement = 'mostly',
      onTransitionStart,
      onTransitionFinish,
      className = '',
      showControls = true,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = useState(index);
    const [isNarrow, setIsNarrow] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [expandState, setExpandState] = useState('collapsed');

    const rootRef = useRef(null);
    const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
    const velocityRef = useRef(0);
    const expandButtonRef = useRef(null);
    const longPressTimeoutRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

    const panelCount = React.Children.count(children);

    // ========================================
    // Responsive Behavior
    // ========================================

    useEffect(() => {
      const checkNarrow = () => {
        if (!narrowFit) return;
        const isNarrowNow = window.innerWidth <= narrowFitWidth;
        setIsNarrow(isNarrowNow);
      };

      checkNarrow();
      window.addEventListener('resize', checkNarrow);
      return () => window.removeEventListener('resize', checkNarrow);
    }, [narrowFit, narrowFitWidth]);

    // ========================================
    // Core Navigation
    // ========================================

    const setIndex = useCallback(
      (newIndex) => {
        let validIndex = newIndex;
        if (wrap) {
          validIndex = ((newIndex % panelCount) + panelCount) % panelCount;
        } else {
          validIndex = Math.max(0, Math.min(newIndex, panelCount - 1));
        }

        if (validIndex === activeIndex) return;

        onTransitionStart?.({
          from: activeIndex,
          to: validIndex,
          isNarrow,
        });

        setIsTransitioning(true);
        setActiveIndex(validIndex);
        onIndexChange?.(validIndex);

        const duration = animate ? 250 : 0;
        setTimeout(() => {
          setIsTransitioning(false);
          onTransitionFinish?.({
            from: activeIndex,
            to: validIndex,
            isNarrow,
          });
        }, duration);
      },
      [activeIndex, panelCount, animate, wrap, onTransitionStart, onTransitionFinish, isNarrow]
    );

    // ========================================
    // Expand/Fullscreen Controls
    // ========================================

    const toggleExpand = useCallback(() => {
      setExpandState((prev) => {
        if (prev === 'collapsed') {
          return 'expanded';
        } else if (prev === 'expanded') {
          return 'collapsed';
        }
        return prev;
      });
      setIsFullscreen(false);
    }, []);

    const handleExpandMouseDown = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();

      longPressTimeoutRef.current = setTimeout(() => {
        setExpandState('fullscreen');
        setIsFullscreen(true);
      }, 500);
    }, []);

    const handleExpandMouseUp = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();

      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
        toggleExpand();
      }
    }, [toggleExpand]);

    const handleExpandMouseLeave = useCallback((e) => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }, []);

    // NEW: Exit fullscreen properly
    const exitFullscreen = useCallback(() => {
      setIsFullscreen(false);
      setExpandState('expanded');
    }, []);

    // ========================================
    // Touch gesture detection
    // ========================================

    const handleTouchStart = useCallback((e) => {
      // Only detect if not on a button
      if (e.target.closest('button')) return;

      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }, []);

    const handleTouchEnd = useCallback((e) => {
      if (!touchStartRef.current.x) return;

      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      const dt = (Date.now() - touchStartRef.current.time) / 1000;

      // Only detect horizontal swipes (not vertical)
      if (Math.abs(dy) > Math.abs(dx)) {
        touchStartRef.current = { x: 0, y: 0, time: 0 };
        return;
      }

      const threshold = window.innerWidth * 0.2;
      const minVelocity = 500;
      const velocity = dt > 0 ? dx / dt : 0;

      if (Math.abs(velocity) > minVelocity || Math.abs(dx) > threshold) {
        if (velocity > 0) {
          setIndex(activeIndex - 1);
        } else {
          setIndex(activeIndex + 1);
        }
      }

      touchStartRef.current = { x: 0, y: 0, time: 0 };
    }, [activeIndex, setIndex]);

    // ========================================
    // Drag Navigation (mouse-based)
    // ========================================

    const handleMouseDown = useCallback(
      (e) => {
        // Don't drag on buttons or in fullscreen
        if (e.target.closest('button') || isFullscreen) return;
        if (!draggable || isTransitioning) return;

        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          time: Date.now(),
        };
        setIsDragging(true);
      },
      [draggable, isTransitioning, isFullscreen]
    );

    const handleMouseMove = useCallback(
      (e) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStartRef.current.x;
        const dt = (Date.now() - dragStartRef.current.time) / 1000;

        velocityRef.current = dt > 0 ? dx / dt : 0;
        setDragOffset(dx);
      },
      [isDragging]
    );

    const handleMouseUp = useCallback(() => {
      if (!isDragging) return;

      setIsDragging(false);

      const threshold = window.innerWidth * 0.2;
      const minVelocity = 500;

      let nextIndex = activeIndex;

      if (Math.abs(velocityRef.current) > minVelocity) {
        nextIndex = velocityRef.current > 0 ? activeIndex - 1 : activeIndex + 1;
      } else if (Math.abs(dragOffset) > threshold) {
        nextIndex = dragOffset > 0 ? activeIndex - 1 : activeIndex + 1;
      }

      setDragOffset(0);
      velocityRef.current = 0;

      if (nextIndex !== activeIndex) {
        setIndex(nextIndex);
      }
    }, [isDragging, activeIndex, dragOffset, setIndex]);

    // ========================================
    // Keyboard Navigation
    // ========================================

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (isTransitioning) return;

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            setIndex(activeIndex - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            setIndex(activeIndex + 1);
            break;
          case 'Home':
            e.preventDefault();
            setIndex(0);
            break;
          case 'End':
            e.preventDefault();
            setIndex(panelCount - 1);
            break;
          case 'Escape':
            if (isFullscreen) {
              e.preventDefault();
              exitFullscreen();
            }
            break;
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, isTransitioning, setIndex, panelCount, isFullscreen, exitFullscreen]);

    // ========================================
    // Expose methods via ref
    // ========================================

    React.useImperativeHandle(ref, () => ({
      setIndex,
      getIndex: () => activeIndex,
      getIsNarrow: () => isNarrow,
      toggleExpand,
      setFullscreen: (fullscreen) => {
        if (fullscreen) {
          setIsFullscreen(true);
          setExpandState('fullscreen');
        } else {
          exitFullscreen();
        }
      },
      next: () => setIndex(activeIndex + 1),
      prev: () => setIndex(activeIndex - 1),
    }));

    // ========================================
    // Calculate panel positions
    // ========================================

    const getPanelStyle = (panelIndex) => {
      const isActive = panelIndex === activeIndex;

      let width = '100%';
      let left = '0%';
      let opacity = 1;
      let zIndex = panelIndex;

      if (isFullscreen) {
        // FULLSCREEN MODE: Active panel only
        width = isActive ? '100%' : '100%';
        left = '0%';
        opacity = isActive ? 1 : 0;
        zIndex = isActive ? 10 : 0;
        // FIX: No backdrop blur in fullscreen
      } else if (isNarrow) {
        // NARROW MODE: Full-width stack
        width = '100%';
        left = '0%';
        opacity = isActive ? 1 : 0;
        zIndex = isActive ? 10 : 0;
      } else if (expandState === 'expanded') {
        // EXPANDED MODE: 70% dominant + peeking
        if (isActive) {
          width = '80%';
          left = '10%';
          opacity = 1;
          zIndex = panelCount + 1;
        } else if (panelIndex < activeIndex) {
          // FIX: Previous panels should be left, not behind
          // Calculate offset: each panel shifts 15% to the left
          const offset = activeIndex - panelIndex;
          const leftPos = 10 - (offset * 15);
          width = '80%';
          left = `${leftPos}%`;
          opacity = 0.5;
          zIndex = panelCount - offset;
        } else {
          // FIX: Next panels should be right, not behind
          const offset = panelIndex - activeIndex;
          const rightPos = 85 + (offset * 6);
          width = '15%';
          left = `${rightPos}%`;
          opacity = 0.4;
          zIndex = panelCount - offset;
        }
      } else {
        // COLLAPSED MODE: All minimal preview
        width = `${100 / panelCount}%`;
        left = `${(panelIndex * 100) / panelCount}%`;
        opacity = 1;
        zIndex = panelIndex;
      }

      return {
        width,
        left,
        opacity,
        zIndex,
        transform: isDragging && panelIndex === activeIndex ? `translateX(${dragOffset}px)` : undefined,
        transition: isTransitioning ? `all 250ms cubic-bezier(0.16, 1, 0.3, 1)` : undefined,
        position: 'absolute',
        top: '0',
        bottom: '0',
        height: '100%',
      };
    };

    // ========================================
    // Render
    // ========================================

    return (
      <div
        ref={rootRef}
        className={`mochi-panels-root ${className}`}
        data-narrow={isNarrow}
        data-expand-state={expandState}
        data-fullscreen={isFullscreen}
        data-dragging={isDragging}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Panel Grid */}
        {React.Children.map(children, (child, idx) => (
          <div
            key={idx}
            className={`mochi-panel-wrapper ${idx === activeIndex ? 'mochi-panel--active' : ''} ${
              isDragging && idx === activeIndex ? 'mochi-panel--dragging' : ''
            }`}
            style={getPanelStyle(idx)}
            onClick={() => !isDragging && setIndex(idx)}
            role="tabpanel"
            aria-label={`Panel ${idx + 1}`}
            tabIndex={idx === activeIndex ? 0 : -1}
          >
            <div className="mochi-panel">
              <div className="mochi-panel-content">{child}</div>

              {/* FIX: Controls only on active panel */}
              {idx === activeIndex && showControls && !isFullscreen && (
                <div className="mochi-panel-controls">
                  {/* Left Navigation Button */}
                  <button
                    className="mochi-btn mochi-btn-nav mochi-btn-prev"
                    onClick={() => setIndex(activeIndex - 1)}
                    disabled={!wrap && activeIndex === 0}
                    aria-label="Previous panel"
                    title="Previous (← arrow key)"
                  >
                    <span className="mochi-btn-icon">‹</span>
                  </button>

                  {/* Expand/Collapse/Fullscreen Button */}
                  <button
                    ref={expandButtonRef}
                    className={`mochi-btn mochi-btn-expand ${expandState}`}
                    onMouseDown={handleExpandMouseDown}
                    onMouseUp={handleExpandMouseUp}
                    onMouseLeave={handleExpandMouseLeave}
                    aria-label={
                      expandState === 'fullscreen'
                        ? 'Exit fullscreen'
                        : expandState === 'expanded'
                          ? 'Collapse'
                          : 'Expand (long press for fullscreen)'
                    }
                    title="Click: Expand/Collapse | Long press: Fullscreen"
                  >
                    <span className="mochi-btn-icon">
                      {expandState === 'fullscreen' ? '⊡' : expandState === 'expanded' ? '⊟' : '⊞'}
                    </span>
                  </button>

                  {/* Right Navigation Button */}
                  <button
                    className="mochi-btn mochi-btn-nav mochi-btn-next"
                    onClick={() => setIndex(activeIndex + 1)}
                    disabled={!wrap && activeIndex === panelCount - 1}
                    aria-label="Next panel"
                    title="Next (→ arrow key)"
                  >
                    <span className="mochi-btn-icon">›</span>
                  </button>
                </div>
              )}

              {isDragging && idx === activeIndex && <div className="mochi-drag-hint">Drag to navigate</div>}
            </div>
          </div>
        ))}

        {/* FIX: Fullscreen Overlay with Close Button - prevent blur, pointer-events */}
        {isFullscreen && (
          <div className="mochi-fullscreen-overlay" onClick={exitFullscreen}>
            <button
              className="mochi-btn mochi-btn-close"
              onClick={(e) => {
                e.stopPropagation();
                exitFullscreen();
              }}
              aria-label="Close fullscreen"
              title="Press ESC to exit"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }
);

StackedMochiPanels.displayName = 'StackedMochiPanels';

const StackedMochiPanel = ({ children, ...props }) => <div {...props}>{children}</div>;
StackedMochiPanel.displayName = 'StackedMochiPanel';

export { StackedMochiPanels, StackedMochiPanel };