// MochiDialog.jsx
// webOS-inspired bottom-sheet dialog.
// Renders via React portal into document.body so no parent context can clip it.
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MochiDialog.scss';
import { Button as MochiButton } from '../Button';

const MochiDialog = ({
  isOpen = false,
  onClose,
  title,
  children,
  type = 'default',       // 'default' | 'alert' | 'confirm' | 'prompt'
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCloseButton = true,
  size = 'medium',        // 'small' | 'medium' | 'large'
  className = '',
  promptValue = '',
  onPromptChange,
  // Custom actions: [{ label, onClick, type? }]
  actions,
}) => {
  const dialogRef = useRef(null);

  // Keyboard + scroll-lock management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) onClose();
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

  // Focus trap: move focus into dialog when opened
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusable = dialogRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onConfirm?.(type === 'prompt' ? promptValue : true);
    onClose?.();
  }, [onConfirm, onClose, type, promptValue]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    onClose?.();
  }, [onCancel, onClose]);

  const renderActions = () => {
    // Custom actions array takes priority over type-based defaults
    if (actions?.length) {
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
      className={`mochi-dialog-overlay${isOpen ? ' open' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        className={`mochi-dialog mochi-dialog-${size} mochi-dialog-${type}${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'mochi-dialog-title' : undefined}
        tabIndex={-1}
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
                &times;
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
                onChange={(e) => onPromptChange?.(e.target.value)}
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

  return createPortal(dialog, document.body);
};

export default MochiDialog;
