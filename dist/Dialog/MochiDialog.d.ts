export default MochiDialog;
declare function MochiDialog({ isOpen, onClose, title, children, type, onConfirm, onCancel, confirmText, cancelText, showCloseButton, size, className, promptValue, onPromptChange, actions, }: {
    isOpen?: boolean | undefined;
    onClose: any;
    title: any;
    children: any;
    type?: string | undefined;
    onConfirm: any;
    onCancel: any;
    confirmText?: string | undefined;
    cancelText?: string | undefined;
    showCloseButton?: boolean | undefined;
    size?: string | undefined;
    className?: string | undefined;
    promptValue?: string | undefined;
    onPromptChange: any;
    actions: any;
}): any;
