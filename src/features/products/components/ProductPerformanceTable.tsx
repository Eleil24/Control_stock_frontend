import { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
    type OnChangeFn
} from '@tanstack/react-table';
import type { ProductPerformance } from '../types';
import '../components/ProductsTable.css'; 
import '../components/Pagination.css';
import './ProductPerformanceTable.css';
interface ProductPerformanceTableProps {
    performanceData: ProductPerformance[];
    isLoading?: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
}
export const ProductPerformanceTable = ({
    performanceData,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange
}: ProductPerformanceTableProps) => {
    const columns = useMemo<ColumnDef<ProductPerformance>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info) => <span className="col-id">#{info.getValue<number>()}</span>,
            },
            {
                accessorKey: 'name',
                header: 'Producto',
                cell: (info) => <span className="product-name">{info.getValue<string>()}</span>,
            },
            {
                accessorKey: 'stockCurrent',
                header: () => <div className="text-right">Stock Actual</div>,
                cell: (info) => (
                    <div className="text-right">
                        <span>{info.getValue<number>()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'soldQuantity',
                header: () => <div className="text-right">Cant. Vendida</div>,
                cell: (info) => (
                    <div className="text-right font-bold text-blue-600">
                        <span className="sold-qty">{info.getValue<number>()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'price',
                header: () => <div className="text-right">Precio Unitario</div>,
                cell: (info) => (
                    <div className="text-right">
                        <span>${info.getValue<number>().toFixed(2)}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'estimatedRevenue',
                header: () => <div className="text-right">Ingreso Estimado</div>,
                cell: (info) => (
                    <div className="text-right">
                        <span className="revenue-total">${info.getValue<number>().toFixed(2)}</span>
                    </div>
                ),
            }
        ],
        []
    );
    const table = useReactTable({
        data: performanceData,
        columns,
        pageCount,
        state: {
            pagination,
        },
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }
    if (isLoading && !performanceData.length) {
        return (
            <div className="products-table-skeleton">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }
    if (!isLoading && !performanceData.length) {
        return (
            <div className="products-empty-state">
                <p>No hay datos de desempeño para mostrar en este reporte.</p>
            </div>
        );
    }
    return (
        <div className="table-container-wrapper">
            <div className="products-table-container">
                <table className={`products-table ${isLoading ? 'table-loading' : ''}`}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    let content = flexRender(cell.column.columnDef.cell, cell.getContext());
                                    if (cell.column.id === 'price' || cell.column.id === 'estimatedRevenue') {
                                        const val = cell.getValue() as number;
                                        content = <span className={cell.column.id === 'estimatedRevenue' ? 'revenue-total' : ''}>{formatCurrency(val)}</span>;
                                    }
                                    const isRightAligned = ['stockCurrent', 'soldQuantity', 'price', 'estimatedRevenue'].includes(cell.column.id);
                                    return (
                                        <td key={cell.id} className={`col-${cell.column.id} ${isRightAligned ? 'text-right' : ''}`}>
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-controls">
                <div className="pagination-info">
                    Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{' '}
                    <strong>{table.getPageCount() === 0 ? 1 : table.getPageCount()}</strong>
                </div>
                <div className="pagination-actions">
                    <button
                        className="pagination-button"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="pagination-button"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        {'<'}
                    </button>
                    <button
                        className="pagination-button"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        {'>'}
                    </button>
                    <button
                        className="pagination-button"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        {'>>'}
                    </button>
                </div>
                <div className="pagination-size">
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                        className="pagination-select"
                        disabled={isLoading}
                    >
                        {[5, 10, 20, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};