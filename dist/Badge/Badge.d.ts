/**
 * MochiBadge — faithful React port of mochi.Badge.
 *
 * Props:
 *   content    {string|number}  Text to display. Empty = hidden (transparent bg).
 *   background {string}         CSS color for background (default: '#69cdff').
 *   color      {string}         CSS color for text (default: '#ffffff').
 */
export function Badge({ content, background, color }: {
    content?: string | undefined;
    background?: string | undefined;
    color?: string | undefined;
}): any;
export { Badge as MochiBadge };
