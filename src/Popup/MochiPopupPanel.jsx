import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Overlay,
  PanelWrapper,
  Panel,
  PanelTitle,
  ContentArea,
  ButtonBar,
} from "./MochiPopupPanel.styles";
import { Button as MochiButton } from "../Button";

// Layout constants mirroring Enyo ContextualPopup
const VERT_FLUSH_MARGIN  = 100;
const HORIZ_FLUSH_MARGIN = 100;
const WIDE_POPUP         = 200;
const LONG_POPUP         = 200;
const HORIZ_BUFFER       = 16;
const MARGIN             = 8;
const NUB_W              = 71;   // nubbin image width  (vertical nubbins)
const NUB_SIDE           = 71;   // nubbin image size   (horizontal nubbins)

export function MochiPopupPanel({
  isOpen,
  title,
  children,
  actions = [],
  onClose,
  anchorRect,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  const getViewW = () => window.innerWidth  ?? document.documentElement.clientWidth;
  const getViewH = () => window.innerHeight ?? document.documentElement.clientHeight;

  const computePosition = useCallback(() => {
    if (!anchorRect || !panelRef.current) return;

    const pw     = panelRef.current.offsetWidth;
    const ph     = panelRef.current.offsetHeight;
    const viewW  = getViewW();
    const viewH  = getViewH();
    const a      = anchorRect;

    const topFlushPt    = VERT_FLUSH_MARGIN;
    const bottomFlushPt = viewH - VERT_FLUSH_MARGIN;
    const leftFlushPt   = HORIZ_FLUSH_MARGIN;
    const rightFlushPt  = viewW - HORIZ_FLUSH_MARGIN;

    let nubHOff = 0;  // --nubbin-h-offset for straight vertical nubbins
    let nubVOff = 0;  // --nubbin-v-offset for straight horizontal nubbins

    // —— vertical placement: returns { top, above } or null
    function tryVertical() {
      let t, above;
      if (a.top < viewH / 2) {
        t = a.bottom + MARGIN;
        above = false;
      } else {
        t = a.top - ph - MARGIN;
        above = true;
      }
      if (t + ph > viewH || t < 0) return null;
      return { top: t, above };
    }

    // —— horizontal placement: returns { left, toRight } or null
    // toRight = popup placed to the RIGHT of anchor (anchor is LEFT of popup)
    function tryHorizontal() {
      let l, toRight;
      if (a.left + a.width < viewW / 2) {
        l = a.right + MARGIN;
        toRight = true;   // popup right of anchor → class 'left' (nub points left toward anchor)
      } else {
        l = a.left - pw - MARGIN;
        toRight = false;  // popup left of anchor  → class 'right' (nub points right toward anchor)
      }
      if (l < 0 || l + pw > viewW) return null;
      return { left: l, toRight };
    }

    // —— center popup horizontally over anchor, clamp to viewport
    // Returns { left, dirClass } where dirClass is 'left'|'right'|'' (direction TO anchor)
    function centerHoriz() {
      const anchorCX = a.left + a.width / 2;
      let l = anchorCX - pw / 2;
      let dirClass = "";

      if (l < MARGIN) {
        l = MARGIN;
        // popup snapped to left edge, anchor is to the RIGHT of popup center → class 'right'
        dirClass = "right";
      } else if (l + pw > viewW - MARGIN) {
        l = viewW - pw - MARGIN;
        // popup snapped to right edge, anchor is to the LEFT of popup center → class 'left'
        dirClass = "left";
      }

      // dynamic nubbin offset: anchor center relative to panel left, minus half nub width
      nubHOff = Math.round(anchorCX - l - NUB_W / 2);
      return { left: l, dirClass };
    }

    // —— center popup vertically beside anchor, clamp (high/low)
    function centerVert() {
      const anchorCY = a.top + a.height / 2;
      let t = anchorCY - ph / 2;
      let mod = "";
      if (t < MARGIN) {
        t = MARGIN;
        mod = "high";
      } else if (t + ph > viewH - MARGIN) {
        t = viewH - ph - MARGIN;
        mod = "low";
      }
      nubVOff = Math.round(anchorCY - t - NUB_SIDE / 2);
      return { top: t, mod };
    }

    // ══ RULE 1: Activator in top/bottom flush zone ══
    const inTopBottom = (a.bottom < topFlushPt) || (a.top > bottomFlushPt);
    const inLeftRight = (a.right  < leftFlushPt) || (a.left > rightFlushPt);

    if (inTopBottom) {
      // 1.a.i — flush vertical
      const v = tryVertical();
      if (v) {
        const { left, dirClass } = centerHoriz();
        if (dirClass) {
          setPos({
            top: v.top, left,
            classes: `vertical ${v.above ? "above" : "below"} ${dirClass} corner`,
            nubHOff, nubVOff,
          });
          return;
        }
      }

      // 1.a.ii — flush horizontal
      const h = tryHorizontal();
      if (h) {
        const { top: ct, mod } = centerVert();
        // toRight=true → class 'left'; toRight=false → class 'right'
        const dirClass = h.toRight ? "left" : "right";
        setPos({
          top: ct, left: h.left,
          classes: `horizontal ${dirClass}${mod ? " " + mod : ""} corner`,
          nubHOff, nubVOff,
        });
        return;
      }

      // 1.b — plain vertical
      const v2 = tryVertical();
      if (v2) {
        const { left, dirClass } = centerHoriz();
        setPos({
          top: v2.top, left,
          classes: `vertical ${v2.above ? "above" : "below"}${dirClass ? " " + dirClass : ""}`,
          nubHOff, nubVOff,
        });
        return;
      }
    } else if (inLeftRight) {
      // 1.b.iii/iv — horizontal
      const h = tryHorizontal();
      if (h) {
        const { top: ct, mod } = centerVert();
        const dirClass = h.toRight ? "left" : "right";
        setPos({
          top: ct, left: h.left,
          classes: `horizontal ${dirClass}${mod ? " " + mod : ""}`,
          nubHOff, nubVOff,
        });
        return;
      }
    }

    // ══ RULE 3: Popup size ══
    if (pw > WIDE_POPUP) {
      const v = tryVertical();
      if (v) {
        const { left, dirClass } = centerHoriz();
        setPos({
          top: v.top, left,
          classes: `vertical ${v.above ? "above" : "below"}${dirClass ? " " + dirClass : ""}`,
          nubHOff, nubVOff,
        });
        return;
      }
    } else if (ph > LONG_POPUP) {
      const h = tryHorizontal();
      if (h) {
        const { top: ct, mod } = centerVert();
        const dirClass = h.toRight ? "left" : "right";
        setPos({
          top: ct, left: h.left,
          classes: `horizontal ${dirClass}${mod ? " " + mod : ""}`,
          nubHOff, nubVOff,
        });
        return;
      }
    }

    // ══ RULE 4/5: Favor vertical (below) ══
    const v = tryVertical();
    if (v) {
      const { left, dirClass } = centerHoriz();
      setPos({
        top: v.top, left,
        classes: `vertical ${v.above ? "above" : "below"}${dirClass ? " " + dirClass : ""}`,
        nubHOff, nubVOff,
      });
      return;
    }

    const h = tryHorizontal();
    if (h) {
      const { top: ct, mod } = centerVert();
      const dirClass = h.toRight ? "left" : "right";
      setPos({
        top: ct, left: h.left,
        classes: `horizontal ${dirClass}${mod ? " " + mod : ""}`,
        nubHOff, nubVOff,
      });
      return;
    }

    // Ultimate fallback
    const { left, dirClass } = centerHoriz();
    setPos({
      top:    Math.min(a.bottom + MARGIN, viewH - ph - MARGIN),
      left,
      classes: `vertical below${dirClass ? " " + dirClass : ""}`,
      nubHOff, nubVOff,
    });
  }, [anchorRect]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      computePosition();
      panelRef.current?.focus();
    });

    document.body.style.overflow = "hidden";
    window.addEventListener("resize", computePosition);
    window.addEventListener("scroll", computePosition, true);
    const onKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      window.removeEventListener("resize", computePosition);
      window.removeEventListener("scroll", computePosition, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, computePosition]);

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
