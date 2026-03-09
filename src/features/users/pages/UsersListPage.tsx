import { useEffect, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { UsersTable } from '../components/UsersTable';
import { getUsers } from '../api/getUsers';
import type { User } from '../types';
import '../../products/pages/ProductsListPage.css';
export const UsersListPage = ({ onCreateNew }: { onCreateNew: () => void }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(-1);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await getUsers(pagination.pageIndex + 1, pagination.pageSize);
            setUsers(response.data);
            setPageCount(response.meta.lastPage);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error desconocido al cargar usuarios');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [pagination.pageIndex, pagination.pageSize]);
    return (
        <div className="products-page">
            <div className="products-page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div>
                        <h1 className="products-title">Usuarios</h1>
                        <p className="products-subtitle">
                            Listado completo de usuarios y administradores del sistema.
                        </p>
                    </div>
                    <button
                        onClick={onCreateNew}
                        style={{
                            backgroundColor: '#60a5fa',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        + Nuevo Usuario
                    </button>
                </div>
            </div>
            {error ? (
                <div className="products-error">
                    <p>⚠️ {error}</p>
                </div>
            ) : (
                <div className="products-content">
                    <UsersTable
                        users={users}
                        isLoading={isLoading}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onUserUpdated={fetchUsers}
                    />
                </div>
            )}
        </div>
    );
};