// MochiDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import './MochiDropdown.scss';

const MochiDropdown = ({
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  disabled = false,
  searchable = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, searchable]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable && searchTerm
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`mochi-dropdown ${className}`} ref={containerRef}>
      {label && <label className="mochi-dropdown-label">{label}</label>}
      <div 
        className={`mochi-dropdown-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="mochi-dropdown-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`mochi-dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="mochi-dropdown-menu">
          {searchable && (
            <div className="mochi-dropdown-search">
              <input
                ref={searchInputRef}
                type="text"
                className="mochi-dropdown-search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="mochi-dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`mochi-dropdown-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  {option.value === value && (
                    <span className="mochi-dropdown-check">✓</span>
                  )}
                </div>
              ))
            ) : (
              <div className="mochi-dropdown-empty">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MochiDropdown;
