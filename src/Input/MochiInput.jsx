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

  /* Mochi's focused-field border (InputDecorator.less: #69cdff). */
  &:focus {
    border-color: var(--mochi-accent, #69cdff);
    background: var(--mochi-field-bg, #fff);
    color: var(--mochi-field-text, #222);
    box-shadow: 0 0 0 3px var(--mochi-accent-soft, rgba(105,205,255,0.3));
  }

  &::placeholder {
    color: var(--mochi-field-placeholder, #b3b3b3);
    font-style: italic;
    opacity: 1;
  }

  /* Mochi dims a disabled field as a whole (InputDecorator.less) rather
     than also fading its colors, which at 40% left text unreadable. */
  &:disabled {
    cursor: not-allowed;
    opacity: var(--mochi-disabled-opacity, 0.4);
  }
`;
