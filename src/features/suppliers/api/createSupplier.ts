import type { CreateSupplierDto, Supplier } from '../types';
import { api } from '../../../lib/axios';

export const createSupplier = async (data: CreateSupplierDto): Promise<Supplier> => {
    try {
        const response = await api.post('/suppliers', data);
        return response.data;
    } catch (error: any) {
        let errorMessage = 'Error al registrar el proveedor';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};
