export default RichText;
/**
 * Mochi RichText React Component
 *
 * A mochi-styled contenteditable div for rich text input.
 * Supports formatted text like bold, italic, underline, etc.
 *
 * IMPORTANT — contentEditable + React children don't mix.
 * We use dangerouslySetInnerHTML so React never owns individual child nodes
 * and never tries to reconcile/removeChild them after the user (or we) mutate
 * the DOM. All placeholder logic is handled via state; no direct innerHTML
 * writes happen outside of the initial render.
 *
 * Props:
 *   value          Initial HTML content
 *   onChange       Callback(html: string) when content changes
 *   onFocus        Callback(event) when editor receives focus
 *   onBlur         Callback(event) when editor loses focus
 *   disabled       Disable editing (default: false)
 *   placeholder    Placeholder text shown when empty
 *   defaultFocus   Auto-focus on mount (default: false)
 *   width          CSS width string (default: '100%')
 *   minHeight      Min height in px (default: 50)
 *   className      Additional CSS classes
 *   allowFormatting  Allow bold/italic/underline shortcuts (default: true)
 */
declare function RichText({ value, onChange, onFocus, onBlur, disabled, placeholder, defaultFocus, width, minHeight, className, allowFormatting, }: {
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
