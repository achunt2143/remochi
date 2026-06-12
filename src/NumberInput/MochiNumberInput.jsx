// MochiNumberInput.jsx
// Composes MochiButton + MochiInput — no custom stylesheet needed.
import React, { useState, useEffect } from 'react';
import { MochiButton } from '../Button/MochiButton';
import { MochiInput }  from '../Input/MochiInput';

// Hide the browser’s native number-input spin arrows; we provide our own
const noSpinStyle = {
  MozAppearance:    'textfield',
  WebkitAppearance: 'none',
  appearance:       'none',
  textAlign:        'center',
  width:            '80px',
  marginRight:      0,       // override MochiInput’s default right margin
};

const MochiNumberInput = ({
  value    = 0,
  onChange,
  min,
  max,
  step       = 1,
  label,
  unit,
  disabled   = false,
  showControls = true,
  className  = '',
}) => {
  const [local, setLocal] = useState(Number(value));

  useEffect(() => { setLocal(Number(value)); }, [value]);

  const commit = (next) => {
    setLocal(next);
    onChange?.(next);
  };

  const decrement = () => {
    const next = local - step;
    if (min === undefined || next >= min) commit(next);
  };

  const increment = () => {
    const next = local + step;
    if (max === undefined || next <= max) commit(next);
  };

  const handleChange = (e) => {
    const next = parseFloat(e.target.value);
    if (isNaN(next)) return;
    if ((min === undefined || next >= min) && (max === undefined || next <= max)) commit(next);
  };

  const atMin = min !== undefined && local <= min;
  const atMax = max !== undefined && local >= max;

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px' }}
    >
      {label && (
        <label style={{ fontSize: '0.9rem', color: 'var(--mochi-text-muted, #888)' }}>
          {label}
        </label>
      )}

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {showControls && (
          <MochiButton
            type={disabled || atMin ? 'disabled' : 'normal'}
            onClick={decrement}
            disabled={disabled || atMin}
            aria-label="Decrement"
          >
            −
          </MochiButton>
        )}

        <MochiInput
          type="number"
          value={local}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          style={noSpinStyle}
        />

        {unit && (
          <span style={{ color: 'var(--mochi-text-muted, #888)', fontSize: '0.9rem' }}>
            {unit}
          </span>
        )}

        {showControls && (
          <MochiButton
            type={disabled || atMax ? 'disabled' : 'normal'}
            onClick={increment}
            disabled={disabled || atMax}
            aria-label="Increment"
          >
            +
          </MochiButton>
        )}
      </div>
    </div>
  );
};

export default MochiNumberInput;
