import React, { useState, useEffect } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { getMovementHistoryReports } from '../api/getMovementHistoryReports';
import type { StockMovement } from '../types';
import { StockMovementsTable } from '../components/StockMovementsTable';
import './MovementHistoryReportsPage.css';

export const MovementHistoryReportsPage: React.FC = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);

    // Filters
    const [productNameFilter, setProductNameFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Values to apply when searching
    const [appliedProductName, setAppliedProductName] = useState('');
    const [appliedType, setAppliedType] = useState('');

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleSearch = () => {
        setAppliedProductName(productNameFilter);
        setAppliedType(typeFilter);
        setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset page to 0
    };

    const handleClearFilters = () => {
        setProductNameFilter('');
        setTypeFilter('');
        setAppliedProductName('');
        setAppliedType('');
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    useEffect(() => {
        const fetchMovements = async () => {
            setIsLoading(true);
            try {
                // pageIndex is 0-based in react-table, API expects 1-based page
                const response = await getMovementHistoryReports(
                    pagination.pageIndex + 1,
                    pagination.pageSize,
                    appliedProductName || undefined,
                    appliedType || undefined
                );

                setMovements(response.data);
                setPageCount(response.meta.lastPage);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el reporte de movimientos');
                setMovements([]);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovements();
    }, [pagination.pageIndex, pagination.pageSize, appliedProductName, appliedType]);

    return (
        <div className="movement-reports-page-wrapper">
            <div className="movement-reports-page-container">
                <div className="movement-reports-page-header">
                    <div>
                        <h1 className="movement-reports-title">Reporte de Movimientos</h1>
                        <p className="movement-reports-subtitle">
                            Visualiza el historial detallado de entradas y salidas de stock aplicando filtros.
                        </p>
                    </div>
                </div>

                <div className="filters-container">
                    <div className="filter-group">
                        <label htmlFor="productName-filter">Nombre del Producto</label>
                        <input
                            id="productName-filter"
                            type="text"
                            placeholder="Ej. Laptop"
                            value={productNameFilter}
                            onChange={(e) => setProductNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="type-filter">Tipo de Movimiento</label>
                        <select
                            id="type-filter"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="IN">Entrada (IN)</option>
                            <option value="OUT">Salida (OUT)</option>
                            <option value="ADJUSTMENT">Ajuste (ADJUSTMENT)</option>
                        </select>
                    </div>

                    <div className="filter-actions">
                        <button className="btn-search" onClick={handleSearch}>
                            Buscar
                        </button>
                        <button className="btn-clear" onClick={handleClearFilters}>
                            Limpiar
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="movements-error">
                        <p>⚠️ {error}</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <StockMovementsTable
                            movements={movements}
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
