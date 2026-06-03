// MochiDateInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import './MochiDateInput.scss';

const MochiDateInput = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [viewMonth, setViewMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
    setIsOpen(false);
  };

  const changeMonth = (delta) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  };

  const isDateSelected = (date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(viewMonth);
  const monthYear = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={`mochi-date-input ${className}`} ref={containerRef}>
      {label && <label className="mochi-date-input-label">{label}</label>}
      <div 
        className={`mochi-date-input-field ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="mochi-date-input-value">
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <span className="mochi-date-input-icon">📅</span>
      </div>

      {isOpen && (
        <div className="mochi-date-picker">
          <div className="mochi-date-picker-header">
            <button 
              className="mochi-date-picker-nav"
              onClick={() => changeMonth(-1)}
            >
              ‹
            </button>
            <span className="mochi-date-picker-month">{monthYear}</span>
            <button 
              className="mochi-date-picker-nav"
              onClick={() => changeMonth(1)}
            >
              ›
            </button>
          </div>

          <div className="mochi-date-picker-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="mochi-date-picker-weekday">{day}</div>
            ))}
          </div>

          <div className="mochi-date-picker-days">
            {days.map((dayObj, idx) => (
              <button
                key={idx}
                className={`mochi-date-picker-day 
                  ${!dayObj.isCurrentMonth ? 'other-month' : ''}
                  ${isDateSelected(dayObj.date) ? 'selected' : ''}
                `}
                onClick={() => handleDateClick(dayObj.date)}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MochiDateInput;
