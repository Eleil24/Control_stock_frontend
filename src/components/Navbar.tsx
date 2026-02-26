// useRef: Hook nativo de React que permite crear una referencia directa a un elemento HTML real en la pantalla.
// useEffect: Sirve para ejecutar efectos secundarios (como escuchar eventos de mouse de toda la página).
// useState: Sirve para crear estados cambiantes que recargan la vista.
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

type TabType = 'list' | 'create' | 'movement' | 'movements-list' | 'low-stock-reports' | 'movement-history-reports' | 'inventory-valuation-reports' | 'product-performance-reports';
type DropdownType = 'products' | 'movements' | 'reports' | null;

// Interface de TypeScript que define qué "props" (propiedades) acepta este componente Navbar al ser llamado desde App.tsx.
interface NavbarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

// Componente Navbar. Desestructuramos las props entre llaves { activeTab, onTabChange } directo en los argumentos.
export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
    // Estado para saber cuál de los menús desplegables está abierto
    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

    // useRef crea un objeto mutable { current: null }. En React, se usa junto con la propiedad "ref" en un elemento JSX 
    // para decirle "captura el nodo HTML de verdad (ej. un div o un nav) y guárdalo aquí".
    const navRef = useRef<HTMLElement>(null);

    // Función para abrir/cerrar un menú en específico.
    const toggleDropdown = (dropdown: NonNullable<DropdownType>) => {
        // En lugar de usar un valor fijo en setState, le pasamos una función flecha. 
        // Su parámetro "prev" contiene el valor actual del estado justo en ese microsegundo.
        // Forma de entenderlo corto: ¿El que quieres abrir ya estaba abierto? Sí -> ciérralo (null). No -> ábrelo (dropdown).
        setOpenDropdown(prev => prev === dropdown ? null : dropdown);
    };

    // Función que se dispara cuando el usuario hace clic en una opción final del menú.
    const handleSelect = (tab: TabType) => {
        onTabChange(tab);       // Ejecuta la función que vino desde App.tsx cambiar de pantalla.
        setOpenDropdown(null);  // Al elegir algo, cerramos automáticamente los menús desplegables (poniendo "null").
    };

    // EFECTO DE CERRAR EL MENÚ CON UN CLIC AFUERA (Close dropdown when clicking outside)
    // -------------------------
    // La coma arreglo vacio "}, []);" al final le dice a React: EJECUTA ESTO UNA ÚNICA VEZ justo cuando la barra de navegación nace en pantalla.
    useEffect(() => {
        // Creamos una función dentro que escucha el evento original de Mouse en la computadora.
        const handleClickOutside = (event: MouseEvent) => {
            // "navRef.current" representa físicamente el elemento <nav> en el HTML real.
            // ".contains" es una función nativa de Javascript (del DOM) que evalúa si el "target" (el botón o pixel donde diste click) está ADENTRO de nuestro nav.
            // Entonces, Si (nav no es nulo) Y (El click NO ocurrió dentro del nav) -> cerramos el menú.
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        // window.document.addEventListener -> Función hiper-nativa (no es de React). Le dice al sistema: 
        // "Vigila TODOS los clicks de ratón abajo (mousedown) en todo el navegador web, y avisa a handleClickOutside".
        document.addEventListener('mousedown', handleClickOutside);

        // CUIDADO (CLEANUP): Si este componente desaparece de la vista, el "vigilante" del document sigue existiendo "de fantasma" consumiendo RAM.
        // En React, lo que "devuelves" dentro de un useEffect (un return de una función), se usa para LIMPIAR LA BASURA al morir el componente.
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Despedimos al vigilante.
        };
    }, []);

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <span className="brand-logo">📦</span>
                    <span className="brand-text">ControlStock</span>
                </div>

                <nav className="navbar-nav" style={{ gap: '0.5rem' }} ref={navRef}>
                    {/* PRODUCTOS DROPDOWN */}
                    <div className="nav-item-dropdown">
                        <button
                            className={`nav-btn ${openDropdown === 'products' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('products')}
                            aria-expanded={openDropdown === 'products'}
                        >
                            Productos
                            <svg
                                className={`dropdown-icon ${openDropdown === 'products' ? 'open' : ''}`}
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
                                    <span className="icon">📋</span> Inventario
                                </button>
                                <button
                                    className={`dropdown-item ${activeTab === 'create' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('create')}
                                >
                                    <span className="icon">➕</span> Nuevo Producto
                                </button>
                            </div>
                        )}
                    </div>

                    {/* MOVIMIENTOS DROPDOWN */}
                    <div className="nav-item-dropdown">
                        <button
                            className={`nav-btn ${openDropdown === 'movements' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('movements')}
                            aria-expanded={openDropdown === 'movements'}
                        >
                            Movimientos
                            <svg
                                className={`dropdown-icon ${openDropdown === 'movements' ? 'open' : ''}`}
                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {openDropdown === 'movements' && (
                            <div className="dropdown-menu">
                                <button
                                    className={`dropdown-item ${activeTab === 'movement' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('movement')}
                                >
                                    <span className="icon">📦</span> Registrar Movimiento
                                </button>
                                <button
                                    className={`dropdown-item ${activeTab === 'movements-list' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('movements-list')}
                                >
                                    <span className="icon">📅</span> Historial Movimientos
                                </button>
                            </div>
                        )}
                    </div>

                    {/* REPORTES DROPDOWN */}
                    <div className="nav-item-dropdown">
                        <button
                            className={`nav-btn ${openDropdown === 'reports' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('reports')}
                            aria-expanded={openDropdown === 'reports'}
                        >
                            Reportes
                            <svg
                                className={`dropdown-icon ${openDropdown === 'reports' ? 'open' : ''}`}
                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {openDropdown === 'reports' && (
                            <div className="dropdown-menu">
                                <button
                                    className={`dropdown-item ${activeTab === 'low-stock-reports' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('low-stock-reports')}
                                >
                                    <span className="icon">📉</span> Bajo Stock
                                </button>
                                <button
                                    className={`dropdown-item ${activeTab === 'movement-history-reports' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('movement-history-reports')}
                                >
                                    <span className="icon">📊</span> Movimientos
                                </button>
                                <button
                                    className={`dropdown-item ${activeTab === 'inventory-valuation-reports' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('inventory-valuation-reports')}
                                >
                                    <span className="icon">💰</span> Valoración
                                </button>
                                <button
                                    className={`dropdown-item ${activeTab === 'product-performance-reports' ? 'selected' : ''}`}
                                    onClick={() => handleSelect('product-performance-reports')}
                                >
                                    <span className="icon">🚀</span> Desempeño
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};
