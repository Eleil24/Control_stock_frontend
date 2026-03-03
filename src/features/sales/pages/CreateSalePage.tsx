import React from 'react';
import { CreateSaleForm } from '../components/CreateSaleForm';

export const CreateSalePage: React.FC = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">Punto de Venta</h1>
            <p className="page-description">Busca productos y genera una nueva boleta de venta.</p>
            <CreateSaleForm />
        </div>
    );
};
