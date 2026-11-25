import styled from "styled-components";

export const MochiInput = styled.input.attrs(props => ({
  disabled: props.disabled,
  // A stable hook for the motion modes (styled-components joins this with
  // any className the caller passes).
  className: 'mochi-input'
}))`
  background: var(--mochi-field-bg, #fff);
  color: var(--mochi-field-text, #1a1a1a);
  border: 2px solid var(--mochi-field-border, rgba(0, 0, 0, 0.12));
  border-radius: var(--mochi-corner-field, 24px);
  font-size: 1.13rem;
  padding: 8px 22px;
  // Focus: the border colour and the 3px halo (spreading from 0) ease in.
  // The ring (outline-color and -offset from nothing) and the disabled
  // dimming ease too.
  transition:
    box-shadow var(--mochi-duration-control, 160ms) var(--mochi-ease-arrive, ease),
    border-color var(--mochi-duration-control, 160ms) var(--mochi-ease-arrive, ease),
    color var(--mochi-duration-control, 160ms) var(--mochi-ease-forward, ease),
    background var(--mochi-duration-control, 160ms) var(--mochi-ease-forward, ease),
    opacity var(--mochi-duration-control, 160ms) var(--mochi-ease-forward, ease),
    outline-color var(--mochi-duration-focus, 120ms) var(--mochi-ease-arrive, ease),
    outline-offset var(--mochi-duration-focus, 120ms) var(--mochi-ease-arrive, ease);
  outline: 2px solid transparent;
  outline-offset: 0;
  margin-right: 14px;

  /* Mochi's focused-field border (InputDecorator.less: #69cdff). */
  &:focus {
    border-color: var(--mochi-accent, #69cdff);
    background: var(--mochi-field-bg, #fff);
    color: var(--mochi-field-text, #1a1a1a);
    box-shadow: 0 0 0 3px var(--mochi-accent-soft, rgba(105,205,255,0.3));
  }

  &:focus-visible {
    outline-color: var(--mochi-focus-ring, #357099);
    outline-offset: 1px;
  }

  &::placeholder {
    color: var(--mochi-field-placeholder, #888888);
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
