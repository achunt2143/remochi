import React, { useState, useEffect, useRef } from 'react';
import './Badge.scss';

/**
 * MochiBadge — faithful React port of mochi.Badge.
 *
 * Props:
 *   content    {string|number}  Text to display. Empty = hidden (transparent bg).
 *   background {string}         CSS color for background (default: '#69cdff').
 *   color      {string}         CSS color for text (default: '#ffffff').
 */
const Badge = ({ content = '', background = '#69cdff', color = '#ffffff' }) => {
  const originalBackground = useRef(background);

  useEffect(() => { originalBackground.current = background; }, [background]);

  const isEmpty = content === '' || content === null || content === undefined;
  const contentStr = isEmpty ? '' : content.toString();
  const isOval = contentStr.length > 2;  // 3+ chars → oval, 1-2 → round circle

  const displayBackground = isEmpty ? 'transparent' : background;
  const innerClass = `mochi-badge-inner ${isOval ? 'oval' : 'round'}`;

  return (
    <div className="mochi-badge">
      <div
        className={innerClass}
        style={{ background: displayBackground, color }}
      >
        {contentStr}
      </div>
    </div>
  );
};

export { Badge };
export { Badge as MochiBadge };
