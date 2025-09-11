import React from "react";
import styled from "styled-components";

// Import your spinner GIFs (adjust paths)
import lightSpinnerSmall from "./spinners/spinner-light.gif";
import lightSpinnerLarge from "./spinners/spinner-large-light.gif";
import darkSpinnerSmall from "./spinners/spinner-dark.gif";
import darkSpinnerLarge from "./spinners/spinner-large-dark.gif";

const SpinnerImg = styled.img`
  display: ${({ active }) => (active ? "inline-block" : "none")};
`;

/**
 * Props:
 * - active: boolean — show or hide spinner
 * - styleType: "light" | "dark" (default: "light")
 * - size: "normal" | "large" (default: "normal")
 */
export const Spinner = ({ active = true, styleType = "light", size = "normal", alt = "Loading..." }) => {
  let src;

  if (styleType === "dark") {
    src = size === "large" ? darkSpinnerLarge : darkSpinnerSmall;
  } else {
    src = size === "large" ? lightSpinnerLarge : lightSpinnerSmall;
  }

  return <SpinnerImg src={src} alt={alt} active={active} size={size} />;
};
