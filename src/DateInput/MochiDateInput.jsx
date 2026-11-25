// MochiDateInput.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MochiInput }      from '../Input/MochiInput';
import './MochiDateInput.scss';
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

// A date-only 'YYYY-MM-DD' string is a calendar day, so it is read as a LOCAL
// date (`new Date('2024-01-15')` would be UTC midnight, the 14th west of UTC).
// Strings with a time part and Date objects keep their instant.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
function toDate(v) {
  if (!v) return null;
  if (typeof v === 'string') {
    const m = DATE_ONLY.exec(v.trim());
    if (m) {
      const y = +m[1], mo = +m[2] - 1, d = +m[3];
      const local = new Date(y, mo, d);
      // new Date(y, ...) maps years 0-99 to 19xx, and rolls 02-31 over.
      local.setFullYear(y);
      return local.getMonth() === mo && local.getDate() === d ? local : null;
    }
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
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
  // Follow the selection (e.g. a `value` prop that changed) to its month.
  const selectedTime = selected ? selected.getTime() : null;
  useEffect(() => {
    if (selectedTime === null) return;
    const s = new Date(selectedTime);
    setView(new Date(s.getFullYear(), s.getMonth(), 1));
  }, [selectedTime]);
  // Which arrow the month last changed by: the day grid arrives from that side.
  const [slide, setSlide] = useState(null);

  const year  = view.getFullYear();
  const month = view.getMonth();
  const cells = buildGrid(year, month);

  const min = toDate(minDate);
  const max = toDate(maxDate);
  const isDisabled = (date) => {
    if (min && date < min) return true;
    if (max && date > max) return true;
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
    transition: 'background var(--mochi-duration-control, 200ms) var(--mochi-ease-forward, ease)',
  };

  const goMonth = (delta) => {
    setSlide(delta > 0 ? 'next' : 'prev');
    setView(new Date(year, month + delta, 1));
  };

  return (
    <div style={{ width: '252px', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <MochiButton type="normal" onClick={() => goMonth(-1)} aria-label="Previous month">‹</MochiButton>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--mochi-text, #1a1a1a)' }}>
          {MONTHS[month]} {year}
        </span>
        <MochiButton type="normal" onClick={() => goMonth(1)} aria-label="Next month">›</MochiButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem',
            color: 'var(--mochi-text-faint, #888888)', fontWeight: 600, padding: '2px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Keyed by month so a change remounts it and the slide runs. */}
      <div
        key={`${year}-${month}`}
        className={slide ? `mochi-date-grid mochi-date-grid-${slide}` : 'mochi-date-grid'}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}
      >
        {cells.map((cell, idx) => {
          const sel      = sameDay(cell.date, selected);
          const disabled = isDisabled(cell.date);
          return (
            <button
              key={idx}
              className={sel ? 'mochi-date-cell mochi-date-cell-selected' : 'mochi-date-cell'}
              style={{
                ...cellBase,
                color: sel ? 'var(--mochi-primary-text, #ffffff)' : !cell.cur || disabled ? 'var(--mochi-text-faint, #888888)' : 'var(--mochi-text, #1a1a1a)',
                background: sel ? 'var(--mochi-primary, #357099)' : 'none',
                fontWeight: sel ? 700 : 400,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 'var(--mochi-disabled-opacity, 0.4)' : 1,
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
  style,
  ...rest
}) => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [selected, setSelected] = useState(toDate(value));
  const triggerRef  = useRef(null);
  // anchorRectRef holds the DOMRect captured synchronously at click time,
  // before React re-renders or any side effects (like overflow:hidden) can
  // shift the scroll position and invalidate the coordinates.
  const anchorRectRef = useRef(null);

  const open = useCallback(() => {
    if (disabled) return;
    // Capture the rect NOW — synchronously inside the click handler,
    // before setIsOpen triggers a re-render or anything else moves the page.
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      // Convert to a plain object so it stays stable across renders.
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

  // Follow later changes to the `value` prop (string or Date). Skips the first
  // render (already seeded above) and never calls onChange.
  const valueTime = toDate(value)?.getTime() ?? null;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setSelected(valueTime === null ? null : new Date(valueTime));
  }, [valueTime]);

  const handleSelect = (date) => {
    setSelected(date);
    onChange?.(date);
    close();
  };

  const displayValue = selected ? formatDisplay(selected) : '';

  return (
    <div
      {...rest}
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
    >
      {label && (
        <label style={{ fontSize: '0.9rem', color: 'var(--mochi-text-muted, #555555)' }}>
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

      {/* anchorRect is the rect captured synchronously at click time so the
          popup positions correctly regardless of scroll position. */}
      <MochiPopupPanel
        isOpen={isOpen}
        anchorRect={anchorRectRef.current}
        onClose={close}
        title="Select date"
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
