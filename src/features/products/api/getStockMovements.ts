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

export const getStockMovements = async (page: number = 1, limit: number = 10): Promise<PaginatedStockMovements> => {
    const response = await fetch(`http://localhost:3000/stock?page=${page}&limit=${limit}`);

    if (!response.ok) {
        throw new Error('Error al obtener el historial de movimientos');
    }

    const data = await response.json();
    return data;
};
