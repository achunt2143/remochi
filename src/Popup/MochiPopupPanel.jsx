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
import { Nubbin, BUMP, CORNER, NUBBIN_STROKE } from "../shared/nubbin";

const VERT_FLUSH_MARGIN  = 100;
const HORIZ_FLUSH_MARGIN = 100;
const WIDE_POPUP         = 200;
const LONG_POPUP         = 200;
const MARGIN             = 8;
const NUB_W              = 71;
const NUB_SIDE           = 71;

// The panel's own border and background (see Panel), so the nubbin reads
// as part of the panel in either theme.
const NUB_STROKE = "var(--mochi-panel-border, var(--mochi-popup-border, #646464))";
const NUB_FILL   = "var(--mochi-surface-material, var(--mochi-panel-bg, #f5f5f5))";

// Which nubbin a placement (Panel's position classes) gets: a bump pointing
// at the anchor, or, for the corner placements, a corner cap whose tip sits
// at the panel corner nearest it ('start' = left/top end of its box).
function nubbinFor(classes) {
  const has = (c) => classes.split(" ").includes(c);
  if (has("vertical")) {
    const direction = has("below") ? "up" : "down";
    if (!has("corner")) return { shape: "bump", direction };
    return { shape: "corner", direction, side: has("left") ? "end" : "start" };
  }
  const direction = has("left") ? "left" : "right";
  if (!has("corner")) return { shape: "bump", direction };
  return { shape: "corner", direction, side: has("high") ? "start" : "end" };
}

// Where a nubbin's tip is inside its own box (the box is `length` x `depth`
// for up/down, transposed for left/right), in the same frame nubbin.jsx
// draws in: u along the line, v across it, mapped the way its `toBox` does.
function nubbinTip({ shape, direction, side }) {
  const { length, depth } = shape === "bump" ? BUMP : CORNER;
  let u = shape === "bump" ? BUMP.peak : CORNER.ramp[0][0];
  const v = shape === "bump"
    ? depth - NUBBIN_STROKE / 2 - BUMP.height
    : CORNER.ramp[0][1];
  if (shape === "corner" && side === "end") u = length - u;
  switch (direction) {
    case "down":  return [u, depth - v];
    case "left":  return [v, u];
    case "right": return [depth - v, u];
    default:      return [u, v];
  }
}

export function MochiPopupPanel({
  isOpen,
  title,
  children,
  actions = [],
  onClose,
  anchorEl,
  anchorRect: anchorRectProp,
  className = "",
  style: styleProp,
  ...rest
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

  // Keep the panel on whole pixels. Its border is painted snapped to device
  // pixels; the nubbin (an SVG) sits at `left/top: 100%` of a size that's
  // fractional whenever the content is, and the two don't always snap the
  // same way, which leaves a sub-pixel step where the border runs into the
  // nubbin. Rounding the position (see panelStyle) and rounding the size up
  // (by under a pixel) leaves nothing to snap.
  const [wholeSize, setWholeSize] = useState(null);
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!pos || !el) { setWholeSize(null); return; }
    const cs = getComputedStyle(el);
    const w = Math.ceil(parseFloat(cs.width) - 0.01);
    const h = Math.ceil(parseFloat(cs.height) - 0.01);
    setWholeSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
  }, [pos]);

  // The entrance scales from the nubbin's tip, so the popup grows out of the
  // thing it points at. Measured from the drawn nubbin (relative to the
  // panel's border box, undoing the entrance's own scale) and handed to the
  // panel as custom properties.
  const [origin, setOrigin] = useState(null);
  useLayoutEffect(() => {
    const el = panelRef.current;
    const nub = el?.querySelector(".mochi-popup-nubbin");
    if (!pos || !el || !nub) { setOrigin(null); return; }
    const panelRect = el.getBoundingClientRect();
    const nubRect = nub.getBoundingClientRect();
    const scale = el.offsetWidth ? panelRect.width / el.offsetWidth : 1;
    const [tipX, tipY] = nubbinTip(nubbinFor(pos.classes));
    const x = Math.round((nubRect.left - panelRect.left) / scale + tipX);
    const y = Math.round((nubRect.top - panelRect.top) / scale + tipY);
    setOrigin((prev) => (prev && prev.x === x && prev.y === y ? prev : { x, y }));
  }, [pos, wholeSize]);

  useEffect(() => {
    if (pos) panelRef.current?.focus();
  }, [pos]);

  // During the measurement pass (isOpen but pos not yet computed) we render
  // the panel invisible so useLayoutEffect can read its dimensions.
  const panelStyle = pos
    ? {
        top:  Math.round(pos.top),
        left: Math.round(pos.left),
        ...(wholeSize && { minWidth: wholeSize.w, minHeight: wholeSize.h }),
        "--nubbin-h-offset": `${pos.nubHOff}px`,
        "--nubbin-v-offset": `${pos.nubVOff}px`,
        ...(origin && {
          "--popup-origin-x": `${origin.x}px`,
          "--popup-origin-y": `${origin.y}px`,
        }),
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
        {...rest}
        tabIndex={isOpen ? -1 : undefined}
        ref={panelRef}
        style={styleProp ? { ...styleProp, ...panelStyle } : panelStyle}
        className={[isOpen && pos ? pos.classes : "", className]
          .filter(Boolean)
          .join(" ")}
      >
        {title && <PanelTitle>{title}</PanelTitle>}
        <ContentArea>{children}</ContentArea>
        {actions.length > 0 && (
          <ButtonBar>
            {actions.map(({ label, onClick, type }, idx) => (
              <MochiButton key={idx} onClick={onClick} type={type}>
                {label}
              </MochiButton>
            ))}
          </ButtonBar>
        )}
        {isOpen && pos && (
          <Nubbin
            {...nubbinFor(pos.classes)}
            className="mochi-popup-nubbin"
            stroke={NUB_STROKE}
            fill={NUB_FILL}
            shadow
          />
        )}
      </Panel>
    </Overlay>,
    document.body
  );
}
