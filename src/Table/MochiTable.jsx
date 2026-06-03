// MochiTable.jsx
import React, { useState } from 'react';
import './MochiTable.scss';

const MochiTable = ({
  columns = [],
  data = [],
  sortable = true,
  hoverable = true,
  striped = false,
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedData = getSortedData();

  return (
    <div className={`mochi-table-container ${className}`}>
      <table className={`mochi-table ${hoverable ? 'hoverable' : ''} ${striped ? 'striped' : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`mochi-table-header ${sortable ? 'sortable' : ''} ${
                  sortConfig.key === column.key ? 'active' : ''
                }`}
                onClick={() => handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="mochi-table-header-content">
                  <span>{column.label}</span>
                  {sortable && sortConfig.key === column.key && (
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
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.key} className="mochi-table-cell">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
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
