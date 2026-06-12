import React, { useRef, useLayoutEffect, useState } from 'react';
import styled, { css, keyframes } from "styled-components";
import { FaChevronDown } from "react-icons/fa";

const colors = {
  normal:   "#333",
  warning:  "#d34431",
  disabled: "#adadad",
  dropdown: "#6e9ebd",
  default:  "#6e9ebd",
};

const bounce = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.1); }
  50%  { transform: scale(0.95); }
  70%  { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// ── canvas text-width helper ─────────────────────────────────────────────────
// One canvas is reused across all button instances (no DOM reflow).
let _canvas = null;
function measureTextWidth(text, font) {
  if (!_canvas) _canvas = document.createElement('canvas');
  const ctx = _canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
}

/**
 * Derives the canvas font string for the Label span from its known styles.
 *
 * Label inherits:
 *   font-family : "Segoe UI", Arial, sans-serif  (from ButtonWrapper)
 *   font-size   : 1.1rem                         (from ButtonWrapper)
 *   font-weight : 600 | 400                      (disabled = 400)
 *   font-style  : italic | normal                (disabled = italic)
 *   letter-spacing is NOT part of ctx.font — handled separately below.
 *
 * We read the resolved font-size off the label ref so we get the real px
 * value regardless of the user's root font size.
 */
function buildLabelFont(labelEl, type) {
  const weight = type === 'disabled' ? '400' : '600';
  const style  = type === 'disabled' ? 'italic' : 'normal';
  // Read live computed font-size from the DOM element (gives real px value)
  const size   = labelEl
    ? getComputedStyle(labelEl).fontSize          // e.g. "17.6px"
    : '17.6px';                                   // sensible fallback
  return `${style} ${weight} ${size} "Segoe UI", Arial, sans-serif`;
}

/**
 * Hook: returns the pixel width of the label text, measured via canvas.
 * Re-runs whenever children, type, or the label element itself changes.
 */
function useLabelWidth(labelRef, children, type) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;

    // Extract plain text from children (handles string, number, and React nodes)
    const text = el.textContent ?? String(children ?? '');
    const font = buildLabelFont(el, type);

    // canvas measureText does not account for letter-spacing;
    // add it manually: spacing applies between each character pair.
    const baseWidth    = measureTextWidth(text, font);
    const computed     = getComputedStyle(el);
    const letterSpacingPx = parseFloat(computed.letterSpacing) || 0; // resolves '0.02em' → px
    const spacingTotal = letterSpacingPx * Math.max(text.length - 1, 0);

    setWidth(baseWidth + spacingTotal);
  }, [children, type, labelRef]);

  return width;
}

// ── styled components ────────────────────────────────────────────────────────

const ButtonWrapper = styled.button`
  background: none;
  border: none;
  font-family: "Segoe UI", "Arial", sans-serif;
  font-size: 1.1rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 0;
  color: ${({ type }) => type === "warning" ? colors.warning : colors.normal};
  ${({ type }) => type === "disabled" && css`color: ${colors.disabled};`}
  outline: none;
  transition: transform 0.15s ease;

  &:focus {
    outline: none;
    color: #222;
  }

  &:active:not(:disabled) {
    transform: scale(1.05);
  }

  &:hover > div > span.mochi-underline {
    transform: scaleX(1);
    opacity: 1;
  }
`;

const TextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

// Width and left are now driven by inline styles (set from canvas measurement)
const UnderlineBar = styled.span`
  position: absolute;
  bottom: 4px;
  height: 3px;
  border-radius: 2px;
  background-color: ${({ type }) => {
    if (type === "warning")  return colors.warning;
    if (type === "disabled") return colors.disabled;
    if (type === "dropdown") return colors.dropdown;
    return colors.default;
  }};
  transform-origin: center;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
`;

const bracketStyle = css`
  font-size: 1.7em;
  font-weight: 600;
  vertical-align: middle;
  margin: 0 2px;
  transition: color 0.2s;
`;

const Bracket = styled.span`
  ${bracketStyle}
  color: ${({ type, disabled }) => {
    if (type === "warning")            return colors.warning;
    if (type === "disabled" || disabled) return colors.disabled;
    return colors.normal;
  }};
  font-style: ${({ type }) => (type === "disabled" ? "italic" : "normal")};
`;

const Label = styled.span`
  font-weight: ${({ type }) => (type === "disabled" ? "400" : "600")};
  font-style:  ${({ type }) => (type === "disabled" ? "italic" : "normal")};
  color: ${({ type }) => {
    if (type === "warning")  return colors.warning;
    if (type === "disabled") return colors.disabled;
    return colors.normal;
  }};
  margin-top: 0.2em;
  letter-spacing: 0.02em;
`;

const DropdownIcon = styled(FaChevronDown)`
  color: ${colors.dropdown};
  margin-left: 6px;
  font-size: 0.95em;
  vertical-align: middle;
`;

// ── component ────────────────────────────────────────────────────────────────

export function MochiButton({
  children = "Button",
  type = "normal",   // normal | warning | disabled | dropdown
  ...props
}) {
  const disabled  = type === "disabled";
  const labelRef  = useRef(null);

  // Canvas-measured width of just the label text (excludes brackets + icon)
  const labelPx   = useLabelWidth(labelRef, children, type);

  // The TextContainer uses inline-flex; the Label is the middle child.
  // We need to know how far from the left edge of TextContainer the Label
  // starts, which equals the width of the left Bracket.
  // Rather than measuring the bracket too, we let the bar's `left` be
  // computed via a CSS calc that centres it under the label:
  //   left = 50% - labelWidth/2
  // This works because the container is itself centred (align-items: center).
  const barStyle = labelPx > 0 ? {
    left:  `calc(50% - ${labelPx / 2}px)`,
    width: `${labelPx}px`,
  } : {
    // fallback before first measurement
    left:  '15%',
    width: '70%',
  };

  return (
    <ButtonWrapper type={type} disabled={disabled} {...props}>
      <TextContainer>
        <Bracket type={type} disabled={disabled}>(</Bracket>
        <Label ref={labelRef} type={type}>{children}</Label>
        {type === "dropdown" && <DropdownIcon />}
        <Bracket type={type} disabled={disabled}>)</Bracket>
        <UnderlineBar
          type={type}
          className="mochi-underline"
          style={barStyle}
        />
      </TextContainer>
    </ButtonWrapper>
  );
}
