import React, { useState, useRef } from 'react';
import { X, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import type { Brand, Category, TemplateRequest, TemplateResponse } from '../../types';
import { session } from '../../utils/session';

interface NewTemplateModalProps {
  isOpen: boolean;
  brands: Brand[];
  categories: Category[];
  templateToEdit: TemplateResponse | null;
  onClose: () => void;
  onSubmit: (data: TemplateRequest) => Promise<void>;
}

export const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  brands,
  categories,
  templateToEdit,
  onClose,
  onSubmit,
}) => {
  // Inicializamos el estado 1 sola vez leyendo las props directamente al montar
  const [formData, setFormData] = useState<TemplateRequest>(() => ({
    title: templateToEdit?.title || '',
    content: templateToEdit?.content || '',
    brandId: templateToEdit?.brandId || undefined,
    categoryId: templateToEdit?.categoryId || undefined,
    imageUrl: templateToEdit?.imageUrl || '',
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({ title: '', content: '', brandId: undefined, categoryId: undefined, imageUrl: '' });
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.).');
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const token = session.getToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      const response = await fetch(`${apiUrl}/api/images/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: data,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const result = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Ocurrió un error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">
            {templateToEdit ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </h2>
          <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Título de la plantilla</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                placeholder="Ej. Bienvenida a Casino..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Marca (Opcional)</label>
              <select
                value={formData.brandId || ''}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition outline-none"
              >
                <option value="">Ninguna</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Categoría (Opcional)</label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition outline-none"
              >
                <option value="">Ninguna</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- ZONA DRAG & DROP --- */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              Imagen Adjunta (Opcional)
            </label>
            
            {formData.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50 flex items-center justify-center h-48 group">
                <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Eliminar Imagen
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all h-48 ${
                  isDragging 
                    ? 'border-indigo-400 bg-indigo-500/10' 
                    : 'border-slate-700 hover:border-slate-500 bg-slate-900/50 cursor-pointer'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
                    <p className="text-sm font-medium text-slate-300">Subiendo a Cloudinary...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full mb-3 transition-colors ${isDragging ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      Haz clic para explorar o arrastra una imagen aquí
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Soporta JPG, PNG, WEBP, GIF</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Contenido (Usa [variable] para dinámicos)</label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition outline-none resize-none"
              placeholder={"Hola [nombre],\n\nTe informamos que tu retiro por [monto] ha sido procesado."}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : (
                templateToEdit ? 'Actualizar Plantilla' : 'Crear Plantilla'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};