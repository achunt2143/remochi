import React, { act, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import BubbleCanvas from "./BubbleCanvas";

const mainBlue = "#04B2F9";
const trackGray = "#dbdbdb";
const trackHeight = "5px";
const thumbDefault = 28;
const thumbPressed = 40;
const fillHeight = "5px";

const Track = styled.div`
  width: ${({ width }) => width || "100%"};
  height: ${trackHeight};
  background: ${trackGray};
  border-radius: 12px;
  position: relative;
  margin: 42px 0 36px 0;
`;

const Fill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: ${fillHeight};
  border-radius: 12px;
  background-color: ${({ color }) => color || mainBlue};
  width: ${({ percent }) => percent}%;
  transition: width 0.3s cubic-bezier(.59,.11,.62,1.49);
  z-index: 1;
`;

const Thumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ percent }) => percent}%;
  transform: translate(-50%, -50%);
  width: ${thumbDefault}px;
  height: ${thumbDefault}px;
  background: ${({ color }) => color || mainBlue};
  border-radius: 50%;
  box-shadow: 0 2px 10px #90d0ff77;
  z-index: 2;
  transition:
    width 0.18s cubic-bezier(.43,.59,.39,.88),
    height 0.18s cubic-bezier(.43,.59,.39,.88),
    box-shadow 0.19s;
  ${({ active }) =>
        active &&
        css`
      width: ${thumbPressed}px;
      height: ${thumbPressed}px;
      box-shadow: 0 8px 28px #90d0ff88;
    `
    }
  cursor: grab;
`;

const Popup = styled.div`
  position: absolute;
  left: 70%;
  top: -40px;
  transform: translate(50%, 0);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 300;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
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
    color = mainBlue,
    width = "320px",
    min = 0,
    max = 100,
    step = 1,
    onChange
}) => {
    const [active, setActive] = useState(false);
    const [internalVal, setInternalVal] = useState(value);
    const trackRef = useRef();

    const percent = ((internalVal - min) * 100) / (max - min);

    // Mouse/touch drag handling
    const handleDrag = (clientX) => {
        const rect = trackRef.current.getBoundingClientRect();
        let rel = clamp((clientX - rect.left) / rect.width, 0, 1);
        let newVal = Math.round(rel * (max - min) / step) * step + min;
        setInternalVal(newVal);
        onChange && onChange(newVal);
    };

    const startDrag = (e) => {
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
            aria-valuetext={`${internalVal}%`}
        >
            <Track ref={trackRef} width={width} onClick={handleTrackClick}>
                <Fill percent={percent} color={color} />
                <Thumb
                    percent={percent}
                    active={active}
                    color={color}
                    onMouseDown={startDrag}
                    onTouchStart={e => {
                        e.stopPropagation();
                        startDrag(e);
                    }}
                >
                    {active && (
                        <>
                            <BubbleCanvas color={color} />
                            <Popup shown={active}>
                                {internalVal}%
                            </Popup>
                        </>
                    )}
                    {/* <Popup shown={active} color={color}>{internalVal}%</Popup> */}
                </Thumb>
            </Track>
        </SliderRoot>
    );
};
