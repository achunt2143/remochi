export default TextArea;
/**
 * Mochi TextArea React Component
 *
 * A mochi-styled textarea control for multi-line text input.
 * Typically used within an InputDecorator component for proper styling.
 *
 * Props:
 *   - value: String for textarea content
 *   - onChange: Callback(event) when content changes
 *   - onFocus: Callback(event) when textarea receives focus
 *   - onBlur: Callback(event) when textarea loses focus
 *   - disabled: Boolean to disable textarea (default: false)
 *   - placeholder: Placeholder text when empty
 *   - defaultFocus: Boolean to auto-focus on render (default: false)
 *   - minHeight: Minimum height in pixels (default: 50)
 *   - rows: Number of visible text rows (default: 4)
 *   - className: Additional CSS classes
 */
declare function TextArea({ value, onChange, onFocus, onBlur, disabled, placeholder, defaultFocus, minHeight, rows, className }: {
    value?: string | undefined;
    onChange?: (() => void) | undefined;
    onFocus?: (() => void) | undefined;
    onBlur?: (() => void) | undefined;
    disabled?: boolean | undefined;
    placeholder?: string | undefined;
    defaultFocus?: boolean | undefined;
    minHeight?: number | undefined;
    rows?: number | undefined;
    className?: string | undefined;
}): any;
