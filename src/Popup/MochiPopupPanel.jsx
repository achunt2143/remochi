import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from "react";
import {
  Overlay,
  PanelWrapper,
  Panel,
  PanelTitle,
  ContentArea,
  ButtonBar,
} from "./MochiPopupPanel.styles";
import { Button as MochiButton } from "../Button";

const VERT_FLUSH_MARGIN  = 100;
const HORIZ_FLUSH_MARGIN = 100;
const WIDE_POPUP         = 200;
const LONG_POPUP         = 200;
const MARGIN             = 8;
const NUB_W              = 71;
const NUB_SIDE           = 71;

export function MochiPopupPanel({
  isOpen,
  title,
  children,
  actions = [],
  onClose,
  // NEW: accept a ref object { current: HTMLElement } so we always read a
  // fresh getBoundingClientRect() instead of a frozen snapshot.
  // Legacy callers that still pass a plain anchorRect object still work.
  anchorEl,
  anchorRect: anchorRectProp,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  const getViewW = () => window.innerWidth  ?? document.documentElement.clientWidth;
  const getViewH = () => window.innerHeight ?? document.documentElement.clientHeight;

  const computePosition = useCallback(() => {
    if (!panelRef.current) return;

    // Prefer live ref → fresh rect every time
    const a = anchorEl?.current
      ? anchorEl.current.getBoundingClientRect()
      : anchorRectProp;

    if (!a) return;

    const pw    = panelRef.current.offsetWidth;
    const ph    = panelRef.current.offsetHeight;
    const viewW = getViewW();
    const viewH = getViewH();

    // If panel hasn't laid out yet (hidden pass), skip
    if (pw === 0 || ph === 0) return;

    const topFlushPt    = VERT_FLUSH_MARGIN;
    const bottomFlushPt = viewH - VERT_FLUSH_MARGIN;
    const leftFlushPt   = HORIZ_FLUSH_MARGIN;
    const rightFlushPt  = viewW - HORIZ_FLUSH_MARGIN;

    let nubHOff = 0;
    let nubVOff = 0;

    function tryVertical() {
      let t, above;
      if (a.top < viewH / 2) { t = a.bottom + MARGIN; above = false; }
      else                   { t = a.top - ph - MARGIN; above = true; }
      if (t + ph > viewH || t < 0) return null;
      return { top: t, above };
    }

    function tryHorizontal() {
      let l, toRight;
      if (a.left + a.width < viewW / 2) { l = a.right  + MARGIN; toRight = true;  }
      else                              { l = a.left - pw - MARGIN; toRight = false; }
      if (l < 0 || l + pw > viewW) return null;
      return { left: l, toRight };
    }

    function centerHoriz() {
      const anchorCX = a.left + a.width / 2;
      let l = anchorCX - pw / 2;
      let dirClass = "";
      if      (l < MARGIN)            { l = MARGIN;             dirClass = "right"; }
      else if (l + pw > viewW - MARGIN) { l = viewW - pw - MARGIN; dirClass = "left";  }
      nubHOff = Math.round(anchorCX - l - NUB_W / 2);
      return { left: l, dirClass };
    }

    function centerVert() {
      const anchorCY = a.top + a.height / 2;
      let t = anchorCY - ph / 2;
      let mod = "";
      if      (t < MARGIN)            { t = MARGIN;              mod = "high"; }
      else if (t + ph > viewH - MARGIN) { t = viewH - ph - MARGIN; mod = "low";  }
      nubVOff = Math.round(anchorCY - t - NUB_SIDE / 2);
      return { top: t, mod };
    }

    const inTopBottom = (a.bottom < topFlushPt) || (a.top > bottomFlushPt);
    const inLeftRight = (a.right  < leftFlushPt) || (a.left > rightFlushPt);

    function resolveVertical(corner = false) {
      const v = tryVertical();
      if (!v) return false;
      const { left, dirClass } = centerHoriz();
      setPos({
        top: v.top, left,
        classes: `vertical ${v.above ? "above" : "below"}${dirClass ? " " + dirClass : ""}${corner ? " corner" : ""}`,
        nubHOff, nubVOff,
      });
      return true;
    }

    function resolveHorizontal(corner = false) {
      const h = tryHorizontal();
      if (!h) return false;
      const { top: ct, mod } = centerVert();
      const dirClass = h.toRight ? "left" : "right";
      setPos({
        top: ct, left: h.left,
        classes: `horizontal ${dirClass}${mod ? " " + mod : ""}${corner ? " corner" : ""}`,
        nubHOff, nubVOff,
      });
      return true;
    }

    if (inTopBottom) {
      const v = tryVertical();
      if (v) {
        const { left, dirClass } = centerHoriz();
        if (dirClass) {
          setPos({ top: v.top, left, classes: `vertical ${v.above ? "above" : "below"} ${dirClass} corner`, nubHOff, nubVOff });
          return;
        }
      }
      if (resolveHorizontal(true)) return;
      if (resolveVertical()) return;
    } else if (inLeftRight) {
      if (resolveHorizontal()) return;
    }

    if (pw > WIDE_POPUP) { if (resolveVertical())   return; }
    else if (ph > LONG_POPUP) { if (resolveHorizontal()) return; }

    if (resolveVertical())   return;
    if (resolveHorizontal()) return;

    // Ultimate fallback
    const { left, dirClass } = centerHoriz();
    setPos({
      top:    Math.min(a.bottom + MARGIN, viewH - ph - MARGIN),
      left,
      classes: `vertical below${dirClass ? " " + dirClass : ""}`,
      nubHOff, nubVOff,
    });
  }, [anchorEl, anchorRectProp]);

  // useLayoutEffect fires synchronously after the DOM is painted.
  // On first mount the panel renders with visibility:hidden so we can
  // measure its real offsetWidth/offsetHeight, then immediately set pos
  // before the browser shows anything — no flicker, no first-click miss.
  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    computePosition();
  }, [isOpen, computePosition]);

  // Also recompute on resize / scroll
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("resize", computePosition);
    window.addEventListener("scroll", computePosition, true);
    const onKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", computePosition);
      window.removeEventListener("scroll", computePosition, true);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, computePosition]);

  // Focus panel once position is known
  useEffect(() => {
    if (pos) panelRef.current?.focus();
  }, [pos]);

  if (!isOpen) return null;

  const panelStyle = pos
    ? {
        top:  pos.top,
        left: pos.left,
        "--nubbin-h-offset": `${pos.nubHOff}px`,
        "--nubbin-v-offset": `${pos.nubVOff}px`,
      }
    : { visibility: "hidden" }; // hidden while measuring on first paint

  return (
    <Overlay
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      aria-modal="true"
      role="dialog"
    >
      <PanelWrapper>
        <Panel
          tabIndex={-1}
          ref={panelRef}
          style={panelStyle}
          className={pos?.classes ?? ""}
        >
          {title && <PanelTitle>{title}</PanelTitle>}
          <ContentArea>{children}</ContentArea>
          {actions.length > 0 && (
            <ButtonBar>
              {actions.map(({ label, onClick, type }, idx) => (
                <MochiButton key={idx} onClick={onClick} $type={type}>
                  {label}
                </MochiButton>
              ))}
            </ButtonBar>
          )}
        </Panel>
      </PanelWrapper>
    </Overlay>
  );
}
