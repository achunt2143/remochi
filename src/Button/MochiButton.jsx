import React, { useRef, useEffect, useCallback } from 'react';
import styled, { css, keyframes } from "styled-components";
import { FaChevronDown } from "react-icons/fa";

const colors = {
  normal:   "var(--mochi-text, #333)",
  warning:  "var(--color-error, #d34431)",
  disabled: "var(--mochi-text-faint, #adadad)",
  dropdown: "var(--mochi-primary, #6e9ebd)",
  default:  "var(--mochi-primary, #6e9ebd)",
};

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
  position: relative;
  color: ${({ $type }) => $type === "warning" ? colors.warning : colors.normal};
  ${({ $type }) => $type === "disabled" && css`color: ${colors.disabled};`}
  outline: none;
  transition: transform 0.15s ease;

  &:focus {
    outline: none;
    color: var(--mochi-text, #222);
  }

  &:active:not(:disabled) {
    transform: scale(1.05);
  }

  &:hover .mochi-underline-bar {
    transform: scaleX(1);
    opacity: 1;
  }
`;

const TextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

// Bar uses inline left/width set by JS; transform/opacity driven by CSS hover
const UnderlineBar = styled.span`
  position: absolute;
  bottom: -2px;
  height: 2px;
  border-radius: 1px;
  background-color: ${({ $type }) => {
    if ($type === "warning")  return colors.warning;
    if ($type === "disabled") return colors.disabled;
    if ($type === "dropdown") return colors.dropdown;
    return colors.default;
  }};
  transform-origin: center;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
  /* left and width set via JS ref */
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
  color: ${({ $type, disabled }) => {
    if ($type === "warning")              return colors.warning;
    if ($type === "disabled" || disabled) return colors.disabled;
    return colors.normal;
  }};
  font-style: ${({ $type }) => ($type === "disabled" ? "italic" : "normal")};
`;

const Label = styled.span`
  font-weight: ${({ $type }) => ($type === "disabled" ? "400" : "600")};
  font-style:  ${({ $type }) => ($type === "disabled" ? "italic" : "normal")};
  color: ${({ $type }) => {
    if ($type === "warning")  return colors.warning;
    if ($type === "disabled") return colors.disabled;
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

export function MochiButton({
  children = "Button",
  type = "normal",
  ...props
}) {
  const disabled      = type === "disabled";
  const containerRef  = useRef(null);
  const barRef        = useRef(null);

  // Mirror Enyo calcBarValue:
  //   width = bounds.width - bounds.width * 5/100  (i.e. 95% of content width)
  //   left  = bounds.left relative to the button root
  const updateBar = useCallback(() => {
    if (!containerRef.current || !barRef.current) return;
    const btnRect  = containerRef.current.closest('button')?.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();
    const w = contRect.width;
    barRef.current.style.width = (w - w * 0.05) + 'px';
    barRef.current.style.left  = btnRect
      ? (contRect.left - btnRect.left) + 'px'
      : '0px';
  }, []);

  useEffect(() => {
    updateBar();
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateBar)
      : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);
    return () => ro && ro.disconnect();
  }, [children, updateBar]);

  return (
    <ButtonWrapper $type={type} disabled={disabled} {...props}>
      <TextContainer ref={containerRef}>
        <Bracket $type={type} disabled={disabled}>(</Bracket>
        <Label $type={type}>{children}</Label>
        {type === "dropdown" && <DropdownIcon />}
        <Bracket $type={type} disabled={disabled}>)</Bracket>
      </TextContainer>
      <UnderlineBar
        ref={barRef}
        $type={type}
        className="mochi-underline-bar"
      />
    </ButtonWrapper>
  );
}
