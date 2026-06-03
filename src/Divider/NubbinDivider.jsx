import React, { useId } from "react";

export function NubbinDivider({
  orientation = "horizontal",
  side,
  color = "currentColor",
  thickness = 6,
  notchRadius = 10,
  fadeSize = 24,
  length = "100%",
  crossSize = 24,
  className = "",
}) {
  const id = useId();
  const isHorizontal = orientation === "horizontal";
  const resolvedSide = side || (isHorizontal ? "bottom" : "left");

  const viewLength = 400;
  const viewCross = Math.max(crossSize, notchRadius * 2 + thickness);

  const centerMain = viewLength / 2;
  const centerCross = viewCross / 2;
  const notchStart = centerMain - notchRadius;
  const notchEnd = centerMain + notchRadius;

  let d = "";

  if (isHorizontal) {
    const sweepFlag = resolvedSide === "top" ? 0 : 1;

    d = [
      `M 0 ${centerCross}`,
      `L ${notchStart} ${centerCross}`,
      `A ${notchRadius} ${notchRadius} 0 0 ${sweepFlag} ${notchEnd} ${centerCross}`,
      `L ${viewLength} ${centerCross}`,
    ].join(" ");
  } else {
    const sweepFlag = resolvedSide === "left" ? 0 : 1;

    d = [
      `M ${centerCross} 0`,
      `L ${centerCross} ${notchStart}`,
      `A ${notchRadius} ${notchRadius} 0 0 ${sweepFlag} ${centerCross} ${notchEnd}`,
      `L ${centerCross} ${viewLength}`,
    ].join(" ");
  }

  const fadeStop = (fadeSize / viewLength) * 100;
  const gradientId = `nubbin-divider-${id}`;

  return (
    <div
      className={className}
      style={{
        color,
        width: isHorizontal ? length : viewCross,
        height: isHorizontal ? viewCross : length,
        flex: "0 0 auto",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={
          isHorizontal
            ? `0 0 ${viewLength} ${viewCross}`
            : `0 0 ${viewCross} ${viewLength}`
        }
        preserveAspectRatio="none"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2={isHorizontal ? "100%" : "0%"}
            y2={isHorizontal ? "0%" : "100%"}
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset={`${fadeStop}%`} stopColor="currentColor" stopOpacity="1" />
            <stop offset={`${100 - fadeStop}%`} stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={d}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}