// MochiTable.jsx
import React, { useState } from 'react';
import './MochiTable.scss';

/**
 * MochiTable accepts two shapes for columns + row data:
 *
 * Shape A — simple (matches the demo):
 *   columns = ['Name', 'Role', 'Status']             // string[]
 *   rows    = [['Alice','Engineer','Active'], ...]    // string[][] or any[][]
 *
 * Shape B — rich:
 *   columns = [{ key, label, width?, render? }]       // object[]
 *   data    = [{ name:'Alice', role:'Engineer' }, ...]// object[]
 *
 * Both shapes are normalised to Shape B internally.
 */
const MochiTable = ({
  // Shape A
  columns   = [],
  rows,
  onRowClick,
  // Shape B (also accepted)
  data,
  // Shared
  sortable  = true,
  hoverable = true,
  striped   = false,
  className = '',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // ── Normalise to rich shape ────────────────────────────────────────
  const isSimpleColumns = columns.length > 0 && typeof columns[0] === 'string';

  const normColumns = isSimpleColumns
    ? columns.map((label, i) => ({ key: String(i), label }))
    : columns;

  // Prefer `rows` (Shape A); fall back to `data` (Shape B)
  const sourceRows = rows ?? data ?? [];

  const normData = isSimpleColumns
    // Shape A: each row is an array — convert to { '0': val, '1': val, ... }
    // Preserve the original array on a _row property for onRowClick
    ? sourceRows.map((row) => {
        const obj = { _row: row };
        normColumns.forEach((col, i) => { obj[col.key] = row[i]; });
        return obj;
      })
    // Shape B: already objects; attach _row = the object itself
    : sourceRows.map((row) => ({ _row: row, ...row }));

  // ── Sort ────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = sortConfig.key
    ? [...normData].sort((a, b) => {
        const av = a[sortConfig.key];
        const bv = b[sortConfig.key];
        if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
        if (av > bv) return sortConfig.direction === 'asc' ?  1 : -1;
        return 0;
      })
    : normData;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={`mochi-table-container ${className}`}>
      <table
        className={[
          'mochi-table',
          hoverable ? 'hoverable' : '',
          striped   ? 'striped'   : '',
        ].join(' ').trim()}
      >
        <thead>
          <tr>
            {normColumns.map((col) => (
              <th
                key={col.key}
                className={[
                  'mochi-table-header',
                  sortable ? 'sortable' : '',
                  sortConfig.key === col.key ? 'active' : '',
                ].join(' ').trim()}
                onClick={() => handleSort(col.key)}
                style={col.width ? { width: col.width } : undefined}
              >
                <div className="mochi-table-header-content">
                  <span>{col.label}</span>
                  {sortable && sortConfig.key === col.key && (
                    <span className="mochi-table-sort-indicator">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={onRowClick ? () => onRowClick(row._row) : undefined}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {normColumns.map((col) => (
                <td key={col.key} className="mochi-table-cell">
                  {col.render ? col.render(row[col.key], row._row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MochiTable;
