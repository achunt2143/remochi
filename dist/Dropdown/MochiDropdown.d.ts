export default MochiDropdown;
/**
 * MochiDropdown
 *
 * A styled trigger button that opens a MochiMenu (contextual popup) with a
 * list of options. Mirrors the mochi.Menu + mochi.MenuDecorator pattern.
 *
 * Props:
 *   options      {Array}    Array of option objects:
 *                             { value, label }                — normal item
 *                             { divider: true }               — horizontal rule
 *                             { sectionLabel: true, label }   — section header
 *   value        {*}        Currently selected value
 *   onChange     {Function} Called with the selected option's value
 *   label        {string}   Optional field label rendered above the trigger
 *   placeholder  {string}   Text shown when nothing is selected
 *   disabled     {boolean}  Disables the trigger
 *   maxHeight    {number}   Max height of the menu in px (default: 200)
 *   className    {string}   Extra class on the root wrapper
 */
declare const MochiDropdown: any;
