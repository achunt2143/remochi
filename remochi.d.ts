import * as React from "react";

export interface MochiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "normal" | "dropdown" | "warning" | "disabled";
}

export const MochiButton: React.ForwardRefExoticComponent<
  MochiButtonProps & React.RefAttributes<HTMLButtonElement>
>;

export interface MochiRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children?: React.ReactNode;
}

export const MochiRadio: React.FC<MochiRadioProps>;

export interface MochiToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: () => void;
}

export const MochiToggle: React.FC<MochiToggleProps>;

export interface MochiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type?: "text" | "search" | "password";
  disabled?: boolean;
}

export const MochiInput: React.FC<MochiInputProps>;

export interface MochiProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // e.g. 0 to 100
  color?: string; // e.g. "yellow", "red", CSS color string
  height?: string; // CSS height value, e.g. "16px"
  width?: string;  // CSS width, e.g. "300px"
}

export const MochiProgressBar: React.FC<MochiProgressBarProps>;

export interface MochiSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange: (value: number) => void;
  color?: string;
  width?: string;
}

export const MochiSlider: React.FC<MochiSliderProps>;

export interface SpinnerProps {
  active?: boolean;
  styleType?: "light" | "dark";
  size?: "normal" | "large";
  alt?: string;
}

export const Spinner: React.FC<SpinnerProps>;

export interface PopupAction {
  label: string;
  onClick: () => void;
  type?: "normal" | "warning";
}

export interface MochiPopupPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null | { top: number; left: number; bottom: number; width: number; height: number };
  title: string;
  actions?: PopupAction[];
  children?: React.ReactNode;
}

export const MochiPopupPanel: React.FC<MochiPopupPanelProps>;
