export default Button;
/**
 * Mochi Button React Component
 *
 * A mochi-styled button with decorative brackets and animated underline bar.
 *
 * Props:
 *   - content: String for button text (default: '')
 *   - disabled: Boolean to disable button (default: false)
 *   - active: Boolean for active state (default: false)
 *   - decoratorLeft: Left bracket character (default: '(')
 *   - decoratorRight: Right bracket character (default: ')')
 *   - barClasses: CSS classes for bar styling (default: '')
 *   - onClick: Callback when button is clicked
 *   - variant: 'normal' | 'warning' | 'affirmative' | 'blue' (default: 'normal')
 */
declare function Button({ content, disabled, active, decoratorLeft, decoratorRight, barClasses, onClick, variant, children }: {
    content?: string | undefined;
    disabled?: boolean | undefined;
    active?: boolean | undefined;
    decoratorLeft?: string | undefined;
    decoratorRight?: string | undefined;
    barClasses?: string | undefined;
    onClick?: (() => void) | undefined;
    variant?: string | undefined;
    children: any;
}): any;
