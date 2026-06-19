export default MochiToggle;
/**
 * MochiToggle — port of mochi.ToggleButton (Enyo)
 *
 * A pill-shaped switch with On/Off label text and a sliding white knob.
 * The entire pill background changes color between active/inactive states.
 *
 * Props:
 *   value          {boolean}  Current on/off state (default: false)
 *   onChange       {Function} Called with { value } on toggle
 *   disabled       {boolean}  Disables interaction (default: false)
 *   canAnimate     {boolean}  Animate background-color transition (default: true)
 *   colorActive    {string}   Pill bg when on (default: '#ffb80d')
 *   colorInactive  {string}   Pill bg when off (default: '#646464')
 *   onContent      {string}   Label shown when on (default: 'On')
 *   offContent     {string}   Label shown when off (default: 'Off')
 */
export function MochiToggle({ value, onChange, disabled, canAnimate, colorActive, colorInactive, onContent, offContent, }: {
    value?: boolean | undefined;
    onChange?: (() => void) | undefined;
    disabled?: boolean | undefined;
    canAnimate?: boolean | undefined;
    colorActive?: string | undefined;
    colorInactive?: string | undefined;
    onContent?: string | undefined;
    offContent?: string | undefined;
}): any;
