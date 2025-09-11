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
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.08);
  z-index: 999;
`;

export const PanelWrapper = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
`;

export const Panel = styled.div.attrs(({ className }) => ({
  className: `mochi-contextual-popup ${className || ''}`
}))`
  position: absolute;
  background: #fff;
  border: 2px solid #646464;
  border-radius: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.44);
  padding: 6px;
  min-width: 150px;
  color: #4b4b4b;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  pointer-events: auto;
  animation: ${fadeIn} 0.3s ease forwards;
  max-width: 320px;

  /* Base nubbin styling */
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
  background: url(${topRightCornerUp}) no-repeat;
}

&.vertical.below.right.corner::after {
  top: 0;
  left: 0%;
  width: 71px;
  height: 20px;
  margin-left: -2px;
  margin-top: -14px;
  background: url(${topLeftCornerUp}) no-repeat;
}

&.vertical.above.left.corner::after {
  top: 100%;
  margin-left: -30px;
  width: 71px;
  height: 20px;
  background: url(${bottomRightCornerDown}) no-repeat;
}

&.vertical.above.right.corner::after {
  top: 100%;
  left: 0%;
  margin-left: -2px;
  width: 71px;
  height: 20px;
  background: url(${bottomLeftCornerDown}) no-repeat;
}

/* Horizontal nubbin positions */

&.right.horizontal::after {
  left: 100%;
  top: 35%;
  width: 20px;
  height: 71px;
  background: url(${right}) no-repeat;
}

&.right.high::after {
  top: 25px;
}

&.right.low::after {
  top: 100%;
  margin-top: -100px;
}

&.left.horizontal::after {
  left: 0%;
  width: 20px;
  height: 71px;
  margin-left: -20px;
  top: 35%;
  background: url(${left}) no-repeat;
}

&.left.high::after {
  top: 25px;
}

&.left.low::after {
  top: 100%;
  margin-top: -100px;
}
`;

export const PanelTitle = styled.div`
  font-weight: bold;
  padding: 24px 32px 0px;
`;

export const ContentArea = styled.div`
  padding: 24px 32px;
`;

export const ButtonBar = styled.div`
  width: 100%;
  text-align: center;
  display: inline-block;
`;
