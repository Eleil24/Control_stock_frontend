import { useEffect, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { ProductsTable } from '../components/ProductsTable';
import { getLowStockReports } from '../api/getLowStockReports';
import type { Product } from '../types';
import './LowStockReportsPage.css';
export const LowStockReportsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(-1);
    const [threshold, setThreshold] = useState<number>(15);
    const [inputValue, setInputValue] = useState<number>(15);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const response = await getLowStockReports(pagination.pageIndex + 1, pagination.pageSize, threshold);
                setProducts(response.data);
                setPageCount(response.meta.lastPage);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error desconocido al cargar el reporte');
                setProducts([]);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };
        const timeoutId = setTimeout(() => {
            fetchReports();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [pagination.pageIndex, pagination.pageSize, threshold]);
    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setInputValue(val || 0);
    };
    const handleThresholdBlur = () => {
        if (inputValue > 0) {
            setThreshold(inputValue);
            setPagination(prev => ({ ...prev, pageIndex: 0 })); 
        } else {
            setInputValue(threshold); 
        }
    };
    const handleThresholdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleThresholdBlur();
        }
    };
    return (
        <div className="low-stock-page">
            <div className="low-stock-page-header">
                <div>
                    <h1 className="low-stock-title">Reporte de Bajo Stock</h1>
                    <p className="low-stock-subtitle">
                        Visualiza los productos cuyo stock actual sea menor al límite establecido.
                    </p>
                </div>
                <div className="threshold-control">
                    <label htmlFor="threshold-input">Límite de Stock:</label>
                    <input
                        id="threshold-input"
                        type="number"
                        min="1"
                        className="threshold-input"
                        value={inputValue}
                        onChange={handleThresholdChange}
                        onBlur={handleThresholdBlur}
                        onKeyDown={handleThresholdKeyDown}
                    />
                </div>
            </div>
            {error ? (
                <div className="low-stock-error">
                    <p>⚠️ {error}</p>
                </div>
            ) : (
                <div className="low-stock-content">
                    <ProductsTable
                        products={products}
                        isLoading={isLoading}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                    />
                </div>
            )}
        </div>
    );
};