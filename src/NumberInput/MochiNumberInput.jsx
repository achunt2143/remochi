// MochiNumberInput.jsx
import React, { useState, useEffect } from 'react';
import './MochiNumberInput.scss';

const MochiNumberInput = ({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit,
  disabled = false,
  showControls = true,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleIncrement = () => {
    const newValue = localValue + step;
    if (max === undefined || newValue <= max) {
      setLocalValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = localValue - step;
    if (min === undefined || newValue >= min) {
      setLocalValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
        setLocalValue(newValue);
        if (onChange) onChange(newValue);
      }
    }
  };

  return (
    <div className={`mochi-number-input ${className}`}>
      {label && <label className="mochi-number-input-label">{label}</label>}
      <div className="mochi-number-input-wrapper">
        {showControls && (
          <button
            className="mochi-number-input-btn"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && localValue <= min)}
          >
            −
          </button>
        )}
        <input
          type="number"
          className="mochi-number-input-field"
          value={localValue}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
        {unit && <span className="mochi-number-input-unit">{unit}</span>}
        {showControls && (
          <button
            className="mochi-number-input-btn"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && localValue >= max)}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default MochiNumberInput;
