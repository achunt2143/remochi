import React, { useState, useRef, useEffect } from 'react';
import './Button.scss';

/**
 * Mochi Button React Component
 * 
 * A mochi-styled button with decorative brackets and animated underline bar.
 * 
 * Props:
 *   - content: String for button text (default: '')
 *   - disabled: Boolean to disable button (default: false)
 *   - active: Boolean for active state (default: false)
 *   - decoratorLeft: Left bracket character (default: '(')
 *   - decoratorRight: Right bracket character (default: ')')
 *   - barClasses: CSS classes for bar styling (default: '')
 *   - onClick: Callback when button is clicked
 *   - variant: 'normal' | 'warning' | 'affirmative' | 'blue' (default: 'normal')
 */
const Button = ({
  content = '',
  disabled = false,
  active = false,
  decoratorLeft = '(',
  decoratorRight = ')',
  barClasses = '',
  onClick = () => {},
  variant = 'normal',
  children
}) => {
  const [isActive, setIsActive] = useState(active);
  const [barWidth, setBarWidth] = useState(0);
  const [barLeft, setBarLeft] = useState(0);
  const buttonRef = useRef(null);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    calculateBarPosition();
    window.addEventListener('resize', calculateBarPosition);
    return () => window.removeEventListener('resize', calculateBarPosition);
  }, [content]);

  const calculateBarPosition = () => {
    if (buttonRef.current) {
      const bounds = buttonRef.current.getBoundingClientRect();
      setBarWidth(bounds.width - bounds.width * 0.05);
      setBarLeft(0);
    }
  };

  const handleClick = (e) => {
    if (!disabled) {
      setIsActive(true);
      onClick(e);
    }
  };

  const variantClass = variant !== 'normal' ? `mochi-button-${variant}` : '';

  return (
    <button
      ref={buttonRef}
      className={`mochi-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${variantClass}`}
      disabled={disabled}
      onClick={handleClick}
    >
      <span className="mochi-button-decorator mochi-button-decorator-left">
        {decoratorLeft}
      </span>
      
      <span className="mochi-button-base">
        {children || content}
      </span>
      
      <span className="mochi-button-decorator mochi-button-decorator-right">
        {decoratorRight}
      </span>

      <span
        className={`mochi-button-bar ${barClasses}`}
        style={{
          width: `${barWidth}px`,
          left: `${barLeft}px`
        }}
      />
    </button>
  );
};

export default Button;
