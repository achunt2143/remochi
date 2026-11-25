// MochiNumberInput.jsx
// Composes MochiButton + MochiInput — no custom stylesheet needed.
import React, { useState, useEffect, useRef } from 'react';
import { MochiButton } from '../Button/MochiButton';
import { MochiInput }  from '../Input/MochiInput';
import './MochiNumberInput.scss';

// Hide the browser’s native number-input spin arrows; we provide our own
const noSpinStyle = {
  MozAppearance:    'textfield',
  WebkitAppearance: 'none',
  appearance:       'none',
  textAlign:        'center',
  width:            '80px',
  marginRight:      0,       // override MochiInput’s default right margin
};

// How long the number's move runs: --mochi-duration-control (200ms).
const MOTION_MS = 200;

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
  style,
  ...rest
}) => {
  const [local, setLocal] = useState(Number(value));
  // A step by the buttons moves the number: the new one rises in from below
  // (or drops in from above) while the old one fades out the other way.
  // { dir: 'up' | 'down', from, to, id } — `id` restarts the motion on a
  // quick second press. Typing and a changed `value` prop don't animate.
  const [motion, setMotion] = useState(null);
  const motionTimer = useRef(null);

  useEffect(() => { setLocal(Number(value)); }, [value]);
  useEffect(() => () => clearTimeout(motionTimer.current), []);

  const commit = (next, dir) => {
    if (dir && next !== local) {
      setMotion({ dir, from: local, to: next, id: (motion?.id ?? 0) + 1 });
      clearTimeout(motionTimer.current);
      motionTimer.current = setTimeout(() => setMotion(null), MOTION_MS);
    }
    setLocal(next);
    onChange?.(next);
  };

  const decrement = () => {
    const next = local - step;
    if (min === undefined || next >= min) commit(next, 'down');
  };

  const increment = () => {
    const next = local + step;
    if (max === undefined || next <= max) commit(next, 'up');
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
      {...rest}
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
    >
      {label && (
        <label style={{ fontSize: '0.9rem', color: 'var(--mochi-text-muted, #555555)' }}>
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

        <span className="mochi-number-field">
          <MochiInput
            // type="number"
            className={motion ? `mochi-number-moving-${motion.id % 2}` : undefined}
            value={local}
            onChange={handleChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            style={noSpinStyle}
          />
          {motion && (
            <>
              {/* The input hides its own text while the two copies move. */}
              <span key={`to-${motion.id}`} className={`mochi-number-ghost mochi-number-in-${motion.dir}`} aria-hidden="true">
                {motion.to}
              </span>
              <span key={`from-${motion.id}`} className={`mochi-number-ghost mochi-number-out-${motion.dir}`} aria-hidden="true">
                {motion.from}
              </span>
            </>
          )}
        </span>

        {unit && (
          <span style={{ color: 'var(--mochi-text-muted, #555555)', fontSize: '0.9rem' }}>
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
