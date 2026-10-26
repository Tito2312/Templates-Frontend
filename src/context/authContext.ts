import { createContext, useContext } from 'react';
import type { User } from '../types';

/**
 * - loading: verificando el token guardado contra el servidor (/users/me)
 * - authenticated / anonymous: estado de sesión resuelto
 * - unreachable: hay token pero el servidor no respondió (no se cierra la sesión)
 */
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'unreachable';

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  isAdmin: boolean;
  // true cuando la sesión se cerró porque el servidor rechazó el token (401)
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  retry: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
};
