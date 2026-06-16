import React, { useEffect, useRef } from "react";

// Resolves a color string that may be a CSS variable (e.g. "var(--mochi-primary, #04B2F9)")
// into an actual color value the Canvas 2D API can use.
function resolveColor(el, color) {
  if (!color || !color.trim().startsWith("var(")) return color || "#04B2F9";
  // Apply it temporarily to the element and read back the computed value
  const prev = el.style.color;
  el.style.color = color;
  const resolved = getComputedStyle(el).color;
  el.style.color = prev;
  return resolved || "#04B2F9";
}

// This draws the legacy Mochi bubble from Enyo
function drawMochiBubble(ctx, color) {
  ctx.clearRect(0, 0, 62, 37);
  ctx.save();
  ctx.fillStyle = color || "#04B2F9";
  ctx.beginPath();
  ctx.moveTo(1, 37);
  ctx.arcTo(1, 33, 12, 33, 4);
  ctx.lineTo(46, 33);
  ctx.arcTo(61, 33, 61, 17, 16);
  ctx.moveTo(61, 17); // Enyo comment: needed in IE9
  ctx.arcTo(61, 1, 46, 1, 16);
  ctx.lineTo(16, 1);
  ctx.arcTo(1, 1, 1, 17, 16);
  ctx.lineTo(1, 37);
  ctx.fill();
  ctx.restore();
}

const BubbleCanvas = ({ color = "var(--mochi-primary, #04B2F9)", style }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resolved = resolveColor(canvas, color);
    drawMochiBubble(canvas.getContext("2d"), resolved);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      width={62}
      height={37}
      style={{
        display: "block",
        position: "absolute",
        left: "100%",
        transform: "translate(-10%, 0)",
        top: "-45px",
        zIndex: 100,
        ...style,
      }}
    />
  );
};

export default BubbleCanvas;
