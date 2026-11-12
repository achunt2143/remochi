import React from 'react';
import './ListHeader.scss';

/**
 * Mochi ListHeader React Component
 * 
 * A simple mochi-styled list header that displays text above list content.
 * Lightweight wrapper with minimal styling.
 * 
 * Props:
 *   - content: String for list header text (default: '')
 *   - children: Optional content to render below header
 */
const ListHeader = ({ content = '', children, className = '', ...rest }) => {
  return (
    <div {...rest} className={['mochi-list-header', className].filter(Boolean).join(' ')}>
      {content}
      {children}
    </div>
  );
};

export default ListHeader;
