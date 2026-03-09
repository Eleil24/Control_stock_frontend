import { useState } from 'react';
import { Lock, User, LogIn, Eye, EyeOff } from 'lucide-react';
import { login } from '../api/login';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export const LoginPage = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { loginState } = useAuth(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await login(username, password);
            loginState(data.access_token, data.user);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="login-card">
                <div className="login-header">
                    <div className="login-image-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img 
                            src="/images/login_imagen.jpg" 
                            alt="Login Security" 
                            style={{ 
                                width: 'auto', 
                                height: '70px', 
                                objectFit: 'contain', 
                                borderRadius: '12px', 
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                            }} 
                        />
                    </div>
                    <h1 className="login-title">Bienvenido</h1>
                    <p className="login-subtitle">Ingresa a tu cuenta para continuar</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error-message">
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="input-group">
                        <label htmlFor="username">Usuario</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-with-icon" style={{ position: 'relative' }}>
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-btn"
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`login-submit-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner"></div> 
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <LogIn size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};