import React from 'react';
import { Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { generateThemeFromHex } from '../../utils/themeGenerator';
import { paletteToStyle } from '../../utils/themeStyle';

const defaultPalette = generateThemeFromHex();

/**
 * Pantalla completa mientras se verifica la sesión (evita mostrar contenido privado)
 * o cuando el servidor no responde (p. ej. Render despertando el backend).
 */
export const SessionScreen: React.FC = () => {
  const { status, retry, logout } = useAuth();

  return (
    <div
      className="min-h-screen bg-theme-base text-theme-primary flex items-center justify-center p-6 font-sans"
      style={paletteToStyle(defaultPalette)}
    >
      {status === 'unreachable' ? (
        <div className="bg-theme-surface border border-theme rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="mx-auto w-fit p-3 bg-theme-elevated border border-theme rounded-xl text-theme-accent">
            <WifiOff className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold">No se pudo conectar con el servidor</h2>
            <p className="text-xs text-theme-muted">
              Puede estar iniciándose. Espera unos segundos y vuelve a intentarlo.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={retry}
              className="btn-theme-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-theme-muted hover:text-theme-primary transition cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-theme-muted">
          <Loader2 className="w-7 h-7 animate-spin text-theme-accent" />
          <p className="text-xs font-medium">Verificando sesión...</p>
        </div>
      )}
    </div>
  );
};
