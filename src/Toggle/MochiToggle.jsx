import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MochiToggle.scss';

/**
 * MochiToggle — port of mochi.ToggleButton (Enyo)
 *
 * A pill-shaped switch with On/Off label text and a sliding white knob.
 * The entire pill background changes color between active/inactive states.
 *
 * Props:
 *   value          {boolean}  Current on/off state (default: false)
 *   onChange       {Function} Called with { value } on toggle
 *   disabled       {boolean}  Disables interaction (default: false)
 *   canAnimate     {boolean}  Animate background-color transition (default: true)
 *   colorActive    {string}   Pill bg when on (default: '#ffb80d')
 *   colorInactive  {string}   Pill bg when off (default: '#646464')
 *   onContent      {string}   Label shown when on (default: 'On')
 *   offContent     {string}   Label shown when off (default: 'Off')
 */
const MochiToggle = ({
  value = false,
  onChange = () => {},
  disabled = false,
  canAnimate = true,
  colorActive = '#ffb80d',
  colorInactive = '#646464',
  onContent = 'On',
  offContent = 'Off',
}) => {
  const [isOn, setIsOn] = useState(value);
  const trackRef = useRef(null);
  const knobRef  = useRef(null);

  // Sync controlled prop
  useEffect(() => { setIsOn(value); }, [value]);

  // Calculate knob travel and apply via translateX
  // Mirrors Enyo's calcKnob: onXPos = trackWidth - knobWidth - (marginLeft * 2)
  const applyKnobPosition = useCallback((on) => {
    if (!trackRef.current || !knobRef.current) return;
    const trackW = trackRef.current.offsetWidth;
    const knobW  = knobRef.current.offsetWidth;
    const xPos   = on ? trackW - knobW - 4 : 0; // 4 = margin 2px * 2
    knobRef.current.style.transform = `translateX(${xPos}px)`;
  }, []);

  useEffect(() => {
    applyKnobPosition(isOn);
  }, [isOn, applyKnobPosition]);

  // Recalc on resize (mirrors resizeHandler)
  useEffect(() => {
    const ro = new ResizeObserver(() => applyKnobPosition(isOn));
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [isOn, applyKnobPosition]);

  const toggle = useCallback((next) => {
    if (disabled) return;
    setIsOn(next);
    onChange({ value: next });
  }, [disabled, onChange]);

  // Drag support — horizontal drag > 10px threshold (mirrors Enyo drag handlers)
  const dragState = useRef({ dragging: false, dragged: false, startX: 0 });

  const onPointerDown = (e) => {
    if (disabled) return;
    dragState.current = { dragging: true, dragged: false, startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 10) {
      dragState.current.dragged = true;
      toggle(dx > 0);
    }
  };

  const onPointerUp = () => {
    const { dragged } = dragState.current;
    dragState.current.dragging = false;
    if (!dragged) toggle(!isOn);
  };

  const classes = [
    'mochi-toggle-button',
    canAnimate && 'mochi-toggle-animate',
    disabled   && 'disabled',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={trackRef}
      className={classes}
      style={{ backgroundColor: isOn ? colorActive : colorInactive }}
      role="switch"
      aria-checked={isOn}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(!isOn); }
        if (e.key === 'ArrowRight') { e.preventDefault(); toggle(true); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); toggle(false); }
      }}
    >
      {/* On label — left side, visible when on */}
      <span
        className="mochi-toggle-content mochi-toggle-content-on"
        style={{ visibility: isOn ? 'visible' : 'hidden' }}
      >
        {onContent || '\u00a0'}
      </span>

      {/* Off label — right side, visible when off */}
      <span
        className="mochi-toggle-content mochi-toggle-content-off"
        style={{ visibility: isOn ? 'hidden' : 'visible' }}
      >
        {offContent || '\u00a0'}
      </span>

      {/* Sliding white knob */}
      <span ref={knobRef} className="mochi-toggle-button-knob" />
    </div>
  );
};

export { MochiToggle };
export default MochiToggle;
