// Importamos useEffect para nuestra logica de redirección
import { useState, useEffect } from 'react';
import { LoginPage } from './features/auth/pages/LoginPage';

// Importamos los componentes "Página" que se van a mostrar dependiendo de qué "pestaña" (tab) esté activa.
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { CreateProductPage, ProductsListPage, LowStockReportsPage, MovementHistoryReportsPage, InventoryValuationReportsPage, ProductPerformanceReportsPage, NetProfitReportsPage } from './features/products';
import { CreateMovementPage } from './features/products/pages/CreateMovementPage';
import { StockMovementsListPage } from './features/products/pages/StockMovementsListPage';
import { CreateSalePage } from './features/sales/pages/CreateSalePage';
import { CreateSupplierPage } from './features/suppliers/pages/CreateSupplierPage';
import { CreatePurchasePage } from './features/purchases/pages/CreatePurchasePage';
import { CreateUserPage } from './features/users/pages/CreateUserPage';

// Importamos la barra de navegación superior.
import { Navbar } from './components/Navbar';

// Contexto de autenticación y rutas protegidas
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';

// Importamos los estilos globales de la aplicación.
import './App.css';

// Componente interno para poder usar el hook useAuth
const AppContent = () => {
  // Estado para controlar qué pantalla se está viendo. ¡Arrancamos en 'dashboard' por defecto!
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'create' | 'movement' | 'movements-list' | 'low-stock-reports' | 'movement-history-reports' | 'inventory-valuation-reports' | 'product-performance-reports' | 'net-profit-reports' | 'sale' | 'supplier' | 'purchase' | 'create-user'>('dashboard');
  const { user } = useAuth();

  // Efecto para redirigir a los vendedores fuera del dashboard
  useEffect(() => {
    if (user?.role === 'VENDEDOR' && activeTab === 'dashboard') {
      setActiveTab('sale'); // Redirige inmediatamente a Punto de Venta
    }
  }, [user, activeTab]);

  return (
    <div className="app-layout">
      {/* Pasamos nuestro estado (activeTab) y nuestra función de cambio (setActiveTab) como "props" a la Navbar. */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {/* Renderizado Condicional como Enrutador manual */}

        {/* Dashboard ahora protegido solo para ADMIN y ALMACENISTA */}
        {activeTab === 'dashboard' && (
          <ProtectedRoute allowedRoles={['ADMIN', 'ALMACENISTA']}>
            <DashboardPage />
          </ProtectedRoute>
        )}

        {activeTab === 'list' && <ProductsListPage />}
        {activeTab === 'create' && <CreateProductPage />}
        {activeTab === 'movement' && <CreateMovementPage />}
        {activeTab === 'movements-list' && <StockMovementsListPage />}

        {/* Rutas de Reportes Operativos (ADMIN y ALMACENISTA) */}
        {['low-stock-reports', 'movement-history-reports'].includes(activeTab) && (
          <ProtectedRoute allowedRoles={['ADMIN', 'ALMACENISTA']}>
            {activeTab === 'low-stock-reports' && <LowStockReportsPage />}
            {activeTab === 'movement-history-reports' && <MovementHistoryReportsPage />}
          </ProtectedRoute>
        )}

        {/* Rutas de Reportes Financieros (SOLO ADMIN) */}
        {['inventory-valuation-reports', 'product-performance-reports', 'net-profit-reports'].includes(activeTab) && (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            {activeTab === 'inventory-valuation-reports' && <InventoryValuationReportsPage />}
            {activeTab === 'product-performance-reports' && <ProductPerformanceReportsPage />}
            {activeTab === 'net-profit-reports' && <NetProfitReportsPage />}
          </ProtectedRoute>
        )}

        {/* Ruta Punto de Venta exclusiva para ADMIN y VENDEDOR */}
        {activeTab === 'sale' && (
          <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
            <CreateSalePage />
          </ProtectedRoute>
        )}

        {/* Ruta Proveedores */}
        {activeTab === 'supplier' && <CreateSupplierPage />}

        {/* Ruta compras exclusiva para ADMIN y ALMACENISTA */}
        {activeTab === 'purchase' && (
          <ProtectedRoute allowedRoles={['ADMIN', 'ALMACENISTA']}>
            <CreatePurchasePage />
          </ProtectedRoute>
        )}

        {/* Ruta creacion de usuarios exclusiva para ADMIN */}
        {activeTab === 'create-user' && (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CreateUserPage />
          </ProtectedRoute>
        )}
      </main>
    </div>
  );
};

// Componente principal que envuelve toda nuestra aplicación.
function App() {
  // Enrutamiento simple para la página de login
  const pathname = window.location.pathname;
  if (pathname === '/auth/login') {
    return (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  }

  // Lo que la función retorna (su return) es el código JSX (HTML mezclado con Javascript) que se dibujará en pantalla.
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}

// Exportamos el componente por defecto para que el index principal de React (main.tsx/index.tsx) pueda cargarlo.
export default App
