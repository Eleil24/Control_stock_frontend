import React, { useState, useEffect } from 'react';
import { useCreateSale } from '../hooks/useCreateSale';
import { getProducts } from '../../products/api/getProducts';
import type { Product } from '../../products/types';
import './CreateSaleForm.css';
interface CartItem {
    product: Product;
    quantity: number;
}
export const CreateSaleForm: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const { mutate, isLoading, isError, error } = useCreateSale();
    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await getProducts(1, 100);
            const availableProducts = response.data.filter(p => p.stock > 0);
            setProducts(availableProducts);
        } catch (err) {
            console.error('Error fetching products for sale:', err);
        } finally {
            setIsLoadingProducts(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    alert(`No hay más stock disponible de ${product.name}`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });
    };
    const removeFromCart = (productId: string | number) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };
    const updateQuantity = (productId: string | number, newQuantity: number) => {
        if (isNaN(newQuantity) || newQuantity <= 0) return;
        const productInState = products.find(p => p.id === productId);
        if (productInState && newQuantity > productInState.stock) {
            alert(`Stock insuficiente. El máximo de ${productInState.name} es ${productInState.stock}`);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };
    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    };
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSubmit = async () => {
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        if (!customerName.trim()) {
            alert("Por favor ingresa el nombre del cliente.");
            return;
        }
        const saleData = {
            customerName: customerName,
            details: cart.map(item => ({
                productId: Number(item.product.id),
                quantity: item.quantity
            }))
        };
        try {
            await mutate(saleData);
            setCart([]);
            alert("¡Boleta generada con éxito!");
            fetchProducts();
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <div className="pos-container">
            {}
            <div className="pos-left-column">
                <div className="pos-header">
                    <h2>Catálogo de Productos</h2>
                    <input
                        type="text"
                        placeholder="Buscar producto por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pos-search-input"
                    />
                </div>
                <div className="pos-products-grid">
                    {isLoadingProducts ? (
                        <p>Cargando productos...</p>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => {
                            const cartItem = cart.find(item => item.product.id === product.id);
                            const remainingStock = product.stock - (cartItem?.quantity || 0);
                            return (
                                <div
                                    key={product.id}
                                    className={`pos-product-card ${remainingStock <= 0 ? 'out-of-stock' : ''}`}
                                    onClick={() => remainingStock > 0 && addToCart(product)}
                                    style={{ opacity: remainingStock <= 0 ? 0.5 : 1, cursor: remainingStock <= 0 ? 'not-allowed' : 'pointer' }}
                                >
                                    <h4>{product.name}</h4>
                                    <p className="pos-product-price">${Number(product.price).toFixed(2)}</p>
                                    <p className="pos-product-stock">Stock disponible: {remainingStock}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No se encontraron productos.</p>
                    )}
                </div>
            </div>
            {}
            <div className="pos-right-column">
                <div className="boleta-header">
                    <h2>Resumen de Venta / Boleta</h2>
                    <div className="form-group">
                        <label>Cliente:</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="pos-customer-input"
                            placeholder="Nombre del cliente"
                        />
                    </div>
                </div>
                <div className="boleta-items-container">
                    {cart.length === 0 ? (
                        <p className="empty-cart-message">No hay productos en la boleta.</p>
                    ) : (
                        <table className="boleta-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cant.</th>
                                    <th>Precio</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.product.id}>
                                        <td className="item-name">{item.product.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.product.stock}
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
                                        <td>${Number(item.product.price).toFixed(2)}</td>
                                        <td className="item-subtotal">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(item.product.id)}
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
                        <span>TOTAL A PAGAR:</span>
                        <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                    </div>
                    {isError && <div className="error-message">Error: {error}</div>}
                    <button
                        className={`submit-sale-btn ${cart.length === 0 ? 'disabled' : ''}`}
                        onClick={handleSubmit}
                        disabled={cart.length === 0 || isLoading}
                    >
                        {isLoading ? 'Procesando...' : 'Generar Boleta'}
                    </button>
                </div>
            </div>
        </div>
    );
};