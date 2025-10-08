import * as React from 'react';

interface MochiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "normal" | "dropdown" | "warning" | "disabled";
}

declare const MochiButton: React.ForwardRefExoticComponent<
  MochiButtonProps & React.RefAttributes<HTMLButtonElement>
>;

interface MochiRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children?: React.ReactNode;
}

declare const MochiRadio: React.FC<MochiRadioProps>;

interface MochiToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: () => void;
}

declare const MochiToggle: React.FC<MochiToggleProps>;

interface MochiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type?: "text" | "search" | "password";
  disabled?: boolean;
}

declare const MochiInput: React.FC<MochiInputProps>;

interface MochiProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // e.g. 0 to 100
  color?: string; // e.g. "yellow", "red", CSS color string
  height?: string; // CSS height value, e.g. "16px"
  width?: string;  // CSS width, e.g. "300px"
}

declare const MochiProgressBar: React.FC<MochiProgressBarProps>;

interface MochiSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange: (value: number) => void;
  color?: string;
  width?: string;
}

declare const MochiSlider: React.FC<MochiSliderProps>;

interface SpinnerProps {
  active?: boolean;
  styleType?: "light" | "dark";
  size?: "normal" | "large";
  alt?: string;
}

declare const Spinner: React.FC<SpinnerProps>;

interface PopupAction {
  label: string;
  onClick: () => void;
  type?: "normal" | "warning";
}

interface MochiPopupPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  anchorRect: DOMRect | null | { top: number; left: number; bottom: number; width: number; height: number };
  title: string;
  actions?: PopupAction[];
  children?: React.ReactNode;
}

declare const MochiPopupPanel: React.FC<MochiPopupPanelProps>;

export { MochiButton, MochiInput, MochiPopupPanel, MochiProgressBar, MochiRadio, MochiSlider, MochiToggle, Spinner };
export type { MochiButtonProps, MochiInputProps, MochiPopupPanelProps, MochiProgressBarProps, MochiRadioProps, MochiSliderProps, MochiToggleProps, PopupAction, SpinnerProps };
