import type { PaginatedSuppliers } from '../types';
import { api } from '../../../lib/axios';
export const getSuppliers = async (page: number = 1, limit: number = 10): Promise<PaginatedSuppliers> => {
    try {
        const response = await api.get(`/suppliers?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error('No se pudo obtener la lista de proveedores');
    }
};