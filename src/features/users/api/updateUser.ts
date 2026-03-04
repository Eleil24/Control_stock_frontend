import { api } from '../../../lib/axios';
import type { User } from '../types';

export const updateUser = async (
    id: number,
    data: { name?: string; username?: string; role?: string }
): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
};
