import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import './ViewSelectButton.scss';

/**
 * Mochi ViewSelectButtonItem Component
 *
 * Individual button item within a ViewSelectButton group.
 * Used internally by ViewSelectButton. Forwards its ref to the root div —
 * the parent needs the real DOM node to measure/position the sliding
 * underline bar (see ViewSelectButton's updateBarPosition). Sizing is left
 * to plain CSS (inline-block + padding) rather than a JS-measured width:
 * measuring this element's own offsetWidth and then feeding that back in
 * as its own explicit width is circular — the first measurement always
 * reads back whatever width was just set (0 on first render), so the box
 * never grows to fit its content.
 */
const ViewSelectButtonItem = React.forwardRef(({
  content,
  active = false,
  disabled = false,
  onClick = () => {},
}, ref) => (
  <div
    ref={ref}
    className={`mochi-view-select-button-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
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
));

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
  // findIndex returns -1 when no item is active, and `-1 || 0` evaluates
  // to -1 (a truthy value in JS) rather than falling through to the 0
  // default — so an explicit check is needed instead.
  const [activeIndex, setActiveIndex] = useState(() => {
    const initialIndex = items.findIndex(item => item.active);
    return initialIndex === -1 ? 0 : initialIndex;
  });
  const [barStyle, setBarStyle] = useState({ width: 0, left: 0 });
  // The bar is positioned absolutely inside .mochi-view-select-button-items
  // (its nearest `position: relative` ancestor — see the CSS), not the
  // outer .mochi-view-select-button container, which also includes the
  // left decorator bracket before it. Measuring against containerRef would
  // include that bracket's width/margin in the offset, pushing the bar too
  // far right of where the active item actually sits within its own
  // positioning context.
  const itemsWrapperRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    updateBarPosition();
    window.addEventListener('resize', updateBarPosition);
    return () => window.removeEventListener('resize', updateBarPosition);
  }, [activeIndex, items]);

  const updateBarPosition = () => {
    if (itemsRef.current[activeIndex]) {
      const activeElement = itemsRef.current[activeIndex];
      const wrapperRect = itemsWrapperRef.current?.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      if (wrapperRect) {
        const left = activeRect.left - wrapperRect.left;
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
    <div className={`mochi-view-select-button mochi-button-${variant}`}>
      <span className={`mochi-button-decorator mochi-button-decorator-left ${decoratorClasses}`}>
        {decoratorLeft}
      </span>

      <div ref={itemsWrapperRef} className="mochi-view-select-button-items">
        {items.map((item, index) => (
          <ViewSelectButtonItem
            key={index}
            ref={(el) => { itemsRef.current[index] = el; }}
            content={item.content}
            active={activeIndex === index}
            disabled={item.disabled}
            onClick={() => handleItemClick(index)}
          />
        ))}

        <div
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
