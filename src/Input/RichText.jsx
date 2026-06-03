import React, { useRef, useEffect, useState } from 'react';
import './RichText.scss';

/**
 * Mochi RichText React Component
 * 
 * A mochi-styled contenteditable div for rich text input.
 * Supports formatted text like bold, italic, underline, etc.
 * Typically used within an InputDecorator component for proper styling.
 * 
 * Note: RichText requires explicit width sizing. Not supported on Android < 3.
 * 
 * Props:
 *   - value: String/HTML for content
 *   - onChange: Callback(event) when content changes
 *   - onFocus: Callback(event) when richtext receives focus
 *   - onBlur: Callback(event) when richtext loses focus
 *   - disabled: Boolean to disable richtext (default: false)
 *   - placeholder: Placeholder text when empty
 *   - defaultFocus: Boolean to auto-focus on render (default: false)
 *   - width: CSS width string (required for proper sizing)
 *   - minHeight: Minimum height in pixels (default: 50)
 *   - className: Additional CSS classes
 *   - allowFormatting: Allow rich text formatting (default: true)
 */
const RichText = ({
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  placeholder = '',
  defaultFocus = false,
  width = '100%',
  minHeight = 50,
  className = '',
  allowFormatting = true
}) => {
  const richTextRef = useRef(null);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(!value);

  useEffect(() => {
    if (defaultFocus && richTextRef.current) {
      richTextRef.current.focus();
    }
  }, [defaultFocus]);

  useEffect(() => {
    setIsPlaceholderVisible(!value);
  }, [value]);

  const handleInput = (e) => {
    const text = richTextRef.current?.innerText || '';
    setIsPlaceholderVisible(!text);
    onChange(e);
  };

  const handleFocus = (e) => {
    if (isPlaceholderVisible && richTextRef.current) {
      richTextRef.current.innerHTML = '';
      setIsPlaceholderVisible(false);
    }
    onFocus(e);
  };

  const handleBlur = (e) => {
    const text = richTextRef.current?.innerText || '';
    if (!text && placeholder) {
      richTextRef.current.innerHTML = `<span class="placeholder">${placeholder}</span>`;
      setIsPlaceholderVisible(true);
    }
    onBlur(e);
  };

  const handleKeyDown = (e) => {
    // Prevent default formatting if allowFormatting is false
    if (!allowFormatting) {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['b', 'i', 'u', 'z', 'y'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      ref={richTextRef}
      className={`mochi-richtext ${className}`}
      contentEditable={!disabled}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        width,
        minHeight: `${minHeight}px`,
        outline: 'none',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}
      suppressContentEditableWarning
      role="textbox"
      aria-label="Rich text editor"
    >
      {isPlaceholderVisible && placeholder ? (
        <span className="mochi-richtext-placeholder">{placeholder}</span>
      ) : (
        value
      )}
    </div>
  );
};

export default RichText;
