import { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
    type OnChangeFn
} from '@tanstack/react-table';
import { Pencil, Check, X } from 'lucide-react';
import type { Product, UpdateProductDto } from '../types';
import { updateProduct } from '../api/updateProduct';
import './ProductsTable.css';
import './Pagination.css';
interface ProductsTableProps {
    products: Product[];
    isLoading?: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    onProductUpdated?: () => void;
}
export const ProductsTable = ({
    products,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange,
    onProductUpdated
}: ProductsTableProps) => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [editFormData, setEditFormData] = useState<UpdateProductDto>({});
    const [isSaving, setIsSaving] = useState(false);
    const handleEditClick = (product: Product) => {
        setEditingRowId(product.id);
        setEditFormData({
            name: product.name,
            description: product.description,
            price: product.price
        });
    };
    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditFormData({});
    };
    const handleSaveEdit = async (id: number | string) => {
        setIsSaving(true);
        try {
            await updateProduct(id, editFormData);
            setEditingRowId(null);
            if (onProductUpdated) {
                onProductUpdated();
            }
        } catch (error) {
            console.error('Failed to update product', error);
            alert('Error al actualizar el producto');
        } finally {
            setIsSaving(false);
        }
    };
    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Agotado', className: 'stock-out' };
        if (stock <= 10) return { label: 'Stock Bajo', className: 'stock-low' };
        return { label: 'En Stock', className: 'stock-ok' };
    };
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
                cell: (info) => {
                    const product = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === product.id) {
                        return (
                            <input
                                type="text"
                                className="edit-input"
                                value={meta.editFormData.name || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, name: e.target.value })}
                                disabled={meta.isSaving}
                            />
                        );
                    }
                    return <span className="product-name">{info.getValue<string>()}</span>;
                },
            },
            {
                accessorKey: 'price',
                header: () => <div className="text-right">Precio</div>,
                cell: (info) => {
                    const product = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === product.id) {
                        return (
                            <div className="col-price text-right">
                                <input
                                    type="number"
                                    className="edit-input num-input"
                                    value={meta.editFormData.price || ''}
                                    onChange={(e) => meta.setEditFormData({ ...meta.editFormData, price: Number(e.target.value) })}
                                    disabled={meta.isSaving}
                                />
                            </div>
                        );
                    }
                    const price = info.getValue<number>();
                    return (
                        <div className="col-price text-right">
                            <span className="price-number">
                                ${price.toFixed(2)}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'stock',
                header: () => <div className="text-right">Stock</div>,
                cell: (info) => {
                    const stock = info.getValue<number>();
                    const status = getStockStatus(stock);
                    return (
                        <div className="col-stock text-right">
                            <span className={`stock-number ${status.className}-text`}>
                                {stock}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'status',
                header: 'Estado',
                cell: (info) => {
                    const stock = info.row.original.stock;
                    const status = getStockStatus(stock);
                    return (
                        <span className={`status-badge ${status.className}`}>
                            {status.label}
                        </span>
                    );
                }
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: (info) => {
                    const product = info.row.original;
                    const meta = info.table.options.meta as any;
                    const isEditing = meta.editingRowId === product.id;
                    if (isEditing) {
                        return (
                            <div className="actions-cell">
                                <button
                                    onClick={() => meta.handleSaveEdit(product.id)}
                                    className="action-btn save-btn"
                                    title="Guardar"
                                    disabled={meta.isSaving}
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={meta.handleCancelEdit}
                                    className="action-btn cancel-btn"
                                    title="Cancelar"
                                    disabled={meta.isSaving}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    }
                    return (
                        <button
                            onClick={() => meta.handleEditClick(product)}
                            className="action-btn edit-btn"
                            title="Editar"
                        >
                            <Pencil size={16} />
                        </button>
                    );
                }
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
        meta: {
            editingRowId,
            editFormData,
            setEditFormData,
            isSaving,
            handleEditClick,
            handleSaveEdit,
            handleCancelEdit
        }
    });
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
                <p>No hay productos disponibles.</p>
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
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={`col-${cell.column.id}`}>
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