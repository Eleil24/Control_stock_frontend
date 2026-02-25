import React from 'react';
import { CreateMovementForm } from '../components/CreateMovementForm';
import '../components/CreateMovementForm.css';

/**
 * Página/Vista que aloja el formulario de Movimientos de Stock.
 * Centra el contenido en pantalla utilizando la misma clase css de CreateProduct.
 */
export const CreateMovementPage: React.FC = () => {
    return (
        <div className="movement-page-wrapper">
            <CreateMovementForm />
        </div>
    );
};
