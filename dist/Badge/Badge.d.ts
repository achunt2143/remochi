/**
 * MochiBadge — faithful React port of mochi.Badge.
 *
 * Supports two usage styles:
 *
 *   1. Variant label badge (demo style):
 *      <Badge variant="success">Active</Badge>
 *      <Badge count={7}>Notifications</Badge>
 *
 *   2. Legacy content prop:
 *      <Badge content="42" />
 *
 * Props:
 *   children   {ReactNode}      Label text (takes priority over `content`)
 *   content    {string|number}  Legacy: text to display
 *   variant    {string}         'default'|'success'|'warning'|'error'|'danger'|'info'
 *   count      {number}         If provided, renders a count pill after the label
 *   background {string}         Override background color (overrides variant)
 *   color      {string}         Text color (default: '#ffffff')
 */
export function Badge({ children, content, variant, count, background, color, }: {
    children: any;
    content: any;
    variant?: string | undefined;
    count: any;
    background: any;
    color?: string | undefined;
}): any;
export { Badge as MochiBadge };
