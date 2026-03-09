import type { StockMovement } from '../types';
import { api } from '../../../lib/axios';
export interface PaginatedMovementHistory {
    data: StockMovement[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}
export const getMovementHistoryReports = async (
    page: number = 1,
    limit: number = 10,
    productName?: string,
    type?: string,
    startDate?: string,
    endDate?: string
): Promise<PaginatedMovementHistory> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (productName) {
        queryParams.append('productName', productName);
    }
    if (type) {
        queryParams.append('type', type);
    }
    if (startDate) {
        queryParams.append('startDate', startDate);
    }
    if (endDate) {
        queryParams.append('endDate', endDate);
    }
    try {
        const response = await api.get(`/reports/movements?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el historial de movimientos para el reporte');
    }
};