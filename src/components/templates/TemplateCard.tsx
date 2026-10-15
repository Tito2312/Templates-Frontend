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
  themeColor,
}) => {
  const activeColor = themeColor || '#6366f1';
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
    <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group relative">
      <div>
        {/* Encabezado */}
        <div className="flex justify-between items-start gap-3 mb-3 border-b border-slate-700/50 pb-2">
          <h3 className="font-bold text-slate-100 text-base leading-snug tracking-wide">
            {template.title}
          </h3>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
            {onEdit && (
              <button
                onClick={() => onEdit(template)}
                title="Editar plantilla"
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(template.id)}
              title="Eliminar plantilla"
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {template.brandName && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border"
              style={{
                backgroundColor: `${activeColor}15`,
                borderColor: `${activeColor}40`,
                color: activeColor,
              }}
            >
              <Briefcase className="w-3 h-3" />
              {template.brandName}
            </span>
          )}
          {template.categoryName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Tag className="w-3 h-3" />
              {template.categoryName}
            </span>
          )}
        </div>

        {/* Previsualización de Imagen */}
        {template.imageUrl && (
          <div className="mb-3 overflow-hidden rounded-lg border border-slate-700/60 max-h-36">
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 mb-4 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
          {template.content}
        </div>
      </div>

      {/* Pie de Tarjeta */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 relative">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          Usado <strong className="text-slate-200">{template.usageCount}</strong> veces
        </span>

        <div className="relative">
          {template.imageUrl ? (
            // Botón con menú desplegable si hay imagen
            <button
              onClick={() => setShowCopyOptions(!showCopyOptions)}
              style={{ backgroundColor: activeColor }}
              className="px-3 py-1.5 text-white rounded-xl text-xs font-medium hover:brightness-110 transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isCopied || copyStatus ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copyStatus || (isCopied ? '¡Texto Copiado!' : 'Copiar...')}
            </button>
          ) : (
            // Botón normal solo para texto
            <button
              onClick={handleCopyTextOnly}
              style={{ backgroundColor: activeColor }}
              className="px-3 py-1.5 text-white rounded-xl text-xs font-medium hover:brightness-110 transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? '¡Copiado!' : 'Copiar'}
            </button>
          )}

          {/* Menú Flotante de Opciones de Copiado */}
          {showCopyOptions && (
            <div className="absolute right-0 bottom-10 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1.5 z-20 w-44 flex flex-col gap-1">
              <button
                onClick={handleCopyTextOnly}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 rounded-lg transition text-left cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Copiar Texto
              </button>
              <button
                onClick={handleCopyImageOnly}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 rounded-lg transition text-left cursor-pointer"
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