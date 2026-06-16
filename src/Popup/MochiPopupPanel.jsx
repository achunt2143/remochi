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
  // anchorEl: a ref object { current: HTMLElement } — live element reference.
  // anchorRect: a plain DOMRect-shaped object — pre-captured snapshot.
  // When anchorEl is provided, rect is read from it inside computePosition.
  // When anchorRect is provided (e.g. captured synchronously at click time),
  // that snapshot is used directly — this is the preferred path for scrolled
  // pages because the rect is captured before React re-renders and before any
  // scroll-locking side effects can shift the page.
  anchorEl,
  anchorRect: anchorRectProp,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  const getViewW = () => window.innerWidth  ?? document.documentElement.clientWidth;
  const getViewH = () => window.innerHeight ?? document.documentElement.clientHeight;

  const computePosition = useCallback(() => {
    if (!panelRef.current) return;

    // Prefer pre-captured snapshot (anchorRectProp) so the rect reflects the
    // scroll position at click time, not after React / side-effects have run.
    // Fall back to reading the live ref when no snapshot is provided.
    const a = anchorRectProp ?? anchorEl?.current?.getBoundingClientRect();

    if (!a) return;

    const pw    = panelRef.current.offsetWidth;
    const ph    = panelRef.current.offsetHeight;
    const viewW = getViewW();
    const viewH = getViewH();

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
      if      (l < MARGIN)              { l = MARGIN;             dirClass = "right"; }
      else if (l + pw > viewW - MARGIN) { l = viewW - pw - MARGIN; dirClass = "left";  }
      nubHOff = Math.round(anchorCX - l - NUB_W / 2);
      return { left: l, dirClass };
    }

    function centerVert() {
      const anchorCY = a.top + a.height / 2;
      let t = anchorCY - ph / 2;
      let mod = "";
      if      (t < MARGIN)              { t = MARGIN;              mod = "high"; }
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

  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    computePosition();
  }, [isOpen, computePosition]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("resize", computePosition);
    // NOTE: overflow:hidden is intentionally NOT set here.
    // The Overlay is position:fixed and covers the full viewport, which already
    // prevents interaction with the page beneath. Setting overflow:hidden on
    // body causes browsers to reset the scroll position before computePosition
    // has run, making the anchor rect stale and placing the popup at the wrong
    // position on scrolled pages.
    const onKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", computePosition);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, computePosition]);

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
    : { visibility: "hidden" };

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
