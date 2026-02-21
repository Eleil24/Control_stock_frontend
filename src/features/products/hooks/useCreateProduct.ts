import { useState } from 'react';
import { createProduct } from '../api/createProduct';
import type { CreateProductDto, Product } from '../types';

/**
 * Este archivo es un "Custom Hook" (Gancho Personalizado) de React.
 * Sirve como un PUENTE entre los componentes visuales (como el Formulario) y la API.
 * Su trabajo es manejar todo el "estado" relacionado con la petición (si está cargando, si dio error).
 */

// Definimos qué va a devolver nuestro hook para que TypeScript nos ayude a no equivocarnos al usarlo.
interface UseCreateProductReturn {
    mutate: (data: CreateProductDto) => Promise<Product | undefined>;
    isLoading: boolean; // ¿Está cargando?
    error: string | null;  // ¿Hubo algún error?
    isSuccess: boolean; // ¿Terminó correctamente?
}

export const useCreateProduct = (): UseCreateProductReturn => {
    // Creamos tres variables de estado locales para rastrear qué está pasando con la petición HTTP
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Esta es la función principal que el formulario va a llamar cuando el usuario haga click en Guardar.
    const mutate = async (data: CreateProductDto) => {
        // 1. Reseteamos los estados y avisamos que empezamos a cargar
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            // 2. Intentamos hacer la petición real a la API (Llamamos a la función de la capa API)
            const newProduct = await createProduct(data);

            // 3. Si todo sale bien, actualizamos el estado confirmando el éxito.
            setIsSuccess(true);
            return newProduct;
        } catch (err: any) {
            // 4. Si falla (por ejemplo tu backend devuelve error 500 o no hay internet), guardamos el error
            setError(err.message || 'Ha ocurrido un error inesperado');
        } finally {
            // 5. Pase lo que pase (éxito o error), le avisamos a la UI que ya no estamos cargando
            setIsLoading(false);
        }
    };

    // Al final, el hook devuelve estas tres variables y la función para que el componente "Formulario" las use
    return { mutate, isLoading, error, isSuccess };
};
