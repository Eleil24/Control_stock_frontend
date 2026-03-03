import React, { useState, useEffect } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { getNetProfitReports } from '../api/getNetProfitReports';
import type { NetProfitReport } from '../types';
import { NetProfitTable } from '../components/NetProfitTable';
import './MovementHistoryReportsPage.css'; // Reciclando estilos

export const NetProfitReportsPage: React.FC = () => {
    const [reports, setReports] = useState<NetProfitReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);

    // Filters
    const [productNameFilter, setProductNameFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    // Values to apply when searching
    const [appliedProductName, setAppliedProductName] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleSearch = () => {
        setAppliedProductName(productNameFilter);
        setAppliedStartDate(startDateFilter);
        setAppliedEndDate(endDateFilter);
        setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset page to 0
    };

    const handleClearFilters = () => {
        setProductNameFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
        setAppliedProductName('');
        setAppliedStartDate('');
        setAppliedEndDate('');
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                // pageIndex is 0-based in react-table, API expects 1-based page
                const response = await getNetProfitReports(
                    pagination.pageIndex + 1,
                    pagination.pageSize,
                    appliedStartDate || undefined,
                    appliedEndDate || undefined,
                    appliedProductName || undefined
                );

                setReports(response.data);
                setPageCount(response.meta.lastPage);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el reporte de ganancia neta');
                setReports([]);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [pagination.pageIndex, pagination.pageSize, appliedProductName, appliedStartDate, appliedEndDate]);

    return (
        <div className="movement-reports-page-wrapper">
            <div className="movement-reports-page-container">
                <div className="movement-reports-page-header">
                    <div>
                        <h1 className="movement-reports-title">Reporte de Ganancia Neta</h1>
                        <p className="movement-reports-subtitle">
                            Visualiza la ganancia estimada evaluando las ventas contra las compras y el inventario.
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
                        <label htmlFor="startDate-filter">Fecha Inicio</label>
                        <input
                            id="startDate-filter"
                            type="date"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="endDate-filter">Fecha Fin</label>
                        <input
                            id="endDate-filter"
                            type="date"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                        />
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
                        <NetProfitTable
                            reports={reports}
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
