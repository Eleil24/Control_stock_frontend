import React, { useState, useEffect } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { getStockMovements } from '../api/getStockMovements';
import type { StockMovement } from '../types';
import { StockMovementsTable } from '../components/StockMovementsTable';
import './StockMovementsListPage.css';
export const StockMovementsListPage: React.FC = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    useEffect(() => {
        const fetchMovements = async () => {
            setIsLoading(true);
            try {
                const response = await getStockMovements(pagination.pageIndex + 1, pagination.pageSize);
                const sortedData = response.data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setMovements(sortedData);
                setPageCount(response.meta.lastPage);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el historial de movimientos');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovements();
    }, [pagination.pageIndex, pagination.pageSize]);
    if (error) {
        return (
            <div className="movements-list-wrapper">
                <div className="movements-list-container">
                    <p className="error-text">{error}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="movements-list-wrapper">
            <div className="movements-list-container">
                <div className="movements-list-header">
                    <h2 className="movements-list-title">Historial de Movimientos</h2>
                    <p className="movements-list-subtitle">Consulta todas las entradas y salidas de stock registradas.</p>
                </div>
                <div className="table-wrapper">
                    <StockMovementsTable
                        movements={movements}
                        isLoading={isLoading}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                    />
                </div>
            </div>
        </div>
    );
};