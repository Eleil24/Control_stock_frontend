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
import type { User } from '../types';
import { updateUser } from '../api/updateUser';
import '../../products/components/ProductsTable.css';
import '../../products/components/Pagination.css';
interface UsersTableProps {
    users: User[]; 
    isLoading?: boolean; 
    pageCount: number; 
    pagination: PaginationState; 
    onPaginationChange: OnChangeFn<PaginationState>; 
    onUserUpdated?: () => void; 
}
export const UsersTable = ({
    users,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange,
    onUserUpdated
}: UsersTableProps) => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [editFormData, setEditFormData] = useState<{ name?: string; username?: string; role?: string }>({});
    const [isSaving, setIsSaving] = useState(false);
    const handleEditClick = (user: User) => {
        setEditingRowId(user.id); 
        setEditFormData({         
            name: user.name,
            username: user.username,
            role: user.role
        });
    };
    const handleCancelEdit = () => {
        setEditingRowId(null); 
        setEditFormData({});   
    };
    const handleSaveEdit = async (id: number | string) => {
        if (!editFormData.name?.trim() || !editFormData.username?.trim()) {
            alert('El nombre y usuario son obligatorios');
            return;
        }
        setIsSaving(true); 
        try {
            await updateUser(Number(id), {
                name: editFormData.name,
                username: editFormData.username,
                role: editFormData.role
            });
            setEditingRowId(null); 
            if (onUserUpdated) onUserUpdated(); 
        } catch (error) {
            console.error('Failed to update user', error);
            alert('Error al actualizar el usuario');
        } finally {
            setIsSaving(false); 
        }
    };
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id', 
                header: 'ID', 
                cell: (info) => <span className="col-id">#{info.getValue<number>()}</span>,
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                cell: (info) => {
                    const user = info.row.original; 
                    const meta = info.table.options.meta as any; 
                    if (meta.editingRowId === user.id) {
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
                accessorKey: 'username',
                header: 'Usuario',
                cell: (info) => {
                    const user = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === user.id) {
                        return (
                            <input
                                type="text"
                                className="edit-input"
                                value={meta.editFormData.username || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, username: e.target.value })}
                                disabled={meta.isSaving}
                            />
                        );
                    }
                    return <span>{info.getValue<string>()}</span>;
                },
            },
            {
                accessorKey: 'role',
                header: 'Rol',
                cell: (info) => {
                    const user = info.row.original;
                    const meta = info.table.options.meta as any;
                    if (meta.editingRowId === user.id) {
                        return (
                            <select
                                className="edit-input"
                                value={meta.editFormData.role || ''}
                                onChange={(e) => meta.setEditFormData({ ...meta.editFormData, role: e.target.value })}
                                disabled={meta.isSaving}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="VENDEDOR">VENDEDOR</option>
                                <option value="ALMACENISTA">ALMACENISTA</option>
                            </select>
                        );
                    }
                    return (
                        <span className={`status-badge ${user.role === 'ADMIN' ? 'stock-ok' : user.role === 'VENDEDOR' ? 'stock-low' : 'stock-out'}`}>
                            {info.getValue<string>()}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: (info) => {
                    const user = info.row.original;
                    const meta = info.table.options.meta as any;
                    const isEditing = meta.editingRowId === user.id;
                    if (isEditing) {
                        return (
                            <div className="actions-cell">
                                {}
                                <button
                                    onClick={() => meta.handleSaveEdit(user.id)}
                                    className="action-btn save-btn"
                                    title="Guardar"
                                    disabled={meta.isSaving}
                                >
                                    <Check size={16} />
                                </button>
                                {}
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
                            onClick={() => meta.handleEditClick(user)}
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
        data: users, 
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
    if (isLoading && !users.length) {
        return (
            <div className="products-table-skeleton">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }
    if (!isLoading && !users.length) {
        return (
            <div className="products-empty-state">
                <p>No hay usuarios registrados.</p>
            </div>
        );
    }
    return (
        <div className="table-container-wrapper">
            <div className="products-table-container">
                {}
                <table className={`products-table ${isLoading ? 'table-loading' : ''}`}>
                    {}
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    {}
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={`col-${cell.column.id}`}>
                                        {}
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {}
            <div className="pagination-controls">
                <div className="pagination-info">
                    {}
                    Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{' '}
                    <strong>{table.getPageCount() === 0 ? 1 : table.getPageCount()}</strong>
                </div>
                <div className="pagination-actions">
                    {}
                    <button className="pagination-button" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage() || isLoading}>{'<<'}</button>
                    <button className="pagination-button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || isLoading}>{'<'}</button>
                    <button className="pagination-button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || isLoading}>{'>'}</button>
                    <button className="pagination-button" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage() || isLoading}>{'>>'}</button>
                </div>
                <div className="pagination-size">
                    {}
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="pagination-select"
                        disabled={isLoading}
                    >
                        {[5, 10, 20, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>Mostrar {pageSize}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};