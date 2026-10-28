// MochiDialog.jsx
// Mochi modal dialog: a centered card over a scrim (see MochiDialog.scss).
// Renders via React portal into document.body so no parent context can clip it.
import React, { useEffect, useRef, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import './MochiDialog.scss';
import { Button as MochiButton } from '../Button';
import { Input as MochiInput } from '../Input';
import { Divider } from '../Divider';

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
  // webOS HIG: green marks the positive choice in a yes/no decision; pass
  // 'warning' when confirming a destructive action (e.g. Delete).
  confirmType = 'affirmative',
  // Mochi/webOS dialogs close through their buttons, the scrim or Escape;
  // the × is opt-in.
  showCloseButton = false,
  size = 'medium',        // 'small' | 'medium' | 'large'
  className = '',
  promptValue = '',
  onPromptChange,
  // Custom actions: [{ label, onClick, type? }]
  actions,
}) => {
  const dialogRef = useRef(null);
  const titleId = useId();

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
          <MochiButton onClick={handleCancel}>{cancelText}</MochiButton>
          <MochiButton type={confirmType} onClick={handleConfirm}>{confirmText}</MochiButton>
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
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {title && (
          <div className="mochi-dialog-header">
            <h2 id={titleId} className="mochi-dialog-title">{title}</h2>
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
        {title && <Divider />}

        <div className="mochi-dialog-content">
          {type === 'prompt' ? (
            <>
              <div className="mochi-dialog-message">{children}</div>
              <MochiInput
                type="text"
                value={promptValue}
                onChange={(e) => onPromptChange?.(e.target.value)}
                autoFocus
                // Inline so it beats the Input's own margin-right regardless
                // of stylesheet order.
                style={{ width: '100%', marginRight: 0, boxSizing: 'border-box' }}
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
