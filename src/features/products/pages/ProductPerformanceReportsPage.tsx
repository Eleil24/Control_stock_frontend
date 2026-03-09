import React, { useState, useEffect } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { getProductPerformanceReports } from '../api/getProductPerformanceReports';
import type { ProductPerformance } from '../types';
import { ProductPerformanceTable } from '../components/ProductPerformanceTable';
import './ProductPerformanceReportsPage.css';
export const ProductPerformanceReportsPage: React.FC = () => {
    const [performanceData, setPerformanceData] = useState<ProductPerformance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const handleSearch = () => {
        setAppliedStartDate(startDateFilter);
        setAppliedEndDate(endDateFilter);
        setPagination(prev => ({ ...prev, pageIndex: 0 })); 
    };
    const handleClearFilters = () => {
        setStartDateFilter('');
        setEndDateFilter('');
        setAppliedStartDate('');
        setAppliedEndDate('');
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };
    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const response = await getProductPerformanceReports(
                    pagination.pageIndex + 1,
                    pagination.pageSize,
                    appliedStartDate || undefined,
                    appliedEndDate || undefined
                );
                setPerformanceData(response.data);
                setPageCount(response.meta.lastPage);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error al cargar el reporte de desempeño');
                setPerformanceData([]);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, [pagination.pageIndex, pagination.pageSize, appliedStartDate, appliedEndDate]);
    return (
        <div className="performance-reports-page-wrapper">
            <div className="performance-reports-page-container">
                <div className="performance-reports-page-header">
                    <h1 className="performance-reports-title">Desempeño de Productos</h1>
                    <p className="performance-reports-subtitle">
                        Evalúa la rotación de inventario y los ingresos estimados por producto en un rango de fechas.
                    </p>
                </div>
                <div className="filters-container">
                    <div className="filter-group">
                        <label htmlFor="startDate-filter">Fecha de Inicio</label>
                        <input
                            id="startDate-filter"
                            type="date"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="endDate-filter">Fecha de Fin</label>
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
                    <div className="performance-error">
                        <p>⚠️ {error}</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <ProductPerformanceTable
                            performanceData={performanceData}
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