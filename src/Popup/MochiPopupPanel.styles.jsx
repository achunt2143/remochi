import styled, { keyframes } from "styled-components";
import bottomLeftCornerDown  from "./nubbinImages/bottom-left-corner-down.png";
import bottomLeftCornerLeft  from "./nubbinImages/bottom-left-corner-left.png";
import bottomRightCornerDown from "./nubbinImages/bottom-right-corner-down.png";
import bottomRightCornerRight from "./nubbinImages/bottom-right-corner-right.png";
import down          from "./nubbinImages/down.png";
import up            from "./nubbinImages/up.png";
import left          from "./nubbinImages/left.png";
import right         from "./nubbinImages/right.png";
import topLeftCornerLeft  from "./nubbinImages/top-left-corner-left.png";
import topLeftCornerUp    from "./nubbinImages/top-left-corner-up.png";
import topRightCornerRight from "./nubbinImages/top-right-corner-right.png";
import topRightCornerUp   from "./nubbinImages/top-right-corner-up.png";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

// Transparent overlay — acts as autoDismiss tap target, not a modal scrim
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
  background: var(--mochi-surface, #fff);
  border: 2px solid var(--mochi-border, #646464);
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

  /* --nubbin-h-offset: JS-computed left offset for vertical nubbins so they
     track the anchor's horizontal center regardless of panel clamping.
     --nubbin-v-offset: same for horizontal nubbins tracking anchor vertical center. */

  &::after {
    content: '';
    position: absolute;
    display: block;
  }

  /* ── Vertical: popup is BELOW anchor → nubbin points UP ── */
  &.vertical.below::after {
    bottom: 100%;
    left: var(--nubbin-h-offset, 35px);
    width: 71px;
    height: 20px;
    background: url(${up}) no-repeat center / contain;
  }

  /* ── Vertical: popup is ABOVE anchor → nubbin points DOWN ── */
  &.vertical.above::after {
    top: 100%;
    left: var(--nubbin-h-offset, 35px);
    width: 71px;
    height: 20px;
    background: url(${down}) no-repeat center / contain;
  }

  /* ── Corner: popup is BELOW anchor, snapped to LEFT viewport edge
       Anchor is to the right → nubbin on top-right corner pointing up-right */
  &.vertical.below.right.corner::after {
    bottom: 100%;
    left: var(--nubbin-h-offset, 0px);
    width: 71px;
    height: 20px;
    background: url(${topRightCornerUp}) no-repeat center / contain;
  }

  /* ── Corner: popup is BELOW anchor, snapped to RIGHT viewport edge
       Anchor is to the left → nubbin on top-left corner pointing up-left */
  &.vertical.below.left.corner::after {
    bottom: 100%;
    left: var(--nubbin-h-offset, 0px);
    width: 71px;
    height: 20px;
    background: url(${topLeftCornerUp}) no-repeat center / contain;
  }

  /* ── Corner: popup is ABOVE anchor, snapped to LEFT viewport edge
       Anchor is to the right → nubbin on bottom-right corner pointing down-right */
  &.vertical.above.right.corner::after {
    top: 100%;
    left: var(--nubbin-h-offset, 0px);
    width: 71px;
    height: 20px;
    background: url(${bottomRightCornerDown}) no-repeat center / contain;
  }

  /* ── Corner: popup is ABOVE anchor, snapped to RIGHT viewport edge
       Anchor is to the left → nubbin on bottom-left corner pointing down-left */
  &.vertical.above.left.corner::after {
    top: 100%;
    left: var(--nubbin-h-offset, 0px);
    width: 71px;
    height: 20px;
    background: url(${bottomLeftCornerDown}) no-repeat center / contain;
  }

  /* ── Horizontal: popup is to the RIGHT of anchor → nubbin points LEFT ── */
  &.horizontal.left::after {
    top: var(--nubbin-v-offset, 35px);
    right: 100%;
    width: 20px;
    height: 71px;
    background: url(${left}) no-repeat center / contain;
  }

  /* ── Horizontal: popup is to the LEFT of anchor → nubbin points RIGHT ── */
  &.horizontal.right::after {
    top: var(--nubbin-v-offset, 35px);
    left: 100%;
    width: 20px;
    height: 71px;
    background: url(${right}) no-repeat center / contain;
  }

  /* ── Horizontal corner: high (popup top-aligned) ── */
  &.horizontal.left.high.corner::after {
    top: var(--nubbin-v-offset, 0px);
    right: 100%;
    width: 20px;
    height: 71px;
    background: url(${topLeftCornerLeft}) no-repeat center / contain;
  }

  &.horizontal.right.high.corner::after {
    top: var(--nubbin-v-offset, 0px);
    left: 100%;
    width: 20px;
    height: 71px;
    background: url(${topRightCornerRight}) no-repeat center / contain;
  }

  /* ── Horizontal corner: low (popup bottom-aligned) ── */
  &.horizontal.left.low.corner::after {
    top: var(--nubbin-v-offset, 0px);
    right: 100%;
    width: 20px;
    height: 71px;
    background: url(${bottomLeftCornerLeft}) no-repeat center / contain;
  }

  &.horizontal.right.low.corner::after {
    top: var(--nubbin-v-offset, 0px);
    left: 100%;
    width: 20px;
    height: 71px;
    background: url(${bottomRightCornerRight}) no-repeat center / contain;
  }
`;

export const PanelTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--mochi-text-muted, #646464);
  padding: 8px 12px 4px;
  border-bottom: 1px solid var(--mochi-border, #ddd);
  margin-bottom: 4px;
`;

export const ContentArea = styled.div`
  padding: 4px 0;
`;

export const ButtonBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 12px 4px;
  border-top: 1px solid var(--mochi-border, #ddd);
  margin-top: 4px;
`;
