import React, { useState } from 'react';
import { useCreateProduct } from '../hooks/useCreateProduct';
import './CreateProductForm.css';

/**
 * React.FC significa "React Functional Component" (Componente Funcional de React).
 * ¿Para qué sirve?
 * 1. Le dice a TypeScript que esta función es un componente de React.
 * 2. Ayuda a dar tipado automático a los 'props' (las propiedades que le pasas al componente).
 *    Por ejemplo, si fuera export const CreateProductForm: React.FC<{ titulo: string }> = ({ titulo }) => ...
 *    TypeScript te avisaría si intentas usar <CreateProductForm /> sin pasarle la propiedad 'titulo'.
 * 3. Aunque hoy en día muchos desarrolladores simplemente escriben la función sin React.FC, 
 *    sigue siendo una buena práctica para que el código sea muy explícito.
 */
export const CreateProductForm: React.FC = () => {
    // Aquí llamamos a nuestro Custom Hook (useCreateProduct).
    // Esto es muy útil porque separamos la lógica de "cómo comunicarse con la API" 
    // de la UI (cómo se ve el formulario).
    const { mutate, isLoading, isSuccess, error } = useCreateProduct();

    // useState es un "Hook" de React. Sirve para crear variables que "reaccionan"
    // a los cambios. Si 'formData' cambia, React vuelve a dibujar (renderizar) esta parte de la pantalla.
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });

    /**
     * Esta función se ejecuta cada vez que el usuario teclea algo en un input.
     * e (evento) contiene la información de lo que pasó.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Extraemos el "name" del input (ej. "price") y el "value" (lo que escribió el usuario)
        const { name, value } = e.target;

        // Actualizamos el estado. 
        // prev => ... significa "Toma el estado anterior (prev), hazle una copia (...prev) 
        // y reemplaza la propiedad que coincida con [name] con el nuevo valor".
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Esta función se ejecuta cuando el usuario le da click a "Guardar Producto" o presiona "Enter"
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // MUY IMPORTANTE: Evita que el navegador recargue la página entera al enviar el form.

        // Llamamos a la función "mutate" de nuestro hook para enviar los datos a la API.
        // Convertimos el precio a Number() porque los inputs en HTML siempre devuelven texto (string).
        await mutate({
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
        });

        // Si la petición fue exitosa (el backend no devolvió error), reseteamos los campos dejándolos vacíos.
        if (!error) {
            setFormData({ name: '', description: '', price: '' });
        }
    };

    return (
        <div className="product-form-container">
            <div className="product-form-header">
                <h2 className="product-form-title">Crear Nuevo Producto</h2>
                <p className="product-form-subtitle">Ingresa los detalles del nuevo artículo para el inventario</p>
            </div>

            {/* onSubmit="handleSubmit": Conecta el evento nativo del navegador con nuestra función de React */}
            <form onSubmit={handleSubmit}>
                <div className="product-form-group">
                    <label htmlFor="name" className="product-form-label">Nombre del Producto</label>
                    <input
                        type="text"
                        id="name"
                        name="name"                   // Este nombre DEBE coincidir con la clave en 'formData'
                        value={formData.name}         // Conecta el input con el estado reactivo
                        onChange={handleChange}       // Escucha cualquier cambio y lo guarda en el estado
                        className="product-form-input"
                        placeholder="Ej. Altavoz Inteligente Echo"
                        required
                    />
                </div>

                <div className="product-form-group">
                    <label htmlFor="price" className="product-form-label">Precio ($)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"                  // Este nombre DEBE coincidir con la clave en 'formData'
                        value={formData.price}        // Conecta el input con el estado reactivo
                        onChange={handleChange}       // Escucha cualquier cambio y lo guarda en el estado
                        className="product-form-input"
                        placeholder="Ej. 100"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="product-form-group">
                    <label htmlFor="description" className="product-form-label">Descripción</label>
                    <textarea
                        id="description"
                        name="description"            // Este nombre DEBE coincidir con la clave en 'formData'
                        value={formData.description}  // Conecta el textarea con el estado reactivo
                        onChange={handleChange}       // Escucha cualquier cambio y lo guarda en el estado
                        className="product-form-textarea"
                        placeholder="Breve descripción del producto..."
                        required
                    />
                </div>

                {/* Si isLoading es true (está haciendo la petición al backend), deshabilitamos el botón 
                    para evitar que el usuario le de click 5 veces seguidas y cree 5 productos iguales */}
                <button
                    type="submit"
                    className="product-form-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creando...' : 'Guardar Producto'}
                </button>
            </form>

            {/* Renderizado Condicional: Lo que está a la derecha del && SOLO se muestra si 'isSuccess' es verdadero */}
            {isSuccess && (
                <div className="product-form-message success">
                    ¡Producto creado con éxito!
                </div>
            )}

            {/* Renderizado Condicional: Solo se muestra si hubo algún error en la petición */}
            {error && (
                <div className="product-form-message error">
                    {error}
                </div>
            )}
        </div>
    );
};
