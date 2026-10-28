import React, { useRef, useLayoutEffect, useState } from 'react';
import styled, { css } from "styled-components";
import { FaChevronDown } from "react-icons/fa";

// Theme-aware: normal/dropdown read theme tokens (see MochiThemeWrapper.scss's
// :root[data-mochi-theme] blocks) so this button follows the selected theme
// instead of a fixed color; the var() fallbacks preserve this component's
// original look if it's ever rendered outside a ThemeWrapper. "normal" uses
// its own dedicated --mochi-button-text rather than the shared
// --mochi-text-muted — this button was previously hardcoded to #333
// regardless of theme, and --mochi-text-muted's light-mode value differs
// from that, which would have shifted the light appearance as a side
// effect of fixing dark mode.
//
// affirmative/blue are Mochi's ButtonColors.less variants (webOS HIG:
// green for the positive choice, blue for sparing emphasis), mapped to
// the same tokens ViewSelectButton's variants use; the fallbacks are
// Mochi's own #00dd11/#35A8EE. The press bar is Mochi's #69cdff accent
// (--mochi-accent) unless the variant has its own color.
const colors = {
  normal:      "var(--mochi-button-text, #333)",
  warning:     "var(--mochi-error, #d34431)",
  affirmative: "var(--mochi-success, #00dd11)",
  blue:        "var(--mochi-primary, #35a8ee)",
  dropdown:    "var(--mochi-primary, #6e9ebd)",
  bar:         "var(--mochi-accent, #69cdff)",
};

const COLORED_VARIANTS = ["warning", "affirmative", "blue"];

// Label/bracket color: the variant's own color, else the normal text color.
const textColor = (variant) =>
  COLORED_VARIANTS.includes(variant) ? colors[variant] : colors.normal;

// Press-bar color: the variant's own color, else the accent.
const barColor = (variant) =>
  COLORED_VARIANTS.includes(variant) ? colors[variant] : colors.bar;

// ── canvas text-width helper ─────────────────────────────────────────────────
// One canvas is reused across all button instances (no DOM reflow).
let _canvas = null;
function measureTextWidth(text, font) {
  if (!_canvas) _canvas = document.createElement('canvas');
  const ctx = _canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
}

/**
 * Derives the canvas font string for the Label span from its computed style.
 */
function buildLabelFont(computed) {
  const { fontStyle, fontWeight, fontSize, fontFamily } = computed;
  return `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
}

/**
 * Hook: returns the pixel width of the label text, measured via canvas.
 */
function useLabelWidth(labelRef, children) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;

    const measure = () => {
      const text            = el.textContent ?? String(children ?? '');
      const computed        = getComputedStyle(el);
      const baseWidth       = measureTextWidth(text, buildLabelFont(computed));
      const letterSpacingPx = parseFloat(computed.letterSpacing) || 0;
      const spacingTotal    = letterSpacingPx * Math.max(text.length - 1, 0);

      setWidth(baseWidth + spacingTotal);
    };
    measure();

    // The label's web font (Prelude/bundled Lato) may still be loading on
    // first render, and canvas measures with the fallback face until it
    // arrives — so measure again once it has.
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    if (!fonts || !fonts.addEventListener) return;
    fonts.addEventListener('loadingdone', measure);
    return () => fonts.removeEventListener('loadingdone', measure);
  }, [children, labelRef]);

  return width;
}

// ── styled components ────────────────────────────────────────────────────────

// Press feedback follows Mochi's ButtonDecorator.less/Button.less: the
// brackets spread and the underline bar appears only while the button is
// held down (:active:hover, so sliding off a held button lets go of it
// visually too) or carries an `active` class, never on plain hover.
//
// Disabled follows Mochi too: the same colors and typeface, dimmed to
// --mochi-disabled-opacity (Button.less: `.mochi-button.disabled`).
const ButtonWrapper = styled.button`
  background: none;
  border: none;
  font-family: "Mochi Bold Oblique", sans-serif;
  font-size: 1.1rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "var(--mochi-disabled-opacity, 0.4)" : 1)};
  padding: 0;
  color: ${({ $variant }) => textColor($variant)};
  outline: none;
  transition: transform 0.15s ease;

  &:focus {
    outline: none;
    color: #222;
  }

  &:focus-visible {
    outline: 2px solid var(--mochi-primary, #6e9ebd);
    outline-offset: 2px;
    border-radius: 6px;
  }

  &:active:not(:disabled) {
    transform: scale(1.05);
  }

  &:active:hover:not(:disabled),
  &.active:not(:disabled) {
    > div > span.mochi-underline {
      transform: scaleX(1);
      opacity: 1;
    }

    > div > span.mochi-bracket-left {
      transform: translateX(-4px);
    }

    > div > span.mochi-bracket-right {
      transform: translateX(4px);
    }
  }
`;

const TextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

const UnderlineBar = styled.span`
  position: absolute;
  bottom: 4px;
  height: 3px;
  border-radius: 2px;
  background-color: ${({ $variant }) => barColor($variant)};
  transform-origin: center;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
`;

// Brackets are Mochi's ButtonDecorator: upright "Mochi Bold".
const bracketStyle = css`
  font-family: "Mochi Bold", sans-serif;
  font-size: 1.7em;
  font-weight: bold;
  font-style: normal;
  vertical-align: middle;
  margin: 0 2px;
  display: inline-block;
  transition: color 0.2s, transform 0.15s ease;
`;

const Bracket = styled.span`
  ${bracketStyle}
  color: ${({ $variant }) => textColor($variant)};
`;

// The label is Mochi's .mochi-button-base: "Mochi Bold Oblique" in every
// state, disabled included.
const Label = styled.span`
  font-family: "Mochi Bold Oblique", sans-serif;
  font-weight: bold;
  font-style: oblique;
  color: ${({ $variant }) => textColor($variant)};
  margin-top: 0.2em;
  letter-spacing: 0.02em;
`;

const DropdownIcon = styled(FaChevronDown)`
  color: ${colors.dropdown};
  margin-left: 6px;
  font-size: 0.95em;
  vertical-align: middle;
`;

// ── component ────────────────────────────────────────────────────────────────

export function MochiButton({
  children = "Button",
  type = "normal",      // visual variant: normal | warning | affirmative | blue | disabled | dropdown
  htmlType = "button",  // native <button type>: button | submit | reset
  disabled: disabledProp = false,
  ...props
}) {
  // `type` is this component's visual variant, not the native button type.
  // Passing it through made every Button inside a <form> submit it (an
  // unrecognized type falls back to "submit"), so the native type always
  // comes from `htmlType` instead.
  const disabled   = disabledProp || type === "disabled";
  // Disabled keeps the variant's own colors (only opacity changes), so
  // type="disabled" just means a disabled normal button.
  const variant    = type === "disabled" ? "normal" : type;
  const labelRef   = useRef(null);
  const isDropdown = type === "dropdown";

  // Canvas-measured width of just the label text (excludes brackets + icon)
  const labelPx = useLabelWidth(labelRef, children);

  // For dropdown buttons the bar must also cover the chevron icon (~20px wide)
  // so we extend the width by 20px and shift left by 10px to keep it centred
  // under the label+icon group.
  const barStyle = labelPx > 0 ? {
    left:  `calc(50% - ${labelPx / 2 + (isDropdown ? 10 : 0)}px)`,
    width: `${labelPx + (isDropdown ? 20 : 0)}px`,
  } : {
    left:  '15%',
    width: '70%',
  };

  return (
    <ButtonWrapper {...props} type={htmlType} disabled={disabled} $variant={variant}>
      <TextContainer>
        <Bracket $variant={variant} className="mochi-bracket-left">(</Bracket>
        <Label ref={labelRef} $variant={variant}>{children}</Label>
        {isDropdown && <DropdownIcon />}
        <Bracket $variant={variant} className="mochi-bracket-right">)</Bracket>
        <UnderlineBar
          $variant={variant}
          className="mochi-underline"
          style={barStyle}
        />
      </TextContainer>
    </ButtonWrapper>
  );
}
