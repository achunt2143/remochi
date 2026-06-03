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
const ListHeader = ({ content = '', children }) => {
  return (
    <div className="mochi-list-header">
      {content}
      {children}
    </div>
  );
};

export default ListHeader;
