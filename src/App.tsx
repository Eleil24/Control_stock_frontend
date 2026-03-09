import { useState, useEffect } from 'react';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { CreateProductPage, ProductsListPage, LowStockReportsPage, MovementHistoryReportsPage, InventoryValuationReportsPage, ProductPerformanceReportsPage, NetProfitReportsPage } from './features/products';
import { CreateMovementPage } from './features/products/pages/CreateMovementPage';
import { StockMovementsListPage } from './features/products/pages/StockMovementsListPage';
import { CreateSalePage } from './features/sales/pages/CreateSalePage';
import { CreateSupplierPage } from './features/suppliers/pages/CreateSupplierPage';
import { SuppliersListPage } from './features/suppliers/pages/SuppliersListPage';
import { CreatePurchasePage } from './features/purchases/pages/CreatePurchasePage';
import { CreateUserPage } from './features/users/pages/CreateUserPage';
import { UsersListPage } from './features/users/pages/UsersListPage';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import './App.css';
const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'create' | 'movement' | 'movements-list' | 'low-stock-reports' | 'movement-history-reports' | 'inventory-valuation-reports' | 'product-performance-reports' | 'net-profit-reports' | 'sale' | 'supplier' | 'create-supplier' | 'purchase' | 'users' | 'create-user'>('dashboard');
  const { user } = useAuth();
  useEffect(() => {
    if (user?.role === 'VENDEDOR' && activeTab === 'dashboard') {
      setActiveTab('sale'); 
    }
  }, [user, activeTab]);
  return (
    <div className="app-layout">
      {}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        {}
        {}
        {activeTab === 'dashboard' && (
          <ProtectedRoute allowedRoles={['ADMIN', 'ALMACENISTA']}>
            <DashboardPage />
          </ProtectedRoute>
        )}
        {activeTab === 'list' && <ProductsListPage />}
        {activeTab === 'create' && <CreateProductPage />}
        {activeTab === 'movement' && <CreateMovementPage />}
        {activeTab === 'movements-list' && <StockMovementsListPage />}
        {}
        {['low-stock-reports', 'movement-history-reports'].includes(activeTab) && (
          <ProtectedRoute allowedRoles={['ADMIN', 'ALMACENISTA']}>
            {activeTab === 'low-stock-reports' && <LowStockReportsPage />}
            {activeTab === 'movement-history-reports' && <MovementHistoryReportsPage />}
          </ProtectedRoute>
        )}
        {}
        {['inventory-valuation-reports', 'product-performance-reports', 'net-profit-reports'].includes(activeTab) && (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            {activeTab === 'inventory-valuation-reports' && <InventoryValuationReportsPage />}
            {activeTab === 'product-performance-reports' && <ProductPerformanceReportsPage />}
            {activeTab === 'net-profit-reports' && <NetProfitReportsPage />}
          </ProtectedRoute>
        )}
        {}
        {activeTab === 'sale' && (
          <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
            <CreateSalePage />
          </ProtectedRoute>
        )}
        {}
        {activeTab === 'supplier' && <SuppliersListPage onCreateNew={() => setActiveTab('create-supplier')} />}
        {activeTab === 'create-supplier' && <CreateSupplierPage onCancel={() => setActiveTab('supplier')} />}
        {}
        {activeTab === 'purchase' && (
          <ProtectedRoute allowedRoles={['ADMIN', 'ALMACENISTA']}>
            <CreatePurchasePage />
          </ProtectedRoute>
        )}
        {}
        {activeTab === 'users' && (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersListPage onCreateNew={() => setActiveTab('create-user')} />
          </ProtectedRoute>
        )}
        {activeTab === 'create-user' && (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CreateUserPage onCancel={() => setActiveTab('users')} />
          </ProtectedRoute>
        )}
      </main>
    </div>
  );
};
function App() {
  const pathname = window.location.pathname;
  if (pathname === '/auth/login') {
    return (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
export default App