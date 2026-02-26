import type { ProductPerformance } from '../types';

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

    const response = await fetch(`http://localhost:3000/reports/performance?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Error al obtener el reporte de desempeño de productos');
    }

    const data = await response.json();
    return data;
};
