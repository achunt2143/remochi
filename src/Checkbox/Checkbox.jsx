import React, { useState, useEffect, useCallback } from 'react';
import './Checkbox.scss';

/**
 * Mochi Checkbox
 *
 * A box that shows or hides a check mark when clicked.
 * Fires onChange when toggled. Use `checked` prop to read state externally.
 *
 * Props:
 *   checked            {boolean}  Controlled checked state (default: false)
 *   onChange           {Function} Called with { checked, value } on toggle
 *   disabled           {boolean}  Disables interaction (default: false)
 *   canAnimate         {boolean}  Animate background-color transition (default: true)
 *   colorActive        {string}   Background when checked (default: var(--mochi-accent, var(--mochi-selected, '#ffb80d')))
 *   colorInactive      {string}   Background when unchecked (default: var(--mochi-mark, '#fff'))
 *   colorActiveDisabled   {string}   Background when checked + disabled (default: var(--mochi-accent, var(--mochi-selected, '#ffb80d')))
 *   colorInactiveDisabled {string}   Background when unchecked + disabled (default: '#fff')
 */
const Checkbox = ({
  checked = false,
  onChange = () => {},
  disabled = false,
  canAnimate = true,
  colorActive = 'var(--mochi-accent, var(--mochi-selected, #ffb80d))',
  // Light-grey accent (--mochi-mark) — the border below (.mochi-checkbox
  // in Checkbox.scss) is the dark --mochi-toggle-track instead, so
  // unchecked reads as a dark ring around a light-grey fill, same pairing
  // Radio uses.
  colorInactive = 'var(--mochi-mark, #fff)',
  colorActiveDisabled = 'var(--mochi-accent, var(--mochi-selected, #ffb80d))',
  colorInactiveDisabled = '#fff',
  className = '',
  style: styleProp,
  onClick: userOnClick,
  onKeyDown: userOnKeyDown,
  ...rest
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  // Keep internal state in sync when controlled prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !isChecked;
    setIsChecked(next);
    onChange({ checked: next, value: next });
  }, [isChecked, disabled, onChange]);

  const getBackgroundColor = () => {
    if (disabled) return isChecked ? colorActiveDisabled : colorInactiveDisabled;
    return isChecked ? colorActive : colorInactive;
  };

  const classes = [
    'mochi-checkbox',
    isChecked  && 'checked',
    disabled   && 'disabled',
    canAnimate && 'mochi-checkbox-animate',
    className,
  ].filter(Boolean).join(' ');

  // When checked the CSS supplies the image; backgroundColor drives the tint.
  // When unchecked we still honour the colorInactive prop inline.
  const mergedStyle = {
    backgroundColor: getBackgroundColor(),
    ...styleProp,
  };

  return (
    <div
      {...rest}
      className={classes}
      style={mergedStyle}
      onClick={(e) => {
        userOnClick?.(e);
        if (!e.defaultPrevented) handleToggle();
      }}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        userOnKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      }}
    />
  );
};

export default Checkbox;
