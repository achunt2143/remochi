import React, { useState } from 'react';
import './GridList.scss';

/**
 * Mochi GridList Image Item Component
 * 
 * Displays an image with optional caption in a grid layout.
 * Supports selection with visual feedback.
 * 
 * Props:
 *   - src: Image source URL
 *   - caption: Optional caption text
 *   - onSelect: Callback when item is selected
 *   - selected: Boolean for selected state
 */
const GridListImageItem = ({ 
  src, 
  caption, 
  onSelect = () => {},
  selected = false,
  className = '',
  onClick: userOnClick,
  onKeyDown: userOnKeyDown,
  ...rest
}) => {
  const handleClick = (e) => {
    userOnClick?.(e);
    if (!e?.defaultPrevented) onSelect(!selected);
  };

  return (
    <div
      {...rest}
      className={['mochi-gridlist-imageitem', selected && 'selected', className]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        userOnKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      <img src={src} alt={caption || 'Grid item'} />
      {caption && <div className="caption">{caption}</div>}
    </div>
  );
};

/**
 * Mochi GridList React Component
 * 
 * A grid layout container for displaying image items.
 * Supports selection and responsive grid sizing.
 * 
 * Props:
 *   - children: GridListImageItem components
 *   - columns: Number of columns (default: 3)
 *   - gap: Gap between items in px (default: 12)
 */
const GridList = ({ 
  children, 
  columns = 3,
  gap = 12,
  className = '',
  style,
  ...rest
}) => {
  return (
    <div 
      {...rest}
      className={['mochi-gridlist', className].filter(Boolean).join(' ')}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        padding: `${gap}px`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default GridList;
export { GridListImageItem };
