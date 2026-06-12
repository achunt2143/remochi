// MochiPagination.jsx — uses MochiButton for all page controls
import React from 'react';
import { MochiButton } from '../Button/MochiButton';
import './MochiPagination.scss';

const MochiPagination = ({
  currentPage  = 1,
  totalPages   = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext  = true,
  maxVisible   = 7,
  className    = '',
}) => {
  const go = (page) => {
    if (page !== currentPage && onPageChange) onPageChange(page);
  };

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end   = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    const pages = [];
    if (start > 1) { pages.push(1); if (start > 2) pages.push('ellipsis-start'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('ellipsis-end'); pages.push(totalPages); }
    return pages;
  };

  const atFirst = currentPage === 1;
  const atLast  = currentPage === totalPages;

  return (
    <div className={`mochi-pagination ${className}`}>
      {showFirstLast && (
        <MochiButton
          type={atFirst ? 'disabled' : 'normal'}
          disabled={atFirst}
          onClick={() => go(1)}
          aria-label="First page"
        >
          ⟨
        </MochiButton>
      )}

      {showPrevNext && (
        <MochiButton
          type={atFirst ? 'disabled' : 'normal'}
          disabled={atFirst}
          onClick={() => go(currentPage - 1)}
          aria-label="Previous page"
        >
          ‹
        </MochiButton>
      )}

      <div className="mochi-pagination-pages">
        {getPageNumbers().map((page, idx) =>
          typeof page === 'string' ? (
            <span key={page} className="mochi-pagination-ellipsis">…</span>
          ) : (
            <MochiButton
              key={page}
              // 'dropdown' type uses the primary colour underline to mark the active page
              type={page === currentPage ? 'dropdown' : 'normal'}
              onClick={() => go(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {String(page)}
            </MochiButton>
          )
        )}
      </div>

      {showPrevNext && (
        <MochiButton
          type={atLast ? 'disabled' : 'normal'}
          disabled={atLast}
          onClick={() => go(currentPage + 1)}
          aria-label="Next page"
        >
          ›
        </MochiButton>
      )}

      {showFirstLast && (
        <MochiButton
          type={atLast ? 'disabled' : 'normal'}
          disabled={atLast}
          onClick={() => go(totalPages)}
          aria-label="Last page"
        >
          ⟩
        </MochiButton>
      )}

      <span className="mochi-pagination-info">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default MochiPagination;
