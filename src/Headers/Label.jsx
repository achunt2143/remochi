import React from 'react';
import './Label.scss';

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Mochi Label React Component
 *
 * The label rung of the type ladder: names a section inside a panel and
 * replaces a divider or card. Write the text in title case; it is uppercased
 * with CSS so screen readers read words.
 *
 * Props:
 *   - content: String for label text (default: '')
 *   - children: Label text, used when content is empty
 *   - as: Element to render (default: 'div')
 *   - level: aria-level when `as` is not an h1-h6 element (default: 3)
 *   - className: Additional CSS classes to apply (default: '')
 */
const Label = ({ content = '', children, as: Tag = 'div', level = 3, className = '', ...rest }) => {
  const isHeading = typeof Tag === 'string' && HEADING_TAGS.includes(Tag);
  const headingProps = isHeading ? {} : { role: 'heading', 'aria-level': level };

  return (
    <Tag {...headingProps} {...rest} className={['mochi-label', className].filter(Boolean).join(' ')}>
      {content || children}
    </Tag>
  );
};

export default Label;
