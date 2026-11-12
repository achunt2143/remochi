import React, { useState } from 'react';
import './Collapsable.scss';

/**
 * CollapsableHeader — clickable title bar.
 * Used internally by Collapsable; also exported for custom layouts.
 */
export const CollapsableHeader = ({
  children,
  onClick,
  className = '',
  onKeyDown: userOnKeyDown,
  ...rest
}) => (
  <div
    {...rest}
    className={['mochi-collapsable-header', className].filter(Boolean).join(' ')}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      userOnKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick && onClick(e);
      }
    }}
  >
    {children}
  </div>
);

/**
 * CollapsableItem — styled content row.
 * Wrap individual items inside a Collapsable for the original Enyo look.
 */
export const CollapsableItem = ({ children, className = '', ...rest }) => (
  <div {...rest} className={['mochi-collapsable-item', className].filter(Boolean).join(' ')}>
    {children}
  </div>
);

/**
 * CollapsableFooter — bottom divider bar.
 */
export const CollapsableFooter = ({ className = '', ...rest }) => (
  <div {...rest} className={['mochi-collapsable-footer', className].filter(Boolean).join(' ')} />
);

/**
 * Collapsable
 *
 * Supports both controlled and uncontrolled usage:
 *
 *   Controlled:    <Collapsable title="…" isOpen={open} onToggle={setOpen}>
 *   Uncontrolled:  <Collapsable title="…" defaultExpanded>
 *
 * Children are rendered as-is — no automatic CollapsableItem wrapping.
 */
const Collapsable = ({
  title,
  children,
  // controlled
  isOpen,
  onToggle,
  // uncontrolled fallback
  defaultExpanded = false,
  className = '',
  ...rest
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultExpanded);

  // Controlled when isOpen is explicitly supplied; otherwise use internal state
  const controlled = isOpen !== undefined;
  const expanded = controlled ? isOpen : internalOpen;

  const handleToggle = () => {
    const next = !expanded;
    if (!controlled) setInternalOpen(next);
    onToggle && onToggle(next);
  };

  return (
    <div {...rest} className={['mochi-collapsable', className].filter(Boolean).join(' ')}>
      <CollapsableHeader onClick={handleToggle}>
        <span
          className="mochi-collapsable-toggle"
          aria-hidden="true"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
        {title}
      </CollapsableHeader>

      {/*
        CSS grid trick: grid-template-rows transitions between 0fr and 1fr
        giving a smooth height animation without needing a fixed max-height.
        The inner wrapper has overflow:hidden so content is clipped during animation.
      */}
      <div
        className="mochi-collapsable-body"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
        aria-hidden={!expanded}
      >
        <div className="mochi-collapsable-content">
          {children}
        </div>
      </div>

      <CollapsableFooter />
    </div>
  );
};

export default Collapsable;
