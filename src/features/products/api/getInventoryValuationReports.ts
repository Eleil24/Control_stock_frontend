import type { Product } from '../types';

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

    const response = await fetch(`http://localhost:3000/reports/valuation?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Error al obtener el reporte de valoración de inventario');
    }

    const data = await response.json();
    return data;
};
