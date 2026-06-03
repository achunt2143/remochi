// MochiDialog.jsx
import React, { useEffect, useRef } from 'react';
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
  onPromptChange
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
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // if (!isOpen) return null;

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

  return (
    <div 
      className={`mochi-dialog-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div 
        ref={dialogRef}
        className={`mochi-dialog mochi-dialog-${size} mochi-dialog-${type} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {title && (
          <div className="mochi-dialog-header">
            <h2 id="dialog-title" className="mochi-dialog-title">{title}</h2>
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

        {(type === 'alert' || type === 'confirm' || type === 'prompt') && (
          <div className="mochi-dialog-actions">
            {type === 'alert' ? (
              <MochiButton onClick={handleConfirm}>{confirmText}</MochiButton>
            ) : (
              <>
                <MochiButton variant="secondary" onClick={handleCancel}>
                  {cancelText}
                </MochiButton>
                <MochiButton onClick={handleConfirm}>{confirmText}</MochiButton>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MochiDialog;
