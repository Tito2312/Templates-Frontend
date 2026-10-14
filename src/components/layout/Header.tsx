import React from 'react';
import { Plus, Bookmark, FolderPlus, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenModal: () => void;
  onOpenCategoriesModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenModal,
  onOpenCategoriesModal,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Bookmark className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide text-slate-100">SAC Response Hub</h1>
          <p className="text-xs text-slate-400">Gestor rápido de plantillas de atención</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {currentUser ? (
          <>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900/60 border border-slate-700 rounded-lg text-xs text-slate-300">
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium text-slate-200">{currentUser.username}</span>
            </div>

            <button
              onClick={onOpenCategoriesModal}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg flex items-center space-x-1.5 transition text-xs font-medium"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Categorías</span>
            </button>

            <button
              onClick={onOpenModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Plantilla</span>
            </button>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition text-xs font-medium"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión / Registro</span>
          </button>
        )}
      </div>
    </header>
  );
};