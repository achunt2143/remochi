export default Checkbox;
/**
 * Mochi Checkbox React Component
 *
 * A checkbox that shows or hides a check mark when clicked.
 * Fires onChange event when toggled. Supports animation, theming, and disabled state.
 *
 * Props:
 *   - checked: Boolean for checked state (default: false)
 *   - onChange: Callback function fired when checkbox is toggled
 *   - disabled: Boolean to disable the checkbox (default: false)
 *   - canAnimate: Boolean to enable transition animation (default: true)
 *   - colorActive: CSS color when checked (default: '#ffb80d')
 *   - colorInactive: CSS color when unchecked (default: '#fff')
 *   - colorActiveDisabled: CSS color when checked and disabled (default: '#ffb80d')
 *   - colorInactiveDisabled: CSS color when unchecked and disabled (default: '#fff')
 */
declare function Checkbox({ checked, onChange, disabled, canAnimate, colorActive, colorInactive, colorActiveDisabled, colorInactiveDisabled }: {
    checked?: boolean | undefined;
    onChange?: (() => void) | undefined;
    disabled?: boolean | undefined;
    canAnimate?: boolean | undefined;
    colorActive?: string | undefined;
    colorInactive?: string | undefined;
    colorActiveDisabled?: string | undefined;
    colorInactiveDisabled?: string | undefined;
}): any;
