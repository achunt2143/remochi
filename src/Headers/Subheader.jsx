import React from 'react';
import './Subheader.scss';

/**
 * Mochi Subheader React Component
 * 
 * A mochi-styled subheader control that displays a single line of text
 * with automatic text overflow handling.
 * 
 * Props:
 *   - content: String for subheader text (default: '')
 */
const Subheader = ({ content = '', className = '', ...rest }) => {
  return (
    <div {...rest} className={['mochi-subheader', className].filter(Boolean).join(' ')}>
      <div className="mochi-subheader-content" title={content}>
        {content}
      </div>
    </div>
  );
};

export default Subheader;
