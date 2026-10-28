import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/routing/PrivateRoute';
import { GuestRoute } from './components/routing/GuestRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

/**
 * Rutas de la aplicación:
 * - "/"          inicio público (bienvenida + inicio de sesión / registro), solo invitados
 * - "/dashboard" vista principal, solo usuarios autenticados
 */
export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
