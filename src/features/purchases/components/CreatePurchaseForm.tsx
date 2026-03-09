import React, { useState, useEffect } from 'react';
import { useCreatePurchase } from '../hooks/useCreatePurchase';
import { getProducts } from '../../products/api/getProducts';
import { getSuppliers } from '../../suppliers/api/getSuppliers';
import type { Product } from '../../products/types';
import type { Supplier } from '../../suppliers/types';
import './CreatePurchaseForm.css';
interface CartItem {
    product: Product;
    quantity: number;
    unitCost: number;
}
export const CreatePurchaseForm: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [supplierId, setSupplierId] = useState<number | ''>('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const { mutate, isLoading: isSubmitting, isError, error } = useCreatePurchase();
    const fetchInitialData = async () => {
        setIsLoadingInitialData(true);
        try {
            const [productsRes, suppliersRes] = await Promise.all([
                getProducts(1, 100), 
                getSuppliers(1, 100)       
            ]);
            setProducts(productsRes.data);
            setSuppliers(suppliersRes.data);
        } catch (err) {
            console.error('Error fetching initial data:', err);
            alert('Error al cargar datos del servidor.');
        } finally {
            setIsLoadingInitialData(false);
        }
    };
    useEffect(() => {
        fetchInitialData();
    }, []);
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { product, quantity: 1, unitCost: product.price }];
        });
    };
    const removeFromCart = (productId: string | number) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };
    const updateQuantity = (productId: string | number, newQuantity: number) => {
        if (isNaN(newQuantity) || newQuantity <= 0) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };
    const updateUnitCost = (productId: string | number, newCost: number) => {
        if (isNaN(newCost) || newCost < 0) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.product.id === productId
                    ? { ...item, unitCost: newCost }
                    : item
            )
        );
    };
    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (item.unitCost * item.quantity), 0);
    };
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSubmit = async () => {
        if (cart.length === 0) {
            alert("Debe agregar al menos un producto a la compra.");
            return;
        }
        if (!invoiceNumber.trim()) {
            alert("Por favor ingresa el Número de Factura (invoiceNumber).");
            return;
        }
        if (!supplierId) {
            alert("Por favor selecciona un Proveedor.");
            return;
        }
        const purchaseData = {
            invoiceNumber: invoiceNumber,
            supplierId: Number(supplierId),
            details: cart.map(item => ({
                productId: Number(item.product.id),
                quantity: item.quantity,
                unitCost: item.unitCost
            }))
        };
        try {
            await mutate(purchaseData);
            setCart([]);
            setInvoiceNumber('');
            setSupplierId('');
            alert("¡Compra ingresada con éxito! El inventario ha sido actualizado.");
            fetchInitialData();
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <div className="pos-container">
            {}
            <div className="pos-left-column">
                <div className="pos-header">
                    <h2>Catálogo para Comprar</h2>
                    <input
                        type="text"
                        placeholder="Buscar producto a comprar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pos-search-input"
                    />
                </div>
                <div className="pos-products-grid">
                    {isLoadingInitialData ? (
                        <p>Cargando catálogo...</p>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => {
                            return (
                                <div
                                    key={product.id}
                                    className="pos-product-card purchase-card"
                                    onClick={() => addToCart(product)}
                                >
                                    <h4>{product.name}</h4>
                                    <p className="pos-product-stock">Stock actual: {product.stock}</p>
                                    <span className="add-icon">➕ Añadir</span>
                                </div>
                            );
                        })
                    ) : (
                        <p>No se encontraron productos en el sistema.</p>
                    )}
                </div>
            </div>
            {}
            <div className="pos-right-column purchase-form">
                <div className="boleta-header">
                    <h2>Detalles de Ingreso (Compra)</h2>
                    <div className="form-group">
                        <label>Proveedor:</label>
                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(Number(e.target.value) || '')}
                            className="pos-customer-input"
                        >
                            <option value="">-- Seleccione un Proveedor --</option>
                            {suppliers.map(sup => (
                                <option key={sup.id} value={sup.id}>
                                    {sup.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginTop: '12px' }}>
                        <label>No. de Factura / Boleta:</label>
                        <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            className="pos-customer-input"
                            placeholder="Ej. F-889922"
                        />
                    </div>
                </div>
                <div className="boleta-items-container">
                    {cart.length === 0 ? (
                        <p className="empty-cart-message">No ha agregado productos para ingresar.</p>
                    ) : (
                        <table className="boleta-table purchase-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cant a Ingresar</th>
                                    <th>Costo Unitario</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.product.id}>
                                        <td className="item-name">{item.product.name}</td>
                                        {}
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '') {
                                                        setCart(prevCart => prevCart.map(cartItem =>
                                                            cartItem.product.id === item.product.id
                                                                ? { ...cartItem, quantity: '' as any }
                                                                : cartItem
                                                        ));
                                                    } else {
                                                        updateQuantity(item.product.id, parseInt(val, 10));
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (!e.target.value || parseInt(e.target.value, 10) <= 0) {
                                                        updateQuantity(item.product.id, 1);
                                                    }
                                                }}
                                                className="quantity-input"
                                            />
                                        </td>
                                        {}
                                        <td>
                                            <div className="cost-input-wrapper">
                                                <span className="currency-symbol">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unitCost || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === '') {
                                                            setCart(prevCart => prevCart.map(cartItem =>
                                                                cartItem.product.id === item.product.id
                                                                    ? { ...cartItem, unitCost: '' as any }
                                                                    : cartItem
                                                            ));
                                                        } else {
                                                            updateUnitCost(item.product.id, parseFloat(val));
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (!e.target.value || parseFloat(e.target.value) < 0) {
                                                            updateUnitCost(item.product.id, 0);
                                                        }
                                                    }}
                                                    className="cost-input"
                                                />
                                            </div>
                                        </td>
                                        <td className="item-subtotal">
                                            ${(item.unitCost * item.quantity).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(item.product.id)}
                                                title="Quitar"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="boleta-footer">
                    <div className="total-section">
                        <span>TOTAL COMPRA:</span>
                        <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                    </div>
                    {isError && <div className="error-message">Error: {error}</div>}
                    <button
                        className={`submit-sale-btn purchase-btn ${cart.length === 0 ? 'disabled' : ''}`}
                        onClick={handleSubmit}
                        disabled={cart.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrar Ingreso'}
                    </button>
                </div>
            </div>
        </div>
    );
};