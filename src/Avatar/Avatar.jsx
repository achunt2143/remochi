import React, { useEffect, useState } from 'react';
import { waterdropRadius } from '../shared/waterdrop';
import './Avatar.scss';

const SIZES = { sm: 24, md: 40, lg: 56, xl: 96 };
// From this size the initials are Mochi Light (the Header's face), below it
// Mochi Bold (the Label's).
const DISPLAY_FROM = 56;

// First letters of up to two words: "Ada Lovelace" -> "AL", "ada" -> "A".
function initialsOf(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('');
}

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
const Avatar = React.forwardRef(function Avatar({
  src,
  alt,
  name,
  icon,
  size = 'md',
  className = '',
  style,
  ...rest
}, ref) {
  const px = typeof size === 'number' ? size : (SIZES[size] ?? SIZES.md);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  const showImage = !!src && !failed;
  const initials = initialsOf(name);
  const label = alt || name;

  const rootStyle = {
    width: px,
    height: px,
    fontSize: px * 0.4,
    borderRadius: waterdropRadius(px),
    ...style,
  };

  return (
    <span
      {...rest}
      ref={ref}
      className={['mochi-avatar', px >= DISPLAY_FROM && 'mochi-avatar--display', className].filter(Boolean).join(' ')}
      style={rootStyle}
      {...(showImage ? {} : label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {showImage ? (
        <img
          className={`mochi-avatar-image${loaded ? ' mochi-avatar-image--loaded' : ''}`}
          src={src}
          alt={alt ?? name ?? ''}
          draggable={false}
          // A cached image can finish before React hears of it.
          ref={(el) => { if (el && el.complete && el.naturalWidth > 0 && !loaded) setLoaded(true); }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : initials ? (
        <span className="mochi-avatar-initials" aria-hidden="true">{initials}</span>
      ) : icon ? (
        <span className="mochi-avatar-icon" aria-hidden="true">{icon}</span>
      ) : null}
    </span>
  );
});

export { Avatar };
export { Avatar as MochiAvatar };
