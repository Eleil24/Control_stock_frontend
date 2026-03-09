import React from 'react';
import { CreateProductForm } from '../components/CreateProductForm';
import '../components/CreateProductForm.css';
export const CreateProductPage: React.FC = () => {
    return (
        <div className="product-page-wrapper">
            {}
            <CreateProductForm />
        </div>
    );
};