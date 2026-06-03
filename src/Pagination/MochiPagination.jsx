// MochiPagination.jsx
import React from 'react';
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

    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Show page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1 && onPageChange) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages && onPageChange) {
      onPageChange(totalPages);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`mochi-pagination ${className}`}>
      {showFirstLast && (
        <button
          className="mochi-pagination-btn mochi-pagination-first"
          onClick={handleFirst}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          ⟨⟨
        </button>
      )}

      {showPrevNext && (
        <button
          className="mochi-pagination-btn mochi-pagination-prev"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
      )}

      <div className="mochi-pagination-pages">
        {pageNumbers.map((page, index) => {
          if (typeof page === 'string' && page.startsWith('ellipsis')) {
            return (
              <span key={page} className="mochi-pagination-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={index}
              className={`mochi-pagination-btn mochi-pagination-page ${
                page === currentPage ? 'active' : ''
              }`}
              onClick={() => handlePageClick(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {showPrevNext && (
        <button
          className="mochi-pagination-btn mochi-pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      )}

      {showFirstLast && (
        <button
          className="mochi-pagination-btn mochi-pagination-last"
          onClick={handleLast}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          ⟩⟩
        </button>
      )}

      <div className="mochi-pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default MochiPagination;
