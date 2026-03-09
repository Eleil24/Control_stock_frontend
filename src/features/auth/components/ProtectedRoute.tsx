import { useAuth } from '../context/AuthContext';
interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}
export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
        window.location.href = '/auth/login';
        return null;
    }
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
    return <>{children}</>;
};