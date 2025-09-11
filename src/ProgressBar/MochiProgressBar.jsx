import React from "react";
import styled, { css, keyframes } from "styled-components";

const colors = {
  blue: "#04B2F9",
  yellow: "#ffb80d",
  red: "#d32f2f"
};

const fillAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: var(--fill-width);
  }
`;

const Container = styled.div`
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "12px"};
  background: #e0e7f0; /* light mochi gray background */
  border-radius: 24px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px #bbc9db88;
`;

const Fill = styled.div`
  height: 100%;
  background-color: ${({ color }) => colors[color] || colors.blue};
  border-radius: 24px 0 0 24px;
  width: ${({ value }) => Math.min(Math.max(value, 0), 100)}%;
  transition: width 0.5s ease;
  will-change: width;
`;

export const MochiProgressBar = ({ value = 0, color = "blue", width, height }) => {
  return (
    <Container width={width} height={height} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <Fill color={color} value={value} />
    </Container>
  );
};
