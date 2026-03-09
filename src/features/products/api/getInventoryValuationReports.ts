import type { Product } from '../types';
import { api } from '../../../lib/axios';
export interface PaginatedInventoryValuation {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}
export const getInventoryValuationReports = async (
    page: number = 1,
    limit: number = 10,
): Promise<PaginatedInventoryValuation> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    try {
        const response = await api.get(`/reports/valuation?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el reporte de valoración de inventario');
    }
};