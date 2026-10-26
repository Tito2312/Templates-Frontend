import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { getApiErrorMessage } from '../../utils/apiError';

export type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
  onToggleMode: () => void;
}

/**
 * Formulario de inicio de sesión / registro (lógica heredada del antiguo AuthModal).
 * Al autenticarse, GuestRoute redirige automáticamente al dashboard.
 */
export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { login, register } = useAuth();
  const isRegister = mode === 'register';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(
        getApiErrorMessage(
          err,
          isRegister ? 'No se pudo crear la cuenta.' : 'Error en la autenticación. Revisa las credenciales.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setError('');
    setPassword('');
    onToggleMode();
  };

  const inputClass =
    'w-full bg-theme-elevated border border-theme rounded-xl px-3.5 py-2.5 text-sm text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition';

  return (
    <div className="bg-theme-surface border border-theme rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="p-2.5 bg-theme-elevated border border-theme rounded-xl text-theme-accent">
          {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-bold text-center text-theme-primary">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
      </div>

      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 p-2.5 rounded-lg text-xs text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Campo Usuario (solo en Registro) */}
        {isRegister && (
          <div>
            <label htmlFor="auth-username" className="block text-xs font-semibold text-theme-muted mb-1">
              Nombre de Usuario
            </label>
            <input
              id="auth-username"
              type="text"
              required
              maxLength={50}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. jorge"
              className={inputClass}
            />
          </div>
        )}

        {/* Campo Correo Electrónico */}
        <div>
          <label htmlFor="auth-email" className="block text-xs font-semibold text-theme-muted mb-1">
            Correo Electrónico
          </label>
          <input
            id="auth-email"
            type="email"
            required
            maxLength={100}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className={inputClass}
          />
        </div>

        {/* Campo Contraseña */}
        <div>
          <label htmlFor="auth-password" className="block text-xs font-semibold text-theme-muted mb-1">
            Contraseña
          </label>
          <input
            id="auth-password"
            type="password"
            required
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-theme-primary w-full py-2.5 rounded-xl font-bold text-sm transition mt-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Ingresar'}
        </button>
      </form>

      <div className="text-center pt-1">
        <button
          type="button"
          onClick={handleToggle}
          className="text-xs text-theme-accent hover:underline cursor-pointer"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
};
