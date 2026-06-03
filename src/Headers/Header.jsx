import React, { useState, useEffect, useRef } from 'react';
import './Header.scss';

/**
 * Mochi Header React Component
 * 
 * A mochi-styled header control that displays a single line of text
 * with optional controls on the right side.
 * 
 * Props:
 *   - content: String for header text (default: '')
 *   - children: React elements for controls (displayed right-aligned)
 *   - customClasses: Additional CSS classes to apply (default: '')
 */
const Header = ({ content = '', children, customClasses = '' }) => {
  const [contentWidth, setContentWidth] = useState('auto');
  const headerRef = useRef(null);
  const controlsRef = useRef(null);

  const minContentWidth = 80;

  useEffect(() => {
    adjustContent();
    window.addEventListener('resize', adjustContent);
    return () => window.removeEventListener('resize', adjustContent);
  }, [children]);

  const adjustContent = () => {
    if (!headerRef.current) return;

    const headerBounds = headerRef.current.getBoundingClientRect();
    const headerPadding = window.getComputedStyle(headerRef.current);
    const paddingLeft = parseFloat(headerPadding.paddingLeft) || 0;
    const paddingRight = parseFloat(headerPadding.paddingRight) || 0;
    const pw = paddingLeft + paddingRight;

    let calculatedWidth = headerBounds.width - pw;

    if (controlsRef.current) {
      const controlBounds = controlsRef.current.getBoundingClientRect();
      const controlWidth = controlBounds.width;
      calculatedWidth = Math.max(minContentWidth, (headerBounds.width - controlWidth - pw));
    }

    setContentWidth(calculatedWidth + 'px');
  };

  const hasControls = React.Children.count(children) > 0;

  return (
    <div className="mochi-header" ref={headerRef}>
      <div
        className={`mochi-header-content ${customClasses}`}
        style={{ maxWidth: contentWidth, width: contentWidth }}
      >
        {content}
      </div>
      {hasControls && (
        <div
          className="mochi-header-controls mochi-header-controls-first"
          ref={controlsRef}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Header;
