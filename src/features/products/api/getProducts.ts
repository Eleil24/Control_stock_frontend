import type { Product } from '../types';

/**
 * Función encargada de obtener la lista completa de productos desde el backend.
 * Centralizamos esto aquí para mantener el código más limpio y modular.
 */
export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch('http://localhost:3000/products');

    if (!response.ok) {
        throw new Error('No se pudo obtener la lista de productos');
    }

    const data = await response.json();
    return data;
};
