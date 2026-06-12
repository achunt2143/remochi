// MochiDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import MochiMenu from './MochiMenu';
import './MochiDropdown.scss';

/**
 * MochiDropdown
 *
 * A styled trigger button that opens a MochiMenu (contextual popup) with a
 * list of options. Mirrors the mochi.Menu + mochi.MenuDecorator pattern.
 *
 * Props:
 *   options      {Array}    Array of option objects:
 *                             { value, label }          — normal item
 *                             { divider: true }         — horizontal rule
 *                             { label: true, content }  — section header
 *   value        {*}        Currently selected value
 *   onChange     {Function} Called with the selected option's value
 *   label        {string}   Optional field label rendered above the trigger
 *   placeholder  {string}   Text shown when nothing is selected
 *   disabled     {boolean}  Disables the trigger
 *   maxHeight    {number}   Max height of the menu in px (default: 200)
 *   className    {string}   Extra class on the root wrapper
 */
const MochiDropdown = ({
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  disabled = false,
  maxHeight = 200,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const selectedOption = options.find(opt => !opt.divider && !opt.label && opt.value === value);

  const handleSelect = (option) => {
    if (option.divider || option.label || option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleTrigger = () => {
    if (!disabled) setIsOpen(o => !o);
  };

  return (
    <div className={`mochi-dropdown ${className}`}>
      {label && <label className="mochi-dropdown-label">{label}</label>}

      {/* Activator / trigger button */}
      <div
        ref={triggerRef}
        className={[
          'mochi-dropdown-trigger',
          disabled && 'disabled',
          isOpen   && 'open',
        ].filter(Boolean).join(' ')}
        onClick={handleTrigger}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleTrigger(); }
          if (e.key === 'Escape') setIsOpen(false);
        }}
      >
        <span className="mochi-dropdown-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`mochi-dropdown-arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </div>

      {/* Contextual popup menu */}
      <MochiMenu
        isOpen={isOpen}
        anchorEl={triggerRef}
        onClose={() => setIsOpen(false)}
        maxHeight={maxHeight}
      >
        {options.map((option, idx) => {
          if (option.divider) {
            return <div key={idx} className="mochi-menu-divider" role="separator" />;
          }
          if (option.label) {
            return <div key={idx} className="mochi-menu-label">{option.content ?? option.label}</div>;
          }
          const isSelected = option.value === value;
          return (
            <div
              key={option.value ?? idx}
              className={[
                'mochi-menu-item',
                isSelected       && 'selected',
                option.disabled  && 'disabled',
              ].filter(Boolean).join(' ')}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {isSelected && <span className="mochi-menu-item-check">✓</span>}
            </div>
          );
        })}
      </MochiMenu>
    </div>
  );
};

export default MochiDropdown;
