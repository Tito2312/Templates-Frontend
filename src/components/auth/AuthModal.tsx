import React, { useState } from 'react';
import { X } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { session } from '../../utils/session';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const user = await userApi.register(username, email, password);
        session.setUser(user);
      } else {
        const user = await userApi.login(email, password);
        session.setUser(user);
      }
      onLoginSuccess();
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('Error en la autenticación. Revisa las credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    /* Fondo oscuro: al hacer clic por fuera se invoca onClose */
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
    >
      {/* Contenedor principal del modal: e.stopPropagation() evita cierres involuntarios al interactuar con el formulario */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 cursor-default relative"
      >
        {/* Botón de Cierre X (si onClose está presente) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <h2 className="text-xl font-bold text-center text-slate-100 pr-6">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-2.5 rounded-lg text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Campo Usuario (solo en Registro) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. jorge"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Campo Correo Electrónico */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-indigo-400 hover:underline"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};