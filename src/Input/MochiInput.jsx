import styled from "styled-components";

export const MochiInput = styled.input.attrs(props => ({
  disabled: props.disabled
}))`
  background: var(--mochi-field-bg, #fff);
  color: var(--mochi-field-text, #444);
  border: 2px solid var(--mochi-field-border, #ccc);
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
    border-color: var(--mochi-primary, #43aae4);
    background: var(--mochi-field-bg, #fff);
    color: var(--mochi-field-text, #222);
    box-shadow: 0 0 0 3px var(--mochi-primary-soft, rgba(67,170,228,0.18));
  }

  &::placeholder {
    color: var(--mochi-field-placeholder, #b3b3b3);
    font-style: italic;
    opacity: 1;
  }

  &:disabled {
    background: var(--mochi-bg, #f7f7f7);
    border-color: var(--mochi-border, #e4e4e4);
    color: var(--mochi-text-faint, #bcbcbc);
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
