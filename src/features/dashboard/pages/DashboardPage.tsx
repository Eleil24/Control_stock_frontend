import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    Box,
    CircleDollarSign,
    TriangleAlert,
    ArrowRightLeft
} from 'lucide-react';
import { getProducts } from '../../products/api/getProducts';
import { getInventoryValuationReports } from '../../products/api/getInventoryValuationReports';
import { getLowStockReports } from '../../products/api/getLowStockReports';
import { getDailyMovementsReport } from '../../products/api/getDailyMovementsReport';
import { getProductPerformanceReports } from '../../products/api/getProductPerformanceReports';
import './DashboardPage.css';
import { useAuth } from '../../auth/context/AuthContext';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
export const DashboardPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true); 
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [totalValuation, setTotalValuation] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [movementsToday, setMovementsToday] = useState(0);
    const [topPerformingProducts, setTopPerformingProducts] = useState<any[]>([]);
    const { user } = useAuth();
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true); 
            try {
                const [
                    productsResponse,
                    lowStockResponse,
                    dailyMovementsResponse
                ] = await Promise.all([
                    getProducts(1, 1),
                    getLowStockReports(1, 1, 10),
                    getDailyMovementsReport()
                ]);
                setTotalProductsCount(productsResponse.meta.total);
                setLowStockCount(lowStockResponse.meta.total);
                setMovementsToday(dailyMovementsResponse.total);
                if (user?.role === 'ADMIN') {
                    const [
                        valuationResponse,
                        performanceResponse
                    ] = await Promise.all([
                        getInventoryValuationReports(1, 1000),
                        getProductPerformanceReports(1, 5)
                    ]);
                    const sumValuation = valuationResponse.data.reduce((acc: number, curr: any) => acc + (curr.valuation || 0), 0);
                    setTotalValuation(sumValuation);
                    const chartData = performanceResponse.data.map((item: any) => ({
                        name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
                        full_name: item.name,
                        Ingresos: item.estimatedRevenue
                    }));
                    setTopPerformingProducts(chartData);
                }
            } catch (error) {
                console.error("Error gigante cargando el dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []); 
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }
    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-border"></div>
                <p>Cargando métricas de tu negocio...</p>
            </div>
        );
    }
    return (
        <div className="dashboard-page-wrapper">
            <div className="dashboard-header text-center">
                <h1 className="dashboard-title">Visión General del Negocio</h1>
                <p className="dashboard-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    Resumen en vivo de tu Inversión e Inventario <Box size={18} />
                </p>
            </div>
            {}
            <div className="kpi-grid">
                {}
                {user?.role === 'ADMIN' && (
                    <div className="kpi-card card-primary">
                        <div className="kpi-icon"><CircleDollarSign size={28} /></div>
                        <div className="kpi-content">
                            <p className="kpi-label">Valor en Inventario</p>
                            <h2 className="kpi-value">{formatCurrency(totalValuation)}</h2>
                        </div>
                    </div>
                )}
                {}
                <div className="kpi-card card-secondary">
                    <div className="kpi-icon"><Box size={28} /></div>
                    <div className="kpi-content">
                        <p className="kpi-label">Productos Registrados</p>
                        {}
                        <h2 className="kpi-value">{totalProductsCount}</h2>
                    </div>
                </div>
                {}
                <div className="kpi-card card-warning">
                    <div className="kpi-icon"><TriangleAlert size={28} /></div>
                    <div className="kpi-content">
                        <p className="kpi-label">Productos casi sin stock</p>
                        <h2 className="kpi-value">{lowStockCount}</h2>
                    </div>
                </div>
                {}
                <div className="kpi-card card-info">
                    <div className="kpi-icon"><ArrowRightLeft size={28} /></div>
                    <div className="kpi-content">
                        <p className="kpi-label">Movimientos Hoy</p>
                        <h2 className="kpi-value">{movementsToday}</h2>
                    </div>
                </div>
            </div>
            {}
            {user?.role === 'ADMIN' && (
                <div className="charts-grid mt-4">
                    {}
                    <div className="chart-card">
                        <h3 className="chart-title">Desempeño Económico Estimado (Top 5)</h3>
                        <p className="chart-subtitle">Productos que más ingresos generan basado en stock y ventas.</p>
                        <div className="chart-container">
                            {}
                            <ResponsiveContainer width="100%" height={300}>
                                {}
                                <BarChart data={topPerformingProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    {}
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    {}
                                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    {}
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Ingresos Estimados']}
                                    />
                                    {}
                                    <Bar dataKey="Ingresos" radius={[6, 6, 0, 0]}>
                                        {}
                                        {topPerformingProducts.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};