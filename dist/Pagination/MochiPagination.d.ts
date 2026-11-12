export default MochiPagination;
declare function MochiPagination({ currentPage, totalPages, onPageChange, showFirstLast, showPrevNext, maxVisible, className, ...rest }: {
    [x: string]: any;
    currentPage?: number | undefined;
    totalPages?: number | undefined;
    onPageChange: any;
    showFirstLast?: boolean | undefined;
    showPrevNext?: boolean | undefined;
    maxVisible?: number | undefined;
    className?: string | undefined;
}): any;
