import React, { useState, useCallback } from 'react';
import './Checkbox.scss';

/**
 * Mochi Checkbox React Component
 * 
 * A checkbox that shows or hides a check mark when clicked.
 * Fires onChange event when toggled. Supports animation, theming, and disabled state.
 * 
 * Props:
 *   - checked: Boolean for checked state (default: false)
 *   - onChange: Callback function fired when checkbox is toggled
 *   - disabled: Boolean to disable the checkbox (default: false)
 *   - canAnimate: Boolean to enable transition animation (default: true)
 *   - colorActive: CSS color when checked (default: '#ffb80d')
 *   - colorInactive: CSS color when unchecked (default: '#fff')
 *   - colorActiveDisabled: CSS color when checked and disabled (default: '#ffb80d')
 *   - colorInactiveDisabled: CSS color when unchecked and disabled (default: '#fff')
 */
const Checkbox = ({
  checked = false,
  onChange = () => {},
  disabled = false,
  canAnimate = true,
  colorActive = '#ffb80d',
  colorInactive = '#fff',
  colorActiveDisabled = '#ffb80d',
  colorInactiveDisabled = '#fff'
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange({
      checked: newCheckedState,
      value: newCheckedState
    });
  }, [isChecked, disabled, onChange]);

  // Determine which color to use based on state
  const getBackgroundColor = () => {
    if (disabled) {
      return isChecked ? colorActiveDisabled : colorInactiveDisabled;
    }
    return isChecked ? colorActive : colorInactive;
  };

  const checkboxClasses = [
    'mochi-checkbox',
    isChecked && 'checked',
    disabled && 'disabled',
    canAnimate && 'mochi-checkbox-animate'
  ]
    .filter(Boolean)
    .join(' ');

  const checkboxStyle = {
    backgroundColor: getBackgroundColor(),
    cursor: disabled ? 'not-allowed' : 'pointer'
  };

  return (
    <div
      className={checkboxClasses}
      style={checkboxStyle}
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
    >
      {isChecked && (
        <svg
          className="mochi-checkbox-checkmark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );
};

export default Checkbox;
