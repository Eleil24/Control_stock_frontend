export interface DailyMovementsReport {
    total: number;
}
import { api } from '../../../lib/axios';
export const getDailyMovementsReport = async (): Promise<DailyMovementsReport> => {
    try {
        const response = await api.get('/reports/daily-movements');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el reporte de movimientos de hoy');
    }
};