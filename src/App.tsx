import { useState } from 'react';
import { CreateProductPage, ProductsListPage } from './features/products';
import { Navbar } from './components/Navbar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === 'list' && <ProductsListPage />}
        {activeTab === 'create' && <CreateProductPage />}
      </main>
    </div>
  )
}

export default App
