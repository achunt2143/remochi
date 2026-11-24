import React from 'react';
import './Badge.scss';

// Variant → background color map. Themed via the same --mochi-* tokens
// MochiButton/Radio/Toggle/Checkbox use, rather than hardcoded hex, so a
// badge's color stays consistent with the rest of the theme instead of a
// fixed value that doesn't adjust in dark mode — warning matches the
// amber --mochi-selected accent (same as Radio/Toggle/Checkbox's checked
// state), error/danger match --mochi-error (same as the warning Button).
const VARIANT_COLORS = {
  default: 'var(--mochi-primary, #357099)',
  success: 'var(--mochi-success, #388e3c)',
  warning: 'var(--mochi-selected, #ffb80d)',
  error:   'var(--mochi-error, #c62828)',
  danger:  'var(--mochi-error, #c62828)',
  info:    'var(--mochi-info, #1565c0)',
};

// Default label ink: white, except on the amber warning fill where white is
// 1.73:1 — that gets --mochi-on-selected-ink (#404040).
const VARIANT_INK = {
  warning: 'var(--mochi-on-selected-ink, #404040)',
};
const DEFAULT_INK = 'var(--mochi-primary-text, #ffffff)';

/**
 * MochiBadge — faithful React port of mochi.Badge.
 *
 * Supports two usage styles:
 *
 *   1. Variant label badge (demo style):
 *      <Badge variant="success">Active</Badge>
 *      <Badge count={7}>Notifications</Badge>
 *
 *   2. Legacy content prop:
 *      <Badge content="42" />
 *
 * Props:
 *   children   {ReactNode}      Label text (takes priority over `content`)
 *   content    {string|number}  Legacy: text to display
 *   variant    {string}         'default'|'success'|'warning'|'error'|'danger'|'info'
 *   count      {number}         If provided, renders a count pill after the label
 *   background {string}         Override background color (overrides variant)
 *   color      {string}         Text color (default: white; dark on the warning variant)
 */
const Badge = ({
  children,
  content,
  variant    = 'default',
  count,
  background,
  color,
  className  = '',
  ...rest
}) => {
  // Resolve label: children > content > empty
  const label = children ?? (content !== undefined ? String(content) : '');
  const isEmpty = label === '' && count === undefined;

  if (isEmpty) return null;

  // Resolve background: explicit prop > variant map > default
  const bg = background || VARIANT_COLORS[variant] || VARIANT_COLORS.default;

  const isOval = typeof label === 'string' && label.length > 2;
  const innerClass = `mochi-badge-inner ${isOval || count !== undefined ? 'oval' : 'round'}`;

  return (
    <div {...rest} className={['mochi-badge', className].filter(Boolean).join(' ')}>
      <div
        className={innerClass}
        style={{ background: bg, color: color || VARIANT_INK[variant] || DEFAULT_INK }}
      >
        {label}
        {count !== undefined && (
          <span className="mochi-badge-count">{count}</span>
        )}
      </div>
    </div>
  );
};

export { Badge };
export { Badge as MochiBadge };
