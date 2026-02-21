import './ProductsTable.css';
import type { Product } from '../types';

interface ProductsTableProps {
    products: Product[];
    isLoading?: boolean;
}

export const ProductsTable = ({ products, isLoading }: ProductsTableProps) => {
    if (isLoading) {
        return (
            <div className="products-table-skeleton">
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="products-empty-state">
                <p>No hay productos disponibles.</p>
            </div>
        );
    }

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Agotado', className: 'stock-out' };
        if (stock <= 10) return { label: 'Stock Bajo', className: 'stock-low' };
        return { label: 'En Stock', className: 'stock-ok' };
    };

    return (
        <div className="products-table-container">
            <table className="products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th className="text-right">Stock</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const status = getStockStatus(product.stock);

                        return (
                            <tr key={product.id}>
                                <td className="col-id">#{product.id}</td>
                                <td className="col-name">
                                    <span className="product-name">{product.name}</span>
                                </td>
                                <td className="col-stock text-right">
                                    <span className={`stock-number ${status.className}-text`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="col-status">
                                    <span className={`status-badge ${status.className}`}>
                                        {status.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
