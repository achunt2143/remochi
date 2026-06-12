// MochiDateInput.jsx
import React, { useState, useRef, useCallback } from 'react';
import { MochiInput }      from '../Input/MochiInput';
import { MochiButton }     from '../Button/MochiButton';
import { MochiPopupPanel } from '../Popup/MochiPopupPanel';

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

  const cellBase = {
    width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%',
    fontSize: '0.85rem',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  };

  return (
    <div style={{ width: '252px', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <MochiButton type="normal" onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Previous month">‹</MochiButton>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--mochi-text, #333)' }}>
          {MONTHS[month]} {year}
        </span>
        <MochiButton type="normal" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Next month">›</MochiButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem',
            color: 'var(--mochi-text-faint, #aaa)', fontWeight: 600, padding: '2px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((cell, idx) => {
          const sel      = sameDay(cell.date, selected);
          const disabled = isDisabled(cell.date);
          return (
            <button
              key={idx}
              style={{
                ...cellBase,
                color: sel ? '#fff' : !cell.cur || disabled ? 'var(--mochi-text-faint, #bbb)' : 'var(--mochi-text, #333)',
                background: sel ? 'var(--mochi-primary, #43aae4)' : 'none',
                fontWeight: sel ? 700 : 400,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
              }}
              onClick={() => !disabled && onSelect(cell.date)}
              disabled={disabled}
              aria-label={isoDate(cell.date)}
              aria-pressed={sel}
            >
              {cell.day}
            </button>
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
  // Pass the DOM ref directly — PopupPanel reads a fresh getBoundingClientRect()
  // each time it computes position, so there's no stale-snapshot problem.
  const triggerRef = useRef(null);

  const open  = useCallback(() => { if (!disabled) setIsOpen(true);  }, [disabled]);
  const close = useCallback(() => setIsOpen(false), []);

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

      {/* anchorEl receives the live ref so PopupPanel always gets a fresh rect */}
      <MochiPopupPanel
        isOpen={isOpen}
        anchorEl={triggerRef}
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
