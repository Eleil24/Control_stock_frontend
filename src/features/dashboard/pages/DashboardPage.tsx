import React, { useState, useEffect } from 'react';

// Importamos Recharts: Una librería profesional para crear gráficos en React basada en D3.js
// ResponsiveContainer: Hace que el gráfico se adapte al tamaño de tu pantalla / celular.
// BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid: Son los bloques de construcción de un gráfico de barras.
// Cell: Nos ayuda a darle un color distinto a cada barra individualmente.
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

// Importamos todos los servicios de la API que hemos construido para reciclar su lógica
// y usarla en este Dashboard principal. ¡Nota los '../' para subir dos niveles hacia 'api'!
import { getProducts } from '../../products/api/getProducts';
import { getInventoryValuationReports } from '../../products/api/getInventoryValuationReports';
import { getLowStockReports } from '../../products/api/getLowStockReports';
import { getDailyMovementsReport } from '../../products/api/getDailyMovementsReport';
import { getProductPerformanceReports } from '../../products/api/getProductPerformanceReports';

// Importamos estilos dedicados a esta vista
import './DashboardPage.css';

import { useAuth } from '../../auth/context/AuthContext';

// Colores que usaremos para pintar las barras de nuestro gráfico (un gradiente profesional)
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DashboardPage: React.FC = () => {
    // -------------------------------------------------------------------------------- //
    // 1. ESTADOS (STATES) DE LA APLICACIÓN                                             //
    //    Estos estados guardan la información que va a dibujar la interfaz web.        //
    // -------------------------------------------------------------------------------- //

    const [isLoading, setIsLoading] = useState(true); // Controla si mostramos un texto de "Cargando..."

    // Estados para las "Tarjetas de KPI" (Los cuadros grandes con números)
    // Inicializamos con 0 para que no se vea feo mientras carga.
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [totalValuation, setTotalValuation] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [movementsToday, setMovementsToday] = useState(0);

    // Estado para nuestro gráfico principal de "Top 5 Productos que más dinero generan"
    const [topPerformingProducts, setTopPerformingProducts] = useState<any[]>([]);

    // -------------------------------------------------------------------------------- //
    // 2. EFECTOS SECUNDARIOS (useEffect)                                               //
    //    Se disparan automáticamente cuando el usuario entra a la pantalla "Dashboard" //
    // -------------------------------------------------------------------------------- //
    // Añadimos useAuth para verificar si es ADMIN
    const { user } = useAuth();

    useEffect(() => {
        // Función asíncrona porque vamos a pedir cosas al backend e internet tarda.
        const fetchDashboardData = async () => {
            setIsLoading(true); // Bloqueamos la vista, mostramos loader

            try {
                // EXPLICACIÓN PRO: Usamos Promise.all() para ejecutar TODAS las peticiones al backend 
                // AL MISMO TIEMPO y no una por una. Esto hace que tu sistema cargue 5 veces más rápido.
                // Peticiones operativas que pueden ver tanto ADMIN como ALMACENISTA
                const [
                    productsResponse,
                    lowStockResponse,
                    dailyMovementsResponse
                ] = await Promise.all([
                    getProducts(1, 1),
                    getLowStockReports(1, 1, 10),
                    getDailyMovementsReport()
                ]);

                // --- LLENANDO LOS DATOS OPERATIVOS ---
                setTotalProductsCount(productsResponse.meta.total);
                setLowStockCount(lowStockResponse.meta.total);
                setMovementsToday(dailyMovementsResponse.total);

                // --- PETICIONES FINANCIERAS (SOLO ADMIN) ---
                if (user?.role === 'ADMIN') {
                    const [
                        valuationResponse,
                        performanceResponse
                    ] = await Promise.all([
                        getInventoryValuationReports(1, 1000),
                        getProductPerformanceReports(1, 5)
                    ]);

                    // Valoración Total
                    const sumValuation = valuationResponse.data.reduce((acc: number, curr: any) => acc + (curr.valuation || 0), 0);
                    setTotalValuation(sumValuation);

                    // Formateamos los datos del gráfico
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
                // Pase lo que pase, apagamos el texto de cargando al final.
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // <-- Ese arreglo vacío le dice "Hazlo sólo UNA vez cuando yo abro esta página"

    // -------------------------------------------------------------------------------- //
    // 3. FORMATEADORES VISUALES COMPARTIDOS                                            //
    // -------------------------------------------------------------------------------- //
    // Función nativa para pintar dinero en Pesos. "$ 15.000"
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // --- PANTALLA DE CARGA PREVIA --- //
    // Si isLoading es verdadero (true), la app no dibuja toda la página abajo. Dibuja esto nada más.
    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-border"></div>
                <p>Cargando métricas de tu negocio...</p>
            </div>
        );
    }

    // -------------------------------------------------------------------------------- //
    // 4. RENDERIZADO VISUAL DEL COMPONENTE (MÓDULO DE DIBUJO)                          //
    // -------------------------------------------------------------------------------- //
    return (
        <div className="dashboard-page-wrapper">
            <div className="dashboard-header text-center">
                <h1 className="dashboard-title">Visión General del Negocio</h1>
                <p className="dashboard-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    Resumen en vivo de tu Inversión e Inventario <Box size={18} />
                </p>
            </div>

            {/* SECCIÓN 1: Tarjetas de KPI (Key Performance Indicators) */}
            <div className="kpi-grid">

                {/* TARJETA: Valor Total (SOLO ADMIN) */}
                {user?.role === 'ADMIN' && (
                    <div className="kpi-card card-primary">
                        <div className="kpi-icon"><CircleDollarSign size={28} /></div>
                        <div className="kpi-content">
                            <p className="kpi-label">Valor en Inventario</p>
                            <h2 className="kpi-value">{formatCurrency(totalValuation)}</h2>
                        </div>
                    </div>
                )}

                {/* TARJETA: Cantidad de Productos */}
                <div className="kpi-card card-secondary">
                    <div className="kpi-icon"><Box size={28} /></div>
                    <div className="kpi-content">
                        <p className="kpi-label">Productos Registrados</p>
                        {/* Imprimimos directo el meta.total del getProducts() */}
                        <h2 className="kpi-value">{totalProductsCount}</h2>
                    </div>
                </div>

                {/* TARJETA: Alerta de Stock Bajo */}
                <div className="kpi-card card-warning">
                    <div className="kpi-icon"><TriangleAlert size={28} /></div>
                    <div className="kpi-content">
                        <p className="kpi-label">Productos casi sin stock</p>
                        <h2 className="kpi-value">{lowStockCount}</h2>
                    </div>
                </div>

                {/* TARJETA: Actividad de Movimientos */}
                <div className="kpi-card card-info">
                    <div className="kpi-icon"><ArrowRightLeft size={28} /></div>
                    <div className="kpi-content">
                        <p className="kpi-label">Movimientos Hoy</p>
                        <h2 className="kpi-value">{movementsToday}</h2>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: GRÁFICOS INTERACTIVOS (RECHARTS) - SOLO ADMIN */}
            {user?.role === 'ADMIN' && (
                <div className="charts-grid mt-4">

                    {/* Cuadro contenedor blanco donde vivirá el gráfico */}
                    <div className="chart-card">
                        <h3 className="chart-title">Desempeño Económico Estimado (Top 5)</h3>
                        <p className="chart-subtitle">Productos que más ingresos generan basado en stock y ventas.</p>

                        <div className="chart-container">
                            {/* ResponsiveContainer le dice al Canvas del gráfico que siempre ocupe el 100% de la pantalla permitida */}
                            <ResponsiveContainer width="100%" height={300}>
                                {/* Inyección de nuestro array de objetos "topPerformingProducts" a Recharts */}
                                <BarChart data={topPerformingProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    {/* lineas de rejilla tenues de fondo */}
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

                                    {/* Ejes Cartesianos (X y Y) */}
                                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />

                                    {/* Tooltip: El cuadrito flotante oscuro que aparece cuando el mouse pasa encima */}
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Ingresos Estimados']}
                                    />

                                    {/* 
                                        Dibujamos las barras (Bar). La llave "dataKey='Ingresos'" le indica a Recharts 
                                        qué variable de nuestro arreglo va a pintar. En este caso el que creamos arriba.
                                    */}
                                    <Bar dataKey="Ingresos" radius={[6, 6, 0, 0]}>
                                        {/* Mapeamos arreglos para darle a cada barra un color distingo según la constante COLORS */}
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
