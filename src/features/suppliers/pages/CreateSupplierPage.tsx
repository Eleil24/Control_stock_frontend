import React from 'react';
import { CreateSupplierForm } from '../components/CreateSupplierForm';
interface CreateSupplierPageProps {
    onCancel?: () => void;
}
export const CreateSupplierPage: React.FC<CreateSupplierPageProps> = ({ onCancel }) => {
    return (
        <div>
            <CreateSupplierForm onCancel={onCancel} />
        </div>
    );
};