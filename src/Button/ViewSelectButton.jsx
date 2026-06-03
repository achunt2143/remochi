import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import './ViewSelectButton.scss';

/**
 * Mochi ViewSelectButtonItem Component
 * 
 * Individual button item within a ViewSelectButton group.
 * Used internally by ViewSelectButton.
 */
const ViewSelectButtonItem = ({ 
  content, 
  active = false,
  disabled = false,
  onClick = () => {},
  variant = 'normal'
}) => {
  const itemRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPadded, setIsPadded] = useState(false);

  useEffect(() => {
    recalcContentWidth();
    window.addEventListener('resize', recalcContentWidth);
    return () => window.removeEventListener('resize', recalcContentWidth);
  }, [content]);

  const recalcContentWidth = () => {
    if (itemRef.current) {
      const width = itemRef.current.offsetWidth;
      setContentWidth(width);
      setIsPadded(width !== 0);
    }
  };

  const itemWidth = isPadded 
    ? contentWidth + (content.length + 2) * 2
    : contentWidth;

  return (
    <div
      ref={itemRef}
      className={`mochi-view-select-button-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      style={{ width: `${itemWidth}px` }}
      onClick={onClick}
      role="radio"
      aria-checked={active}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span className="mochi-button-base">{content}</span>
    </div>
  );
};

/**
 * Mochi ViewSelectButton React Component
 * 
 * A group of buttons laid out horizontally with decorative end-caps and animated selection bar.
 * Only one button can be active at a time (radio button behavior).
 * 
 * Props:
 *   - items: Array of { content: string, active?: boolean, disabled?: boolean }
 *   - onSelect: Callback(selectedItem, index) when selection changes
 *   - decoratorLeft: Left bracket character (default: '(')
 *   - decoratorRight: Right bracket character (default: ')')
 *   - barClasses: CSS classes for bar styling (default: '')
 *   - decoratorClasses: CSS classes for decorator styling (default: '')
 *   - variant: 'normal' | 'warning' | 'affirmative' | 'blue' (default: 'normal')
 */
const ViewSelectButton = ({
  items = [],
  onSelect = () => {},
  decoratorLeft = '(',
  decoratorRight = ')',
  barClasses = '',
  decoratorClasses = '',
  variant = 'normal'
}) => {
  const [activeIndex, setActiveIndex] = useState(
    items.findIndex(item => item.active) || 0
  );
  const [barStyle, setBarStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    updateBarPosition();
    window.addEventListener('resize', updateBarPosition);
    return () => window.removeEventListener('resize', updateBarPosition);
  }, [activeIndex, items]);

  const updateBarPosition = () => {
    if (itemsRef.current[activeIndex]) {
      const activeElement = itemsRef.current[activeIndex];
      const containerRect = containerRef.current?.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      if (containerRect) {
        const left = activeRect.left - containerRect.left;
        const width = activeRect.width;

        setBarStyle({
          width: `${width}px`,
          left: `${left}px`,
          transition: 'all 0.3s ease'
        });
      }
    }
  };

  const handleItemClick = (index) => {
    if (!items[index].disabled) {
      setActiveIndex(index);
      onSelect(items[index], index);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`mochi-view-select-button mochi-button-${variant}`}
    >
      <span className={`mochi-button-decorator mochi-button-decorator-left ${decoratorClasses}`}>
        {decoratorLeft}
      </span>

      <div className="mochi-view-select-button-items">
        {items.map((item, index) => (
          <ViewSelectButtonItem
            key={index}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            content={item.content}
            active={activeIndex === index}
            disabled={item.disabled}
            variant={variant}
            onClick={() => handleItemClick(index)}
          />
        ))}

        <div
          ref={barRef}
          className={`mochi-button-bar ${barClasses}`}
          style={barStyle}
        />
      </div>

      <span className={`mochi-button-decorator mochi-button-decorator-right ${decoratorClasses}`}>
        {decoratorRight}
      </span>
    </div>
  );
};

export default ViewSelectButton;
export { ViewSelectButtonItem };
