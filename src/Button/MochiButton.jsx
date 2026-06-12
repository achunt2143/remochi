import React, { useRef, useEffect, useCallback } from 'react';
import './Button.scss';

/**
 * MochiButton — faithful React port of mochi.Button from Enyo.
 *
 * Structure mirrors the original tools array:
 *   ButtonDecoratorLeft  →  .mochi-button-decorator.mochi-button-decorator-left
 *   .mochi-button-base   →  the label span
 *   ButtonDecoratorRight →  .mochi-button-decorator.mochi-button-decorator-right
 *   .mochi-button-bar    →  absolute underline, width measured from .mochi-button-base
 *
 * Props:
 *   type           – 'normal' | 'warning' | 'disabled' | 'dropdown' | 'affirmative' | 'blue'
 *   decoratorLeft  – left bracket char  (default '(')
 *   decoratorRight – right bracket char (default ')')
 *   barClasses     – extra classes forwarded to the bar element
 *   children       – button label
 */
export function MochiButton({
  children = 'Button',
  type = 'normal',
  decoratorLeft  = '(',
  decoratorRight = ')',
  barClasses = '',
  className = '',
  onClick,
  ...props
}) {
  const disabled   = type === 'disabled';
  const baseRef    = useRef(null);
  const barRef     = useRef(null);

  // Enyo calcBarValue: bar.width = base.width - base.width * 5/100
  const updateBar = useCallback(() => {
    if (baseRef.current && barRef.current) {
      const w = baseRef.current.getBoundingClientRect().width;
      barRef.current.style.width = (w - w * 0.05) + 'px';
    }
  }, []);

  useEffect(() => {
    updateBar();
    // Re-measure if the button is inside something that resizes
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateBar)
      : null;
    if (ro && baseRef.current) ro.observe(baseRef.current);
    return () => ro && ro.disconnect();
  }, [children, updateBar]);

  // Build class list for the root <button>
  const variantClass = {
    warning:    'mochi-button-warning',
    disabled:   'mochi-button-disabled',
    dropdown:   'mochi-button-dropdown',
    affirmative:'mochi-button-affirmative',
    blue:       'mochi-button-blue',
  }[type] ?? '';

  const rootClasses = [
    'mochi-button',
    variantClass,
    className,
  ].filter(Boolean).join(' ');

  const barFinalClasses = ['mochi-button-bar', barClasses].filter(Boolean).join(' ');

  return (
    <button
      className={rootClasses}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {/* ButtonDecoratorLeft */}
      <span className="mochi-button-decorator mochi-button-decorator-left">
        <span className="mochi-button-decorator-bookened">{decoratorLeft}</span>
      </span>

      {/* Label — measured for bar width */}
      <span className="mochi-button-base" ref={baseRef}>
        {children}
      </span>

      {/* ButtonDecoratorRight */}
      <span className="mochi-button-decorator mochi-button-decorator-right">
        <span className="mochi-button-decorator-bookened">{decoratorRight}</span>
      </span>

      {/* Underline bar — width set via JS, colour via CSS :active state */}
      <span className={barFinalClasses} ref={barRef} />
    </button>
  );
}
