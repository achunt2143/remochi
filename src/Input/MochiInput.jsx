import styled from "styled-components";

export const MochiInput = styled.input.attrs(props => ({
  disabled: props.disabled
}))`
  background: #fff;
  color: #444;
  border: 2px solid ${({ disabled }) => disabled ? "#e4e4e4" : "#ccc"};
  border-radius: 24px;
  font-size: 1.13rem;
  padding: 8px 22px;
  transition:
    box-shadow 0.15s,
    border-color 0.15s,
    color 0.13s,
    background 0.13s;
  outline: none;
  margin-right: 14px;

  &:focus {
    border-color: #43aae455;
    background: #fff;
    color: #222;
  }

  &::placeholder {
    color: #b3b3b3;
    font-style: italic;
    opacity: 1;
  }

  &:disabled {
    background: #f7f7f7;
    border-color: #e4e4e4;
    color: #bcbcbc;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
