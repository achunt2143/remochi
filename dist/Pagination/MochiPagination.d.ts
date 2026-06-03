export default MochiPagination;
declare function MochiPagination({ currentPage, totalPages, onPageChange, showFirstLast, showPrevNext, maxVisible, className }: {
    currentPage?: number | undefined;
    totalPages?: number | undefined;
    onPageChange: any;
    showFirstLast?: boolean | undefined;
    showPrevNext?: boolean | undefined;
    maxVisible?: number | undefined;
    className?: string | undefined;
}): any;
