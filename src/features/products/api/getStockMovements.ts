// Función encargada de traer el historial de movimientos de stock paginado desde el backend.
import type { StockMovement } from '../types';

export interface PaginatedStockMovements {
    data: StockMovement[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

import { api } from '../../../lib/axios';

export const getStockMovements = async (page: number = 1, limit: number = 10): Promise<PaginatedStockMovements> => {
    try {
        const response = await api.get(`/stock?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el historial de movimientos');
    }
};
