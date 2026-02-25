import { useEffect, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { ProductsTable } from '../components/ProductsTable';
import { getProducts } from '../api/getProducts';
import type { Product } from '../types';
import './ProductsListPage.css';

export const ProductsListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(-1);

    // pagination state for react-table: 0-indexed page
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // translate 0-based pageIndex to 1-based API page
                const response = await getProducts(pagination.pageIndex + 1, pagination.pageSize);
                setProducts(response.data);
                setPageCount(response.meta.lastPage);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error desconocido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [pagination.pageIndex, pagination.pageSize]);

    return (
        <div className="products-page">
            <div className="products-page-header">
                <div>
                    <h1 className="products-title">Inventario</h1>
                    <p className="products-subtitle">
                        Gestiona y visualiza el stock de tus productos en tiempo real.
                    </p>
                </div>
            </div>

            {error ? (
                <div className="products-error">
                    <p>⚠️ {error}</p>
                </div>
            ) : (
                <div className="products-content">
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
