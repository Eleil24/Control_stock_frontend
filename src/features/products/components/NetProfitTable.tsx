import { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
    type OnChangeFn
} from '@tanstack/react-table';
import type { NetProfitReport } from '../types';
import './Pagination.css';

interface NetProfitTableProps {
    reports: NetProfitReport[];
    isLoading?: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
}

export const NetProfitTable = ({
    reports,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange
}: NetProfitTableProps) => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const columns = useMemo<ColumnDef<NetProfitReport>[]>(
        () => [
            {
                accessorKey: 'productId',
                header: 'ID',
                cell: (info) => <span className="id-cell">{info.getValue<number>()}</span>,
            },
            {
                accessorKey: 'productName',
                header: 'Producto',
                cell: (info) => <span className="product-cell font-medium">{info.getValue<string>()}</span>,
            },
            {
                accessorKey: 'totalSalesForDate',
                header: 'Ventas en Rango',
                cell: (info) => <span className="quantity-cell text-center">{info.getValue<number>()}</span>,
            },
            {
                accessorKey: 'totalSales',
                header: 'Total Ventas ($)',
                cell: (info) => <span className="currency-cell text-green-600">{formatCurrency(info.getValue<number>())}</span>,
            },
            {
                accessorKey: 'totalPurchases',
                header: 'Total Compras ($)',
                cell: (info) => <span className="currency-cell text-red-600">{formatCurrency(info.getValue<number>())}</span>,
            },
            {
                accessorKey: 'netProfit',
                header: 'Ganancia Neta ($)',
                cell: (info) => {
                    const value = info.getValue<number>();
                    return (
                        <span className={`currency-cell font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(value)}
                        </span>
                    );
                }
            }
        ],
        []
    );

    const table = useReactTable({
        data: reports,
        columns,
        pageCount,
        state: {
            pagination,
        },
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    if (isLoading && !reports.length) {
        return (
            <div className="movements-table-skeleton">
                <p className="loading-text">Cargando reporte de ganancia neta...</p>
            </div>
        );
    }

    if (!isLoading && !reports.length) {
        return (
            <div className="movements-empty-state">
                <p className="empty-message">No se encontró información para los filtros aplicados.</p>
            </div>
        );
    }

    return (
        <div className="table-container-wrapper">
            <div className="table-wrapper">
                <table className={`movements-table ${isLoading ? 'table-loading' : ''}`}>
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
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
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
