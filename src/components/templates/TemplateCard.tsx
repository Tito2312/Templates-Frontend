import React from 'react';
import { Copy, Check, Trash2, Tag, Briefcase, Eye } from 'lucide-react';
import type { TemplateResponse } from '../../types';

interface TemplateCardProps {
  template: TemplateResponse;
  isCopied: boolean;
  onCopy: (template: TemplateResponse) => void;
  onDelete: (id: number) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isCopied,
  onCopy,
  onDelete,
}) => {
  return (
    <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Encabezado de la Tarjeta */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-indigo-300 transition">
            {template.title}
          </h3>
          <button
            onClick={() => onDelete(template.id)}
            title="Eliminar plantilla"
            className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Badges de Marca y Categoría */}
        <div className="flex flex-wrap gap-2 mb-3">
          {template.brandName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
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

        {/* Previsualización de Imagen Opcional */}
        {template.imageUrl && (
          <div className="mb-3 overflow-hidden rounded-lg border border-slate-700/60 max-h-36">
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Contenido de la Plantilla */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 mb-4 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
          {template.content}
        </div>
      </div>

      {/* Pie de Tarjeta: Contador y Botón de Copiar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          Usado <strong className="text-slate-200">{template.usageCount}</strong> veces
        </span>

        <button
          onClick={() => onCopy(template)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isCopied
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};