import React from "react";
import styled from "styled-components";

// Semantic color map — falls back to CSS variables, then hardcoded defaults.
// yellow reads --mochi-selected (not --color-warning): --color-warning is
// a genuinely different orange, while the fallback here (#ffb80d) was
// clearly written for the same amber "selected" accent Radio/Toggle/
// Checkbox use — same mismatch as those components had. red/green use the
// --mochi-* aliases (not the underlying --color-* vars directly) to match
// the convention the rest of the theme follows, e.g. the warning Button.
const colorMap = {
  blue:   "var(--mochi-primary, #5b9dd9)",
  yellow: "var(--mochi-selected, #ffb80d)",
  red:    "var(--mochi-error, #d32f2f)",
  green:  "var(--mochi-success, #4caf50)",
};

const Container = styled.div`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "12px"};
  background: var(--mochi-hover, rgba(0,0,0,0.08));
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--mochi-border, rgba(0,0,0,0.1));
`;

const Fill = styled.div`
  height: 100%;
  background-color: ${({ $color }) => colorMap[$color] || colorMap.blue};
  border-radius: 24px 0 0 24px;
  width: ${({ $value }) => Math.min(Math.max($value, 0), 100)}%;
  transition: width 0.5s ease;
  will-change: width;
`;

export const MochiProgressBar = ({
  value = 0,
  color = "blue",
  width,
  height
}) => (
  <Container
    $width={width}
    $height={height}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={value}
  >
    <Fill $color={color} $value={value} />
  </Container>
);
