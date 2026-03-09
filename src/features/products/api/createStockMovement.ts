import type { CreateStockMovementDto } from '../types';
import { api } from '../../../lib/axios';
export const createStockMovement = async (movementData: CreateStockMovementDto): Promise<any> => {
    try {
        const response = await api.post('/stock', movementData);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Error al intentar registrar el movimiento de stock';
        throw new Error(message);
    }
};