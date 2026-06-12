import React, { useRef, useEffect, useState, useCallback } from 'react';
import './RichText.scss';

/**
 * Mochi RichText React Component
 *
 * A mochi-styled contenteditable div for rich text input.
 * Supports formatted text like bold, italic, underline, etc.
 *
 * IMPORTANT — contentEditable + React children don't mix.
 * We use dangerouslySetInnerHTML so React never owns individual child nodes
 * and never tries to reconcile/removeChild them after the user (or we) mutate
 * the DOM. All placeholder logic is handled via state; no direct innerHTML
 * writes happen outside of the initial render.
 *
 * Props:
 *   value          Initial HTML content
 *   onChange       Callback(html: string) when content changes
 *   onFocus        Callback(event) when editor receives focus
 *   onBlur         Callback(event) when editor loses focus
 *   disabled       Disable editing (default: false)
 *   placeholder    Placeholder text shown when empty
 *   defaultFocus   Auto-focus on mount (default: false)
 *   width          CSS width string (default: '100%')
 *   minHeight      Min height in px (default: 50)
 *   className      Additional CSS classes
 *   allowFormatting  Allow bold/italic/underline shortcuts (default: true)
 */
const RichText = ({
  value        = '',
  onChange     = () => {},
  onFocus      = () => {},
  onBlur       = () => {},
  disabled     = false,
  placeholder  = '',
  defaultFocus = false,
  width        = '100%',
  minHeight    = 50,
  className    = '',
  allowFormatting = true,
}) => {
  const editorRef = useRef(null);

  // Track whether the editor is empty so we can show/hide the placeholder.
  // We derive initial state from the value prop.
  const isEmpty = (html) => !html || html.replace(/<[^>]*>/g, '').trim() === '';
  const [showPlaceholder, setShowPlaceholder] = useState(isEmpty(value));

  // Auto-focus on mount if requested
  useEffect(() => {
    if (defaultFocus) editorRef.current?.focus();
  }, [defaultFocus]);

  // If the controlled `value` prop changes externally, sync the DOM.
  // We only do this when the editor is NOT focused to avoid clobbering
  // the user's in-progress edits.
  useEffect(() => {
    const el = editorRef.current;
    if (!el || document.activeElement === el) return;
    // Only write if content actually differs (avoids cursor-jump on each render)
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
    setShowPlaceholder(isEmpty(value));
  }, [value]);

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    setShowPlaceholder(isEmpty(html));
    onChange(html);
  }, [onChange]);

  const handleFocus = useCallback((e) => {
    // Hide placeholder — no DOM mutation needed, just flip state.
    setShowPlaceholder(false);
    onFocus(e);
  }, [onFocus]);

  const handleBlur = useCallback((e) => {
    const el = editorRef.current;
    const html = el ? el.innerHTML : '';
    setShowPlaceholder(isEmpty(html));
    onBlur(e);
  }, [onBlur]);

  const handleKeyDown = useCallback((e) => {
    if (!allowFormatting) {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['b', 'i', 'u', 'z', 'y'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    }
  }, [allowFormatting]);

  return (
    <div className={`mochi-richtext-wrapper ${className}`} style={{ width }}>
      {/* Placeholder sits behind the editor, shown via state */}
      {showPlaceholder && placeholder && (
        <span
          className="mochi-richtext-placeholder"
          aria-hidden="true"
        >
          {placeholder}
        </span>
      )}

      {/*
        dangerouslySetInnerHTML tells React: "don't touch my children".
        This is the correct pattern for contentEditable — React will never
        attempt removeChild/insertBefore on nodes the user or the browser
        has already mutated.
      */}
      <div
        ref={editorRef}
        className="mochi-richtext"
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        // Seed the initial HTML; after mount React hands off DOM ownership.
        dangerouslySetInnerHTML={{ __html: value }}
        style={{
          minHeight: `${minHeight}px`,
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
        aria-disabled={disabled}
      />
    </div>
  );
};

export default RichText;
