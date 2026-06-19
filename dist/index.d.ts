import * as React from 'react';

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
interface BadgeProps {
  content?: string | number;
  background?: string;
  color?: string;
}
declare const Badge: React.FC<BadgeProps>;

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
interface ButtonProps {
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
declare const Button: React.FC<ButtonProps>;

interface RadioProps {
  name?: string;
  value?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  children?: React.ReactNode;
}
declare const Radio: React.FC<RadioProps>;

interface ViewSelectButtonItem {
  content: string;
  active?: boolean;
  disabled?: boolean;
}
interface ViewSelectButtonProps {
  items?: ViewSelectButtonItem[];
  onSelect?: (item: ViewSelectButtonItem, index: number) => void;
  decoratorLeft?: string;
  decoratorRight?: string;
  barClasses?: string;
  decoratorClasses?: string;
  variant?: 'normal' | 'warning' | 'affirmative' | 'blue';
}
declare const ViewSelectButton: React.FC<ViewSelectButtonProps>;

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------
interface CheckboxChangeEvent {
  checked: boolean;
  value: boolean;
}
interface CheckboxProps {
  checked?: boolean;
  onChange?: (event: CheckboxChangeEvent) => void;
  disabled?: boolean;
  canAnimate?: boolean;
  colorActive?: string;
  colorInactive?: string;
  colorActiveDisabled?: string;
  colorInactiveDisabled?: string;
}
declare const Checkbox: React.FC<CheckboxProps>;

// ---------------------------------------------------------------------------
// Collapsable
// ---------------------------------------------------------------------------
interface CollapsableProps {
  title?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
}
declare const Collapsable: React.FC<CollapsableProps>;
declare const CollapsableHeader: React.FC<{ children?: React.ReactNode; onClick?: () => void }>;
declare const CollapsableItem: React.FC<{ children?: React.ReactNode }>;
declare const CollapsableFooter: React.FC;

// ---------------------------------------------------------------------------
// DateInput
// ---------------------------------------------------------------------------
interface DateInputProps {
  value?: string | Date;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minDate?: string | Date;
  maxDate?: string | Date;
  disabled?: boolean;
  className?: string;
}
declare const DateInput: React.FC<DateInputProps>;

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------
interface DialogProps {
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
declare const Dialog: React.FC<DialogProps>;

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  width?: string | number;
  height?: string | number;
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}
declare const Divider: React.FC<DividerProps>;

interface NubbinDividerProps {
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
declare const NubbinDivider: React.FC<NubbinDividerProps>;

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------
interface DropdownOption {
  value: string | number;
  label: string;
}
interface DropdownProps {
  options?: DropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}
declare const Dropdown: React.FC<DropdownProps>;

// ---------------------------------------------------------------------------
// Headers
// ---------------------------------------------------------------------------
interface HeaderProps {
  content?: string;
  children?: React.ReactNode;
  customClasses?: string;
}
declare const Header: React.FC<HeaderProps>;

interface SubheaderProps {
  content?: string;
}
declare const Subheader: React.FC<SubheaderProps>;

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
declare const Input: React.ComponentType<InputProps>;

interface RichTextProps {
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
declare const RichText: React.FC<RichTextProps>;

interface TextAreaProps {
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
declare const TextArea: React.FC<TextAreaProps>;

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------
interface ItemProps {
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
declare const Item: React.FC<ItemProps>;

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------
interface ListProps {
  children?: React.ReactNode;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
}
declare const List: React.FC<ListProps>;

interface ListItemProps {
  children?: React.ReactNode;
  tapHighlight?: boolean;
  onSelect?: (highlighted: boolean) => void;
}
declare const ListItem: React.FC<ListItemProps>;

interface ListHeaderProps {
  content?: string;
  children?: React.ReactNode;
}
declare const ListHeader: React.FC<ListHeaderProps>;

interface GridListProps {
  children?: React.ReactNode;
  columns?: number;
  gap?: number;
}
declare const GridList: React.FC<GridListProps>;

interface GridListImageItemProps {
  src?: string;
  caption?: string;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
}
declare const GridListImageItem: React.FC<GridListImageItemProps>;

// ---------------------------------------------------------------------------
// MediaPlayer
// ---------------------------------------------------------------------------
interface VideoProps {
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
declare const Video: React.FC<VideoProps>;

// ---------------------------------------------------------------------------
// NumberInput
// ---------------------------------------------------------------------------
interface NumberInputProps {
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
declare const NumberInput: React.FC<NumberInputProps>;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
  className?: string;
}
declare const Pagination: React.FC<PaginationProps>;

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------
interface StackedPanelProps {
  children?: React.ReactNode;
  [key: string]: any;
}
declare const StackedPanel: React.FC<StackedPanelProps>;

interface StackedPanelsMethods {
  setIndex: (index: number) => void;
  getIndex: () => number;
  getIsNarrow: () => boolean;
  toggleExpand: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  next: () => void;
  prev: () => void;
}
interface StackedPanelsProps {
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
declare const StackedPanels: React.ForwardRefExoticComponent<
  StackedPanelsProps & React.RefAttributes<StackedPanelsMethods>
>;

// ---------------------------------------------------------------------------
// Popup
// ---------------------------------------------------------------------------
interface PopupAction {
  label: string;
  onClick: () => void;
  type?: 'normal' | 'warning';
}
interface PopupPanelProps {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
  actions?: PopupAction[];
  onClose?: () => void;
  anchorRect?: DOMRect | { top: number; left: number; bottom: number; width: number; height: number } | null;
}
declare const PopupPanel: React.FC<PopupPanelProps>;

// ---------------------------------------------------------------------------
// ProgressBar
// ---------------------------------------------------------------------------
interface ProgressBarProps {
  value?: number;
  color?: 'blue' | 'yellow' | 'red' | string;
  width?: string;
  height?: string;
}
declare const ProgressBar: React.FC<ProgressBarProps>;

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
interface SliderProps {
  value?: number;
  color?: string;
  width?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}
declare const Slider: React.FC<SliderProps>;

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
interface SpinnerProps {
  active?: boolean;
  styleType?: 'light' | 'dark';
  size?: 'normal' | 'large';
  alt?: string;
}
declare const Spinner: React.FC<SpinnerProps>;

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
interface TableColumn<T = Record<string, any>> {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: any, row: T) => React.ReactNode;
}
interface TableProps<T = Record<string, any>> {
  columns?: TableColumn<T>[];
  data?: T[];
  sortable?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  className?: string;
}
declare const Table: React.FC<TableProps>;

// ---------------------------------------------------------------------------
// ThemeWrapper
// ---------------------------------------------------------------------------
interface ThemeColors {
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
interface ThemeContextValue {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  colors: ThemeColors;
}
interface ThemeWrapperProps {
  children?: React.ReactNode;
  defaultTheme?: 'dark' | 'light';
  fontFamily?: string;
  className?: string;
}
declare const ThemeWrapper: React.FC<ThemeWrapperProps>;
declare function useTheme(): ThemeContextValue;

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
interface ToggleProps {
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
declare const Toggle: React.FC<ToggleProps>;

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------
interface WizardStep {
  label: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
  skippable?: boolean;
  onNext?: () => boolean | void | Promise<boolean | void>;
}
interface WizardProps {
  steps?: WizardStep[];
  onComplete?: () => void;
  onCancel?: () => void;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
  className?: string;
}
declare const Wizard: React.FC<WizardProps>;

export { Badge, Button, Checkbox, Collapsable, CollapsableFooter, CollapsableHeader, CollapsableItem, DateInput, Dialog, Divider, Dropdown, GridList, GridListImageItem, Header, Input, Item, List, ListHeader, ListItem, NubbinDivider, NumberInput, Pagination, PopupPanel, ProgressBar, Radio, RichText, Slider, Spinner, StackedPanel, StackedPanels, Subheader, Table, TextArea, ThemeWrapper, Toggle, Video, ViewSelectButton, Wizard, useTheme };
export type { BadgeProps, ButtonProps, CheckboxChangeEvent, CheckboxProps, CollapsableProps, DateInputProps, DialogProps, DividerProps, DropdownOption, DropdownProps, GridListImageItemProps, GridListProps, HeaderProps, InputProps, ItemProps, ListHeaderProps, ListItemProps, ListProps, NubbinDividerProps, NumberInputProps, PaginationProps, PopupAction, PopupPanelProps, ProgressBarProps, RadioProps, RichTextProps, SliderProps, SpinnerProps, StackedPanelProps, StackedPanelsMethods, StackedPanelsProps, SubheaderProps, TableColumn, TableProps, TextAreaProps, ThemeColors, ThemeContextValue, ThemeWrapperProps, ToggleProps, VideoProps, ViewSelectButtonItem, ViewSelectButtonProps, WizardProps, WizardStep };
