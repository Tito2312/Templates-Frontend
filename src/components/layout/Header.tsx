import React from 'react';
import { Plus, FolderCog, LogIn, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenModal: () => void;
  onOpenCategoriesModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  themeColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenModal,
  onOpenCategoriesModal,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="bg-theme-surface/80 backdrop-blur-md border-b border-theme/80 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Identidad de la App */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-theme-elevated border border-theme rounded-xl text-theme-accent shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-theme-primary tracking-tight">
              GESTOR DE PLANTILLAS
            </h1>
            <p className="text-[11px] text-theme-muted hidden sm:block">
              Respuestas rápidas para atención a clientes
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Botón Administrar Categorías */}
              <button
                type="button"
                onClick={onOpenCategoriesModal}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-theme-elevated hover:bg-theme-elevated/80 text-theme-primary border border-theme transition flex items-center gap-2 cursor-pointer shadow-sm"
                title="Administrar Categorías"
              >
                <FolderCog className="w-4 h-4 text-theme-accent" />
                <span className="hidden sm:inline">Categorías</span>
              </button>

              {/* Botón Nueva Plantilla */}
              <button
                type="button"
                onClick={onOpenModal}
                className="btn-theme-primary px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md hover:brightness-110 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Plantilla</span>
              </button>

              {/* Indicador de Usuario + Logout */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-theme/80">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-theme-elevated/50 text-xs text-theme-muted">
                  <UserIcon className="w-3.5 h-3.5 text-theme-accent" />
                  <span className="font-medium text-theme-primary hidden md:inline">
                    {currentUser.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 text-theme-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-elevated hover:bg-theme-elevated/80 text-theme-primary border border-theme transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-theme-accent" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};