import React, { useState } from 'react';
import { useCreateSupplier } from '../hooks/useCreateSupplier';
import './CreateSupplierForm.css';

export const CreateSupplierForm: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const { mutate, isLoading, isError, error } = useCreateSupplier();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('El nombre del proveedor es obligatorio');
            return;
        }

        try {
            await mutate({ name, phone, email });
            alert('¡Proveedor registrado con éxito!');

            // Clean the form
            setName('');
            setPhone('');
            setEmail('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="supplier-form-container">
            <div className="supplier-form-card">
                <h2>Registrar Nuevo Proveedor</h2>
                <p className="supplier-form-subtitle">
                    Ingresa los datos del proveedor para poder registrar futuras entradas o compras de inventario.
                </p>

                {isError && (
                    <div className="supplier-error-alert">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="supplier-form">
                    <div className="form-group">
                        <label htmlFor="supplierName">Nombre / Razón Social <span className="required">*</span></label>
                        <input
                            id="supplierName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Distribuidora Tech Global"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="supplierPhone">Teléfono de Contacto</label>
                        <input
                            id="supplierPhone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej. +56912345678"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="supplierEmail">Correo Electrónico</label>
                        <input
                            id="supplierEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ej. contacto@techglobal.com"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-submit-supplier"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Proveedor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
