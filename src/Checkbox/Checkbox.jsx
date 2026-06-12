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
 *   colorActive        {string}   Background when checked (default: '#ffb80d')
 *   colorInactive      {string}   Background when unchecked (default: '#fff')
 *   colorActiveDisabled   {string}   Background when checked + disabled (default: '#ffb80d')
 *   colorInactiveDisabled {string}   Background when unchecked + disabled (default: '#fff')
 */
const Checkbox = ({
  checked = false,
  onChange = () => {},
  disabled = false,
  canAnimate = true,
  colorActive = '#ffb80d',
  colorInactive = '#fff',
  colorActiveDisabled = '#ffb80d',
  colorInactiveDisabled = '#fff',
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
  ].filter(Boolean).join(' ');

  // When checked the CSS supplies the image; backgroundColor drives the tint.
  // When unchecked we still honour the colorInactive prop inline.
  const style = isChecked
    ? { backgroundColor: getBackgroundColor() }
    : { backgroundColor: getBackgroundColor() };

  return (
    <div
      className={classes}
      style={style}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      }}
    />
  );
};

export default Checkbox;
