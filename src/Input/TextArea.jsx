import React, { useRef, useEffect, useState } from 'react';
import './TextArea.scss';

/**
 * Mochi TextArea React Component
 * 
 * A mochi-styled textarea control for multi-line text input.
 * Typically used within an InputDecorator component for proper styling.
 * 
 * Props:
 *   - value: String for textarea content
 *   - onChange: Callback(event) when content changes
 *   - onFocus: Callback(event) when textarea receives focus
 *   - onBlur: Callback(event) when textarea loses focus
 *   - disabled: Boolean to disable textarea (default: false)
 *   - placeholder: Placeholder text when empty
 *   - defaultFocus: Boolean to auto-focus on render (default: false)
 *   - minHeight: Minimum height in pixels (default: 50)
 *   - rows: Number of visible text rows (default: 4)
 *   - className: Additional CSS classes
 */
const TextArea = ({
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  placeholder = '',
  defaultFocus = false,
  minHeight = 50,
  rows = 4,
  className = ''
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (defaultFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [defaultFocus]);

  return (
    <textarea
      ref={textareaRef}
      className={`mochi-textarea ${className}`}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      style={{ minHeight: `${minHeight}px` }}
    />
  );
};

export default TextArea;
