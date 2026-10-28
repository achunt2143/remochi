import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import BubbleCanvas from "./BubbleCanvas";

const trackHeight = "5px";
const thumbDefault = 28;
const thumbPressed = 40;

const BUBBLE_W = 62;
const BUBBLE_H = 37;

// webOS TouchPad tap targets are 54px square (HIG, "Laying Out Content
// and Controls"); the track and knob get invisible hit areas that size.
const TAP_TARGET = 54;

// Mochi's slider knob/fill color (Slider.less: #69cdff).
const ACCENT = "var(--mochi-accent, #69cdff)";
const ACCENT_SOFT = "var(--mochi-accent-soft, rgba(105,205,255,0.3))";

const Track = styled.div`
  width: ${({ width }) => width || "100%"};
  height: ${trackHeight};
  background: var(--mochi-slider-track, #a2a2a2);
  border-radius: 12px;
  position: relative;
  margin: 42px 0 36px 0;

  /* Taller tap area for the 5px track, like Mochi's .mochi-slider-taparea. */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: ${(5 - TAP_TARGET) / 2}px;
    height: ${TAP_TARGET}px;
  }
`;

const Fill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: ${trackHeight};
  border-radius: 12px;
  background-color: ${({ $color }) => $color || ACCENT};
  width: ${({ $percent }) => $percent}%;
  transition: ${({ $active }) => $active ? "none" : "width 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)"};
  z-index: 1;
`;

const Thumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ $percent }) => $percent}%;
  transform: translate(-50%, -50%);
  width: ${thumbDefault}px;
  height: ${thumbDefault}px;
  background: ${({ $color }) => $color || ACCENT};
  border-radius: 50%;
  /*
   * A custom color gets a shadow mixed from that color; the default path
   * uses the accent's own soft tint (--mochi-accent-soft).
   */
  box-shadow: ${({ $color }) =>
    $color
      ? `0 2px 10px color-mix(in srgb, ${$color} 40%, transparent)`
      : `0 2px 10px ${ACCENT_SOFT}`};
  z-index: 2;
  transition:
    left ${({ $active }) => $active ? "0s" : "0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)"},
    width 0.18s cubic-bezier(0.43, 0.59, 0.39, 0.88),
    height 0.18s cubic-bezier(0.43, 0.59, 0.39, 0.88),
    box-shadow 0.19s;
  ${({ $active, $color }) =>
    $active &&
    css`
      width: ${thumbPressed}px;
      height: ${thumbPressed}px;
      box-shadow: ${$color
        ? `0 8px 28px color-mix(in srgb, ${$color} 50%, transparent)`
        : `0 8px 28px ${ACCENT_SOFT}`};
    `}
  cursor: grab;

  /* Full-size tap target around the 28px knob. */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${TAP_TARGET}px;
    height: ${TAP_TARGET}px;
    transform: translate(-50%, -50%);
  }
`;

const PopupText = styled.div`
  position: absolute;
  left: 100%;
  top: -45px;
  transform: translate(calc(-10% + ${BUBBLE_W / 2}px - 50%), 0);
  width: max-content;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: ${BUBBLE_H}px;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  z-index: 101;
  opacity: ${({ $shown }) => ($shown ? 1 : 0)};
  transition: opacity 0.18s;
`;

const SliderRoot = styled.div`
  position: relative;
  user-select: none;
  touch-action: none;
`;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// Snap to the step grid (anchored at min) and clamp to [min, max], rounding
// off float noise for fractional steps (3 * 0.1 = 0.30000000000000004).
function snapToStep(val, min, max, step) {
  const decimals = (String(step).split(".")[1] || "").length;
  const snapped = Math.round((val - min) / step) * step + min;
  return clamp(Number(snapped.toFixed(decimals)), min, max);
}

export const MochiSlider = ({
  value = 50,
  color,
  width = "320px",
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) => {
  const [active, setActive] = useState(false);
  const [internalVal, setInternalVal] = useState(value);
  const trackRef = useRef();
  // Latest value, readable from the window drag listeners between renders.
  const valueRef = useRef(value);
  // A live drag owns the value: external updates (e.g. a progress tick from
  // a rAF loop) must not yank the thumb out from under the pointer.
  const isDragging = useRef(false);

  // Follow the `value` prop when the parent changes it and we're not dragging.
  useEffect(() => {
    if (isDragging.current) return;
    valueRef.current = value;
    setInternalVal(value);
  }, [value]);

  // When no color prop is given, pass undefined so styled-components falls
  // through to the CSS variable path (ACCENT).
  // BubbleCanvas handles var() strings itself via getComputedStyle.
  const resolvedColor = color || undefined;
  const percent = ((internalVal - min) * 100) / (max - min);

  // Set a new value, reporting it only if it actually changed.
  const commit = (raw) => {
    const next = snapToStep(raw, min, max, step);
    if (next === valueRef.current) return;
    valueRef.current = next;
    setInternalVal(next);
    onChange && onChange(next);
  };

  const handleDrag = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const rel = clamp((clientX - rect.left) / rect.width, 0, 1);
    commit(min + rel * (max - min));
  };

  // Standard slider keys: arrows step, PageUp/PageDown move a tenth of the
  // range, Home/End jump to the ends.
  const handleKeyDown = (e) => {
    const current = valueRef.current;
    const page = Math.max(step, (max - min) / 10);
    let next;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = current + step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = current - step;
        break;
      case "PageUp":
        next = current + page;
        break;
      case "PageDown":
        next = current - page;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    commit(next);
  };

  const startDrag = () => {
    isDragging.current = true;
    setActive(true);
    document.body.style.cursor = "grabbing";

    const move = (ev) => {
      handleDrag(ev.touches ? ev.touches[0].clientX : ev.clientX);
    };

    const up = (ev) => {
      // Commit the position at release (a no-op when it matches the last move)
      const clientX = ev.touches ? ev.changedTouches[0].clientX : ev.clientX;
      handleDrag(clientX);
      isDragging.current = false;
      setActive(false);
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  const handleTrackClick = (e) => {
    handleDrag(e.clientX);
  };

  // BubbleCanvas color: pass the explicit color string when provided, otherwise
  // pass the var() string so resolveColor() can compute it from the DOM.
  const bubbleColor = color || ACCENT;

  return (
    <SliderRoot
      style={{ width }}
      tabIndex={0}
      role="slider"
      aria-valuenow={internalVal}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={`${internalVal}`}
      onKeyDown={handleKeyDown}
    >
      <Track ref={trackRef} width={width} onClick={handleTrackClick}>
        <Fill $percent={percent} $color={resolvedColor} $active={active} />
        <Thumb
          $percent={percent}
          $active={active}
          $color={resolvedColor}
          onMouseDown={startDrag}
          onTouchStart={(e) => {
            e.stopPropagation();
            startDrag(e);
          }}
        >
          {active && (
            <>
              <BubbleCanvas color={bubbleColor} />
              <PopupText $shown={active}>
                {internalVal}{min === 0 && max === 100 ? '%' : ''}
              </PopupText>
            </>
          )}
        </Thumb>
      </Track>
    </SliderRoot>
  );
};
