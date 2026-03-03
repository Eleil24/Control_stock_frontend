import type { NetProfitReport } from '../types';
import { api } from '../../../lib/axios';

export interface PaginatedNetProfit {
    data: NetProfitReport[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit?: number;
    };
}

export const getNetProfitReports = async (
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    productName?: string
): Promise<PaginatedNetProfit> => {
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

    if (productName) {
        queryParams.append('productName', productName);
    }

    try {
        const response = await api.get(`/reports/net-profit?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el reporte de ganancia neta');
    }
};
