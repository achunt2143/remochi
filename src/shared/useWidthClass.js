import { useState, useEffect, useLayoutEffect } from 'react';
import { SCREEN_NARROW, SCREEN_WIDE } from './screens';

// useLayoutEffect warns during server rendering; fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const classify = (width, narrow, wide) => (width <= narrow ? 'narrow' : width >= wide ? 'wide' : 'medium');

/**
 * useWidthClass — 'narrow' | 'medium' | 'wide' for the width the element
 * actually has (its content box), not the window's, so a narrow pane on a
 * wide screen behaves as narrow. Narrow is up to `narrow`, wide from `wide`.
 * Reads 'medium' until measured (and on the server); measured synchronously
 * on mount. Falls back to the window width where ResizeObserver is missing.
 */
export function useWidthClass(ref, { narrow = SCREEN_NARROW, wide = SCREEN_WIDE } = {}) {
  const [widthClass, setWidthClass] = useState('medium');

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const apply = (width) => setWidthClass(classify(width, narrow, wide));
    const check = () => apply(el.getBoundingClientRect().width);
    check();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver((entries) => {
        const box = entries[0] && entries[0].contentRect;
        if (box) apply(box.width);
        else check();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
    const onResize = () => apply(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [ref, narrow, wide]);

  return widthClass;
}
