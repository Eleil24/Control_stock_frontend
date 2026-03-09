import { api } from '../../../lib/axios';
import type { PaginatedUsers } from '../types';
export const getUsers = async (page: number = 1, limit: number = 10): Promise<PaginatedUsers> => {
    try {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error('No se pudo obtener la lista de usuarios');
    }
};