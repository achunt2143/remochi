import React, { useEffect, useRef, useState } from "react";

import {
  SPINNERS,
  OUTLINE,
  OUTLINE_VAR,
  OUTLINE_WIDTH,
  MAX_PIECES,
  CALM_FRAMES,
  CALM_HOLD,
  CALM_FADE,
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
export const SpinnerArt = ({ size = "normal", styleType = "light", frame = 0, pathRef, calmStep, style, ...rest }) => {
  const kind = size === "large" ? "large" : "normal";
  const spec = SPINNERS[kind];
  const outline = `var(${OUTLINE_VAR}, ${OUTLINE[kind][styleType === "dark" ? "dark" : "light"]})`;
  const group = (pieces, key, layerStyle) => (
    <g
      key={key}
      strokeWidth={kind === "large" ? OUTLINE_WIDTH * 0.7 : OUTLINE_WIDTH}
      strokeLinejoin="round"
      paintOrder="stroke"
      style={{ stroke: outline, ...layerStyle }}
    >
      {pieces}
    </g>
  );
  const body = calmStep === undefined
    ? group(
        Array.from({ length: MAX_PIECES }, (_, i) => {
          const piece = framePieces(kind, frame)[i];
          return (
            <path
              key={i}
              ref={pathRef ? (el) => pathRef(i, el) : undefined}
              d={piece?.d}
              fill={piece?.fill}
              display={piece ? undefined : "none"}
            />
          );
        }),
        "art",
      )
    : // reduced motion: one layer per held keyframe, crossfaded by opacity
      CALM_FRAMES[kind].map((f, k) =>
        group(
          framePieces(kind, f).map((piece, i) => <path key={i} d={piece.d} fill={piece.fill} />),
          k,
          { opacity: k === calmStep ? 1 : 0, transition: `opacity ${CALM_FADE}ms ease-in-out` },
        ),
      );
  return (
    <svg
      {...rest}
      width={spec.width}
      height={spec.height}
      viewBox={`0 0 ${spec.width} ${spec.height}`}
      style={{ overflow: "visible", ...style }}
    >
      {body}
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
 * Drawn and animated in code. With `prefers-reduced-motion: reduce` it stops
 * morphing and instead holds each of the three shapes for a second, with a
 * soft crossfade between them.
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
  const [calmStep, setCalmStep] = useState(0);

  // Reduced motion: step calmly through the three shapes, in place.
  useEffect(() => {
    if (!active || !reduced) return undefined;
    const id = setInterval(() => setCalmStep((k) => (k + 1) % CALM_FRAMES[kind].length), CALM_HOLD + CALM_FADE);
    return () => clearInterval(id);
  }, [active, reduced, kind]);

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
      calmStep={reduced ? calmStep : undefined}
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
