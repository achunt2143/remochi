import React, { useState, useRef } from 'react';
import './ListItem.scss';

/**
 * Mochi ListItem React Component
 * 
 * A control designed to display a group of stacked items, typically used in lists.
 * Items are displayed with styling between them and highlight on tap/click.
 * 
 * Props:
 *   - children: Content to display in the list item
 *   - tapHighlight: Enable/disable tap highlight effect (default: true)
 *   - onSelect: Callback fired when item is selected/highlighted
 */
const ListItem = ({ 
  children, 
  tapHighlight = true,
  onSelect = () => {} 
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const itemRef = useRef(null);

  const handleMouseDown = () => {
    if (tapHighlight) {
      setIsHighlighted(true);
      onSelect(true);
    }
  };

  const handleMouseUp = () => {
    if (tapHighlight) {
      setIsHighlighted(false);
      onSelect(false);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`mochi-list-item ${isHighlighted ? 'mochi-highlight' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="option"
    >
      {isHighlighted && (
        <>
          <div className="mochi-highlight-border top" />
        </>
      )}
      <div className="mochi-list-item-content">
        {children}
      </div>
      {isHighlighted && (
        <>
          <div className="mochi-highlight-border bottom" />
        </>
      )}
    </div>
  );
};

export default ListItem;
