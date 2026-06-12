import styled, { keyframes } from "styled-components";
import bottomLeftCornerDown from "./nubbinImages/bottom-left-corner-down.png";
import bottomLeftCornerLeft from "./nubbinImages/bottom-left-corner-left.png";
import bottomRightCornerDown from "./nubbinImages/bottom-right-corner-down.png";
import bottomRightCornerRight from "./nubbinImages/bottom-right-corner-right.png";
import down from "./nubbinImages/down.png";
import up from "./nubbinImages/up.png";
import left from "./nubbinImages/left.png";
import right from "./nubbinImages/right.png";
import topLeftCornerLeft from "./nubbinImages/top-left-corner-left.png";
import topLeftCornerUp from "./nubbinImages/top-left-corner-up.png";
import topRightCornerRight from "./nubbinImages/top-right-corner-right.png";
import topRightCornerUp from "./nubbinImages/top-right-corner-up.png";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
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

  &::after {
    content: '';
    position: absolute;
  }

  &.vertical.above::after {
    top: 100%;
    width: 71px;
    height: 20px;
    background: url(${down}) no-repeat center;
  }

  &.vertical.below::after {
    top: 0;
    margin-top: -20px;
    left: 32%;
    width: 71px;
    height: 20px;
    background: url(${up}) no-repeat center;
  }

  &.vertical.below.left.corner::after {
    top: 0;
    left: 100%;
    margin-top: -14px;
    margin-left: -30px;
    width: 71px;
    height: 20px;
    background: url(${topRightCornerUp}) no-repeat center;
  }

  &.vertical.below.right.corner::after {
    top: 0;
    left: -41px;
    margin-top: -14px;
    width: 71px;
    height: 20px;
    background: url(${topLeftCornerUp}) no-repeat center;
  }

  &.vertical.above.left.corner::after {
    top: 100%;
    left: 100%;
    margin-left: -30px;
    width: 71px;
    height: 20px;
    background: url(${bottomRightCornerDown}) no-repeat center;
  }

  &.vertical.above.right.corner::after {
    top: 100%;
    left: -41px;
    width: 71px;
    height: 20px;
    background: url(${bottomLeftCornerDown}) no-repeat center;
  }

  &.horizontal.left::after {
    top: 20%;
    left: 100%;
    width: 20px;
    height: 71px;
    background: url(${right}) no-repeat center;
  }

  &.horizontal.right::after {
    top: 20%;
    right: 100%;
    width: 20px;
    height: 71px;
    background: url(${left}) no-repeat center;
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
