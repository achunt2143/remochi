export default MochiWizard;
/**
 * Completion tracking works like a stack by default: Next marks the step
 * being left as completed, and going back (Back, or tapping an earlier
 * step) un-completes the step returned to and everything after it, since
 * those steps are being redone.
 *
 * Pass `completedSteps` to manage completion yourself. The wizard then only
 * displays that list, and onCompletedStepsChange reports what its default
 * tracking would have changed it to, so the app can take, adjust or ignore
 * it. Same controlled/uncontrolled split as RepanelStack's activeIndex.
 */
declare function MochiWizard({ steps, onComplete, onCancel, onStepChange, completedSteps: completedStepsProp, onCompletedStepsChange, showStepNumbers, allowSkip, className }: {
    steps?: never[] | undefined;
    onComplete: any;
    onCancel: any;
    onStepChange: any;
    completedSteps: any;
    onCompletedStepsChange: any;
    showStepNumbers?: boolean | undefined;
    allowSkip?: boolean | undefined;
    className?: string | undefined;
}): any;
