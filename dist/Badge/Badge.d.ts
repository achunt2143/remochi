/**
 * Mochi Badge React Component
 *
 * A badge component in the Mochi style that dynamically adjusts between
 * circular (round) and oval shapes based on content length.
 *
 * Props:
 *   - content: String or number to display in the badge
 *   - background: CSS color string for background (default: '#69cdff')
 *   - color: CSS color string for text (default: '#ffffff')
 */
export function Badge({ content, background, color }: {
    content?: string | undefined;
    background?: string | undefined;
    color?: string | undefined;
}): any;
