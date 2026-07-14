export default ViewSelectButton;
/**
 * Mochi ViewSelectButton React Component
 *
 * A group of buttons laid out horizontally with decorative end-caps and animated selection bar.
 * Only one button can be active at a time (radio button behavior).
 *
 * Props:
 *   - items: Array of { content: string, active?: boolean, disabled?: boolean }
 *   - onSelect: Callback(selectedItem, index) when selection changes
 *   - decoratorLeft: Left bracket character (default: '(')
 *   - decoratorRight: Right bracket character (default: ')')
 *   - barClasses: CSS classes for bar styling (default: '')
 *   - decoratorClasses: CSS classes for decorator styling (default: '')
 *   - variant: 'normal' | 'warning' | 'affirmative' | 'blue' (default: 'normal')
 */
declare function ViewSelectButton({ items, onSelect, decoratorLeft, decoratorRight, barClasses, decoratorClasses, variant }: {
    items?: never[] | undefined;
    onSelect?: (() => void) | undefined;
    decoratorLeft?: string | undefined;
    decoratorRight?: string | undefined;
    barClasses?: string | undefined;
    decoratorClasses?: string | undefined;
    variant?: string | undefined;
}): any;
/**
 * Mochi ViewSelectButtonItem Component
 *
 * Individual button item within a ViewSelectButton group.
 * Used internally by ViewSelectButton. Forwards its ref to the root div —
 * the parent needs the real DOM node to measure/position the sliding
 * underline bar (see ViewSelectButton's updateBarPosition). Sizing is left
 * to plain CSS (inline-block + padding) rather than a JS-measured width:
 * measuring this element's own offsetWidth and then feeding that back in
 * as its own explicit width is circular — the first measurement always
 * reads back whatever width was just set (0 on first render), so the box
 * never grows to fit its content.
 */
export const ViewSelectButtonItem: any;
