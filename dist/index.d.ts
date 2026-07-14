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
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Px height (horizontal) or width (vertical) of the line. @default 4 */
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}
/** Two-cap divider: a left cap and a right cap meeting seamlessly at the centre, each fading in from its outer edge. */
declare const Divider: React.FC<DividerProps>;

/** Which nubbin image to show — straight (`up`/`down`/`left`/`right`) or a Popup-style corner variant. */
type NubbinDividerNubbin =
  | 'up' | 'down' | 'left' | 'right'
  | 'top-left-up' | 'top-right-up'
  | 'top-left-left' | 'top-right-right'
  | 'bottom-left-down' | 'bottom-right-down'
  | 'bottom-left-left' | 'bottom-right-right';

interface NubbinDividerProps {
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
// Menu
// ---------------------------------------------------------------------------
interface MochiSlidingMenuProps {
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
interface MochiSlidingMenuContentShifterProps {
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
declare const MochiSlidingMenu: React.FC<MochiSlidingMenuProps> & {
  ContentShifter: React.FC<MochiSlidingMenuContentShifterProps>;
};
declare const MochiSlidingMenuContentShifter: React.FC<MochiSlidingMenuContentShifterProps>;

interface MochiSlidingMenuItemProps {
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
declare const MochiSlidingMenuItem: React.FC<MochiSlidingMenuItemProps>;

interface MochiSlidingMenuItemGroupProps {
  children?: React.ReactNode;
  /** Section heading rendered in uppercase muted text. */
  label?: string;
  /** Show a divider border below the group. @default false */
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
declare const MochiSlidingMenuItemGroup: React.FC<MochiSlidingMenuItemGroupProps>;

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
interface RepanelProps {
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
declare const Repanel: React.FC<RepanelProps>;

interface FloatingPanelProps {
  children?: React.ReactNode;
  /** Visual style variant. */
  style?: 'default' | 'shadow';
  className?: string;
  [key: string]: any;
}
declare const FloatingPanel: React.FC<FloatingPanelProps>;

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
type ActiveIndexChangeReason = 'grabber' | 'method';

/** Reason a reveal change was committed. */
type RevealChangeReason = 'grabber' | 'method';

/** How narrow mode collapses the stack. */
type NarrowBehavior = 'single' | 'stack' | 'overlay';

/** Detail payload for `onActiveIndexChange`. */
interface ActiveIndexChangeDetail {
  previousIndex: number;
  reason: ActiveIndexChangeReason;
  panelCount: number;
  isNarrow: boolean;
}

/** Detail payload for `onRevealChange`. */
interface RevealChangeDetail {
  previousReveal: number;
  reason: RevealChangeReason;
  snapPoints: number[];
  isNarrow: boolean;
}

/** Imperative handle exposed via `ref`. */
interface StackedPanelsMethods {
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

interface StackedPanelsProps {
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

declare const RepanelStack: React.ForwardRefExoticComponent<
  StackedPanelsProps & React.RefAttributes<StackedPanelsMethods>
>;
declare const MochiStackedPanels: React.ForwardRefExoticComponent<
  StackedPanelsProps & React.RefAttributes<StackedPanelsMethods>
>;
declare const StackedMochiPanels: React.ForwardRefExoticComponent<
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

export { Badge, Button, Checkbox, Collapsable, CollapsableFooter, CollapsableHeader, CollapsableItem, DateInput, Dialog, Divider, Dropdown, FloatingPanel, GridList, GridListImageItem, Header, Input, Item, List, ListHeader, ListItem, MochiSlidingMenu, MochiSlidingMenuContentShifter, MochiSlidingMenuItem, MochiSlidingMenuItemGroup, MochiStackedPanels, NubbinDivider, NumberInput, Pagination, PopupPanel, ProgressBar, Radio, Repanel, RepanelStack, RichText, Slider, Spinner, StackedMochiPanels, Subheader, Table, TextArea, ThemeWrapper, Toggle, Video, ViewSelectButton, Wizard, useTheme };
export type { ActiveIndexChangeDetail, ActiveIndexChangeReason, BadgeProps, ButtonProps, CheckboxChangeEvent, CheckboxProps, CollapsableProps, DateInputProps, DialogProps, DividerProps, DropdownOption, DropdownProps, FloatingPanelProps, GridListImageItemProps, GridListProps, HeaderProps, InputProps, ItemProps, ListHeaderProps, ListItemProps, ListProps, MochiSlidingMenuContentShifterProps, MochiSlidingMenuItemGroupProps, MochiSlidingMenuItemProps, MochiSlidingMenuProps, NarrowBehavior, NubbinDividerNubbin, NubbinDividerProps, NumberInputProps, PaginationProps, PopupAction, PopupPanelProps, ProgressBarProps, RadioProps, RepanelProps, RevealChangeDetail, RevealChangeReason, RichTextProps, SliderProps, SpinnerProps, StackedPanelsMethods, StackedPanelsProps, SubheaderProps, TableColumn, TableProps, TextAreaProps, ThemeColors, ThemeContextValue, ThemeWrapperProps, ToggleProps, VideoProps, ViewSelectButtonItem, ViewSelectButtonProps, WizardProps, WizardStep };
