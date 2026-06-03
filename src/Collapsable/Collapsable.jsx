import React, { useState } from 'react';
import './Collapsable.scss';

/**
 * Mochi CollapsableHeader Component
 * 
 * Header/title for collapsable sections
 */
const CollapsableHeader = ({ children, onClick }) => {
  return (
    <div 
      className="mochi-collapsable-header"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

/**
 * Mochi CollapsableItem Component
 * 
 * Content item within collapsable section
 */
const CollapsableItem = ({ children }) => {
  return (
    <div className="mochi-collapsable-item">
      {children}
    </div>
  );
};

/**
 * Mochi CollapsableFooter Component
 * 
 * Footer/divider for collapsable sections
 */
const CollapsableFooter = () => {
  return <div className="mochi-collapsable-footer" />;
};

/**
 * Mochi Collapsable React Component
 * 
 * A container for collapsable sections with header, content items, and footer.
 * Manages expand/collapse state and animations.
 * 
 * Props:
 *   - title: String for the header title
 *   - children: Content items to display when expanded
 *   - defaultExpanded: Boolean for initial expanded state (default: false)
 *   - onToggle: Callback fired when toggle state changes
 */
const Collapsable = ({ 
  title, 
  children, 
  defaultExpanded = false,
  onToggle = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle(newState);
  };

  return (
    <div className="mochi-collapsable">
      <CollapsableHeader onClick={handleToggle}>
        <span className="mochi-collapsable-toggle">
          {isExpanded ? '▼' : '▶'}
        </span>
        {title}
      </CollapsableHeader>
      
      {isExpanded && (
        <div className="mochi-collapsable-content">
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <CollapsableItem key={index}>
                {child}
              </CollapsableItem>
            ))
          ) : (
            <CollapsableItem>{children}</CollapsableItem>
          )}
        </div>
      )}
      
      <CollapsableFooter />
    </div>
  );
};

export default Collapsable;
export { CollapsableHeader, CollapsableItem, CollapsableFooter };
