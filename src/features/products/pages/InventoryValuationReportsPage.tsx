import React, { useState, useEffect } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { getInventoryValuationReports } from '../api/getInventoryValuationReports';
import type { Product } from '../types';
import { InventoryValuationTable } from '../components/InventoryValuationTable';
import './InventoryValuationReportsPage.css';
import '../components/InventoryValuationTable.css';

export const InventoryValuationReportsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                // pageIndex is 0-based in react-table, API expects 1-based page
                const response = await getInventoryValuationReports(
                    pagination.pageIndex + 1,
                    pagination.pageSize
                );

                setProducts(response.data);
                setPageCount(response.meta.lastPage);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el reporte de valoración de inventario');
                setProducts([]);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [pagination.pageIndex, pagination.pageSize]);

    return (
        <div className="valuation-reports-page-wrapper">
            <div className="valuation-reports-page-container">
                <div className="valuation-reports-page-header">
                    <div>
                        <h1 className="valuation-reports-title">Valoración de Inventario</h1>
                        <p className="valuation-reports-subtitle">
                            Visualiza el detalle del capital inmovilizado calculado según stock y precio unitario.
                        </p>
                    </div>
                </div>

                {error ? (
                    <div className="valuation-error">
                        <p>⚠️ {error}</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <InventoryValuationTable
                            products={products}
                            isLoading={isLoading}
                            pageCount={pageCount}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
