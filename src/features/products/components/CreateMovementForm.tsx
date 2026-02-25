// Importamos React y sus hooks nativos:
// - useState: Nos permite crear variables (estado) que cuando cambian, le avisan a React que debe redibujar (re-renderizar) la pantalla.
// - useEffect: Sirve para ejecutar código en momentos específicos (ej. justo cuando la pantalla termina de cargar por primera vez).
import React, { useState, useEffect } from 'react';

// Importamos nuestro custom hook que maneja la lógica de enviar los datos del movimiento al backend.
import { useCreateStockMovement } from '../hooks/useCreateStockMovement';

// Importamos la función que hace la petición GET al backend para traer la lista de productos disponibles.
import { getProducts } from '../api/getProducts';

// Importamos el tipo de dato Product para que TypeScript nos ayude a no cometer errores.
import type { Product } from '../types';

// Importamos los estilos CSS específicos para este formulario.
import './CreateMovementForm.css';

// Declaramos nuestro componente funcional (React.FC significa Functional Component).
export const CreateMovementForm: React.FC = () => {
    // ESTADOS PARA LOS PRODUCTOS
    // -------------------------
    // products: Arreglo donde guardaremos la lista de productos que nos responde el servidor. Inicia vacío ([]).
    // setProducts: Función que usamos para actualizar esa lista.
    const [products, setProducts] = useState<Product[]>([]);

    // isLoadingProducts: Un booleano para saber si estamos esperando la respuesta del servidor con los productos.
    // Inicia en 'true' porque apenas el componente carga, ya sabemos que tiene que ir a buscar los datos.
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // HOOK DE MUTACIÓN
    // -------------------------
    // Extraemos las funciones y variables de nuestro custom hook.
    // mutate: La función a la que le pasaremos los datos formados para enviarlos al backend.
    // isLoading: Si el envío del movimiento está en curso.
    // isSuccess: Si se guardó todo bien.
    // error: Si hubo un fallo en el guardado.
    const { mutate, isLoading, isSuccess, error } = useCreateStockMovement();

    // ESTADO DEL FORMULARIO
    // -------------------------
    // formData: Es un objeto que guarda lo que el usuario escribe/selecciona en tiempo real.
    // setFormData: Usado para actualizar formData letra por letra o click por click.
    const [formData, setFormData] = useState({
        productId: '', // El ID del producto seleccionado en el <select>
        type: '',      // El tipo de movimiento (IN, OUT, ADJUSTMENT)
        quantity: '',  // La cantidad que se va a afectar (inicia como texto para que el input numérico funcione bien al inicio)
    });

    // EFFECT PARA CARGAR DATOS INICIALES
    // -------------------------
    // useEffect recibe dos cosas:
    // 1. Una función (lo que va a ejecutar).
    // 2. Un arreglo de dependencias (cuándo lo va a ejecutar).
    // Como el arreglo está vacío '[]', le estamos diciendo a React: "Ejecuta esto SOLO UNA VEZ cuando el componente aparezca en pantalla".
    useEffect(() => {
        // Creamos una función asíncrona por separado, ya que el primer parámetro de useEffect no puede ser async directamente.
        const fetchProducts = async () => {
            try {
                // await pausa esta línea hasta que 'getProducts' (petición a backend) nos devuelva los datos.
                const response = await getProducts();
                // Si hay éxito, guardamos los datos en nuestro estado 'products'.
                setProducts(response.data);
            } catch (err) {
                // Si la petición falla (ej. sin internet), imprimimos un error en la consola del navegador.
                console.error('Error al cargar productos para el selector', err);
            } finally {
                // Sin importar si hubo error o éxito, apagamos el indicador de carga.
                // Así el <select> de HTML deja de decir "Cargando...".
                setIsLoadingProducts(false);
            }
        };

        // Inmediatamente después de crear la función, la llamamos para que se ejecute.
        fetchProducts();
    }, []);

    // MANEJADOR DE CAMBIOS EN LOS INPUTS
    // -------------------------
    // Esta función se ejecuta CADA VEZ que el usuario pulsa una tecla en el input numérico o cambia una opción del <select>.
    // Recibe 'e' (el evento nativo de HTML que contiene qué elemento causó el cambio y su nuevo valor).
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Obtenemos 'name' (nombre del input, ej. "quantity") y 'value' (el valor escrito) desde 'e.target'.
        const { name, value } = e.target;

        // setFormData usando una función de "estado previo (prev)":
        // Agarramos el objeto anterior (...prev) copiando todo lo que tenía,
        // Y solo reemplazamos el campo dinámico [name] con el nuevo 'value'.
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // MANEJADOR DEL ENVÍO DEL FORMULARIO
    // -------------------------
    // Esta función se ejecuta cuando el usuario hace click en el botón "Registrar Movimiento" (type="submit").
    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault() es nativo de los navegadores web.
        // Sirve para EVITAR que la página entera se recargue al enviar el formulario (comportamiento por defecto del HTML antiguo).
        e.preventDefault();

        // Validación básica: Si falta algún dato, detenemos el proceso con 'return'.
        if (!formData.productId || !formData.quantity || !formData.type) {
            return;
        }

        // Llamamos a la función 'mutate' (que viene de useCreateStockMovement) y le pasamos el objeto listo para el backend.
        await mutate({
            // Convertimos productId y quantity de "texto" (como los trata HTML) a "Mero Número" (Number) que exige TypeScript/Backend.
            productId: Number(formData.productId),
            type: formData.type,
            quantity: Number(formData.quantity),
        }, {
            // onSuccess se dispara sólo si la petición anterior no lanzó errores.
            onSuccess: async () => {
                // Como las cantidades cambiaron en la base de datos, volvemos a descargar los productos 
                // para que el <select> muestre el stock actualizado de inmediato.
                setIsLoadingProducts(true);
                try {
                    const response = await getProducts();
                    setProducts(response.data);
                } catch (err) {
                    console.error('Error al recargar productos', err);
                } finally {
                    setIsLoadingProducts(false);
                }

                // Finalmente, limpiamos las cajas de texto y el select para que el usuario pueda registrar otra cosa si quiere.
                setFormData({
                    productId: '',
                    type: '',
                    quantity: '',
                });
            }
        });
    };

    // EL RENDER (Lo que ve el usuario)
    // -------------------------
    return (
        <div className="movement-form-container">
            <div className="movement-form-header">
                <h2 className="movement-form-title">Registro de Stock</h2>
                <p className="movement-form-subtitle">Selecciona un producto existente para registrar una entrada o salida.</p>
            </div>

            {/* onSubmit={handleSubmit} conecta el evento "Enviar" con nuestra función de Javascript. */}
            <form onSubmit={handleSubmit}>
                <div className="movement-form-group">
                    <label htmlFor="productId" className="movement-form-label">Producto</label>
                    <div className="select-wrapper">
                        {/* El value={formData.productId} + onChange={handleChange} es lo que hace a este <select> un "Componente Controlado por React". Lo que se muestra está atado a nuestra variable de estado. */}
                        <select
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className="movement-form-select"
                            required // Nativo HTML: no deja enviar form si está vacío
                            disabled={isLoadingProducts} // Si isLoadingProducts es true, el select no se puede clickear
                        >
                            {/* Opción deshabilitada por defecto. Sirve como "Placeholder" (Texto de ayuda) */}
                            <option value="" disabled>
                                {isLoadingProducts ? 'Cargando productos...' : '-- Seleccione un producto --'}
                            </option>

                            {/* products.map: Recorre nuestro arreglo de productos y por cada uno genera una etiqueta HTML <option>. Se necesita la prop especial 'key' para que React diferencie a cada uno. */}
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} (Stock actual: {product.stock})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="movement-form-group">
                    <label htmlFor="type" className="movement-form-label">Tipo de Movimiento</label>
                    <div className="select-wrapper">
                        <select
                            id="type"
                            name="type" // El 'name' debe coincidir exactamente con la clave de formData.
                            value={formData.type}
                            onChange={handleChange}
                            className="movement-form-select"
                            required
                        >
                            <option value="" disabled>-- Seleccione el tipo --</option>
                            <option value="ADJUSTMENT">Ajuste de Inventario</option>
                            <option value="IN">Entrada (Compra/Proveedor)</option>
                            <option value="OUT">Salida (Venta/Merma)</option>
                        </select>
                    </div>
                </div>

                <div className="movement-form-group">
                    <label htmlFor="quantity" className="movement-form-label">Cantidad Afectada</label>
                    <input
                        type="number" // Nativo HTML: abre el teclado numérico en móviles y frena que tipeen letras.
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="movement-form-input"
                        placeholder="Ej. 10"
                        min="1" // Nativo HTML: No permite meter números negativos
                        step="1" // Nativo HTML: Permite avance de a números enteros
                        required // Nativo HTML: Obligatorio
                    />
                    <small className="help-text">Ingresa valores positivos (la cantidad total entrará/saldrá según el tipo).</small>
                </div>

                {/* Si la carga de productos o el envío están en curso, el botón se deshabilita para evitar doble click. */}
                <button
                    type="submit"
                    className="movement-form-button"
                    disabled={isLoading || isLoadingProducts}
                >
                    {/* Operador Ternario (? :): Si isLoading es VERO, dice "Guardando...", de lo contrario "Registrar Movimiento" */}
                    {isLoading ? 'Guardando...' : 'Registrar Movimiento'}
                </button>
            </form>

            {/* Renderizado Condicional: Si isSuccess es VERO (&&), renderiza el div verde de la derecha. */}
            {isSuccess && (
                <div className="movement-form-message success">
                    ¡Movimiento registrado con éxito!
                </div>
            )}

            {/* Renderizado Condicional: Si error es algo (distinto de null), renderiza el div rojo de error. */}
            {error && (
                <div className="movement-form-message error">
                    {error}
                </div>
            )}
        </div>
    );
};

