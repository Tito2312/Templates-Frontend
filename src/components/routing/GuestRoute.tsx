import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { SessionScreen } from './SessionScreen';

/** Solo invitados. Con sesión → la ruta que se quería abrir o el dashboard. */
export const GuestRoute: React.FC = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading' || status === 'unreachable') {
    return <SessionScreen />;
  }

  if (status === 'authenticated') {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from && from !== '/' ? from : '/dashboard'} replace />;
  }

  return <Outlet />;
};
