/**
 * useWidthClass — 'narrow' | 'medium' | 'wide' for the width the element
 * actually has (its content box), not the window's, so a narrow pane on a
 * wide screen behaves as narrow. Narrow is up to `narrow`, wide from `wide`.
 * Reads 'medium' until measured (and on the server); measured synchronously
 * on mount. Falls back to the window width where ResizeObserver is missing.
 */
export function useWidthClass(ref: any, { narrow, wide }?: {
    narrow?: number | undefined;
    wide?: number | undefined;
}): any;
