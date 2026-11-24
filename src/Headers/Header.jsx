import React from 'react';
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
const Header = ({ content = '', children, customClasses = '', className = '', ...rest }) => {
  const hasControls = React.Children.toArray(children).length > 0;

  return (
    <div {...rest} className={['mochi-header', className].filter(Boolean).join(' ')}>
      <div className={['mochi-header-content', customClasses].filter(Boolean).join(' ')}>
        {content}
      </div>
      {hasControls && (
        <div className="mochi-header-controls mochi-header-controls-first">
          {children}
        </div>
      )}
    </div>
  );
};

export default Header;
