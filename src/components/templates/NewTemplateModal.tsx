import React, { useState, useRef } from 'react';
import { X, Plus, Save, Image as ImageIcon, Briefcase, Tag, FileText, Upload, Link, Trash2 } from 'lucide-react';
import type { Brand, Category, TemplateRequest, TemplateResponse } from '../../types';

interface NewTemplateModalProps {
  isOpen: boolean;
  brands: Brand[];
  categories: Category[];
  templateToEdit?: TemplateResponse | null;
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
  const [title, setTitle] = useState(templateToEdit?.title || '');
  const [content, setContent] = useState(templateToEdit?.content || '');
  const [brandId, setBrandId] = useState<number | ''>(templateToEdit?.brandId || '');
  const [categoryId, setCategoryId] = useState<number | ''>(templateToEdit?.categoryId || '');
  const [imageUrl, setImageUrl] = useState(templateToEdit?.imageUrl || '');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        brandId: brandId ? Number(brandId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        imageUrl: imageUrl.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error enviando plantilla:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-theme-surface border border-theme rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 cursor-default"
      >
        
        {/* Encabezado */}
        <div className="flex justify-between items-center p-5 border-b border-theme/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-theme-elevated border border-theme rounded-xl text-theme-accent">
              {templateToEdit ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <h2 className="text-base font-bold text-theme-primary">
              {templateToEdit ? 'Editar Plantilla' : 'Nueva Plantilla'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-theme-muted hover:text-theme-primary transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Título */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-muted">Título de la Plantilla *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Saludo Inicial Clientes..."
              className="w-full bg-theme-elevated border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition"
            />
          </div>

          {/* Selects: Marca y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-muted flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-theme-accent" /> Marca
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-theme-elevated border border-theme rounded-xl px-3 py-2 text-xs text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition cursor-pointer"
              >
                <option value="" className="bg-theme-surface">Sin Marca</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id} className="bg-theme-surface">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-muted flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-theme-elevated border border-theme rounded-xl px-3 py-2 text-xs text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition cursor-pointer"
              >
                <option value="" className="bg-theme-surface">Sin Categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-theme-surface">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zona de Carga / Arrastrar Imagen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-theme-muted flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-theme-accent" /> Imagen Adjunta (Opcional)
              </label>

              <div className="flex gap-1 p-0.5 bg-theme-elevated border border-theme rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-2 py-0.5 rounded-md transition ${
                    uploadMode === 'file'
                      ? 'bg-theme-surface text-theme-primary font-bold shadow-sm'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  Archivo / Arrastrar
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-0.5 rounded-md transition ${
                    uploadMode === 'url'
                      ? 'bg-theme-surface text-theme-primary font-bold shadow-sm'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  URL Externa
                </button>
              </div>
            </div>

            {imageUrl ? (
              <div className="relative border border-theme rounded-xl p-2 bg-theme-elevated/40 flex items-center gap-3">
                <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-theme" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-theme-primary truncate">Imagen cargada</p>
                  <p className="text-[10px] text-theme-muted truncate">{imageUrl.startsWith('data:') ? 'Archivo local' : imageUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  title="Quitar imagen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : uploadMode === 'file' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-theme-accent bg-theme-accent/10'
                    : 'border-theme hover:border-theme-accent/60 bg-theme-elevated/30 hover:bg-theme-elevated/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="p-2.5 bg-theme-elevated border border-theme rounded-xl text-theme-accent">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-theme-primary">
                    Haz clic para seleccionar o <span className="text-theme-accent">arrastra una imagen aquí</span>
                  </p>
                  <p className="text-[10px] text-theme-muted mt-0.5">PNG, JPG, GIF o WEBP</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Link className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.png"
                  className="w-full bg-theme-elevated border border-theme rounded-xl pl-9 pr-3.5 py-2 text-xs text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition"
                />
              </div>
            )}
          </div>

          {/* Contenido / Texto */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-muted flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-theme-accent" /> Contenido *
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí el texto de tu respuesta. Usa [nombre] para variables dinámicas..."
              className="w-full bg-theme-elevated border border-theme rounded-xl p-3 text-xs text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition font-mono leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-theme/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-theme-muted hover:text-theme-primary transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-theme-primary px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Guardando...' : templateToEdit ? 'Actualizar' : 'Crear Plantilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};