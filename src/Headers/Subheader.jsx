import React, { useState, useEffect, useRef } from 'react';
import './Subheader.scss';

/**
 * Mochi Subheader React Component
 * 
 * A mochi-styled subheader control that displays a single line of text
 * with automatic text overflow handling.
 * 
 * Props:
 *   - content: String for subheader text (default: '')
 */
const Subheader = ({ content = '' }) => {
  const [contentWidth, setContentWidth] = useState('auto');
  const subheaderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    adjustContent();
    window.addEventListener('resize', adjustContent);
    return () => window.removeEventListener('resize', adjustContent);
  }, [content]);

  const adjustContent = () => {
    if (!subheaderRef.current) return;

    const bounds = subheaderRef.current.getBoundingClientRect();
    const padding = window.getComputedStyle(subheaderRef.current);
    const paddingLeft = parseFloat(padding.paddingLeft) || 0;
    const paddingRight = parseFloat(padding.paddingRight) || 0;
    const pw = paddingLeft + paddingRight;

    const calculatedWidth = bounds.width - pw;
    setContentWidth(calculatedWidth + 'px');
  };

  return (
    <div className="mochi-subheader" ref={subheaderRef}>
      <div
        className="mochi-subheader-content"
        ref={contentRef}
        style={{ maxWidth: contentWidth }}
        title={content}
      >
        {content}
      </div>
    </div>
  );
};

export default Subheader;
