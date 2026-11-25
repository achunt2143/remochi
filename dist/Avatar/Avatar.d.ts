/**
 * Avatar
 *
 * A person's or app's picture in the waterdrop shape, scaled with its size
 * (waterdropRadius: 12/3 at 40px, 7/2 at 20px, the full 16/4 from about
 * 56px). Without an image, or when it fails to load, it shows the initials
 * of `name`, else `icon`.
 *
 * Props:
 *   src       {string}      Image URL
 *   alt       {string}      Image alt text and accessible name (default: name)
 *   name      {string}      Initials fallback and accessible name
 *   icon      {ReactNode}   Shown when there is no image and no name
 *   size      {'sm'|'md'|'lg'|'xl'|number}  24 / 40 / 56 / 96 px, or px.
 *                           Default: 'md'
 *   className {string}      Extra CSS classes
 *   style     {object}      Merged onto the root
 *   ...rest                 Passed to the root; ref goes to the root
 */
export const Avatar: any;
export { Avatar as MochiAvatar };
