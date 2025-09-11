import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Overlay,
  PanelWrapper,
  Panel,
  PanelTitle,
  ContentArea,
  ButtonBar,
} from "./MochiPopupPanel.styles";
import { MochiButton } from "../Button/MochiButton";

export function MochiPopupPanel({
  isOpen,
  title,
  children,
  actions = [],
  onClose,
  anchorRect,
}) {
  const panelRef = useRef(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    positionClass: "vertical below", // default class string
  });

  const updatePosition = useCallback(() => {
    if (!anchorRect || !panelRef.current) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const margin = 8;

    const popupWidth = panelRef.current.offsetWidth;
    const popupHeight = panelRef.current.offsetHeight;

    const activatorCenterX = anchorRect.left + anchorRect.width / 2;
    const activatorCenterY = anchorRect.top + anchorRect.height / 2;

    // Determine vertical position
    let below = true;
    let top = anchorRect.bottom + margin;
    if (top + popupHeight > viewportH) {
      below = false;
      top = anchorRect.top - popupHeight - margin;
    }

    // Horizontal centered
    let left = activatorCenterX - popupWidth / 2;

    // Clamp horizontally within viewport
    if (left < margin) left = margin;
    if (left + popupWidth > viewportW - margin) left = viewportW - popupWidth - margin;

    // Decide corner flush classes
    let positionClass = below ? "vertical below" : "vertical above";
    // Add corner classes if needed
    if (left <= margin) positionClass += " left corner";
    else if (left + popupWidth >= viewportW - margin) positionClass += " right corner";

    setPosition({ top, left, positionClass });
  }, [anchorRect]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, updatePosition]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()} aria-modal="true" role="dialog">
      <PanelWrapper>
        <Panel
          tabIndex={-1}
          ref={panelRef}
          style={{ top: position.top, left: position.left }}
          className={position.positionClass}
        >
          {title && <PanelTitle>{title}</PanelTitle>}
          <ContentArea>{children}</ContentArea>
          <ButtonBar>
            {actions.map(({ label, onClick, type }, idx) => (
              <MochiButton key={idx} onClick={onClick} type={type}>
                {label}
              </MochiButton>
            ))}
          </ButtonBar>
        </Panel>
      </PanelWrapper>
    </Overlay>
  );
}
