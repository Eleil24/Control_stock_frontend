import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
    activeTab: 'list' | 'create';
    onTabChange: (tab: 'list' | 'create') => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleSelect = (tab: 'list' | 'create') => {
        onTabChange(tab);
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
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
                    <span className="brand-logo">📦</span>
                    <span className="brand-text">ControlStock</span>
                </div>

                <nav className="navbar-nav">
                    <div className="nav-item-dropdown" ref={dropdownRef}>
                        <button
                            className={`nav-btn ${isDropdownOpen ? 'active' : ''}`}
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                        >
                            Productos
                            <svg
                                className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
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
                </nav>
            </div>
        </header>
    );
};
