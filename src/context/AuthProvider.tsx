import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { userApi } from '../api/userApi';
import { setUnauthorizedHandler } from '../api/httpClient';
import { session } from '../utils/session';
import { AuthContext, type AuthContextValue, type AuthStatus } from './authContext';
import type { User } from '../types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sin token no hay nada que verificar: se arranca directamente como anónimo
  const [status, setStatus] = useState<AuthStatus>(() => (session.getToken() ? 'loading' : 'anonymous'));
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Comparte la misma petición a /me entre los dos montajes de StrictMode (evita llamadas dobles)
  const meRequest = useRef<{ attempt: number; promise: Promise<User> } | null>(null);

  // Cualquier 401 fuera de login/registro cierra la sesión local
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus('anonymous');
      setSessionExpired(true);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  // Verificación del token guardado: el rol siempre viene del servidor, nunca de localStorage
  useEffect(() => {
    if (status !== 'loading') return;
    let ignore = false;

    if (!meRequest.current || meRequest.current.attempt !== attempt) {
      meRequest.current = { attempt, promise: userApi.me() };
    }

    meRequest.current.promise
      .then((me) => {
        if (ignore) return;
        session.setUser(me);
        setUser(me);
        setStatus('authenticated');
      })
      .catch((error) => {
        if (ignore) return;
        // El 401 ya lo gestionó el interceptor; cualquier otro fallo no cierra la sesión
        if (error?.response?.status !== 401) {
          setStatus('unreachable');
        }
      });

    return () => {
      ignore = true;
    };
  }, [status, attempt]);

  const login = useCallback(async (email: string, password: string) => {
    const loggedUser = await userApi.login(email, password);
    setUser(loggedUser);
    setSessionExpired(false);
    setStatus('authenticated');
    return loggedUser;
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const newUser = await userApi.register(username, email, password);
    setUser(newUser);
    setSessionExpired(false);
    setStatus('authenticated');
    return newUser;
  }, []);

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
    setSessionExpired(false);
    setStatus('anonymous');
  }, []);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
    setStatus('loading');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAdmin: user?.role === 'ROLE_ADMIN',
      sessionExpired,
      login,
      register,
      logout,
      retry,
    }),
    [status, user, sessionExpired, login, register, logout, retry]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
