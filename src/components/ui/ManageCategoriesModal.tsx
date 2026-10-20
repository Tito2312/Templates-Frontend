import React, { useState, useEffect } from 'react';
import { X, Plus, Tag, Briefcase, Pencil, Check } from 'lucide-react';
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
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [categoryName, setCategoryName] = useState('');
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Estados para la edición de marcas
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editBrandColor, setEditBrandColor] = useState('#6366f1');

  // Estados para la edición de categorías
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      Promise.all([
        brandApi.getBrands(),
        categoryApi.getCategories(),
      ])
        .then(([brandsData, categoriesData]) => {
          if (isMounted) {
            setBrands(brandsData);
            setCategories(categoriesData);
          }
        })
        .catch((err) => {
          console.error('Error al cargar marcas y categorías', err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

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
      await brandApi.createBrand(brandName.trim(), brandColor);
      setBrandName('');
      setBrandColor('#6366f1');
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

  // Handlers para Edición de Marcas
  const handleStartEditBrand = (brand: Brand) => {
    setEditingBrandId(brand.id);
    setEditBrandName(brand.name);
    setEditBrandColor(brand.colorHex || '#6366f1');
  };

  const handleCancelEditBrand = () => {
    setEditingBrandId(null);
    setEditBrandName('');
    setEditBrandColor('#6366f1');
  };

  const handleSaveEditBrand = async (id: number) => {
    if (!editBrandName.trim()) return;
    setLoadingBrand(true);
    try {
      await brandApi.updateBrand(id, editBrandName.trim(), editBrandColor);
      setEditingBrandId(null);
      await reloadData();
      onRefresh();
    } catch (err) {
      console.error('Error al actualizar marca', err);
    } finally {
      setLoadingBrand(false);
    }
  };

  // Handlers para Edición de Categorías
  const handleStartEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryName('');
  };

  const handleSaveEditCategory = async (id: number) => {
    if (!editCategoryName.trim()) return;
    setLoadingCategory(true);
    try {
      await categoryApi.updateCategory(id, editCategoryName.trim());
      setEditingCategoryId(null);
      await reloadData();
      onRefresh();
    } catch (err) {
      console.error('Error al actualizar categoría', err);
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-theme-surface border border-theme rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 cursor-default transition-colors duration-300"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-theme/80 pb-3">
          <h2 className="text-lg font-bold text-theme-primary flex items-center gap-2">
            Gestión de Marcas y Categorías
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-theme-muted hover:text-theme-primary p-1.5 rounded-lg hover:bg-theme-elevated transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección Marcas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-theme-accent flex items-center gap-1.5 uppercase tracking-wider">
              <Briefcase className="w-4 h-4" /> Marcas
            </h3>
            <form onSubmit={handleCreateBrand} className="flex gap-2 items-center">
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Nueva marca..."
                className="flex-1 p-2 bg-theme-elevated border border-theme rounded-xl text-xs text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition"
              />

              {/* Selector de Color Hexadecimal */}
              <div className="flex items-center gap-1 bg-theme-elevated border border-theme rounded-xl px-2 py-1">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-5 h-5 bg-transparent rounded cursor-pointer border-0"
                  title="Seleccionar color de marca"
                />
              </div>

              <button
                type="submit"
                disabled={loadingBrand}
                className="btn-theme-primary px-3 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center bg-theme-elevated/50 p-2.5 rounded-xl text-xs text-theme-primary border border-theme/60"
                >
                  {editingBrandId === b.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editBrandName}
                        onChange={(e) => setEditBrandName(e.target.value)}
                        className="flex-1 p-1 bg-theme-elevated border border-theme rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                      <input
                        type="color"
                        value={editBrandColor}
                        onChange={(e) => setEditBrandColor(e.target.value)}
                        className="w-5 h-5 bg-transparent rounded cursor-pointer border-0 shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditBrand(b.id)}
                        disabled={loadingBrand}
                        className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-theme-elevated transition"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditBrand}
                        className="p-1.5 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-theme-elevated transition"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: b.colorHex || '#6366f1' }}
                        />
                        <span className="font-medium">{b.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.colorHex && (
                          <span className="text-[10px] font-mono text-theme-muted">{b.colorHex}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartEditBrand(b)}
                          className="text-theme-muted hover:text-theme-primary p-1 rounded hover:bg-theme-elevated transition cursor-pointer"
                          title="Editar marca"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sección Categorías */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-4 h-4" /> Categorías
            </h3>
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 p-2 bg-theme-elevated border border-theme rounded-xl text-xs text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition"
              />
              <button
                type="submit"
                disabled={loadingCategory}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center bg-theme-elevated/50 p-2.5 rounded-xl text-xs text-theme-primary border border-theme/60"
                >
                  {editingCategoryId === c.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1 p-1 bg-theme-elevated border border-theme rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategory(c.id)}
                        disabled={loadingCategory}
                        className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-theme-elevated transition"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditCategory}
                        className="p-1.5 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-theme-elevated transition"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleStartEditCategory(c)}
                        className="text-theme-muted hover:text-theme-primary p-1 rounded hover:bg-theme-elevated transition cursor-pointer"
                        title="Editar categoría"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};