import React from 'react';
import { CreateMovementForm } from '../components/CreateMovementForm';
import '../components/CreateMovementForm.css';
export const CreateMovementPage: React.FC = () => {
    return (
        <div className="movement-page-wrapper">
            <CreateMovementForm />
        </div>
    );
};