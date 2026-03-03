// Importamos el "tipo de dato" (interfaz) para garantizar que los datos.
// que le mandemos a la API tengan los campos correctos (productId, type, quantity).
import type { CreateStockMovementDto } from '../types';
import { api } from '../../../lib/axios';

/**
 * Función encargada de enviar la creación de un nuevo movimiento de stock (Entrada/Salida) al backend.
 * Recibe los datos validados del formulario.
 * 
 * La palabra clave "async" indica que esta función trabaja de manera asíncrona,
 * es decir, puede tomar cierto tiempo (por la conexión de red) y no paraliza el resto del programa.
 * 
 * "Promise<any>" es la forma de decirle a TypeScript: "Esta función de entrada promete
 * devolver algo en el futuro, pero ahorita no sé qué exactamente (any)".
 */
export const createStockMovement = async (movementData: CreateStockMovementDto): Promise<any> => {
    try {
        const response = await api.post('/stock', movementData);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Error al intentar registrar el movimiento de stock';
        throw new Error(message);
    }
};
