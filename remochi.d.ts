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
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Px height (horizontal) or width (vertical) of the line. @default 4 */
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}
/** Two-cap divider: a left cap and a right cap meeting seamlessly at the centre, each fading in from its outer edge. */
export const Divider: React.FC<DividerProps>;

/** Which nubbin image to show — straight (`up`/`down`/`left`/`right`) or a Popup-style corner variant. */
export type NubbinDividerNubbin =
  | 'up' | 'down' | 'left' | 'right'
  | 'top-left-up' | 'top-right-up'
  | 'top-left-left' | 'top-right-right'
  | 'bottom-left-down' | 'bottom-right-down'
  | 'bottom-left-left' | 'bottom-right-right';

export interface NubbinDividerProps {
  /** @default 'up' */
  nubbin?: NubbinDividerNubbin;
  /** CSS left value shifting the nubbin from centre, e.g. '50%' (default), '120px', 'calc(...)'. */
  nubbinOffset?: string;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Px thickness of the cap lines flanking the nubbin. The nubbin image itself is a fixed-size asset and doesn't scale with this. @default 2 (matches the nubbin's own stroke weight) */
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}
/** Three-part divider — [left cap][nubbin image][right cap] — the caps stretch to fill their half and the nubbin sits fixed-size, flush against them. The 8 corner variants (borrowed from Popup) are the exception: a corner nubbin is the end of the line rather than a bump in the middle of it, so only one cap is drawn, on whichever side it trails off toward. */
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
export interface RepanelProps {
  children?: React.ReactNode;
  /** Percentage width of the panel within its row, e.g. 25, 33, 50. */
  width?: number;
  /** Visual style variant. */
  style?: 'default' | 'shadow';
  /** Draws a nubbin grabber accent at the bottom-left edge. `RepanelStack` sets this on every child but the first. */
  handle?: boolean;
  className?: string;
  [key: string]: any;
}
/** A full-height, rounded-left panel — the stackable card surface used standalone or inside `RepanelStack`. */
export const Repanel: React.FC<RepanelProps>;

export interface FloatingPanelProps {
  children?: React.ReactNode;
  /** Visual style variant. */
  style?: 'default' | 'shadow';
  className?: string;
  [key: string]: any;
}
export const FloatingPanel: React.FC<FloatingPanelProps>;

/**
 * RepanelStack — webOS/Mochi stacked panel workspace.
 *
 * A multi-column master-detail layout: the active panel is the front
 * (rightmost) column and takes the remaining width, while earlier panels
 * stay revealed to its left as real, fully interactive columns (not dimmed
 * peeking slivers) — every visible panel is simultaneously active and
 * navigable. Every panel but the first (the base of the stack, with nothing
 * behind it to reveal) has its own nubbin grabber at its bottom-left edge,
 * with different behavior depending on which panel it's on:
 *   - A parent panel's grabber adjusts reveal — grows/shrinks how many
 *     parents are shown, all the way back to panel 0. Never changes which
 *     panel is active.
 *   - The active panel's own grabber does the same reveal-adjust when
 *     dragged left (so a stack collapsed all the way down to just the
 *     active panel can always be reopened — every parent's own grabber
 *     goes non-interactive once its panel collapses to 0 width) or when
 *     dragged right while there's still more of the stack left to reveal.
 *     Only once nothing is left to reveal does dragging it right become a
 *     swipe-to-close gesture instead: it continuously shrinks while the
 *     panel behind grows to fill the space; release past ~45% dragged,
 *     with a fast flick, or double-click it, and the close commits —
 *     otherwise it springs back open. A closed panel doesn't return on its
 *     own; only an explicit forward action (`next`/`setActiveIndex`)
 *     reopens it.
 * There is no separate header gesture zone — the nubbin is the only
 * interactive surface a panel adds on top of its own content.
 */

/** Reason an active-index change was committed. */
export type ActiveIndexChangeReason = 'grabber' | 'method';

/** Reason a reveal change was committed. */
export type RevealChangeReason = 'grabber' | 'method';

/** How narrow mode collapses the stack. */
export type NarrowBehavior = 'single' | 'stack' | 'overlay';

/** Detail payload for `onActiveIndexChange`. */
export interface ActiveIndexChangeDetail {
  previousIndex: number;
  reason: ActiveIndexChangeReason;
  panelCount: number;
  isNarrow: boolean;
}

/** Detail payload for `onRevealChange`. */
export interface RevealChangeDetail {
  previousReveal: number;
  reason: RevealChangeReason;
  snapPoints: number[];
  isNarrow: boolean;
}

/** Imperative handle exposed via `ref`. */
export interface StackedPanelsMethods {
  /** Bring the panel at `index` to the front of the stack. */
  setActiveIndex: (index: number) => void;
  /** Advance the front panel by one. */
  next: () => void;
  /** Move the front panel back by one. */
  prev: () => void;
  /** Set the reveal depth. Within the configured `snapPoints` range the value snaps to the nearest point; beyond it (revealing more of the stack than the defaults cover) it snaps to the nearest whole parent instead. */
  setReveal: (value: number) => void;
  /** Reveal the deepest allowed stack depth (max snap point). */
  expand: () => void;
  /** Collapse to the shallowest stack depth (min snap point). */
  collapse: () => void;
  /** Read the current state snapshot. */
  getState: () => {
    activeIndex: number;
    reveal: number;
    panelCount: number;
    isNarrow: boolean;
  };
}

export interface StackedPanelsProps {
  children?: React.ReactNode;

  /** Controlled front/top panel index. */
  activeIndex?: number;
  /** Initial front panel index when uncontrolled. Defaults to the last panel. */
  defaultActiveIndex?: number;
  /** Called when the front panel changes. */
  onActiveIndexChange?: (index: number, detail: ActiveIndexChangeDetail) => void;

  /** Controlled reveal depth (snapped to `snapPoints`, or to the nearest whole parent if it exceeds that range). */
  reveal?: number;
  /** Initial reveal depth when uncontrolled. */
  defaultReveal?: number;
  /** Called when the reveal depth snaps to a new value. */
  onRevealChange?: (reveal: number, detail: RevealChangeDetail) => void;

  /** Allowed reveal depths for discrete controls (Expand/Collapse, keyboard stepping). A grabber drag isn't limited to this list — it can reveal every parent back to panel 0. @default [1, 2, 3] */
  snapPoints?: number[];
  /** Default number of panels shown at once on mount. Not a hard cap — a grabber drag can reveal more of the stack. @default 3 */
  maxVisiblePanels?: number;
  /** Shadow-seam overlap strength (0..1) between adjacent stacked columns. */
  overlap?: number;
  /** Width (px) of each revealed, non-active parent column. @default 240 */
  peek?: number;

  /** Show each panel's (but the first's) nubbin grabber — reveal-adjust on parents, reveal-adjust or swipe-to-close on the active panel. @default true */
  grabber?: boolean;
  /** Wrap around at the ends when changing the front panel. */
  wrap?: boolean;
  /** Animate layout transitions. @default true */
  animate?: boolean;

  /** Collapse to a narrow layout below `narrowFitWidth`. @default true */
  narrowFit?: boolean;
  /** Root width (px) at/below which narrow mode activates. @default 768 */
  narrowFitWidth?: number;
  /** Narrow-mode layout. @default 'single' */
  narrowBehavior?: NarrowBehavior;

  className?: string;
}

export const RepanelStack: React.ForwardRefExoticComponent<
  StackedPanelsProps & React.RefAttributes<StackedPanelsMethods>
>;
export const MochiStackedPanels: React.ForwardRefExoticComponent<
  StackedPanelsProps & React.RefAttributes<StackedPanelsMethods>
>;
export const StackedMochiPanels: React.ForwardRefExoticComponent<
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
