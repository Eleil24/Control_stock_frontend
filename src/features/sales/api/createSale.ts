import type { CreateSaleDto, SaleResponse } from '../types';
import { api } from '../../../lib/axios';
export const createSale = async (saleData: CreateSaleDto): Promise<SaleResponse> => {
    try {
        const response = await api.post('/sales', saleData);
        return response.data;
    } catch (error) {
        throw new Error('Error al generar la boleta de venta');
    }
};