import type { Supplier } from '../types';
import { api } from '../../../lib/axios';

export const getSuppliers = async (): Promise<Supplier[]> => {
    try {
        const response = await api.get('/suppliers');
        return response.data;
    } catch (error) {
        throw new Error('No se pudo obtener la lista de proveedores');
    }
};
