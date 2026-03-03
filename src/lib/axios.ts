import axios from 'axios';

// Creamos una instancia de axios pre-configurada
export const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de peticiones: Se ejecuta ANTES de que la petición salga hacia el backend
api.interceptors.request.use(
    (config) => {
        // Buscamos el token en localStorage
        const token = localStorage.getItem('access_token');

        // Si existe, lo inyectamos en los headers de Autorización
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuestas: Se ejecuta CUANDO recibimos la respuesta del backend
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el error es 401 (No Autorizado), significa que el token expiró o es inválido
        if (error.response && error.response.status === 401) {
            // Limpiamos localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            // Redirigimos al usuario al login
            // Solo redirigimos si no estamos ya en la página de login para evitar bucles
            if (window.location.pathname !== '/auth/login') {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);
