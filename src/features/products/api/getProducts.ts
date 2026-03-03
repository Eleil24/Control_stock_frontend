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
import { api } from '../../../lib/axios';

export const getProducts = async (page: number = 1, limit: number = 10): Promise<PaginatedProducts> => {
    try {
        const response = await api.get(`/products?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error('No se pudo obtener la lista de productos');
    }
};
