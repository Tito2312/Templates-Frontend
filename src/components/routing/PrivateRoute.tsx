import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { SessionScreen } from './SessionScreen';

/** Solo usuarios autenticados. Sin sesión → inicio, recordando la ruta solicitada. */
export const PrivateRoute: React.FC = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading' || status === 'unreachable') {
    return <SessionScreen />;
  }

  if (status === 'anonymous') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
