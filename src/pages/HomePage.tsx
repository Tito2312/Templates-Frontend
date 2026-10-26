import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AuthForm, type AuthMode } from '../components/auth/AuthForm';
import { WelcomePanel } from '../components/home/WelcomePanel';
import { useAuth } from '../context/authContext';
import { generateThemeFromHex } from '../utils/themeGenerator';
import { paletteToStyle } from '../utils/themeStyle';

// Mismos colores que la vista principal sin marca seleccionada
const palette = generateThemeFromHex();

/**
 * Página de inicio pública (ruta "/"): bienvenida e inicio de sesión / registro en una sola vista,
 * dividida en diagonal. Al pasar a registro, mensaje y formulario intercambian lados
 * (estilos .home-* en index.css).
 */
export default function HomePage() {
  const { sessionExpired } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div
      className="home min-h-screen bg-theme-base text-theme-primary font-sans relative overflow-hidden flex flex-col md:block"
      data-mode={mode}
      style={paletteToStyle(palette)}
    >
      {/* Línea superior accent, igual que en la vista principal */}
      <div className="absolute top-0 inset-x-0 h-1.5 z-30" style={{ backgroundColor: palette.primary }} />

      {/* Atmósfera suave de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 z-0"
        style={{ background: `radial-gradient(circle at 50% 15%, ${palette.primary} 0%, transparent 65%)` }}
      />

      <section className="home-welcome bg-theme-surface z-10 flex items-center">
        <div className="home-welcome-content w-full px-6 pt-12 pb-16 md:py-0">
          <WelcomePanel />
        </div>
      </section>

      <section className="home-form z-20 flex flex-col items-center justify-center gap-3 px-6 py-10 md:py-0">
        {sessionExpired && (
          <div
            role="status"
            className="w-full max-w-sm flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-300 p-2.5 rounded-xl text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            Tu sesión expiró. Inicia sesión de nuevo.
          </div>
        )}
        <AuthForm mode={mode} onToggleMode={() => setMode((m) => (m === 'login' ? 'register' : 'login'))} />
      </section>
    </div>
  );
}
