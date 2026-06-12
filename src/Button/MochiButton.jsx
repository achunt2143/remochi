import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';

// ─── Colour helpers ────────────────────────────────────────────────────────
const colorFor = (variant) => {
  switch (variant) {
    case 'warning':     return 'var(--color-error,      #d34431)';
    case 'affirmative': return 'var(--color-success,    #00dd11)';
    case 'blue':        return 'var(--mochi-primary,    #35a8ee)';
    case 'disabled':    return 'var(--mochi-text-faint, #adadad)';
    case 'dropdown':    return 'var(--mochi-primary,    #6e9ebd)';
    default:            return 'var(--mochi-text,       #333)';
  }
};

// ─── Styled components ─────────────────────────────────────────────────────
const ButtonWrapper = styled.button`
  background: none;
  border: none;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  font-size: 1.1rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 0;
  position: relative;
  color: ${({ $variant }) => colorFor($variant)};
  outline: none;
  transition: transform 0.15s ease;

  &:focus { outline: none; }
  &:active:not(:disabled) { transform: scale(1.05); }

  /* Show bar on hover OR when .active class is present */
  &:hover .mochi-underline-bar,
  &.active .mochi-underline-bar {
    transform: scaleX(1);
    opacity: 1;
  }
`;

const TextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

const UnderlineBar = styled.span`
  position: absolute;
  bottom: -2px;
  height: 2px;
  border-radius: 1px;
  background-color: ${({ $variant }) =>
    $variant === 'normal'
      ? 'var(--mochi-primary, #6e9ebd)'
      : colorFor($variant)
  };
  transform-origin: center;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
  /* left + width set by JS */
`;

const Bracket = styled.span`
  font-size: 1.7em;
  font-weight: 600;
  vertical-align: middle;
  margin: 0 2px;
  transition: color 0.2s;
  color: ${({ $variant }) => colorFor($variant)};
  font-style: ${({ $variant }) => ($variant === 'disabled' ? 'italic' : 'normal')};
`;

const Label = styled.span`
  font-weight: ${({ $variant }) => ($variant === 'disabled' ? '400' : '600')};
  font-style:  ${({ $variant }) => ($variant === 'disabled' ? 'italic' : 'normal')};
  color: ${({ $variant }) => colorFor($variant)};
  margin-top: 0.2em;
  letter-spacing: 0.02em;
`;

const DropdownIcon = styled(FaChevronDown)`
  color: var(--mochi-primary, #6e9ebd);
  margin-left: 6px;
  font-size: 0.95em;
  vertical-align: middle;
`;

// ─── Component ────────────────────────────────────────────────────────────
/**
 * MochiButton
 *
 * Props:
 *   children / content  — label text (children takes precedence)
 *   variant             — 'normal' | 'warning' | 'affirmative' | 'blue' | 'disabled' | 'dropdown'
 *   active              — boolean; keeps the underline bar visible (mirrors Enyo active state)
 *   decoratorLeft       — left bracket character  (default '(')
 *   decoratorRight      — right bracket character (default ')')
 *   barClasses          — extra CSS classes forwarded to the underline bar span
 *   disabled            — boolean; disables the button (also set automatically when variant='disabled')
 *   onClick             — click handler
 */
export function MochiButton({
  children,
  content        = '',
  variant        = 'normal',
  active         = false,
  decoratorLeft  = '(',
  decoratorRight = ')',
  barClasses     = '',
  disabled,
  onClick,
  ...props
}) {
  const isDisabled       = disabled || variant === 'disabled';
  const effectiveVariant = isDisabled && variant === 'normal' ? 'disabled' : variant;

  const [isActive, setIsActive] = useState(active);
  useEffect(() => setIsActive(active), [active]);

  const containerRef = useRef(null);
  const barRef       = useRef(null);
  const label        = children ?? content;

  // Mirror Enyo calcBarValue: width = 95% of content width, left = offset from button root
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
      ? new ResizeObserver(updateBar) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);
    return () => ro?.disconnect();
  }, [label, updateBar]);

  const handleClick = (e) => {
    if (!isDisabled) {
      setIsActive(true);
      onClick?.(e);
    }
  };

  return (
    <ButtonWrapper
      $variant={effectiveVariant}
      disabled={isDisabled}
      className={isActive ? 'active' : ''}
      onClick={handleClick}
      {...props}
    >
      <TextContainer ref={containerRef}>
        <Bracket $variant={effectiveVariant}>{decoratorLeft}</Bracket>
        <Label   $variant={effectiveVariant}>{label}</Label>
        {variant === 'dropdown' && <DropdownIcon />}
        <Bracket $variant={effectiveVariant}>{decoratorRight}</Bracket>
      </TextContainer>

      <UnderlineBar
        ref={barRef}
        $variant={effectiveVariant}
        className={`mochi-underline-bar${barClasses ? ' ' + barClasses : ''}`}
      />
    </ButtonWrapper>
  );
}
