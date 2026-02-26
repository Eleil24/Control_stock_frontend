import type { StockMovement } from '../types';

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
    type?: string
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

    const response = await fetch(`http://localhost:3000/reports/movements?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Error al obtener el historial de movimientos para el reporte');
    }

    const data = await response.json();
    return data;
};
