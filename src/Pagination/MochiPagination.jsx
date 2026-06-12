// MochiPagination.jsx — uses Button component for all page controls
import React from 'react';
import { Button } from '../Button';
import './MochiPagination.scss';

const MochiPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisible = 7,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('ellipsis-start');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('ellipsis-end');
      pages.push(totalPages);
    }

    return pages;
  };

  const go = (page) => {
    if (page !== currentPage && onPageChange) onPageChange(page);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`mochi-pagination ${className}`}>
      {showFirstLast && (
        <Button
          decoratorLeft="⟨"
          disabled={currentPage === 1}
          onClick={() => go(1)}
          aria-label="First page"
        />
      )}

      {showPrevNext && (
        <Button
          decoratorLeft="‹"
          disabled={currentPage === 1}
          onClick={() => go(currentPage - 1)}
          aria-label="Previous page"
        />
      )}

      <div className="mochi-pagination-pages">
        {pageNumbers.map((page, idx) =>
          typeof page === 'string' ? (
            <span key={page} className="mochi-pagination-ellipsis">…</span>
          ) : (
            <span
              key={page}
              className={page === currentPage ? 'mochi-pagination-active' : ''}
            >
              <Button
                content={String(page)}
                isActive={page === currentPage}
                onClick={() => go(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              />
            </span>
          )
        )}
      </div>

      {showPrevNext && (
        <Button
          decoratorRight="›"
          disabled={currentPage === totalPages}
          onClick={() => go(currentPage + 1)}
          aria-label="Next page"
        />
      )}

      {showFirstLast && (
        <Button
          decoratorRight="⟩"
          disabled={currentPage === totalPages}
          onClick={() => go(totalPages)}
          aria-label="Last page"
        />
      )}

      <span className="mochi-pagination-info">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default MochiPagination;
