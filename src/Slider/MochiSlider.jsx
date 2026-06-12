import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import BubbleCanvas from "./BubbleCanvas";

const trackHeight = "5px";
const thumbDefault = 28;
const thumbPressed = 40;

// Canvas bubble is 62x37px. We want the text centred over it.
// BubbleCanvas sits at left:100%, transform: translate(-10%, 0), top:-45px
// relative to the Thumb. The popup text needs to match that position.
// Bubble width = 62px. Its left edge is at ~(thumbWidth - 62*0.1) from thumb left.
// Simplest: make PopupText absolute, same anchor as the canvas, then centre.

const BUBBLE_W = 62;
const BUBBLE_H = 37;

const Track = styled.div`
  width: ${({ width }) => width || "100%"};
  height: ${trackHeight};
  background: var(--mochi-hover, #dbdbdb);
  border-radius: 12px;
  position: relative;
  margin: 42px 0 36px 0;
`;

const Fill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: ${trackHeight};
  border-radius: 12px;
  background-color: ${({ $color }) => $color || "var(--mochi-primary, #04B2F9)"};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.3s cubic-bezier(0.59, 0.11, 0.62, 1.49);
  z-index: 1;
`;

const Thumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ $percent }) => $percent}%;
  transform: translate(-50%, -50%);
  width: ${thumbDefault}px;
  height: ${thumbDefault}px;
  background: ${({ $color }) => $color || "var(--mochi-primary, #04B2F9)"};
  border-radius: 50%;
  box-shadow: 0 2px 10px var(--mochi-primary-soft, rgba(4, 178, 249, 0.4));
  z-index: 2;
  transition:
    width 0.18s cubic-bezier(0.43, 0.59, 0.39, 0.88),
    height 0.18s cubic-bezier(0.43, 0.59, 0.39, 0.88),
    box-shadow 0.19s;
  ${({ $active }) =>
    $active &&
    css`
      width: ${thumbPressed}px;
      height: ${thumbPressed}px;
      box-shadow: 0 8px 28px var(--mochi-primary-soft, rgba(4, 178, 249, 0.5));
    `}
  cursor: grab;
`;

// Sits in the same stacking context as BubbleCanvas (both children of Thumb).
// BubbleCanvas: left:100%, translateX(-10%), top:-45px, width:62px
// We mirror that anchor then shift right by half the bubble width to centre.
const PopupText = styled.div`
  position: absolute;
  /* Match BubbleCanvas anchor exactly */
  left: 100%;
  top: -45px;
  /* BubbleCanvas translateX is -10% of its own width = -6.2px.
     Centre of bubble from its left edge = 62/2 = 31px.
     So centre from our left:100% = -6.2 + 31 = 24.8px.
     We then shift back by 50% of our own width via translateX(-50%)
     but since we're text we use a fixed offset instead. */
  transform: translate(calc(-10% + ${BUBBLE_W / 2}px - 50%), 0);
  width: max-content;

  /* Typography */
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: ${BUBBLE_H}px;   /* vertically centre in the 37px tall bubble */
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  z-index: 101;                  /* above the canvas (z-index: 100) */

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

  // Resolved color: explicit prop → CSS variable fallback string
  // BubbleCanvas receives this same value so canvas fill always matches.
  const resolvedColor = color || "var(--mochi-primary, #04B2F9)";

  const percent = ((internalVal - min) * 100) / (max - min);

  const handleDrag = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const rel = clamp((clientX - rect.left) / rect.width, 0, 1);
    const newVal = Math.round((rel * (max - min)) / step) * step + min;
    setInternalVal(newVal);
    onChange && onChange(newVal);
  };

  const startDrag = () => {
    setActive(true);
    document.body.style.cursor = "grabbing";
    const move = (ev) => {
      handleDrag(ev.touches ? ev.touches[0].clientX : ev.clientX);
    };
    const up = () => {
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

  return (
    <SliderRoot
      style={{ width }}
      tabIndex={0}
      role="slider"
      aria-valuenow={internalVal}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={`${internalVal}`}
    >
      <Track ref={trackRef} width={width} onClick={handleTrackClick}>
        <Fill $percent={percent} $color={resolvedColor} />
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
              {/* Canvas draws the bubble shape in the correct color */}
              <BubbleCanvas color={resolvedColor} />
              {/* Text layered on top, centred over the bubble */}
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
