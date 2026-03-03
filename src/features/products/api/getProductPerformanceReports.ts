import type { ProductPerformance } from '../types';
import { api } from '../../../lib/axios';

export interface PaginatedProductPerformance {
    data: ProductPerformance[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}

export const getProductPerformanceReports = async (
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
): Promise<PaginatedProductPerformance> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (startDate) {
        queryParams.append('startDate', startDate);
    }

    if (endDate) {
        queryParams.append('endDate', endDate);
    }

    try {
        const response = await api.get(`/reports/performance?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el reporte de desempeño de productos');
    }
};
