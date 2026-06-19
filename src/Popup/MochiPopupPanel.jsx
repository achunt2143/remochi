import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Overlay,
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
  anchorEl,
  anchorRect: anchorRectProp,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  const getViewW = () => window.innerWidth  ?? document.documentElement.clientWidth;
  const getViewH = () => window.innerHeight ?? document.documentElement.clientHeight;

  const computePosition = useCallback(() => {
    if (!panelRef.current) return;

    const a = anchorRectProp ?? anchorEl?.current?.getBoundingClientRect();
    if (!a) return;

    const pw    = panelRef.current.offsetWidth;
    const ph    = panelRef.current.offsetHeight;
    const viewW = getViewW();
    const viewH = getViewH();

    if (pw === 0 || ph === 0) return;

    const topFlushPt    = VERT_FLUSH_MARGIN;
    const bottomFlushPt = viewH - VERT_FLUSH_MARGIN;

    let nubHOff = 0;
    let nubVOff = 0;

    function tryVertical() {
      const above = a.top >= viewH / 2;
      const t     = above ? a.top - ph : a.bottom;
      if (t < 0 || t + ph > viewH) return null;
      return { above };
    }

    function tryHorizontal() {
      const toRight = (a.left + a.width / 2) < viewW / 2;
      const l       = toRight ? a.right : a.left - pw;
      if (l < 0 || l + pw > viewW) return null;
      return { toRight };
    }

    function centerHoriz() {
      const cx = a.left + a.width / 2;
      let l = cx - pw / 2;
      let dirClass = "";
      if (l < MARGIN)              { l = MARGIN;              dirClass = "right"; }
      if (l + pw > viewW - MARGIN) { l = viewW - pw - MARGIN; dirClass = "left";  }
      nubHOff = Math.round(cx - l - NUB_W / 2);
      return { left: l, dirClass };
    }

    function centerVert() {
      const cy = a.top + a.height / 2;
      let t = cy - ph / 2;
      let mod = "";
      if (t < MARGIN)              { t = MARGIN;              mod = "high"; }
      if (t + ph > viewH - MARGIN) { t = viewH - ph - MARGIN; mod = "low";  }
      nubVOff = Math.round(cy - t - NUB_SIDE / 2);
      return { top: t, mod };
    }

    function resolveVertical(corner = false) {
      const v = tryVertical();
      if (!v) return false;

      const top = v.above ? a.top - ph : a.bottom;
      const { left: centredLeft, dirClass } = centerHoriz();

      let left = centredLeft;
      if (corner) {
        if (dirClass === "left")  left = a.right - pw;
        if (dirClass === "right") left = a.left;
      }

      setPos({
        top, left,
        classes: `vertical ${v.above ? "above" : "below"}${
          dirClass ? " " + dirClass : ""}${corner ? " corner" : ""}`,
        nubHOff, nubVOff,
      });
      return true;
    }

    function resolveHorizontal(corner = false) {
      const h = tryHorizontal();
      if (!h) return false;

      const left = h.toRight ? a.right : a.left - pw;
      const { top: centredTop, mod } = centerVert();

      let top = centredTop;
      if (corner) {
        if (mod === "high") top = a.top;
        if (mod === "low")  top = a.bottom - ph;
      }

      setPos({
        top, left,
        classes: `horizontal ${h.toRight ? "left" : "right"}${
          mod ? " " + mod : ""}${corner ? " corner" : ""}`,
        nubHOff, nubVOff,
      });
      return true;
    }

    const inTopBottom = a.bottom < topFlushPt || a.top > bottomFlushPt;
    const inLeftRight = a.right  < HORIZ_FLUSH_MARGIN || a.left > viewW - HORIZ_FLUSH_MARGIN;

    if (inTopBottom) {
      const v = tryVertical();
      if (v) {
        const { dirClass } = centerHoriz();
        if (dirClass) {
          if (resolveVertical(true)) return;
        }
      }
      if (resolveHorizontal(true)) return;
      if (resolveVertical())       return;
    } else if (inLeftRight) {
      if (resolveHorizontal()) return;
    }

    if (pw > WIDE_POPUP)      { if (resolveVertical())   return; }
    else if (ph > LONG_POPUP) { if (resolveHorizontal()) return; }

    if (resolveVertical())   return;
    if (resolveHorizontal()) return;

    // Ultimate fallback — below, centred
    const { left, dirClass } = centerHoriz();
    setPos({
      top:  a.bottom,
      left,
      classes: `vertical below${dirClass ? " " + dirClass : ""}`,
      nubHOff, nubVOff,
    });
  }, [anchorEl, anchorRectProp]);

  useLayoutEffect(() => {
    if (!isOpen) { setPos(null); return; }
    computePosition();
  }, [isOpen, computePosition]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("resize", computePosition);
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

  // During the measurement pass (isOpen but pos not yet computed) we render
  // the panel invisible so useLayoutEffect can read its dimensions.
  const panelStyle = pos
    ? {
        top:  pos.top,
        left: pos.left,
        "--nubbin-h-offset": `${pos.nubHOff}px`,
        "--nubbin-v-offset": `${pos.nubVOff}px`,
      }
    : { visibility: "hidden", top: 0, left: 0 };

  // Always render into a portal on document.body so position:fixed coords
  // are always relative to the viewport — no parent stacking context,
  // overflow, or transform can interfere.
  if (!isOpen && !pos) return null;

  return ReactDOM.createPortal(
    <Overlay
      $hidden={!isOpen}
      onClick={(e) => isOpen && e.target === e.currentTarget && onClose?.()}
      aria-modal={isOpen ? "true" : undefined}
      aria-hidden={!isOpen ? "true" : undefined}
      role="dialog"
    >
      <Panel
        tabIndex={isOpen ? -1 : undefined}
        ref={panelRef}
        style={panelStyle}
        className={isOpen && pos ? pos.classes : ""}
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
    </Overlay>,
    document.body
  );
}
