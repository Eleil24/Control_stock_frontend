// Importamos 'useState' de React. Este hook nos permite crear variables de estado en componentes o custom hooks funcionales de React.
// El estado sirve para guardar valores que, cuando cambian, le dicen a React que vuelva a renderizar la vista.
import { useState } from 'react';

// Importamos la función que hace la llamada real a nuestra API backend para crear el movimiento de stock.
import { createStockMovement } from '../api/createStockMovement';

// Importamos el tipo (Type/Interface) que define qué datos (forma) debe tener un movimiento para ser creado.
// Esto ayuda a TypeScript a validar que no enviemos datos incorrectos.
import type { CreateStockMovementDto } from '../types';

/**
 * Custom Hook para gestionar el estado de la petición de creación de un movimiento de stock.
 * Similar a useCreateProduct, pero usando nuestro propio estado en lugar de react-query
 * para mantener consistencia con la arquitectura que estás armando (sin librerías extra complejas si no hacen falta).
 */
export const useCreateStockMovement = () => {
    // 1. isLoading: Booleano que indica si la petición al servidor está en curso (cargando).
    // Inicia en 'false' porque al cargar la página todavía no hemos enviado nada.
    const [isLoading, setIsLoading] = useState(false);

    // 2. isSuccess: Booleano que indica si la petición al servidor fue exitosa.
    // Inicia en 'false' porque todavía no hemos tenido éxito.
    const [isSuccess, setIsSuccess] = useState(false);

    // 3. error: String o Null que guarda un mensaje de error si la petición falla.
    // Inicia en 'null' porque no hay errores al principio.
    const [error, setError] = useState<string | null>(null);

    // Definimos la función 'mutate' que será la encargada de ejecutar la petición y actualizar los estados.
    // Recibe los datos del movimiento ('movementData') y unas opciones extra (como una función 'onSuccess' a ejecutar si todo va bien).
    const mutate = async (
        movementData: CreateStockMovementDto,
        options?: { onSuccess?: () => void }
    ) => {
        // Antes de enviar la petición, actualizamos los estados:
        // Decimos que está cargando (true), reiniciamos el éxito a 'false' y limpiamos errores anteriores (null).
        setIsLoading(true);
        setIsSuccess(false);
        setError(null);

        // Usamos try-catch para manejar código asíncrono que puede fallar (como una petición por red).
        try {
            // 'await' pausa la ejecución de esta función hasta que 'createStockMovement' termine de responder el backend.
            await createStockMovement(movementData);

            // Si la línea anterior no falla, llegamos aquí. Significa que fue un éxito. Guardamos el estado como true.
            setIsSuccess(true);

            // Si nos pasaron la función opcional 'onSuccess' en los parámetros, la ejecutamos ahora.
            // Ejemplo: Cerrar un modal, limpiar un formulario, o mostrar un mensaje "Toast" verde.
            if (options?.onSuccess) {
                options.onSuccess();
            }
        } catch (err: any) {
            // Si algo falla en el 'try' (ej. el backend envía error 500, o no hay internet), el código salta aquí.
            // Guardamos el mensaje de error. Si 'err.message' no existe, ponemos un mensaje por defecto.
            setError(err.message || 'Error desconocido al registrar el movimiento');
        } finally {
            // El bloque 'finally' se ejecuta SIEMPRE: ya sea que pasó por el 'try' (éxito) o por el 'catch' (error).
            // Lo usamos para decir que ya terminamos de cargar (false), independientemente del resultado.
            setIsLoading(false);
        }
    };

    // El hook retorna un objeto con la función que ejecuta la acción (mutate)
    // y los tres estados reactivos (isLoading, isSuccess, error) para que un componente pueda leerlos y mostrar la interfaz adecuada.
    return {
        mutate,
        isLoading,
        isSuccess,
        error,
    };
};
