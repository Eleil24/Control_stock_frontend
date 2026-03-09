import { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
    type OnChangeFn
} from '@tanstack/react-table';
import type { StockMovement } from '../types';
import './Pagination.css';
interface StockMovementsTableProps {
    movements: StockMovement[];
    isLoading?: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
}
export const StockMovementsTable = ({
    movements,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange
}: StockMovementsTableProps) => {
    const formatDate = (dateString: string) => {
        if (dateString && dateString.includes(',') && dateString.includes('/')) {
            return dateString.replace(', ', ' a las ');
        }
        try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                };
                return date.toLocaleDateString('es-ES', options);
            }
        } catch (e) {
        }
        return dateString;
    };
    const getMovementTypeBadge = (type: string) => {
        switch (type) {
            case 'IN':
                return <span className="movement-badge badge-in">Entrada</span>;
            case 'OUT':
                return <span className="movement-badge badge-out">Salida</span>;
            case 'ADJUSTMENT':
                return <span className="movement-badge badge-adj">Ajuste</span>;
            default:
                return <span className="movement-badge">{type}</span>;
        }
    };
    const columns = useMemo<ColumnDef<StockMovement>[]>(
        () => [
            {
                accessorKey: 'createdAt',
                header: 'Fecha',
                cell: (info) => <span className="date-cell">{formatDate(info.getValue<string>())}</span>,
            },
            {
                id: 'product',
                header: 'Producto',
                cell: (info) => {
                    const mov = info.row.original;
                    return (
                        <span className="product-cell">
                            {mov.product ? mov.product.name : `ID Producto: ${mov.productId}`}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'type',
                header: 'Tipo de Movimiento',
                cell: (info) => <div className="type-cell">{getMovementTypeBadge(info.getValue<string>())}</div>,
            },
            {
                id: 'quantity',
                header: 'Cantidad',
                cell: (info) => {
                    const mov = info.row.original;
                    return (
                        <span className="quantity-cell">
                            {mov.type === 'OUT' ? '-' : '+'}{mov.quantity}
                        </span>
                    );
                },
            }
        ],
        []
    );
    const table = useReactTable({
        data: movements,
        columns,
        pageCount,
        state: {
            pagination,
        },
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });
    if (isLoading && !movements.length) {
        return (
            <div className="movements-table-skeleton">
                <p className="loading-text">Cargando historial de movimientos...</p>
            </div>
        );
    }
    if (!isLoading && !movements.length) {
        return (
            <div className="movements-empty-state">
                <p className="empty-message">No se encontraron movimientos registrados.</p>
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