export default MochiSlidingMenu;
export function MochiSlidingMenu(props: any): any;
export namespace MochiSlidingMenu {
    export { ContentShifter };
}
/**
 * ContentShifter
 * Wraps your main app content and translates it when the menu opens.
 * This is a static sub-component — it does NOT need to be inside a ThemeWrapper.
 */
declare function ContentShifter({ children, position, isMenuOpen, menuWidth, menuHeight, duration, className, style, }: {
    children: any;
    position?: string | undefined;
    isMenuOpen?: boolean | undefined;
    menuWidth?: string | undefined;
    menuHeight?: string | undefined;
    duration?: number | undefined;
    className?: string | undefined;
    style?: {} | undefined;
}): any;
export { ContentShifter as MochiSlidingMenuContentShifter };
