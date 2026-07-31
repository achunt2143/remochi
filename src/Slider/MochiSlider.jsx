import React, { useRef, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import BubbleCanvas from "./BubbleCanvas";

const trackHeight = "5px";
const thumbDefault = 28;
const thumbPressed = 40;

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
  box-shadow: ${({ $color }) =>
    $color
      ? `0 2px 10px color-mix(in srgb, ${$color} 40%, transparent)`
      : "0 2px 10px var(--mochi-primary-soft, rgba(0,0,0,0.25))"};
  z-index: 2;
  transition:
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
        : "0 8px 28px var(--mochi-primary-soft, rgba(0,0,0,0.3))"};
    `}
  cursor: grab;
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
  // isDragging ref prevents external value updates from clobbering a live drag
  const isDragging = useRef(false);

  // Sync internalVal from value prop whenever it changes and we are NOT dragging.
  // This is what makes the slider controlled — progress ticks from the rAF loop
  // (or any other external update) are reflected in the track fill and thumb.
  useEffect(() => {
    if (!isDragging.current) {
      setInternalVal(value);
    }
  }, [value]);

  const resolvedColor = color || undefined;
  const percent = ((internalVal - min) * 100) / (max - min);

  const handleDrag = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const rel = clamp((clientX - rect.left) / rect.width, 0, 1);
    const newVal = Math.round((rel * (max - min)) / step) * step + min;
    setInternalVal(newVal);
    onChange && onChange(newVal);
  };

  const startDrag = () => {
    isDragging.current = true;
    setActive(true);
    document.body.style.cursor = "grabbing";

    const move = (ev) => {
      handleDrag(ev.touches ? ev.touches[0].clientX : ev.clientX);
    };

    const up = (ev) => {
      // Compute and emit the final committed value on release
      const rect = trackRef.current?.getBoundingClientRect();
      if (rect) {
        const clientX = ev.touches ? ev.changedTouches[0].clientX : ev.clientX;
        const rel = clamp((clientX - rect.left) / rect.width, 0, 1);
        const finalVal = Math.round((rel * (max - min)) / step) * step + min;
        setInternalVal(finalVal);
        onChange && onChange(finalVal);
      }
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

  const bubbleColor = color || "var(--mochi-primary, #04B2F9)";

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
