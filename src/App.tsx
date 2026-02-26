// useState: Hook nativo de React que permite a un componente tener memoria.
// Al cambiar el valor de este estado, React automáticamente recarga la parte visual (renderiza) para mostrar los cambios.
import { useState } from 'react';

// Importamos los componentes "Página" que se van a mostrar dependiendo de qué "pestaña" (tab) esté activa.
import { CreateProductPage, ProductsListPage, LowStockReportsPage, MovementHistoryReportsPage, InventoryValuationReportsPage, ProductPerformanceReportsPage } from './features/products';
import { CreateMovementPage } from './features/products/pages/CreateMovementPage';
import { StockMovementsListPage } from './features/products/pages/StockMovementsListPage';

// Importamos la barra de navegación superior.
import { Navbar } from './components/Navbar';

// Importamos los estilos globales de la aplicación.
import './App.css';

// Componente principal que envuelve toda nuestra aplicación.
function App() {
  // Estado para controlar qué pantalla se está viendo.
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'movement' | 'movements-list' | 'low-stock-reports' | 'movement-history-reports' | 'inventory-valuation-reports' | 'product-performance-reports'>('list');

  // Lo que la función retorna (su return) es el código JSX (HTML mezclado con Javascript) que se dibujará en pantalla.
  return (
    <div className="app-layout">
      {/* Pasamos nuestro estado (activeTab) y nuestra función de cambio (setActiveTab) como "props" a la Navbar. */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {/* Renderizado Condicional como Enrutador manual */}
        {activeTab === 'list' && <ProductsListPage />}
        {activeTab === 'create' && <CreateProductPage />}
        {activeTab === 'movement' && <CreateMovementPage />}
        {activeTab === 'movements-list' && <StockMovementsListPage />}
        {activeTab === 'low-stock-reports' && <LowStockReportsPage />}
        {activeTab === 'movement-history-reports' && <MovementHistoryReportsPage />}
        {activeTab === 'inventory-valuation-reports' && <InventoryValuationReportsPage />}
        {activeTab === 'product-performance-reports' && <ProductPerformanceReportsPage />}
      </main>
    </div>
  )
}

// Exportamos el componente por defecto para que el index principal de React (main.tsx/index.tsx) pueda cargarlo.
export default App
