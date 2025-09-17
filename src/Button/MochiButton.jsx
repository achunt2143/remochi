import styled, { css, keyframes } from "styled-components";
import { FaChevronDown } from "react-icons/fa";

const colors = {
  normal: "#333",
  warning: "#d34431",
  disabled: "#adadad",
  dropdown: "#6e9ebd",
  default: "#6e9ebd",
};

const bounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.1); }
  50% { transform: scale(0.95); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ButtonWrapper = styled.button`
  background: none;
  border: none;
  font-family: "Segoe UI", "Arial", sans-serif;
  font-size: 1.1rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 0;
  color: ${({ type }) => type === "warning" ? colors.warning : colors.normal};
  ${({ type }) => type === "disabled" && css`color: ${colors.disabled};`}
  outline: none;
  transition: transform 0.15s ease;

  &:focus {
    outline: none;
    color: #222;
  }

  &:active:not(:disabled) {
    transform: scale(1.05);
  }

  /* On hover, target the UnderlineBar inside the TextContainer to animate it */
  &:hover > div > span {
    transform: scaleX(1);
    opacity: 1;
  }
`;

const TextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

const UnderlineBar = styled.span`
  position: absolute;
  bottom: 4px; /* slight spacing below text */
  left: 15%;
  height: 3px;
  width: 70%;
  border-radius: 2px;
  background-color: ${({ type }) => {
    if (type === "warning") return colors.warning;
    if (type === "disabled") return colors.disabled;
    if (type === "dropdown") return colors.dropdown;
    return colors.default;
  }};
  transform-origin: center;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
`;

const bracketStyle = css`
  font-size: 1.7em;
  font-weight: 600;
  vertical-align: middle;
  margin: 0 2px;
  transition: color 0.2s;
`;

const Bracket = styled.span`
  ${bracketStyle}
  color: ${({ type, disabled }) => {
    if (type === "warning") return colors.warning;
    if (type === "disabled" || disabled) return colors.disabled;
    return colors.normal;
  }};
  font-style: ${({ type }) => (type === "disabled" ? "italic" : "normal")};
`;

const Label = styled.span`
  font-weight: ${({ type }) => (type === "disabled" ? "400" : "600")};
  font-style: ${({ type }) => (type === "disabled" ? "italic" : "normal")};
  color: ${({ type }) => {
    if (type === "warning") return colors.warning;
    if (type === "disabled") return colors.disabled;
    return colors.normal;
  }};
  margin-top: 0.2em;
  letter-spacing: 0.02em;
`;

const DropdownIcon = styled(FaChevronDown)`
  color: ${colors.dropdown};
  margin-left: 6px;
  font-size: 0.95em;
  vertical-align: middle;
`;

export function MochiButton({
  children = "Button",
  type = "normal", // normal | warning | disabled | dropdown
  ...props
}) {
  const disabled = type === "disabled";
  return (
    <ButtonWrapper type={type} disabled={disabled} {...props}>
      <TextContainer>
        <Bracket type={type} disabled={disabled}>(</Bracket>
        <Label type={type}>{children}</Label>
        {type === "dropdown" && <DropdownIcon />}
        <Bracket type={type} disabled={disabled}>)</Bracket>
        <UnderlineBar type={type} />
      </TextContainer>
    </ButtonWrapper>
  );
}
