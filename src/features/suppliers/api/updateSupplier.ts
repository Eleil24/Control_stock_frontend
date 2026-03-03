import { api } from '../../../lib/axios';
import type { Supplier } from '../types';

export const updateSupplier = async (
    id: number,
    data: { name: string; phone?: string; email?: string }
): Promise<Supplier> => {
    const response = await api.patch(`/suppliers/${id}`, data);
    return response.data;
};
