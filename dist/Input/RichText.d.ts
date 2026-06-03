export default RichText;
/**
 * Mochi RichText React Component
 *
 * A mochi-styled contenteditable div for rich text input.
 * Supports formatted text like bold, italic, underline, etc.
 * Typically used within an InputDecorator component for proper styling.
 *
 * Note: RichText requires explicit width sizing. Not supported on Android < 3.
 *
 * Props:
 *   - value: String/HTML for content
 *   - onChange: Callback(event) when content changes
 *   - onFocus: Callback(event) when richtext receives focus
 *   - onBlur: Callback(event) when richtext loses focus
 *   - disabled: Boolean to disable richtext (default: false)
 *   - placeholder: Placeholder text when empty
 *   - defaultFocus: Boolean to auto-focus on render (default: false)
 *   - width: CSS width string (required for proper sizing)
 *   - minHeight: Minimum height in pixels (default: 50)
 *   - className: Additional CSS classes
 *   - allowFormatting: Allow rich text formatting (default: true)
 */
declare function RichText({ value, onChange, onFocus, onBlur, disabled, placeholder, defaultFocus, width, minHeight, className, allowFormatting }: {
    value?: string | undefined;
    onChange?: (() => void) | undefined;
    onFocus?: (() => void) | undefined;
    onBlur?: (() => void) | undefined;
    disabled?: boolean | undefined;
    placeholder?: string | undefined;
    defaultFocus?: boolean | undefined;
    width?: string | undefined;
    minHeight?: number | undefined;
    className?: string | undefined;
    allowFormatting?: boolean | undefined;
}): any;
