import type { CreateProductDto, Product } from '../types';
import { api } from '../../../lib/axios';
export const createProduct = async (productData: CreateProductDto): Promise<Product> => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el producto');
    }
};