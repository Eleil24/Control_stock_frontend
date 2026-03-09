import { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard,
    ShoppingCart,
    PackagePlus,
    Box,
    Building2,
    PlusCircle,
    Wrench,
    TrendingDown,
    History,
    CircleDollarSign,
    TrendingUp,
    Wallet,
    LogOut,
    Users,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';
import './Navbar.css';
export type TabType =
    | 'dashboard'
    | 'list'
    | 'create'
    | 'movement'
    | 'movements-list'
    | 'low-stock-reports'
    | 'movement-history-reports'
    | 'inventory-valuation-reports'
    | 'product-performance-reports'
    | 'net-profit-reports'
    | 'sale'
    | 'supplier'
    | 'create-supplier'
    | 'purchase'
    | 'users'
    | 'create-user';
type DropdownType = 'products' | 'movements' | 'reports' | 'sales' | null;
interface NavbarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}
export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logoutState } = useAuth(); 
    const navRef = useRef<HTMLElement>(null);
    const toggleDropdown = (dropdown: NonNullable<DropdownType>) => {
        setOpenDropdown(prev => prev === dropdown ? null : dropdown);
    };
    const handleSelect = (tab: TabType) => {
        onTabChange(tab);       
        setOpenDropdown(null);  
        setIsMobileMenuOpen(false); 
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
                setIsMobileMenuOpen(false); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, []);
    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Box className="brand-logo" size={24} style={{ color: 'white', marginRight: '6px' }} />
                    <span className="brand-text">ControlStock</span>
                </div>
                {}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Navigation"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {}
                <nav className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} ref={navRef}>
                    {}
                    {user?.role !== 'VENDEDOR' && (
                        <button
                            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''} `}
                            onClick={() => handleSelect('dashboard')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <LayoutDashboard size={16} />
                            Vista Global
                        </button>
                    )}
                    {}
                    {user?.role !== 'ALMACENISTA' && (
                        <button
                            className={`nav-btn ${activeTab === 'sale' ? 'active' : ''} `}
                            onClick={() => handleSelect('sale')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <ShoppingCart size={16} />
                            Punto de Venta
                        </button>
                    )}
                    {}
                    {user?.role !== 'VENDEDOR' && (
                        <button
                            className={`nav-btn ${activeTab === 'purchase' ? 'active' : ''} `}
                            onClick={() => handleSelect('purchase')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <PackagePlus size={16} />
                            Ingresar Compras
                        </button>
                    )}
                    {}
                    <div className="nav-item-dropdown">
                        <button
                            className={`nav-btn ${openDropdown === 'products' ? 'active' : ''} `}
                            onClick={() => toggleDropdown('products')}
                            aria-expanded={openDropdown === 'products'}
                        >
                            <Box size={16} style={{ marginRight: '0.4rem' }} />
                            Productos
                            <svg
                                className={`dropdown-icon ${openDropdown === 'products' ? 'open' : ''} `}
                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        {openDropdown === 'products' && (
                            <div className="dropdown-menu">
                                <button
                                    className={`dropdown-item ${activeTab === 'list' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('list')}
                                >
                                    <span className="icon"><Box size={16} /></span> Inventario
                                </button>
                                {}
                                {user?.role !== 'VENDEDOR' && (
                                    <>
                                        <button
                                            className={`dropdown-item ${activeTab === 'supplier' ? 'selected' : ''} `}
                                            onClick={() => handleSelect('supplier')}
                                        >
                                            <span className="icon"><Building2 size={16} /></span> Proveedores
                                        </button>
                                        <button
                                            className={`dropdown-item ${activeTab === 'create' ? 'selected' : ''} `}
                                            onClick={() => handleSelect('create')}
                                        >
                                            <span className="icon"><PlusCircle size={16} /></span> Nuevo Producto
                                        </button>
                                        <button
                                            className={`dropdown-item ${activeTab === 'movement' ? 'selected' : ''} `}
                                            onClick={() => handleSelect('movement')}
                                        >
                                            <span className="icon"><Wrench size={16} /></span> Ajuste Rápido (Merma)
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {}
                    {user?.role !== 'VENDEDOR' && (
                        <div className="nav-item-dropdown">
                            <button
                                className={`nav-btn ${openDropdown === 'reports' ? 'active' : ''} `}
                                onClick={() => toggleDropdown('reports')}
                                aria-expanded={openDropdown === 'reports'}
                            >
                                <History size={16} style={{ marginRight: '0.4rem' }} />
                                Reportes
                                <svg
                                    className={`dropdown-icon ${openDropdown === 'reports' ? 'open' : ''} `}
                                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                            {openDropdown === 'reports' && (
                                <div className="dropdown-menu">
                                    <button
                                        className={`dropdown-item ${activeTab === 'low-stock-reports' ? 'selected' : ''} `}
                                        onClick={() => handleSelect('low-stock-reports')}
                                    >
                                        <span className="icon"><TrendingDown size={16} /></span> Bajo Stock
                                    </button>
                                    <button
                                        className={`dropdown-item ${activeTab === 'movement-history-reports' ? 'selected' : ''} `}
                                        onClick={() => handleSelect('movement-history-reports')}
                                    >
                                        <span className="icon"><History size={16} /></span> Movimientos
                                    </button>
                                    {}
                                    {user?.role === 'ADMIN' && (
                                        <>
                                            <button
                                                className={`dropdown-item ${activeTab === 'inventory-valuation-reports' ? 'selected' : ''} `}
                                                onClick={() => handleSelect('inventory-valuation-reports')}
                                            >
                                                <span className="icon"><CircleDollarSign size={16} /></span> Valoración
                                            </button>
                                            <button
                                                className={`dropdown-item ${activeTab === 'product-performance-reports' ? 'selected' : ''} `}
                                                onClick={() => handleSelect('product-performance-reports')}
                                            >
                                                <span className="icon"><TrendingUp size={16} /></span> Desempeño
                                            </button>
                                            <button
                                                className={`dropdown-item ${activeTab === 'net-profit-reports' ? 'selected' : ''} `}
                                                onClick={() => handleSelect('net-profit-reports')}
                                            >
                                                <span className="icon"><Wallet size={16} /></span> Ganancia Neta
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {}
                    {user?.role === 'ADMIN' && (
                        <button
                            className={`nav-btn ${activeTab === 'users' ? 'active' : ''} `}
                            onClick={() => handleSelect('users')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <Users size={16} />
                            Usuarios
                        </button>
                    )}
                    {}
                    <div style={{ flexGrow: 1 }} /> {}
                    <button
                        className="nav-btn"
                        onClick={logoutState}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fca5a5' }}
                        title="Cerrar Sesión"
                    >
                        <LogOut size={16} />
                        {user?.name}
                    </button>
                </nav>
            </div>
        </header>
    );
};