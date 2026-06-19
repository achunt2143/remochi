export default MochiTable;
/**
 * MochiTable accepts two shapes for columns + row data:
 *
 * Shape A — simple (matches the demo):
 *   columns = ['Name', 'Role', 'Status']             // string[]
 *   rows    = [['Alice','Engineer','Active'], ...]    // string[][] or any[][]
 *
 * Shape B — rich:
 *   columns = [{ key, label, width?, render? }]       // object[]
 *   data    = [{ name:'Alice', role:'Engineer' }, ...]// object[]
 *
 * Both shapes are normalised to Shape B internally.
 */
declare function MochiTable({ columns, rows, onRowClick, data, sortable, hoverable, striped, className, }: {
    columns?: never[] | undefined;
    rows: any;
    onRowClick: any;
    data: any;
    sortable?: boolean | undefined;
    hoverable?: boolean | undefined;
    striped?: boolean | undefined;
    className?: string | undefined;
}): any;
