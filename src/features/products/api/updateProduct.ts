import { api } from '../../../lib/axios';
import type { Product, UpdateProductDto } from '../types';

/**
 * Función encargada de actualizar un producto en el backend usando su ID
 */
export const updateProduct = async (id: number | string, data: UpdateProductDto): Promise<Product> => {
    try {
        const response = await api.patch(`/products/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Error al conectar con el servidor para actualizar el producto'
        );
    }
};
