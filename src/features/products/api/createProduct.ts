import type { CreateProductDto, Product } from '../types';

/**
 * Este archivo pertenece a la capa "API" de nuestro Feature de Productos.
 * Su ÚNICA responsabilidad es hablar con el backend (tu servidor local o en la nube).
 * No sabe nada de React, ni de botones, ni de formularios. Solo sabe hacer peticiones HTTP.
 */

// Importamos la URL de la API desde las variables de entorno.
// Si no existe (import.meta.env.VITE_API_BASE_URL), usamos localhost por defecto.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Función asíncrona para crear un producto en el backend.
 * Recibe los datos (productData) que cumplen con el contrato CreateProductDto.
 * Promete devolver un objeto que cumple con el contrato Product.
 */
export const createProduct = async (productData: CreateProductDto): Promise<Product> => {
    // fetch() es la función nativa del navegador para hacer peticiones HTTP.
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST', // Queremos crear algo, por eso es POST
        headers: {
            'Content-Type': 'application/json', // Le decimos al backend que enviamos JSON
        },
        // Convertimos nuestro objeto de JavaScript (productData) a un texto en formato JSON
        body: JSON.stringify(productData),
    });

    // Validamos que el backend responda con un código de éxito (ej. 200, 201)
    if (!response.ok) {
        throw new Error('Error al crear el producto');
    }

    // Convertimos la respuesta (el JSON que nos devuelve tu backend) de vuelta a un objeto JS
    return response.json();
};
