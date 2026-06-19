import styled, { keyframes } from "styled-components";
import bottomLeftCornerDown   from "./nubbinImages/bottom-left-corner-down.png";
import bottomLeftCornerLeft   from "./nubbinImages/bottom-left-corner-left.png";
import bottomRightCornerDown  from "./nubbinImages/bottom-right-corner-down.png";
import bottomRightCornerRight from "./nubbinImages/bottom-right-corner-right.png";
import down            from "./nubbinImages/down.png";
import up              from "./nubbinImages/up.png";
import left            from "./nubbinImages/left.png";
import right           from "./nubbinImages/right.png";
import topLeftCornerLeft   from "./nubbinImages/top-left-corner-left.png";
import topLeftCornerUp     from "./nubbinImages/top-left-corner-up.png";
import topRightCornerRight from "./nubbinImages/top-right-corner-right.png";
import topRightCornerUp   from "./nubbinImages/top-right-corner-up.png";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

// Full-viewport transparent overlay — click-outside dismiss target.
// Always in the DOM (never unmounted) so no fixed-element reflow can
// scroll the page. Hidden via visibility+pointer-events when closed.
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 999;
  pointer-events: ${({ $hidden }) => $hidden ? 'none' : 'auto'};
  visibility:     ${({ $hidden }) => $hidden ? 'hidden' : 'visible'};
`;

// Panel is position:fixed so top/left are always viewport-relative px,
// matching the values from getBoundingClientRect() on the anchor.
// This is the same pattern used by dropdowns and <dialog> polyfills —
// no wrapper coordinate system to worry about.
export const Panel = styled.div.attrs(({ className }) => ({
  className: `mochi-contextual-popup ${className || ""}`,
}))`
  position: fixed;
  background: var(--mochi-surface, #ffffff);
  border: 2px solid var(--mochi-popup-border, #646464);
  border-radius: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.44);
  padding: 6px;
  min-width: 150px;
  color: var(--mochi-text, #4b4b4b);
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  pointer-events: auto;
  z-index: 1000;
  animation: ${fadeIn} 0.22s ease forwards;
  max-width: 320px;

  /* ────────────────────────────────────────────────────────────────
     VERTICAL POPUP MARGIN OFFSETS
     Extra space so the nubbin image doesn't overlap the panel border.
  ──────────────────────────────────────────────────────────────── */
  &.vertical.below { margin-top:  20px; }
  &.vertical.above { margin-top: -10px; }

  /* ────────────────────────────────────────────────────────────────
     HORIZONTAL POPUP MARGIN OFFSETS
  ──────────────────────────────────────────────────────────────── */
  &.horizontal.right { margin-left: -11px; }
  &.horizontal.left  { margin-left:  10px; }

  /* ────────────────────────────────────────────────────────────────
     CORNER BORDER-RADIUS ZEROING
  ──────────────────────────────────────────────────────────────── */
  &.vertical.below.left.corner   { border-top-right-radius:    0; }
  &.vertical.below.right.corner  { border-top-left-radius:     0; }
  &.vertical.above.left.corner   { border-bottom-right-radius: 0; }
  &.vertical.above.right.corner  { border-bottom-left-radius:  0; }
  &.horizontal.left.high.corner  { border-top-left-radius:     0; }
  &.horizontal.right.high.corner { border-top-right-radius:    0; }
  &.horizontal.left.low.corner   { border-bottom-left-radius:  0; }
  &.horizontal.right.low.corner  { border-bottom-right-radius: 0; }

  /* ────────────────────────────────────────────────────────────────
     NUBBIN ::after rules
  ──────────────────────────────────────────────────────────────── */
  &::after {
    content: '';
    position: absolute;
    display: block;
  }

  /* vertical below — nub points UP */
  &.vertical.below::after {
    top: 0;
    margin-top: -20px;
    left: var(--nubbin-h-offset, 34%);
    width: 71px;
    height: 20px;
    background: transparent url(${up}) no-repeat;
  }

  /* vertical above — nub points DOWN */
  &.vertical.above::after {
    top: 100%;
    left: var(--nubbin-h-offset, 34%);
    width: 71px;
    height: 20px;
    background: transparent url(${down}) no-repeat;
  }

  /* vertical below + left corner — nub at top-right */
  &.vertical.below.left.corner::after {
    top: 0;
    left: 100%;
    margin-top: -14px;
    margin-left: -30px;
    width: 71px;
    height: 20px;
    background: transparent url(${topRightCornerUp}) no-repeat;
  }

  /* vertical below + right corner — nub at top-left */
  &.vertical.below.right.corner::after {
    top: 0;
    left: 0;
    margin-left: -2px;
    margin-top: -14px;
    width: 71px;
    height: 20px;
    background: transparent url(${topLeftCornerUp}) no-repeat;
  }

  /* vertical above + left corner — nub at bottom-right */
  &.vertical.above.left.corner::after {
    top: 100%;
    left: 100%;
    margin-left: -30px;
    width: 71px;
    height: 20px;
    background: transparent url(${bottomRightCornerDown}) no-repeat;
  }

  /* vertical above + right corner — nub at bottom-left */
  &.vertical.above.right.corner::after {
    top: 100%;
    left: 0;
    margin-left: -2px;
    width: 71px;
    height: 20px;
    background: transparent url(${bottomLeftCornerDown}) no-repeat;
  }

  /* horizontal left — popup right of anchor, nub points LEFT */
  &.horizontal.left::after {
    left: 0;
    margin-left: -20px;
    top: var(--nubbin-v-offset, 35%);
    width: 20px;
    height: 71px;
    background: transparent url(${left}) no-repeat;
  }

  /* horizontal right — popup left of anchor, nub points RIGHT */
  &.horizontal.right::after {
    left: 100%;
    top: var(--nubbin-v-offset, 35%);
    width: 20px;
    height: 71px;
    background: transparent url(${right}) no-repeat;
  }

  /* horizontal left + high corner — nub at top-left */
  &.horizontal.left.high.corner::after {
    top: 0;
    left: 0;
    margin-top: -2px;
    margin-left: -14px;
    width: 20px;
    height: 71px;
    background: transparent url(${topLeftCornerLeft}) no-repeat;
  }

  /* horizontal right + high corner — nub at top-right */
  &.horizontal.right.high.corner::after {
    top: 0;
    left: 100%;
    margin-top: -2px;
    width: 20px;
    height: 71px;
    background: transparent url(${topRightCornerRight}) no-repeat;
  }

  /* horizontal left + low corner — nub at bottom-left */
  &.horizontal.left.low.corner::after {
    top: 100%;
    left: 0;
    margin-top: -30px;
    margin-left: -14px;
    width: 20px;
    height: 71px;
    background: transparent url(${bottomLeftCornerLeft}) no-repeat;
  }

  /* horizontal right + low corner — nub at bottom-right */
  &.horizontal.right.low.corner::after {
    top: 100%;
    left: 100%;
    margin-top: -30px;
    width: 20px;
    height: 71px;
    background: transparent url(${bottomRightCornerRight}) no-repeat;
  }
`;

export const PanelTitle = styled.div`
  font-weight: bold;
  color: var(--mochi-text-muted, #646464);
  padding: 24px 32px 0;
`;

export const ContentArea = styled.div`
  padding: 24px 32px;
`;

export const ButtonBar = styled.div`
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 0 8px 8px;
`;
