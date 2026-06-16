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

// Transparent overlay — acts as autoDismiss tap target only, not a modal scrim
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 999;
`;

export const PanelWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const Panel = styled.div.attrs(({ className }) => ({
  className: `mochi-contextual-popup ${className || ""}`,
}))`
  position: absolute;
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
  animation: ${fadeIn} 0.22s ease forwards;
  max-width: 320px;

  /* ────────────────────────────────────────────────────────────────
     VERTICAL POPUP MARGIN OFFSETS
     Extra top space so the nubbin doesn't overlap the panel border.
  ──────────────────────────────────────────────────────────────── */
  &.vertical.below {
    margin-top: 20px;
  }
  &.vertical.above {
    margin-top: -10px;
    margin-bottom: 10px;
  }

  /* ────────────────────────────────────────────────────────────────
     HORIZONTAL POPUP MARGIN OFFSETS
     right = popup is LEFT of anchor (nub points right toward anchor)
     left  = popup is RIGHT of anchor (nub points left toward anchor)
  ──────────────────────────────────────────────────────────────── */
  &.horizontal.right { margin-left: -11px; }
  &.horizontal.left  { margin-left:  10px; }

  /* ────────────────────────────────────────────────────────────────
     CORNER BORDER-RADIUS ZEROING
     The corner where the nub image butts up against the panel gets
     its radius zeroed so the nub image and panel edge are seamless.
  ──────────────────────────────────────────────────────────────── */

  /* Vertical below: nub at top edge */
  &.vertical.below.left.corner  { border-top-right-radius: 0; } /* nub at top-right */
  &.vertical.below.right.corner { border-top-left-radius:  0; } /* nub at top-left  */

  /* Vertical above: nub at bottom edge */
  &.vertical.above.left.corner  { border-bottom-right-radius: 0; } /* nub at bottom-right */
  &.vertical.above.right.corner { border-bottom-left-radius:  0; } /* nub at bottom-left  */

  /* Horizontal high (top-aligned): nub at top edge */
  &.horizontal.left.high.corner  { border-top-left-radius:  0; } /* nub at top-left  */
  &.horizontal.right.high.corner { border-top-right-radius: 0; } /* nub at top-right */

  /* Horizontal low (bottom-aligned): nub at bottom edge */
  &.horizontal.left.low.corner  { border-bottom-left-radius:  0; } /* nub at bottom-left  */
  &.horizontal.right.low.corner { border-bottom-right-radius: 0; } /* nub at bottom-right */

  /* ────────────────────────────────────────────────────────────────
     NUBBIN ::after rules
     Class semantics (matching Enyo originals):
       left/right on vertical  = direction TO the anchor
       left/right on horizontal = which side of the popup the nub is on
       --nubbin-h-offset = JS-computed px so straight nubbins track anchor center
       --nubbin-v-offset = same for horizontal nubbins
  ──────────────────────────────────────────────────────────────── */
  &::after {
    content: '';
    position: absolute;
    display: block;
  }

  /* ── VERTICAL: popup BELOW anchor → nub points UP ──
     Base rule covers all .vertical.below cases;
     .left/.right overrides are handled by the same dynamic offset */
  &.vertical.below::after {
    top: 0;
    margin-top: -20px;
    left: var(--nubbin-h-offset, 34%);
    width: 71px;
    height: 20px;
    background: transparent url(${up}) no-repeat;
  }

  /* ── VERTICAL: popup ABOVE anchor → nub points DOWN ── */
  &.vertical.above::after {
    top: 100%;
    left: var(--nubbin-h-offset, 34%);
    width: 71px;
    height: 20px;
    background: transparent url(${down}) no-repeat;
  }

  /* ── VERTICAL CORNER NUBBINS ──
     Fixed pixel offsets matching original Enyo CSS exactly.
     These override the base vertical rules above. */

  /* Below + left corner: nub at top-right of panel */
  &.vertical.below.left.corner::after {
    top: 0%;
    left: 100%;
    margin-top: -14px;
    margin-left: -30px;
    width: 71px;
    height: 20px;
    background: transparent url(${topRightCornerUp}) no-repeat;
  }

  /* Below + right corner: nub at top-left of panel */
  &.vertical.below.right.corner::after {
    top: 0%;
    left: 0%;
    margin-left: -2px;
    margin-top: -14px;
    width: 71px;
    height: 20px;
    background: transparent url(${topLeftCornerUp}) no-repeat;
  }

  /* Above + left corner: nub at bottom-right of panel */
  &.vertical.above.left.corner::after {
    top: 100%;
    left: 100%;
    margin-left: -30px;
    width: 71px;
    height: 20px;
    background: transparent url(${bottomRightCornerDown}) no-repeat;
  }

  /* Above + right corner: nub at bottom-left of panel */
  &.vertical.above.right.corner::after {
    top: 100%;
    left: 0%;
    margin-left: -2px;
    width: 71px;
    height: 20px;
    background: transparent url(${bottomLeftCornerDown}) no-repeat;
  }

  /* ── HORIZONTAL: popup to the RIGHT of anchor → nub points LEFT ──
     class 'left' = nub is on the left side of the panel */
  &.horizontal.left::after {
    left: 0%;
    margin-left: -20px;
    top: var(--nubbin-v-offset, 35%);
    width: 20px;
    height: 71px;
    background: transparent url(${left}) no-repeat;
  }

  /* ── HORIZONTAL: popup to the LEFT of anchor → nub points RIGHT ──
     class 'right' = nub is on the right side of the panel */
  &.horizontal.right::after {
    left: 100%;
    top: var(--nubbin-v-offset, 35%);
    width: 20px;
    height: 71px;
    background: transparent url(${right}) no-repeat;
  }

  /* ── HORIZONTAL CORNER NUBBINS ──
     Fixed pixel offsets matching original Enyo CSS exactly. */

  /* Left + high corner: nub at top-left of panel */
  &.horizontal.left.high.corner::after {
    top: 0%;
    left: 0%;
    margin-top: -2px;
    margin-left: -14px;
    width: 20px;
    height: 71px;
    background: transparent url(${topLeftCornerLeft}) no-repeat;
  }

  /* Right + high corner: nub at top-right of panel */
  &.horizontal.right.high.corner::after {
    top: 0%;
    left: 100%;
    margin-top: -2px;
    width: 20px;
    height: 71px;
    background: transparent url(${topRightCornerRight}) no-repeat;
  }

  /* Left + low corner: nub at bottom-left of panel */
  &.horizontal.left.low.corner::after {
    top: 100%;
    left: 0%;
    margin-top: -30px;
    margin-left: -14px;
    width: 20px;
    height: 71px;
    background: transparent url(${bottomLeftCornerLeft}) no-repeat;
  }

  /* Right + low corner: nub at bottom-right of panel */
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
