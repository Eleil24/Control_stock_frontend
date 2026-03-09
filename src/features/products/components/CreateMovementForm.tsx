import React, { useState, useEffect } from 'react';
import { useCreateStockMovement } from '../hooks/useCreateStockMovement';
import { getProducts } from '../api/getProducts';
import type { Product } from '../types';
import './CreateMovementForm.css';
export const CreateMovementForm: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const { mutate, isLoading, isSuccess, error } = useCreateStockMovement();
    const [formData, setFormData] = useState({
        productId: '', 
        type: '',      
        quantity: '',  
    });
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);
            } catch (err) {
                console.error('Error al cargar productos para el selector', err);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId || !formData.quantity || !formData.type) {
            return;
        }
        await mutate({
            productId: Number(formData.productId),
            type: formData.type,
            quantity: Number(formData.quantity),
        }, {
            onSuccess: async () => {
                setIsLoadingProducts(true);
                try {
                    const response = await getProducts();
                    setProducts(response.data);
                } catch (err) {
                    console.error('Error al recargar productos', err);
                } finally {
                    setIsLoadingProducts(false);
                }
                setFormData({
                    productId: '',
                    type: '',
                    quantity: '',
                });
            }
        });
    };
    return (
        <div className="movement-form-container">
            <div className="movement-form-header">
                <h2 className="movement-form-title">Registro de Stock</h2>
                <p className="movement-form-subtitle">Selecciona un producto existente para registrar una entrada o salida.</p>
            </div>
            {}
            <form onSubmit={handleSubmit}>
                <div className="movement-form-group">
                    <label htmlFor="productId" className="movement-form-label">Producto</label>
                    <div className="select-wrapper">
                        {}
                        <select
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className="movement-form-select"
                            required 
                            disabled={isLoadingProducts} 
                        >
                            {}
                            <option value="" disabled>
                                {isLoadingProducts ? 'Cargando productos...' : '-- Seleccione un producto --'}
                            </option>
                            {}
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
                            name="type" 
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
                        type="number" 
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="movement-form-input"
                        placeholder="Ej. 10"
                        min="1" 
                        step="1" 
                        required 
                    />
                    <small className="help-text">Ingresa valores positivos (la cantidad total entrará/saldrá según el tipo).</small>
                </div>
                {}
                <button
                    type="submit"
                    className="movement-form-button"
                    disabled={isLoading || isLoadingProducts}
                >
                    {}
                    {isLoading ? 'Guardando...' : 'Registrar Movimiento'}
                </button>
            </form>
            {}
            {isSuccess && (
                <div className="movement-form-message success">
                    ¡Movimiento registrado con éxito!
                </div>
            )}
            {}
            {error && (
                <div className="movement-form-message error">
                    {error}
                </div>
            )}
        </div>
    );
};