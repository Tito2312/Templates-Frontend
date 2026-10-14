import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Brand, Category, TemplateRequest, TemplateResponse } from '../../types';

interface NewTemplateModalProps {
  isOpen: boolean;
  brands: Brand[];
  categories: Category[];
  templateToEdit?: TemplateResponse | null;
  onClose: () => void;
  onSubmit: (data: Omit<TemplateRequest, 'userId'>) => Promise<void>;
}

export const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  brands,
  categories,
  templateToEdit,
  onClose,
  onSubmit,
}) => {
  // Inicialización directa del estado a partir de templateToEdit (sin useEffect)
  const [title, setTitle] = useState(templateToEdit?.title || '');
  const [content, setContent] = useState(templateToEdit?.content || '');
  const [brandId, setBrandId] = useState<string>(
    templateToEdit?.brandId ? templateToEdit.brandId.toString() : ''
  );
  const [categoryId, setCategoryId] = useState<string>(
    templateToEdit?.categoryId ? templateToEdit.categoryId.toString() : ''
  );
  const [imageUrl, setImageUrl] = useState(templateToEdit?.imageUrl || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        content,
        brandId: brandId ? Number(brandId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        imageUrl: imageUrl.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Error al guardar la plantilla:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 cursor-default">
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <h2 className="text-xl font-bold text-slate-100">
            {templateToEdit ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Título de la Plantilla
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Saludo Inicial WhatsApp"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Marca y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Marca
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">Sin Marca</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">Sin Categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL de Imagen */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              URL de Imagen / Banner (Opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.png"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Contenido de la Plantilla
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el texto de la respuesta..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : templateToEdit ? 'Actualizar Plantilla' : 'Guardar Plantilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};