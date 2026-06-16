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
    const leftFlushPt   = HORIZ_FLUSH_MARGIN;

    let nubHOff = 0;
    let nubVOff = 0;

    // ── Axis helpers ────────────────────────────────────────────────────────

    function tryVertical() {
      let above;
      if (a.top < viewH / 2) { above = false; }
      else                   { above = true;  }
      // Verify it actually fits
      const t = above ? a.top - ph : a.bottom;
      if (t + ph > viewH || t < 0) return null;
      return { above };
    }

    function tryHorizontal() {
      let toRight;
      if (a.left + a.width < viewW / 2) { toRight = true;  }
      else                              { toRight = false; }
      const l = toRight ? a.right : a.left - pw;
      if (l < 0 || l + pw > viewW) return null;
      return { toRight };
    }

    // ── top/left derivation ─────────────────────────────────────────────────
    //
    // The Panel is position:absolute inside PanelWrapper (fixed, top:0 left:0,
    // full viewport). So top/left are viewport-relative px.
    //
    // Vertical placement (below / above):
    //   below  → top  = a.bottom   (panel sits just under the anchor)
    //   above  → top  = a.top - ph (panel sits just above the anchor)
    //
    // Horizontal placement (left-of / right-of anchor):
    //   right-of anchor (nub on left side)  → left = a.right
    //   left-of  anchor (nub on right side) → left = a.left - pw
    //
    // Centering on the opposite axis:
    //   centerHoriz: horizontally centres the popup on the anchor's mid-point,
    //                clamped to viewport margins.
    //   centerVert:  vertically   centres the popup on the anchor's mid-point,
    //                clamped to viewport margins.
    //
    // Corner nubbins mix both: e.g. vertical-below-right-corner means the
    // popup is BELOW the anchor and the nub is at the top-LEFT corner of the
    // panel → left aligns to a.left (anchor's left edge).

    function topForBelow()  { return a.bottom; }
    function topForAbove()  { return a.top - ph; }
    function leftForRight() { return a.right; }          // popup right-of anchor
    function leftForLeft()  { return a.left - pw; }      // popup left-of anchor

    function centerHoriz() {
      // Centre popup on anchor's horizontal midpoint, clamp to viewport.
      const anchorCX = a.left + a.width / 2;
      let l = anchorCX - pw / 2;
      let dirClass = "";
      if      (l < MARGIN)              { l = MARGIN;              dirClass = "right"; }
      else if (l + pw > viewW - MARGIN) { l = viewW - pw - MARGIN; dirClass = "left";  }
      nubHOff = Math.round(anchorCX - l - NUB_W / 2);
      return { left: l, dirClass };
    }

    function centerVert() {
      // Centre popup on anchor's vertical midpoint, clamp to viewport.
      const anchorCY = a.top + a.height / 2;
      let t = anchorCY - ph / 2;
      let mod = "";
      if      (t < MARGIN)              { t = MARGIN;              mod = "high"; }
      else if (t + ph > viewH - MARGIN) { t = viewH - ph - MARGIN; mod = "low";  }
      nubVOff = Math.round(anchorCY - t - NUB_SIDE / 2);
      return { top: t, mod };
    }

    const inTopBottom = (a.bottom < topFlushPt) || (a.top > bottomFlushPt);
    const inLeftRight = (a.right  < leftFlushPt) || (a.left > viewW - leftFlushPt);

    // ── Resolve helpers ──────────────────────────────────────────────────────

    function resolveVertical(corner = false) {
      const v = tryVertical();
      if (!v) return false;
      const { left, dirClass } = centerHoriz();

      // top: below anchor or above anchor
      const top = v.above ? topForAbove() : topForBelow();

      // Corner case: left/right dirClass means the centred popup has been
      // clamped to a viewport edge — the nub moves to that corner.
      // In that case, snap the horizontal position to the anchor edge instead
      // of the clamped-centre value so the corner nub lines up perfectly.
      let resolvedLeft = left;
      if (corner && dirClass === "left") {
        // nub at top/bottom-RIGHT corner → popup's right edge near anchor's right
        resolvedLeft = a.right - pw;
      } else if (corner && dirClass === "right") {
        // nub at top/bottom-LEFT corner → popup's left edge near anchor's left
        resolvedLeft = a.left;
      }

      setPos({
        top, left: resolvedLeft,
        classes: `vertical ${v.above ? "above" : "below"}${dirClass ? " " + dirClass : ""}${corner ? " corner" : ""}`,
        nubHOff, nubVOff,
      });
      return true;
    }

    function resolveHorizontal(corner = false) {
      const h = tryHorizontal();
      if (!h) return false;
      const { top, mod } = centerVert();
      const dirClass = h.toRight ? "left" : "right";

      // left: right-of anchor or left-of anchor
      const left = h.toRight ? leftForRight() : leftForLeft();

      // Corner: snap vertical position to anchor edge
      let resolvedTop = top;
      if (corner && mod === "high") {
        resolvedTop = a.top;
      } else if (corner && mod === "low") {
        resolvedTop = a.bottom - ph;
      }

      setPos({
        top: resolvedTop, left,
        classes: `horizontal ${dirClass}${mod ? " " + mod : ""}${corner ? " corner" : ""}`,
        nubHOff, nubVOff,
      });
      return true;
    }

    // ── Decision tree (unchanged logic, new top/left values) ────────────────

    if (inTopBottom) {
      const v = tryVertical();
      if (v) {
        const { left, dirClass } = centerHoriz();
        if (dirClass) {
          const top = v.above ? topForAbove() : topForBelow();
          const resolvedLeft = dirClass === "left" ? a.right - pw : a.left;
          setPos({
            top, left: resolvedLeft,
            classes: `vertical ${v.above ? "above" : "below"} ${dirClass} corner`,
            nubHOff, nubVOff,
          });
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

    // Ultimate fallback: below, centred
    const { left, dirClass } = centerHoriz();
    setPos({
      top:    topForBelow(),
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

  const overlayHidden = !isOpen;

  const panelStyle = isOpen && pos
    ? {
        top:  pos.top,
        left: pos.left,
        "--nubbin-h-offset": `${pos.nubHOff}px`,
        "--nubbin-v-offset": `${pos.nubVOff}px`,
      }
    : { visibility: "hidden" };

  return (
    <Overlay
      $hidden={overlayHidden}
      onClick={(e) => !overlayHidden && e.target === e.currentTarget && onClose?.()}
      aria-modal={isOpen ? "true" : undefined}
      aria-hidden={overlayHidden ? "true" : undefined}
      role="dialog"
    >
      <PanelWrapper>
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
      </PanelWrapper>
    </Overlay>
  );
}
