import React, { useState } from 'react';
import { Plus, Tag, Briefcase } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { categoryApi } from '../../api/categoryApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ManageCategoriesModal: React.FC<Props> = ({ isOpen, onClose, onRefresh }) => {
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  if (!isOpen) return null;

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setLoadingBrand(true);
    try {
      await brandApi.createBrand(brandName.trim());
      setBrandName('');
      onRefresh();
    } catch (err) {
      console.error('Error al crear marca', err);
    } finally {
      setLoadingBrand(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setLoadingCategory(true);
    try {
      await categoryApi.createCategory(categoryName.trim());
      setCategoryName('');
      onRefresh();
    } catch (err) {
      console.error('Error al crear categoría', err);
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-100">Gestión de Marcas y Categorías</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        {/* Crear Marca */}
        <form onSubmit={handleCreateBrand} className="space-y-2">
          <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Nueva Marca
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Marca Beta"
              className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
            />
            <button
              type="submit"
              disabled={loadingBrand}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Crear
            </button>
          </div>
        </form>

        <hr className="border-slate-700" />

        {/* Crear Categoría */}
        <form onSubmit={handleCreateCategory} className="space-y-2">
          <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Nueva Categoría
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Reclamos"
              className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
            />
            <button
              type="submit"
              disabled={loadingCategory}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Crear
            </button>
          </div>
        </form>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};