import { useState } from 'react';
import { UserPlus, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createUser } from '../api/createUser';
import './CreateUserPage.css';

interface CreateUserPageProps {
    onCancel?: () => void;
}

export const CreateUserPage = ({ onCancel }: CreateUserPageProps) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('VENDEDOR');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            await createUser({
                name,
                username,
                password,
                role
            });

            setSuccess(`Usuario ${name} (${role}) creado exitosamente.`);

            // Clean form
            setName('');
            setUsername('');
            setPassword('');
            setRole('VENDEDOR');
        } catch (err: any) {
            setError(err.message || 'Error desconocido al crear usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Crear Nuevo Usuario</h1>
                    <p className="page-subtitle">Registra nuevos administradores, gerentes o vendedores para el sistema.</p>
                </div>
                <div className="header-icon-container">
                    <UserPlus size={28} className="header-icon" />
                </div>
            </div>

            <div className="card form-card">
                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <CheckCircle2 size={20} />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-layout">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. Juan Perez"
                                required
                                disabled={isLoading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Nombre de Usuario (Login)</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ej. juan.vendedor"
                                required
                                disabled={isLoading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimo 6 caracteres"
                                required
                                disabled={isLoading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Rol del Sistema</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="form-select"
                                disabled={isLoading}
                            >
                                <option value="VENDEDOR">VENDEDOR (Acceso Básico)</option>
                                <option value="ALMACENISTA">ALMACENISTA (Reportes y Compras)</option>
                                <option value="ADMIN">ADMIN (Acceso Total)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setName('');
                                setUsername('');
                                setPassword('');
                                setRole('VENDEDOR');
                                setError(null);
                                setSuccess(null);
                            }}
                            disabled={isLoading}
                        >
                            Limpiar Formularios
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancelar y Volver
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="btn-loader"></span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Guardar Usuario</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
