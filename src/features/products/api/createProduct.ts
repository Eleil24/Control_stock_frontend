import type { CreateProductDto, Product } from '../types';
import { api } from '../../../lib/axios';

/**
 * Este archivo pertenece a la capa "API" de nuestro Feature de Productos.
 * Su ÚNICA responsabilidad es hablar con el backend (tu servidor local o en la nube).
 * No sabe nada de React, ni de botones, ni de formularios. Solo sabe hacer peticiones HTTP.
 */

// Importamos la URL de la API desde las variables de entorno.
// Si no existe (import.meta.env.VITE_API_BASE_URL), usamos localhost por defecto.


/**
 * Función asíncrona para crear un producto en el backend.
 * Recibe los datos (productData) que cumplen con el contrato CreateProductDto.
 * Promete devolver un objeto que cumple con el contrato Product.
 */
export const createProduct = async (productData: CreateProductDto): Promise<Product> => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el producto');
    }
};
