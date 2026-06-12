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
const NUB_W              = 71;  // nubbin image width  (px)
const NUB_H              = 20;  // nubbin image height (px) — vertical nubbins
const NUB_SIDE           = 71;  // nubbin image size for horizontal nubbins

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

  // ─── helpers ────────────────────────────────────────────────────────────────

  const getViewW = () => window.innerWidth  ?? document.documentElement.clientWidth;
  const getViewH = () => window.innerHeight ?? document.documentElement.clientHeight;

  // ─── positioning engine (mirrors Enyo 5-rule adjustPosition) ───────────────

  const computePosition = useCallback(() => {
    if (!anchorRect || !panelRef.current) return;

    const vp      = panelRef.current;
    const vpRect  = vp.getBoundingClientRect();
    const pw      = vpRect.width;
    const ph      = vpRect.height;
    const viewW   = getViewW();
    const viewH   = getViewH();
    const a       = anchorRect; // shorthand

    const topFlushPt    = VERT_FLUSH_MARGIN;
    const bottomFlushPt = viewH - VERT_FLUSH_MARGIN;
    const leftFlushPt   = HORIZ_FLUSH_MARGIN;
    const rightFlushPt  = viewW - HORIZ_FLUSH_MARGIN;

    // ── Result accumulator ──────────────────────────────────────────────────
    let top, left;
    let classes   = "";
    // CSS vars for dynamic nubbin tracking
    let nubHOff   = 0;   // --nubbin-h-offset: left of nubbin in ::after for vertical nubbins
    let nubVOff   = 0;   // --nubbin-v-offset: top  of nubbin in ::after for horizontal nubbins

    // ── vertical placement helper ───────────────────────────────────────────
    // Returns { top, above } or null if it won't fit
    function tryVertical() {
      let t, above;
      if (a.top < viewH / 2) {
        t     = a.bottom + MARGIN;
        above = false;
      } else {
        t     = a.top - ph - MARGIN;
        above = true;
      }
      if (t + ph > viewH || t < 0) return null;
      return { top: t, above };
    }

    // ── horizontal placement helper ─────────────────────────────────────────
    // Returns { left, isRight } or null if it won't fit
    function tryHorizontal() {
      let l, isRight;
      if (a.left + a.width < viewW / 2) {
        l       = a.right + MARGIN;
        isRight = false; // popup is to the RIGHT of activator → nub class 'left' (points left)
      } else {
        l       = a.left - pw - MARGIN;
        isRight = true;  // popup is to the LEFT  of activator → nub class 'right'
      }
      if (l < 0 || l + pw > viewW) return null;
      return { left: l, isRight };
    }

    // ── center horizontally over anchor, clamped ─────────────────────────────
    function centerHoriz(panelLeft) {
      const anchorCX = a.left + a.width / 2;
      let l = anchorCX - pw / 2;
      let corner = "";
      if (l < MARGIN) {
        l = MARGIN;
        corner = "right corner"; // popup snapped left  → nub on right side pointing to anchor
      } else if (l + pw > viewW - MARGIN) {
        l = viewW - pw - MARGIN;
        corner = "left corner";  // popup snapped right → nub on left  side pointing to anchor
      }
      // nubbin tracks the anchor center relative to where the panel ended up
      nubHOff = Math.round(anchorCX - l - NUB_W / 2);
      return { left: l, corner };
    }

    // ── center vertically beside anchor, clamped (high/low) ─────────────────
    function centerVert(panelTop) {
      const anchorCY = a.top + a.height / 2;
      let t = anchorCY - ph / 2;
      let mod = "";
      if (t < MARGIN) {
        t   = MARGIN;
        mod = "high";
      } else if (t + ph > viewH - MARGIN) {
        t   = viewH - ph - MARGIN;
        mod = "low";
      }
      nubVOff = Math.round(anchorCY - t - NUB_SIDE / 2);
      return { top: t, mod };
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  RULE 1a/1b: Activator in top/bottom flush zone → vertical flush first
    // ═══════════════════════════════════════════════════════════════════════
    const inTopBottom = (a.bottom < topFlushPt) || (a.top > bottomFlushPt);
    const inLeftRight = (a.right  < leftFlushPt) || (a.left > rightFlushPt);

    if (inTopBottom) {
      // 1.a.i — flush vertical
      const v = tryVertical();
      if (v) {
        const { corner } = centerHoriz(null);
        if (corner) {
          classes = `vertical ${v.above ? "above" : "below"} ${corner}`;
          top  = v.top;
          left = (corner.startsWith("right") )
            ? MARGIN
            : viewW - pw - MARGIN;
          // re-compute nubHOff for flush cases
          nubHOff = Math.round((a.left + a.width / 2) - left - NUB_W / 2);
          setPos({ top, left, classes, nubHOff, nubVOff });
          return;
        }
      }

      // 1.a.ii — flush horizontal
      const h = tryHorizontal();
      if (h) {
        const { top: ct, mod } = centerVert(null);
        const hClasses = `horizontal ${h.isRight ? "right" : "left"}${mod ? " " + mod : ""} corner`;
        setPos({ top: ct, left: h.left, classes: hClasses, nubHOff, nubVOff });
        return;
      }

      // 1.b — plain vertical
      const v2 = tryVertical();
      if (v2) {
        const ch = centerHoriz(null);
        classes = `vertical ${v2.above ? "above" : "below"}${ch.corner ? " " + ch.corner : ""}`;
        setPos({ top: v2.top, left: ch.left, classes, nubHOff, nubVOff });
        return;
      }
    } else if (inLeftRight) {
      // 1.b.iii/iv — horizontal
      const h = tryHorizontal();
      if (h) {
        const { top: ct, mod } = centerVert(null);
        const hClasses = `horizontal ${h.isRight ? "right" : "left"}${mod ? " " + mod : ""}`;
        setPos({ top: ct, left: h.left, classes: hClasses, nubHOff, nubVOff });
        return;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  RULE 3: Popup size based
    // ═══════════════════════════════════════════════════════════════════════
    if (pw > WIDE_POPUP) {
      const v = tryVertical();
      if (v) {
        const ch = centerHoriz(null);
        classes = `vertical ${v.above ? "above" : "below"}${ch.corner ? " " + ch.corner : ""}`;
        setPos({ top: v.top, left: ch.left, classes, nubHOff, nubVOff });
        return;
      }
    } else if (ph > LONG_POPUP) {
      const h = tryHorizontal();
      if (h) {
        const { top: ct, mod } = centerVert(null);
        const hClasses = `horizontal ${h.isRight ? "right" : "left"}${mod ? " " + mod : ""}`;
        setPos({ top: ct, left: h.left, classes: hClasses, nubHOff, nubVOff });
        return;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  RULE 4/5: Favor vertical (below)
    // ═══════════════════════════════════════════════════════════════════════
    const v = tryVertical();
    if (v) {
      const ch = centerHoriz(null);
      classes = `vertical ${v.above ? "above" : "below"}${ch.corner ? " " + ch.corner : ""}`;
      setPos({ top: v.top, left: ch.left, classes, nubHOff, nubVOff });
      return;
    }

    const h = tryHorizontal();
    if (h) {
      const { top: ct, mod } = centerVert(null);
      const hClasses = `horizontal ${h.isRight ? "right" : "left"}${mod ? " " + mod : ""}`;
      setPos({ top: ct, left: h.left, classes: hClasses, nubHOff, nubVOff });
      return;
    }

    // Ultimate fallback — just put it below centered, clamped
    const ch = centerHoriz(null);
    setPos({
      top:    Math.min(a.bottom + MARGIN, viewH - ph - MARGIN),
      left:   ch.left,
      classes: "vertical below",
      nubHOff,
      nubVOff,
    });
  }, [anchorRect]);

  useEffect(() => {
    if (!isOpen) return;

    // First paint: measure after mount
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
    : { visibility: "hidden" }; // hidden on first RAF before position computed

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
