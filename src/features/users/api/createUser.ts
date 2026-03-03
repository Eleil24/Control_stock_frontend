import { api } from '../../../lib/axios';

export interface CreateUserDTO {
    name: string;
    username: string;
    password?: string;
    role: string;
}

export interface UserResponse {
    id: number;
    name: string;
    username: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export const createUser = async (data: CreateUserDTO): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>('/users', data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            // Backend errors usually come in an array of messages or a single string
            const message = error.response.data.message;
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }
        throw new Error('Error al crear el usuario. Verifica la conexión con el servidor.');
    }
};
