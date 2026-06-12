import styled from "styled-components";

const MochiToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const MochiToggleTrack = styled.span`
  width: 46px;
  height: 26px;
  background: var(--mochi-hover, #e2e8f0);
  border: 1px solid var(--mochi-border, #ccc);
  border-radius: 16px;
  display: inline-block;
  position: relative;
  transition: background 0.2s, border-color 0.2s;

  ${({ $checked }) =>
    $checked &&
    `
    background: var(--mochi-primary-soft, #ddf0ff);
    border-color: var(--mochi-primary, #04B2F9);
  `}
`;

const MochiToggleKnob = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? "22px" : "2px")};
  width: 22px;
  height: 22px;
  background: ${({ $checked }) =>
    $checked ? "var(--mochi-primary, #04B2F9)" : "var(--mochi-text-muted, #646464)"};
  border-radius: 14px 16px 16px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: left 0.2s, background 0.2s;
`;

const MochiToggleInput = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

export const MochiToggle = ({ checked, onChange }) => (
  <MochiToggleLabel>
    <MochiToggleInput checked={checked} onChange={onChange} />
    <MochiToggleTrack $checked={checked}>
      <MochiToggleKnob $checked={checked} />
    </MochiToggleTrack>
  </MochiToggleLabel>
);
