import React, { useState, useEffect } from 'react';
import { X, Plus, Tag, Briefcase } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { categoryApi } from '../../api/categoryApi';
import type { Brand, Category } from '../../types';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Cargar datos únicamente si el modal está abierto
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          brandApi.getBrands(),
          categoryApi.getCategories(),
        ]);
        if (isMounted) {
          setBrands(brandsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Error al cargar marcas y categorías', err);
      }
    };

    if (isOpen) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  const reloadData = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        brandApi.getBrands(),
        categoryApi.getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error al recargar marcas y categorías', err);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setLoadingBrand(true);
    try {
      await brandApi.createBrand(brandName.trim());
      setBrandName('');
      await reloadData();
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
      await reloadData();
      onRefresh();
    } catch (err) {
      console.error('Error al crear categoría', err);
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    /* Fondo oscuro: al hacer clic aquí se llama a onClose */
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
    >
      {/* Cajas internas: e.stopPropagation() evita que el clic dentro cierre el modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 cursor-default"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Gestión de Marcas y Categorías
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección Marcas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Briefcase className="w-4 h-4" /> Marcas
            </h3>
            <form onSubmit={handleCreateBrand} className="flex gap-2">
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Nueva marca..."
                className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loadingBrand}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg text-xs text-slate-300 border border-slate-700/50"
                >
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección Categorías */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-4 h-4" /> Categorías
            </h3>
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loadingCategory}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg text-xs text-slate-300 border border-slate-700/50"
                >
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};