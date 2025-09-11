import styled, { css } from "styled-components";

// Change these values to match your pixel-perfect reference!
const SIZE = 30;
const BORDER = 2;
const ACTIVE_COLOR = "#ffb80d";
const INACTIVE_BORDER = "#b2b2b2";

const MochiRadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  font-size: 1.08rem;
  font-style: italic;
  color: #4b4b4b;
  padding: 6px 10px;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  user-select: none;
`;

const MochiRadioOuter = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 50%;
  background: ${({ checked, disabled }) =>
    disabled ? "#ffdb86"
    : checked ? ACTIVE_COLOR
    : "#fff"};
  margin-right: 8px;
  box-sizing: border-box;
  transition: background 0.15s;

  ${({ checked, disabled }) =>
    (!checked || disabled) &&
    css`
      border: ${BORDER}px solid ${disabled ? "#ddd" : INACTIVE_BORDER};
    `}
`;

const MochiRadioInput = styled.input.attrs({ type: "radio" })`
  display: none;
`;

const CheckmarkSVG = styled.svg`
  display: ${({ checked }) => (checked ? "block" : "none")};
  width: 20px;
  height: 20px;
`;

export const MochiRadio = ({
  name,
  value,
  checked,
  onChange,
  disabled,
  children
}) => (
  <MochiRadioLabel disabled={disabled}>
    <MochiRadioInput
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <MochiRadioOuter checked={checked} disabled={disabled}>
      <CheckmarkSVG
        checked={checked}
        viewBox="0 0 18 14"
        aria-hidden={!checked}
      >
        {/* Width, strokeWidth, and coordinates adjusted to match legacy mark */}
        <polyline
          points="4,8 8,12 14,4"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </CheckmarkSVG>
    </MochiRadioOuter>
    {children}
  </MochiRadioLabel>
);