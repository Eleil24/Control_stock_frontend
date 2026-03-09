import { api } from '../../../lib/axios';
export interface User {
    id: number;
    name: string;
    username: string;
    role: string;
}
export interface LoginResponse {
    access_token: string;
    user: User;
}
export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>('/auth/login', { username, password });
        return response.data;
    } catch (error: any) {
        if (error.response && (error.response.status === 401 || error.response.status === 404)) {
            throw new Error('Credenciales inválidas');
        }
        throw new Error('Error de conexión con el servidor');
    }
};