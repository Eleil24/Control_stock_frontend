import { useEffect, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { SuppliersTable } from '../components/SuppliersTable';
import { getSuppliers } from '../api/getSuppliers';
import type { Supplier } from '../types';
import '../../products/pages/ProductsListPage.css'; // Reutilizamos estilos principales

export const SuppliersListPage = ({ onCreateNew }: { onCreateNew: () => void }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(-1);

    // pagination state for react-table: 0-indexed page
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const response = await getSuppliers(pagination.pageIndex + 1, pagination.pageSize);
            setSuppliers(response.data);
            setPageCount(response.meta.lastPage);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [pagination.pageIndex, pagination.pageSize]);

    return (
        <div className="products-page">
            <div className="products-page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', textAlign: 'left' }}>
                    <div>
                        <h1 className="products-title">Proveedores</h1>
                        <p className="products-subtitle">
                            Listado completo de proveedores registrados en el sistema.
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
                        + Nuevo Proveedor
                    </button>
                </div>
            </div>

            {error ? (
                <div className="products-error">
                    <p>⚠️ {error}</p>
                </div>
            ) : (
                <div className="products-content">
                    <SuppliersTable
                        suppliers={suppliers}
                        isLoading={isLoading}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSupplierUpdated={fetchSuppliers}
                    />
                </div>
            )}
        </div>
    );
};
