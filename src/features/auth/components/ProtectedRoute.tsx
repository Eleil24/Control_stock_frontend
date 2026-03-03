// import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();

    // Si no está autenticado, lo mandamos al login
    if (!isAuthenticated) {
        // Aquí podriamos usar window.location.href, 
        // pero si empezamos a usar react-router, Navigate es mejor.
        // Como estamos usando una lógica manual en App.tsx por ahora, 
        // asumimos que este componente se usará allí o con un renderizado condicional.

        // Si la App actual no usa react-router-dom, esto lanzará un error. 
        // Vamos a implementarlo sin react-router-dom para que concuerde con tu App.tsx actual.
        window.location.href = '/auth/login';
        return null;
    }

    // Si hay roles permitidos y el usuario actual no tiene ninguno de esos, bloqueamos
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', marginTop: '10vh' }}>
                <h1 style={{ color: '#ef4444' }}>Acceso Denegado</h1>
                <p>No tienes permisos suficientes para ver esta página.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    // Si pasa todas las validaciones, renderiza los hijos (o el outlet si se usara router)
    return <>{children}</>;
};
