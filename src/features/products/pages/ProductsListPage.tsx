import { useEffect, useState } from 'react';
import { ProductsTable } from '../components/ProductsTable';
import { getProducts } from '../api/getProducts';
import type { Product } from '../types';
import './ProductsListPage.css';

export const ProductsListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err: any) {
                setError(err.message || 'Error desconocido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                    <ProductsTable products={products} isLoading={isLoading} />
                </div>
            )}
        </div>
    );
};
