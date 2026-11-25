import React, { useRef, useEffect } from "react";
import styled from "styled-components";

// Semantic color map — falls back to CSS variables, then hardcoded defaults.
// yellow reads --mochi-selected (not --color-warning): --color-warning is
// a genuinely different orange, while the fallback here (#ffb80d) was
// clearly written for the same amber "selected" accent Radio/Toggle/
// Checkbox use — same mismatch as those components had. red/green use the
// --mochi-* aliases (not the underlying --color-* vars directly) to match
// the convention the rest of the theme follows, e.g. the warning Button.
// blue (the default) is Mochi's progress fill, #69cdff (ProgressBar.less),
// via --mochi-accent.
const colorMap = {
  blue:   "var(--mochi-accent, #69cdff)",
  yellow: "var(--mochi-selected, #ffb80d)",
  red:    "var(--mochi-error, #c62828)",
  green:  "var(--mochi-success, #388e3c)",
};

const Container = styled.div`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "12px"};
  background: var(--mochi-hover, rgba(0,0,0,0.08));
  border-radius: var(--mochi-corner-field, 24px);
  overflow: hidden;
  border: 1px solid var(--mochi-border, rgba(0,0,0,0.1));
`;

const Fill = styled.div.attrs({ className: "mochi-progress-fill" })`
  height: 100%;
  background-color: ${({ $color }) => colorMap[$color] || colorMap.blue};
  border-radius: 0;
  width: ${({ $value }) => Math.min(Math.max($value, 0), 100)}%;
  // A short change takes the control duration, a long one the arrive duration
  // (set by the component from the distance travelled); forward ease either way.
  transition: width var(--fill-duration, var(--mochi-duration-control, 200ms)) var(--mochi-ease-forward, ease);
  will-change: width;
`;

// Beyond this many percentage points a change counts as a long one.
const LONG_CHANGE = 25;

export const MochiProgressBar = ({
  value = 0,
  color = "blue",
  width,
  height,
  ...rest
}) => {
  const lastValue = useRef(value);
  const distance = Math.abs(value - lastValue.current);
  useEffect(() => { lastValue.current = value; }, [value]);

  return (
    <Container
      $width={width}
      $height={height}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      {...rest}
    >
      <Fill
        $color={color}
        $value={value}
        style={{
          '--fill-duration': distance > LONG_CHANGE
            ? 'var(--mochi-duration-arrive, 220ms)'
            : 'var(--mochi-duration-control, 200ms)',
        }}
      />
    </Container>
  );
};
