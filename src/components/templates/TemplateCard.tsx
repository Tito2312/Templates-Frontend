import React, { useState } from 'react';
import { Copy, Check, Trash2, Pencil, Tag, Briefcase, Eye, Image as ImageIcon, FileText } from 'lucide-react';
import type { TemplateResponse } from '../../types';
import { copyImageToClipboard } from '../../utils/clipboardUtils';

interface TemplateCardProps {
  template: TemplateResponse;
  isCopied: boolean;
  onCopy: (template: TemplateResponse) => void;
  onDelete: (id: number) => void;
  onEdit?: (template: TemplateResponse) => void;
  themeColor?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isCopied,
  onCopy,
  onDelete,
  onEdit,
}) => {
  const [showCopyOptions, setShowCopyOptions] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleCopyTextOnly = () => {
    onCopy(template);
    setShowCopyOptions(false);
  };

  const handleCopyImageOnly = async () => {
    if (!template.imageUrl) return;
    const success = await copyImageToClipboard(template.imageUrl);
    if (success) {
      setCopyStatus('¡Imagen copiada!');
      setTimeout(() => setCopyStatus(null), 2000);
    }
    setShowCopyOptions(false);
  };

  return (
    <div className="bg-theme-surface border border-theme border-t-2 border-t-theme-accent rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Encabezado destacado con franja superior */}
        <div className="bg-theme-elevated/40 p-4 border-b border-theme/60 flex justify-between items-start gap-3">
          <h3 className="font-bold text-theme-primary text-base leading-snug tracking-wide group-hover:text-theme-accent transition-colors">
            {template.title}
          </h3>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(template)}
                title="Editar plantilla"
                className="text-theme-muted hover:text-theme-primary p-1.5 rounded-lg hover:bg-theme-elevated transition cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(template.id)}
              title="Eliminar plantilla"
              className="text-theme-muted hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo de la tarjeta */}
        <div className="p-4 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {template.brandName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-theme-elevated text-theme-accent border border-theme">
                <Briefcase className="w-3 h-3" />
                {template.brandName}
              </span>
            )}
            {template.categoryName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Tag className="w-3 h-3" />
                {template.categoryName}
              </span>
            )}
          </div>

          {/* Previsualización de Imagen */}
          {template.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-theme bg-theme-elevated/30 max-h-36">
              <img
                src={template.imageUrl}
                alt={template.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
          )}

          {/* Contenido */}
          <div className="bg-theme-elevated/70 border border-theme/60 rounded-xl p-3 text-xs text-theme-primary/90 font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
            {template.content}
          </div>
        </div>
      </div>

      {/* Pie de Tarjeta */}
      <div className="p-4 pt-2 border-t border-theme/60 flex items-center justify-between relative">
        <span className="text-[11px] font-medium text-theme-muted flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-theme-muted/70" />
          Usado <strong className="text-theme-primary">{template.usageCount}</strong> veces
        </span>

        <div className="relative">
          {template.imageUrl ? (
            // Botón con menú desplegable si hay imagen
            <button
              onClick={() => setShowCopyOptions(!showCopyOptions)}
              className="btn-theme-primary px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isCopied || copyStatus ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copyStatus || (isCopied ? '¡Texto Copiado!' : 'Copiar...')}
            </button>
          ) : (
            // Botón normal solo para texto
            <button
              onClick={handleCopyTextOnly}
              className="btn-theme-primary px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? '¡Copiado!' : 'Copiar'}
            </button>
          )}

          {/* Menú Flotante de Opciones de Copiado */}
          {showCopyOptions && (
            <div className="absolute right-0 bottom-10 bg-theme-surface border border-theme rounded-xl shadow-2xl p-1.5 z-20 w-44 flex flex-col gap-1">
              <button
                onClick={handleCopyTextOnly}
                className="flex items-center gap-2 px-3 py-2 text-xs text-theme-primary hover:bg-theme-elevated rounded-lg transition text-left cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-theme-accent" />
                Copiar Texto
              </button>
              <button
                onClick={handleCopyImageOnly}
                className="flex items-center gap-2 px-3 py-2 text-xs text-theme-primary hover:bg-theme-elevated rounded-lg transition text-left cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Copiar Imagen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};