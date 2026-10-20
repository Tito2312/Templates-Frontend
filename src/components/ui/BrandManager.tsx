import React, { useState } from 'react';
import { Briefcase, Plus, Pencil, Check, X } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import type { Brand } from '../../types';

interface BrandManagerProps {
  brands: Brand[];
  onBrandsUpdated: () => void;
}

export const BrandManager: React.FC<BrandManagerProps> = ({
  brands,
  onBrandsUpdated,
}) => {
  const [brandName, setBrandName] = useState('');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#6366f1');

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setLoading(true);
    try {
      await brandApi.createBrand(brandName.trim(), brandColor);
      setBrandName('');
      setBrandColor('#6366f1');
      onBrandsUpdated();
    } catch (err) {
      console.error('Error al crear marca', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setEditName(brand.name);
    setEditColor(brand.colorHex || '#6366f1');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('#6366f1');
  };

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) return;
    setLoading(true);
    try {
      await brandApi.updateBrand(id, editName.trim(), editColor);
      setEditingId(null);
      onBrandsUpdated();
    } catch (err) {
      console.error('Error al actualizar marca', err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          disabled={loading}
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
            {editingId === b.id ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 p-1 bg-theme-elevated border border-theme rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="w-5 h-5 bg-transparent rounded cursor-pointer border-0 shrink-0"
                />
                <button
                  type="button"
                  onClick={() => handleSaveEdit(b.id)}
                  disabled={loading}
                  className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-theme-elevated transition"
                  title="Guardar"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
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
                    onClick={() => handleStartEdit(b)}
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
  );
};