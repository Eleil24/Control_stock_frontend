// Importamos el "tipo de dato" (interfaz) para garantizar que los datos.
// que le mandemos a la API tengan los campos correctos (productId, type, quantity).
import type { CreateStockMovementDto } from '../types';

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
    // "fetch" es una función nativa de Javascript y de los navegadores web.
    // Sirve para hacer peticiones HTTP (comunicarse con un backend/servidor de internet).
    // "await" detiene la ejecución "pausando" la función hasta que el servidor devuelva una respuesta.
    const response = await fetch('http://localhost:3000/stock', {
        // "method: 'POST'" especifica el verbo HTTP.
        // POST se usa mundialmente cuando la intención es CREAR nueva información en el servidor.
        method: 'POST',

        // Los "Headers" son etiquetas adjuntas al paquete de red que le dicen detalles al servidor.
        headers: {
            // "Content-Type" le dice al backend de NestJS: "Oye, lo que te mando en el body es un texto con formato JSON, 
            // no es un archivo de imagen, ni un PDF, ni texto plano."
            'Content-Type': 'application/json',
        },

        // "body" es el cuerpo principal del mensaje, donde viajan los datos.
        // Las peticiones de red solo entienden de TEXTO o BINARIOS, no entienden "Objetos de Javascript".
        // Por eso usamos "JSON.stringify(movementData)". Esta función convierte un objeto o arreglo
        // en una mera cadena de texto (String) respetando la sintaxis formal de JSON.
        body: JSON.stringify(movementData),
    });

    // "response.ok" es una propiedad booleana que provee "fetch".
    // Automáticamente es "true" si la petición fue exitosa (códigos de Status 200 al 299).
    // Es "false" si hubo un error del usuario (ej: código 400 por enviar algo malo) o error del servidor (código 500).
    if (!response.ok) {
        // Si no está OK, intentamos leer el mensaje de error que seguramente envió el backend.
        // Usamos response.json() para convertir de vuelta el texto de error del servidor a Javascript.
        // El .catch(() => ({})) por detrás dice: "Si por algo el backend no envió un JSON válido y truena, 
        // arréglalo pasándole un objeto vacío {} para que la app no explote más feo".
        const errorData = await response.json().catch(() => ({}));

        // Cuando usamos "throw new Error(..)", hacemos que esta operación falle a propósito en JavaScript.
        // Esto desencadenará el "catch (err)" del bloque "try - catch" en tu Custom Hook de React.
        // Si el backend envió un mensaje ("errorData.message"), usamos ese. 
        // Si no (||), mandamos un mensaje genérico nuestro.
        throw new Error(errorData.message || 'Error al intentar registrar el movimiento de stock');
    }

    // Si la lectura de "response.ok" fue positiva, significa que se guardó.
    // Volvemos a usar "response.json()" para desencriptar el texto que el backend 
    // dio de respuesta y lo guardamos en una variable para pasárselo a React.
    const data = await response.json();
    return data;
};
