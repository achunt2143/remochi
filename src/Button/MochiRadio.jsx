import styled from "styled-components";

const SIZE = 30;
const BORDER = 2;

const MochiRadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  font-size: 1.08rem;
  font-style: italic;
  color: var(--mochi-text, #4b4b4b);
  padding: 6px 10px;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  user-select: none;
`;

// The checked fill is a fixed amber "selected" accent (--mochi-selected),
// not --mochi-primary (blue) — that was the bug: the old fallback values
// here (#ffb80d / #ffdb86) were clearly written for an amber accent, but
// --mochi-primary itself resolves to blue, so the live color silently
// didn't match what the fallback implied. Figma confirms the checked
// state is meant to be amber with a muted-gray border, in both themes.
const MochiRadioOuter = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 50%;
  // Unchecked fill is a light-grey accent (--mochi-mark), framed by a dark
  // border matching Toggle's own track color (--mochi-toggle-track) below
  // — the same light-grey-inside/dark-border pairing Checkbox uses, so
  // both controls read the same "off state" look and stay visually
  // distinct from each other.
  background: ${({ $checked, disabled }) =>
    disabled
      ? "var(--mochi-selected-soft, #ffdb86)"
      : $checked
      ? "var(--mochi-selected, #ffb80d)"
      : "var(--mochi-mark, #fff)"};
  margin-right: 8px;
  box-sizing: border-box;
  transition: background 0.15s;

  border: ${BORDER}px solid
    ${({ $checked, disabled }) =>
      disabled
        ? "var(--mochi-border, #ddd)"
        : $checked
        ? "var(--mochi-text-muted, #a0a0a0)"
        : "var(--mochi-toggle-track, #646464)"};
`;

const MochiRadioInput = styled.input.attrs({ type: "radio" })`
  display: none;
`;

const CheckmarkSVG = styled.svg`
  display: ${({ $checked }) => ($checked ? "block" : "none")};
  width: 20px;
  height: 20px;
  // --mochi-toggle-knob (not --mochi-mark): the checkmark sits on the
  // amber checked fill, and the light grey --mochi-mark uses for the
  // unchecked fill doesn't read well against that amber — the same dark
  // grey Toggle's knob uses works much better there. White in light mode.
  color: var(--mochi-toggle-knob, #fff);
`;

const MochiRadio = ({ name, value, checked, onChange, disabled, children }) => (
  <MochiRadioLabel disabled={disabled}>
    <MochiRadioInput
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <MochiRadioOuter $checked={checked} disabled={disabled}>
      <CheckmarkSVG $checked={checked} viewBox="0 0 18 14" aria-hidden={!checked}>
        <polyline
          points="4,8 8,12 14,4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </CheckmarkSVG>
    </MochiRadioOuter>
    {children}
  </MochiRadioLabel>
);

export default MochiRadio;
