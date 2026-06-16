import * as React from 'react';

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
export interface BadgeProps {
  content?: string | number;
  background?: string;
  color?: string;
}
export const Badge: React.FC<BadgeProps>;

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
export interface ButtonProps {
  content?: string;
  disabled?: boolean;
  active?: boolean;
  decoratorLeft?: string;
  decoratorRight?: string;
  barClasses?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'normal' | 'warning' | 'affirmative' | 'blue';
  children?: React.ReactNode;
}
export const Button: React.FC<ButtonProps>;

export interface RadioProps {
  name?: string;
  value?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  children?: React.ReactNode;
}
export const Radio: React.FC<RadioProps>;

export interface ViewSelectButtonItem {
  content: string;
  active?: boolean;
  disabled?: boolean;
}
export interface ViewSelectButtonProps {
  items?: ViewSelectButtonItem[];
  onSelect?: (item: ViewSelectButtonItem, index: number) => void;
  decoratorLeft?: string;
  decoratorRight?: string;
  barClasses?: string;
  decoratorClasses?: string;
  variant?: 'normal' | 'warning' | 'affirmative' | 'blue';
}
export const ViewSelectButton: React.FC<ViewSelectButtonProps>;

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------
export interface CheckboxChangeEvent {
  checked: boolean;
  value: boolean;
}
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (event: CheckboxChangeEvent) => void;
  disabled?: boolean;
  canAnimate?: boolean;
  colorActive?: string;
  colorInactive?: string;
  colorActiveDisabled?: string;
  colorInactiveDisabled?: string;
}
export const Checkbox: React.FC<CheckboxProps>;

// ---------------------------------------------------------------------------
// Collapsable
// ---------------------------------------------------------------------------
export interface CollapsableProps {
  title?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
}
export const Collapsable: React.FC<CollapsableProps>;
export const CollapsableHeader: React.FC<{ children?: React.ReactNode; onClick?: () => void }>;
export const CollapsableItem: React.FC<{ children?: React.ReactNode }>;
export const CollapsableFooter: React.FC;

// ---------------------------------------------------------------------------
// DateInput
// ---------------------------------------------------------------------------
export interface DateInputProps {
  value?: string | Date;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minDate?: string | Date;
  maxDate?: string | Date;
  disabled?: boolean;
  className?: string;
}
export const DateInput: React.FC<DateInputProps>;

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------
export interface DialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  type?: 'default' | 'alert' | 'confirm' | 'prompt';
  onConfirm?: (value: boolean | string) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  promptValue?: string;
  onPromptChange?: (value: string) => void;
}
export const Dialog: React.FC<DialogProps>;

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  width?: string | number;
  height?: string | number;
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}
export const Divider: React.FC<DividerProps>;

export interface NubbinDividerProps {
  orientation?: 'horizontal' | 'vertical';
  side?: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  thickness?: number;
  notchRadius?: number;
  fadeSize?: number;
  length?: string | number;
  crossSize?: number;
  className?: string;
}
export const NubbinDivider: React.FC<NubbinDividerProps>;

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------
export interface DropdownOption {
  value: string | number;
  label: string;
}
export interface DropdownProps {
  options?: DropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}
export const Dropdown: React.FC<DropdownProps>;

// ---------------------------------------------------------------------------
// Headers
// ---------------------------------------------------------------------------
export interface HeaderProps {
  content?: string;
  children?: React.ReactNode;
  customClasses?: string;
}
export const Header: React.FC<HeaderProps>;

export interface SubheaderProps {
  content?: string;
}
export const Subheader: React.FC<SubheaderProps>;

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input: React.ComponentType<InputProps>;

export interface RichTextProps {
  value?: string;
  onChange?: React.FormEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  disabled?: boolean;
  placeholder?: string;
  defaultFocus?: boolean;
  width?: string;
  minHeight?: number;
  className?: string;
  allowFormatting?: boolean;
}
export const RichText: React.FC<RichTextProps>;

export interface TextAreaProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
  placeholder?: string;
  defaultFocus?: boolean;
  minHeight?: number;
  rows?: number;
  className?: string;
}
export const TextArea: React.FC<TextAreaProps>;

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------
export interface ItemProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode | string;
  rightContent?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onIconClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
  disabled?: boolean;
  hoverable?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}
export const Item: React.FC<ItemProps>;

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------
export interface ListProps {
  children?: React.ReactNode;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
}
export const List: React.FC<ListProps>;

export interface ListItemProps {
  children?: React.ReactNode;
  tapHighlight?: boolean;
  onSelect?: (highlighted: boolean) => void;
}
export const ListItem: React.FC<ListItemProps>;

export interface ListHeaderProps {
  content?: string;
  children?: React.ReactNode;
}
export const ListHeader: React.FC<ListHeaderProps>;

export interface GridListProps {
  children?: React.ReactNode;
  columns?: number;
  gap?: number;
}
export const GridList: React.FC<GridListProps>;

export interface GridListImageItemProps {
  src?: string;
  caption?: string;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
}
export const GridListImageItem: React.FC<GridListImageItemProps>;

// ---------------------------------------------------------------------------
// MediaPlayer
// ---------------------------------------------------------------------------
export interface VideoProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}
export const Video: React.FC<VideoProps>;

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------
export interface MochiSlidingMenuProps {
  children?: React.ReactNode;
  /** Which edge the menu slides in from. @default 'left' */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Controlled open state. Omit to use internal state. */
  isOpen?: boolean;
  /** Called when the menu requests an open/close transition. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  /** Slide animation duration in ms. @default 300 */
  duration?: number;
  /** Close on Escape key. @default true */
  closeOnEscape?: boolean;
  /** Close when backdrop is clicked. @default true */
  closeOnBackdropClick?: boolean;
  /** Override the backdrop CSS color. Defaults to a theme-aware value. */
  backdropColor?: string;
  /** Show the backdrop overlay. @default true */
  showBackdrop?: boolean;
}
/** MochiSlidingMenu.ContentShifter props */
export interface MochiSlidingMenuContentShifterProps {
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isMenuOpen?: boolean;
  /** Width of the left/right menu (CSS value). @default '280px' */
  menuWidth?: string;
  /** Height of the top/bottom menu (CSS value). @default 'auto' */
  menuHeight?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}
export const MochiSlidingMenu: React.FC<MochiSlidingMenuProps> & {
  ContentShifter: React.FC<MochiSlidingMenuContentShifterProps>;
};
export const MochiSlidingMenuContentShifter: React.FC<MochiSlidingMenuContentShifterProps>;

export interface MochiSlidingMenuItemProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  href?: string;
  isActive?: boolean;
  badge?: string | number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'success';
}
export const MochiSlidingMenuItem: React.FC<MochiSlidingMenuItemProps>;

export interface MochiSlidingMenuItemGroupProps {
  children?: React.ReactNode;
  /** Section heading rendered in uppercase muted text. */
  label?: string;
  /** Show a divider border below the group. @default false */
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export const MochiSlidingMenuItemGroup: React.FC<MochiSlidingMenuItemGroupProps>;

// ---------------------------------------------------------------------------
// NumberInput
// ---------------------------------------------------------------------------
export interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  showControls?: boolean;
  className?: string;
}
export const NumberInput: React.FC<NumberInputProps>;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
  className?: string;
}
export const Pagination: React.FC<PaginationProps>;

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------
export interface StackedPanelProps {
  children?: React.ReactNode;
  [key: string]: any;
}
export const StackedPanel: React.FC<StackedPanelProps>;

export interface StackedPanelsMethods {
  setIndex: (index: number) => void;
  getIndex: () => number;
  getIsNarrow: () => boolean;
  toggleExpand: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  next: () => void;
  prev: () => void;
}
export interface StackedPanelsProps {
  children?: React.ReactNode;
  index?: number;
  onIndexChange?: (index: number) => void;
  animate?: boolean;
  draggable?: boolean;
  narrowFit?: boolean;
  narrowFitWidth?: number;
  wrap?: boolean;
  arrangement?: string;
  onTransitionStart?: (event: { from: number; to: number; isNarrow: boolean }) => void;
  onTransitionFinish?: (event: { from: number; to: number; isNarrow: boolean }) => void;
  className?: string;
  showControls?: boolean;
}
export const StackedPanels: React.ForwardRefExoticComponent<
  StackedPanelsProps & React.RefAttributes<StackedPanelsMethods>
>;

// ---------------------------------------------------------------------------
// Popup
// ---------------------------------------------------------------------------
export interface PopupAction {
  label: string;
  onClick: () => void;
  type?: 'normal' | 'warning';
}
export interface PopupPanelProps {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
  actions?: PopupAction[];
  onClose?: () => void;
  anchorRect?: DOMRect | { top: number; left: number; bottom: number; width: number; height: number } | null;
}
export const PopupPanel: React.FC<PopupPanelProps>;

// ---------------------------------------------------------------------------
// ProgressBar
// ---------------------------------------------------------------------------
export interface ProgressBarProps {
  value?: number;
  color?: 'blue' | 'yellow' | 'red' | string;
  width?: string;
  height?: string;
}
export const ProgressBar: React.FC<ProgressBarProps>;

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
export interface SliderProps {
  value?: number;
  color?: string;
  width?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}
export const Slider: React.FC<SliderProps>;

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
export interface SpinnerProps {
  active?: boolean;
  styleType?: 'light' | 'dark';
  size?: 'normal' | 'large';
  alt?: string;
}
export const Spinner: React.FC<SpinnerProps>;

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
export interface TableColumn<T = Record<string, any>> {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: any, row: T) => React.ReactNode;
}
export interface TableProps<T = Record<string, any>> {
  columns?: TableColumn<T>[];
  data?: T[];
  sortable?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  className?: string;
}
export const Table: React.FC<TableProps>;

// ---------------------------------------------------------------------------
// ThemeWrapper
// ---------------------------------------------------------------------------
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}
export interface ThemeContextValue {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  colors: ThemeColors;
}
export interface ThemeWrapperProps {
  children?: React.ReactNode;
  defaultTheme?: 'dark' | 'light';
  fontFamily?: string;
  className?: string;
}
export const ThemeWrapper: React.FC<ThemeWrapperProps>;
export function useTheme(): ThemeContextValue;

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
export interface ToggleProps {
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export const Toggle: React.FC<ToggleProps>;

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------
export interface WizardStep {
  label: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
  skippable?: boolean;
  onNext?: () => boolean | void | Promise<boolean | void>;
}
export interface WizardProps {
  steps?: WizardStep[];
  onComplete?: () => void;
  onCancel?: () => void;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
  className?: string;
}
export const Wizard: React.FC<WizardProps>;
