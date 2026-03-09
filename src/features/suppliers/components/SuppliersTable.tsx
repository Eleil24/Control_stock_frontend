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
import type { Supplier } from '../types';
import { updateSupplier } from '../api/updateSupplier';
import '../../products/components/ProductsTable.css';
import '../../products/components/Pagination.css';
interface SuppliersTableProps {
    suppliers: Supplier[];
    isLoading?: boolean;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    onSupplierUpdated?: () => void;
}
export const SuppliersTable = ({
    suppliers,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange,
    onSupplierUpdated
}: SuppliersTableProps) => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [editFormData, setEditFormData] = useState<{ name?: string; phone?: string; email?: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const handleEditClick = (supplier: Supplier) => {
        setEditingRowId(supplier.id);
        setEditFormData({
            name: supplier.name,
            phone: supplier.phone || '',
            email: supplier.email || ''
        });
    };
    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditFormData({});
    };
    const handleSaveEdit = async (id: number | string) => {
        if (!editFormData.name?.trim()) {
            alert('El nombre del proveedor es obligatorio');
            return;
        }
        setIsSaving(true);
        try {
            await updateSupplier(Number(id), {
                name: editFormData.name,
                phone: editFormData.phone,
                email: editFormData.email
            });
            setEditingRowId(null);
            if (onSupplierUpdated) {
                onSupplierUpdated();
            }
        } catch (error) {
            console.error('Failed to update supplier', error);
            alert('Error al actualizar el proveedor');
        } finally {
            setIsSaving(false);
        }
    };
    const columns = useMemo<ColumnDef<Supplier>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info) => <span className="col-id">#{info.getValue<number>()}</span>,
            },
            {
                accessorKey: 'name',
                header: 'Proveedor',
                cell: (info) => {
                    const supplier = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === supplier.id) {
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
                accessorKey: 'phone',
                header: 'Teléfono',
                cell: (info) => {
                    const supplier = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === supplier.id) {
                        return (
                            <input
                                type="text"
                                className="edit-input"
                                value={meta.editFormData.phone || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, phone: e.target.value })}
                                disabled={meta.isSaving}
                            />
                        );
                    }
                    return <span>{info.getValue<string>()}</span>;
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: (info) => {
                    const supplier = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === supplier.id) {
                        return (
                            <input
                                type="text"
                                className="edit-input"
                                value={meta.editFormData.email || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, email: e.target.value })}
                                disabled={meta.isSaving}
                            />
                        );
                    }
                    return <span>{info.getValue<string>()}</span>;
                },
            },
            {
                accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
                id: 'createdAt',
                header: 'Fecha Registro',
                cell: (info) => <span>{info.getValue<string>()}</span>,
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: (info) => {
                    const supplier = info.row.original;
                    const meta = info.table.options.meta as any;
                    const isEditing = meta.editingRowId === supplier.id;
                    if (isEditing) {
                        return (
                            <div className="actions-cell">
                                <button
                                    onClick={() => meta.handleSaveEdit(supplier.id)}
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
                            onClick={() => meta.handleEditClick(supplier)}
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
        data: suppliers,
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
    if (isLoading && !suppliers.length) {
        return (
            <div className="products-table-skeleton">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }
    if (!isLoading && !suppliers.length) {
        return (
            <div className="products-empty-state">
                <p>No hay proveedores registrados.</p>
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