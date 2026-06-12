// MochiDialog.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MochiDialog.scss';
import { Button as MochiButton } from '../Button';

const MochiDialog = ({
  isOpen = false,
  onClose,
  title,
  children,
  type = 'default', // 'default', 'alert', 'confirm', 'prompt'
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCloseButton = true,
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
  promptValue = '',
  onPromptChange,
  // Custom actions array: [{ label, onClick, type? }]
  actions,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(type === 'prompt' ? promptValue : true);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  // Determine which action bar to render
  const renderActions = () => {
    // Custom actions array takes priority
    if (actions && actions.length > 0) {
      return (
        <div className="mochi-dialog-actions">
          {actions.map((action, i) => (
            <MochiButton
              key={i}
              type={action.type || 'normal'}
              onClick={action.onClick}
            >
              {action.label}
            </MochiButton>
          ))}
        </div>
      );
    }

    // Built-in action types
    if (type === 'alert') {
      return (
        <div className="mochi-dialog-actions">
          <MochiButton onClick={handleConfirm}>{confirmText}</MochiButton>
        </div>
      );
    }

    if (type === 'confirm' || type === 'prompt') {
      return (
        <div className="mochi-dialog-actions">
          <MochiButton type="warning" onClick={handleCancel}>{cancelText}</MochiButton>
          <MochiButton onClick={handleConfirm}>{confirmText}</MochiButton>
        </div>
      );
    }

    return null;
  };

  const dialog = (
    <div
      className={`mochi-dialog-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        className={`mochi-dialog mochi-dialog-${size} mochi-dialog-${type} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mochi-dialog-title"
      >
        {title && (
          <div className="mochi-dialog-header">
            <h2 id="mochi-dialog-title" className="mochi-dialog-title">{title}</h2>
            {showCloseButton && (
              <button
                className="mochi-dialog-close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="mochi-dialog-content">
          {type === 'prompt' ? (
            <>
              <div className="mochi-dialog-message">{children}</div>
              <input
                type="text"
                className="mochi-dialog-prompt-input"
                value={promptValue}
                onChange={(e) => onPromptChange && onPromptChange(e.target.value)}
                autoFocus
              />
            </>
          ) : (
            children
          )}
        </div>

        {renderActions()}
      </div>
    </div>
  );

  // Render into document.body via portal so no parent transform/overflow can clip it
  return createPortal(dialog, document.body);
};

export default MochiDialog;
