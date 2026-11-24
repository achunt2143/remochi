import styled, { keyframes } from "styled-components";

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
  background: var(--mochi-surface-material, var(--mochi-panel-bg, #f5f5f5));
  border: 2px solid var(--mochi-panel-border, var(--mochi-popup-border, #646464));
  border-radius: var(--mochi-corner-field, 24px);
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

  /* The panel takes focus when it opens; show it when opened from the keyboard. */
  &:focus-visible {
    outline: 2px solid var(--mochi-primary, #4a8bc2);
    outline-offset: 2px;
  }

  /* ────────────────────────────────────────────────────────────────
     VERTICAL POPUP MARGIN OFFSETS
     Extra space so the nubbin doesn't overlap the panel border.
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
     NUBBIN
     Drawn in code (see shared/nubbin.jsx) and rendered by
     MochiPopupPanel as the panel's last child. Each rule places the
     nubbin's box so its line runs exactly over the panel's border: the
     bump's flat tails and the corner caps' straight edges sit on the
     border and their fill covers it under the shape, so the two read as
     one stroke. Colours come from the same tokens as the panel's own
     border and background, so light and dark need nothing extra.
  ──────────────────────────────────────────────────────────────── */
  & > .mochi-popup-nubbin {
    position: absolute;
    pointer-events: none;
  }

  /* vertical below — nub points UP */
  &.vertical.below > .mochi-popup-nubbin {
    top: 0;
    margin-top: -20px;
    left: var(--nubbin-h-offset, 34%);
  }

  /* vertical above — nub points DOWN */
  &.vertical.above > .mochi-popup-nubbin {
    top: 100%;
    left: var(--nubbin-h-offset, 34%);
  }

  /* vertical below + left corner — nub at top-right */
  &.vertical.below.left.corner > .mochi-popup-nubbin {
    top: 0;
    left: 100%;
    margin-top: -14px;
    margin-left: -30px;
  }

  /* vertical below + right corner — nub at top-left */
  &.vertical.below.right.corner > .mochi-popup-nubbin {
    top: 0;
    left: 0;
    margin-left: -2px;
    margin-top: -14px;
  }

  /* vertical above + left corner — nub at bottom-right */
  &.vertical.above.left.corner > .mochi-popup-nubbin {
    top: 100%;
    left: 100%;
    margin-left: -30px;
  }

  /* vertical above + right corner — nub at bottom-left */
  &.vertical.above.right.corner > .mochi-popup-nubbin {
    top: 100%;
    left: 0;
    margin-left: -2px;
  }

  /* horizontal left — popup right of anchor, nub points LEFT */
  &.horizontal.left > .mochi-popup-nubbin {
    left: 0;
    margin-left: -20px;
    top: var(--nubbin-v-offset, 35%);
  }

  /* horizontal right — popup left of anchor, nub points RIGHT */
  &.horizontal.right > .mochi-popup-nubbin {
    left: 100%;
    top: var(--nubbin-v-offset, 35%);
  }

  /* horizontal left + high corner — nub at top-left */
  &.horizontal.left.high.corner > .mochi-popup-nubbin {
    top: 0;
    left: 0;
    margin-top: -2px;
    margin-left: -14px;
  }

  /* horizontal right + high corner — nub at top-right */
  &.horizontal.right.high.corner > .mochi-popup-nubbin {
    top: 0;
    left: 100%;
    margin-top: -2px;
  }

  /* horizontal left + low corner — nub at bottom-left */
  &.horizontal.left.low.corner > .mochi-popup-nubbin {
    top: 100%;
    left: 0;
    margin-top: -30px;
    margin-left: -14px;
  }

  /* horizontal right + low corner — nub at bottom-right */
  &.horizontal.right.low.corner > .mochi-popup-nubbin {
    top: 100%;
    left: 100%;
    margin-top: -30px;
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
