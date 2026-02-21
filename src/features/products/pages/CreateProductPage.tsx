import React from 'react';
import { CreateProductForm } from '../components/CreateProductForm';
import '../components/CreateProductForm.css';

/**
 * Las "Pages" o "Views" actúan como contenedores organizadores superiores.
 * Si mañana esta página necesitara mostrar una lista a la izquierda y el 
 * formulario a la derecha, armaríamos el "layout" (organigrama) aquí mismo.
 * Esta página NO debe tener lógica de creación directa, todo eso se lo delega al "Formulario".
 */
export const CreateProductPage: React.FC = () => {
    return (
        <div className="product-page-wrapper">
            {/* Solo importamos el componente visual (el formulario) y lo estampamos aquí */}
            <CreateProductForm />
        </div>
    );
};
