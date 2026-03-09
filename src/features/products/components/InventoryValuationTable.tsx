import { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
    type OnChangeFn
} from '@tanstack/react-table';
import type { Product } from '../types';
import '../components/ProductsTable.css'; 
import '../components/Pagination.css';
interface InventoryValuationTableProps {
    products: Product[];
    isLoading?: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
}
export const InventoryValuationTable = ({
    products,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange
}: InventoryValuationTableProps) => {
    const columns = useMemo<ColumnDef<Product>[]>(
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
                accessorKey: 'stock',
                header: () => <div className="text-right">Stock</div>,
                cell: (info) => (
                    <div className="text-right">
                        <span>{info.getValue<number>()}</span>
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
                id: 'valuation',
                accessorFn: row => row.valuation || (row.price * row.stock),
                header: () => <div className="text-right">Valoración Total</div>,
                cell: (info) => (
                    <div className="text-right font-bold text-green-600">
                        <span>${info.getValue<number>().toFixed(2)}</span>
                    </div>
                ),
            }
        ],
        []
    );
    const table = useReactTable({
        data: products,
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
    if (isLoading && !products.length) {
        return (
            <div className="products-table-skeleton">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }
    if (!isLoading && !products.length) {
        return (
            <div className="products-empty-state">
                <p>No hay productos para mostrar en este reporte.</p>
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
                                    if (cell.column.id === 'price' || cell.column.id === 'valuation') {
                                        const val = cell.getValue() as number;
                                        content = <span className={cell.column.id === 'valuation' ? 'val-total' : ''}>{formatCurrency(val)}</span>;
                                    }
                                    return (
                                        <td key={cell.id} className={`col-${cell.column.id} ${cell.column.id === 'price' || cell.column.id === 'valuation' || cell.column.id === 'stock' ? 'text-right' : ''}`}>
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