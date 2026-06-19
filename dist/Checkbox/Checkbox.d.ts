export default Checkbox;
/**
 * Mochi Checkbox
 *
 * A box that shows or hides a check mark when clicked.
 * Fires onChange when toggled. Use `checked` prop to read state externally.
 *
 * Props:
 *   checked            {boolean}  Controlled checked state (default: false)
 *   onChange           {Function} Called with { checked, value } on toggle
 *   disabled           {boolean}  Disables interaction (default: false)
 *   canAnimate         {boolean}  Animate background-color transition (default: true)
 *   colorActive        {string}   Background when checked (default: '#ffb80d')
 *   colorInactive      {string}   Background when unchecked (default: '#fff')
 *   colorActiveDisabled   {string}   Background when checked + disabled (default: '#ffb80d')
 *   colorInactiveDisabled {string}   Background when unchecked + disabled (default: '#fff')
 */
declare function Checkbox({ checked, onChange, disabled, canAnimate, colorActive, colorInactive, colorActiveDisabled, colorInactiveDisabled, }: {
    checked?: boolean | undefined;
    onChange?: (() => void) | undefined;
    disabled?: boolean | undefined;
    canAnimate?: boolean | undefined;
    colorActive?: string | undefined;
    colorInactive?: string | undefined;
    colorActiveDisabled?: string | undefined;
    colorInactiveDisabled?: string | undefined;
}): any;
