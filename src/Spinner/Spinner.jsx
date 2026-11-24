import React, { useEffect, useRef, useState } from "react";

import {
  SPINNERS,
  OUTLINE,
  OUTLINE_VAR,
  OUTLINE_WIDTH,
  MAX_PIECES,
  framePieces,
} from "./spinnerArt";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(REDUCED_MOTION).matches,
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia(REDUCED_MOTION);
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * The spinner's drawing for one frame: a pool of paths, so the animation can
 * rewrite them in place. Self-contained (inline styles only) so it also
 * renders to static markup.
 */
export const SpinnerArt = ({ size = "normal", styleType = "light", frame = 0, pathRef, calm = false, style, ...rest }) => {
  const spec = SPINNERS[size === "large" ? "large" : "normal"];
  const pieces = framePieces(size === "large" ? "large" : "normal", frame);
  return (
    <svg
      {...rest}
      width={spec.width}
      height={spec.height}
      viewBox={`0 0 ${spec.width} ${spec.height}`}
      style={style}
    >
      {calm && (
        <style>{`@keyframes mochi-spinner-calm{from{opacity:1}to{opacity:.45}}.mochi-spinner-calm{animation:mochi-spinner-calm 2.4s ease-in-out infinite alternate}`}</style>
      )}
      <g className={calm ? "mochi-spinner-calm" : undefined}
        strokeWidth={size === "large" ? OUTLINE_WIDTH * 0.7 : OUTLINE_WIDTH}
        strokeLinejoin="round"
        paintOrder="stroke"
        style={{ stroke: `var(${OUTLINE_VAR}, ${OUTLINE[size === "large" ? "large" : "normal"][styleType === "dark" ? "dark" : "light"]})` }}
      >
        {Array.from({ length: MAX_PIECES }, (_, i) => (
          <path
            key={i}
            ref={pathRef ? (el) => pathRef(i, el) : undefined}
            d={pieces[i]?.d}
            fill={pieces[i]?.fill}
            display={pieces[i] ? undefined : "none"}
          />
        ))}
      </g>
    </svg>
  );
};

/**
 * Props:
 * - active: boolean — show or hide spinner
 * - styleType: "light" | "dark" (default: "light")
 * - size: "normal" | "large" (default: "normal")
 * - alt: accessible label (default: "Loading...")
 *
 * Drawn and animated in code. With `prefers-reduced-motion: reduce` it holds
 * the circle and fades it slowly in and out instead of morphing.
 */
export const Spinner = ({
  active = true,
  styleType = "light",
  size = "normal",
  alt = "Loading...",
  style,
  ...rest
}) => {
  const kind = size === "large" ? "large" : "normal";
  const reduced = usePrefersReducedMotion();
  const paths = useRef([]);

  useEffect(() => {
    const show = (index) => {
      const pieces = framePieces(kind, index);
      paths.current.forEach((el, i) => {
        if (!el) return;
        const piece = pieces[i];
        if (piece) {
          el.setAttribute("d", piece.d);
          el.setAttribute("fill", piece.fill);
          el.removeAttribute("display");
        } else {
          el.setAttribute("display", "none");
        }
      });
    };
    if (reduced) {
      show(0);
    }
    if (!active || reduced) return undefined;
    const { frames, delay } = SPINNERS[kind];
    let raf;
    let shown = -1;
    const start = performance.now();
    const tick = (now) => {
      const index = Math.floor((now - start) / delay) % frames.length;
      if (index !== shown) {
        shown = index;
        show(index);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, kind]);

  return (
    <SpinnerArt
      {...rest}
      calm={reduced}
      role="img"
      aria-label={alt}
      size={kind}
      styleType={styleType}
      pathRef={(i, el) => { paths.current[i] = el; }}
      style={{
        display: active ? "inline-block" : "none",
        ...style,
      }}
    />
  );
};
