import type { Product } from '../types';

export interface PaginatedProducts {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

/**
 * Función encargada de obtener la lista paginada de productos desde el backend.
 */
export const getProducts = async (page: number = 1, limit: number = 10): Promise<PaginatedProducts> => {
    const response = await fetch(`http://localhost:3000/products?page=${page}&limit=${limit}`);

    if (!response.ok) {
        throw new Error('No se pudo obtener la lista de productos');
    }

    const data = await response.json();
    return data;
};
