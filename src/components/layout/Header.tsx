import React from 'react';
import { Plus, Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Bookmark className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide text-slate-100">SAC Response Hub</h1>
          <p className="text-xs text-slate-400">Gestor rápido de plantillas de atención</p>
        </div>
      </div>
      <button
        onClick={onOpenModal}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition font-medium text-sm shadow-md active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Nueva Plantilla</span>
      </button>
    </header>
  );
};