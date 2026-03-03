import type { CreatePurchaseDto, PurchaseResponse } from '../types';
import { api } from '../../../lib/axios';

export const createPurchase = async (data: CreatePurchaseDto): Promise<PurchaseResponse> => {
    try {
        const response = await api.post('/purchases', data);
        return response.data;
    } catch (error: any) {
        let errorMessage = 'Error al registrar la compra';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};
