import React from 'react';
import { Copy, Check, Trash2, Image as ImageIcon } from 'lucide-react';
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
    <div className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between transition shadow-md hover:shadow-xl relative group">
      <div>
        {/* Encabezado de la tarjeta */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-slate-100 pr-6">{template.title}</h3>
          <button
            onClick={() => onDelete(template.id)}
            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            title="Eliminar plantilla"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Badges de Marca, Categoría y Usos */}
        <div className="flex flex-wrap gap-2 mb-3">
          {template.brandName && (
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/50 text-xs px-2.5 py-1 rounded-md font-medium">
              {template.brandName}
            </span>
          )}
          {template.categoryName && (
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs px-2.5 py-1 rounded-md font-medium">
              {template.categoryName}
            </span>
          )}
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-md ml-auto">
            {template.usageCount} usos
          </span>
        </div>

        {/* Contenido de la plantilla */}
        <p className="text-slate-300 text-sm bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 whitespace-pre-wrap mb-3 max-h-40 overflow-y-auto">
          {template.content}
        </p>

        {/* Enlace de adjunto si existe */}
        {template.imageUrl && (
          <div className="mb-3">
            <a
              href={template.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:underline"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ver adjunto / imagen</span>
            </a>
          </div>
        )}
      </div>

      {/* Botón Acción Copiar */}
      <button
        onClick={() => onCopy(template)}
        className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition ${
          isCopied
            ? 'bg-emerald-600 text-white'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4" />
            <span>¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copiar Mensaje</span>
          </>
        )}
      </button>
    </div>
  );
};