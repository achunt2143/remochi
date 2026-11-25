// MochiPagination.jsx — uses MochiButton for all page controls
import React, { useLayoutEffect, useRef, useState } from 'react';
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
  ...rest
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

  // The current page's accent bar is one element that slides to the new page
  // (the Button's own bar is hidden under it, see the SCSS). Measured from
  // that hidden bar, so it sits exactly where the Button's would.
  const pagesRef = useRef(null);
  const [bar, setBar] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const pages = pagesRef.current;
      const mark = pages?.querySelector('.mochi-pagination-current .mochi-underline');
      if (!mark) { setBar(null); return; }
      const pr = pages.getBoundingClientRect();
      const mr = mark.getBoundingClientRect();
      // offsetWidth ignores the Button's scaleX, which centres on the bar.
      const width = mark.offsetWidth;
      const next = {
        left: mr.left + mr.width / 2 - width / 2 - pr.left,
        top: mr.top - pr.top,
        width,
      };
      setBar((prev) =>
        prev && prev.left === next.left && prev.top === next.top && prev.width === next.width
          ? prev
          : { ...next, glide: prev !== null }
      );
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(pagesRef.current);
    // The Button sizes its bar once the label is measured, after first paint.
    const mark = pagesRef.current.querySelector('.mochi-pagination-current .mochi-underline');
    if (mark) ro.observe(mark);
    return () => ro.disconnect();
  }, [currentPage, totalPages, maxVisible]);

  const atFirst = currentPage === 1;
  const atLast  = currentPage === totalPages;

  return (
    <div {...rest} className={['mochi-pagination', className].filter(Boolean).join(' ')}>
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

      <div ref={pagesRef} className="mochi-pagination-pages">
        {getPageNumbers().map((page, idx) =>
          typeof page === 'string' ? (
            <span key={page} className="mochi-pagination-ellipsis">…</span>
          ) : (
            <MochiButton
              key={page}
              // `active` holds the Button's accent bar under the current page
              className={page === currentPage ? 'active mochi-pagination-current' : undefined}
              onClick={() => go(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {String(page)}
            </MochiButton>
          )
        )}
        {bar && (
          <span
            className="mochi-pagination-bar"
            aria-hidden="true"
            data-glide={bar.glide ? 'true' : undefined}
            style={{ left: bar.left, top: bar.top, width: bar.width }}
          />
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
