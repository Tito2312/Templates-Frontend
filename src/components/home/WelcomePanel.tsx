import React from 'react';
import { Sparkles } from 'lucide-react';

/** Mensaje de bienvenida de la página de inicio (texto proporcionado por el cliente). */
export const WelcomePanel: React.FC = () => (
  <div className="max-w-md space-y-5">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-theme-elevated border border-theme rounded-xl text-theme-accent shadow-sm">
        <Sparkles className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-theme-primary tracking-tight">GESTOR DE PLANTILLAS</p>
        <p className="text-[11px] text-theme-muted">Respuestas rápidas para atención a clientes</p>
      </div>
    </div>

    <h1 className="text-3xl md:text-4xl font-bold text-theme-primary tracking-tight">¡Bienvenidos!</h1>

    <div className="space-y-3 text-sm md:text-base leading-relaxed text-theme-muted">
      <p>
        Les presentamos esta aplicación, diseñada para optimizar la gestión de plantillas, facilitar su
        organización y hacer más eficientes nuestros procesos de trabajo.
      </p>
      <p>Esperamos que esta herramienta sea de gran utilidad y contribuya a mejorar nuestra productividad.</p>
    </div>
  </div>
);
