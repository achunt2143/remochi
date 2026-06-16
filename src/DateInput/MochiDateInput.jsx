// MochiDateInput.jsx
import React, { useState, useRef, useCallback } from 'react';
import { MochiInput }      from '../Input/MochiInput';
import { MochiButton }     from '../Button/MochiButton';
import { MochiPopupPanel } from '../Popup/MochiPopupPanel';
import { MochiItem }       from '../Item/MochiItem';
import './MochiDateInput.scss';

// ── helpers ────────────────────────────────────────────────────────────────
const DAYS  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDisplay(d) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function buildGrid(year, month) {
  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, date: new Date(year, month - 1, daysInPrev - i), cur: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, date: new Date(year, month, d), cur: true });
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++)
    cells.push({ day: d, date: new Date(year, month + 1, d), cur: false });

  return cells;
}

function sameDay(a, b) {
  return a && b &&
    a.getDate()     === b.getDate() &&
    a.getMonth()    === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
}

// ── Calendar ──────────────────────────────────────────────────────────────
function Calendar({ selected, onSelect, minDate, maxDate }) {
  const init = selected ?? new Date();
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();
  const cells = buildGrid(year, month);

  const isDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className="mochi-date-calendar">
      {/* Month navigation header */}
      <div className="mochi-date-calendar-header">
        <MochiButton type="normal" onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Previous month">‹</MochiButton>
        <span className="mochi-date-calendar-title">{MONTHS[month]} {year}</span>
        <MochiButton type="normal" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Next month">›</MochiButton>
      </div>

      {/* Day-of-week labels */}
      <div className="mochi-date-calendar-dow">
        {DAYS.map(d => (
          <div key={d} className="mochi-date-calendar-dow-cell">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="mochi-date-calendar-grid">
        {cells.map((cell, idx) => {
          const sel      = sameDay(cell.date, selected);
          const disabled = isDisabled(cell.date);

          return (
            <MochiItem
              key={idx}
              hoverable={!disabled}
              selected={sel}
              disabled={disabled}
              variant="compact"
              onClick={() => !disabled && onSelect(cell.date)}
              aria-label={isoDate(cell.date)}
              aria-pressed={sel}
              className={[
                'mochi-date-day',
                !cell.cur  ? 'mochi-date-day--other-month' : '',
                sel        ? 'mochi-date-day--selected'     : '',
                disabled   ? 'mochi-date-day--disabled'     : '',
              ].filter(Boolean).join(' ')}
            >
              {cell.day}
            </MochiItem>
          );
        })}
      </div>
    </div>
  );
}

// ── MochiDateInput ─────────────────────────────────────────────────────────
const MochiDateInput = ({
  value,
  onChange,
  label,
  placeholder = 'Select date…',
  minDate,
  maxDate,
  disabled = false,
  className = '',
}) => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [selected, setSelected] = useState(value ? new Date(value) : null);
  const triggerRef  = useRef(null);
  const anchorRectRef = useRef(null);

  const open = useCallback(() => {
    if (disabled) return;
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      anchorRectRef.current = {
        top: r.top, bottom: r.bottom,
        left: r.left, right: r.right,
        width: r.width, height: r.height,
      };
    }
    setIsOpen(true);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
    anchorRectRef.current = null;
  }, []);

  const handleSelect = (date) => {
    setSelected(date);
    onChange?.(date);
    close();
  };

  const displayValue = selected ? formatDisplay(selected) : '';

  return (
    <div className={className} style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '0.9rem', color: 'var(--mochi-text-muted, #888)' }}>
          {label}
        </label>
      )}

      <MochiInput
        ref={triggerRef}
        readOnly
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onClick={open}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', minWidth: '180px' }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      />

      <MochiPopupPanel
        isOpen={isOpen}
        anchorRect={anchorRectRef.current}
        onClose={close}
        title="Select a date"
      >
        <Calendar
          selected={selected}
          onSelect={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
        />
      </MochiPopupPanel>
    </div>
  );
};

export default MochiDateInput;
