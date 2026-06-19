// MochiItem.jsx
import React from 'react';
import './MochiItem.scss';

const MochiItem = ({
  children,
  title,
  subtitle,
  icon,
  rightContent,
  onClick,
  onIconClick,
  selected = false,
  disabled = false,
  hoverable = true,
  variant = 'default', // 'default', 'compact', 'detailed'
  className = ''
}) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (!disabled && onIconClick) {
      onIconClick(e);
    }
  };

  return (
    <div
      className={`mochi-item mochi-item-${variant} ${selected ? 'selected' : ''} ${
        disabled ? 'disabled' : ''
      } ${hoverable ? 'hoverable' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {icon && (
        <div
          className="mochi-item-icon"
          onClick={onIconClick ? handleIconClick : undefined}
          role={onIconClick ? 'button' : undefined}
          tabIndex={onIconClick && !disabled ? 0 : undefined}
        >
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
      )}

      <div className="mochi-item-content">
        {title && <div className="mochi-item-title">{title}</div>}
        {subtitle && <div className="mochi-item-subtitle">{subtitle}</div>}
        {children && <div className="mochi-item-body">{children}</div>}
      </div>

      {rightContent && <div className="mochi-item-right">{rightContent}</div>}
    </div>
  );
};

export default MochiItem;
