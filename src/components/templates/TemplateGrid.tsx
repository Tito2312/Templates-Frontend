import React from 'react';
import { BookmarkX } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import type { TemplateResponse } from '../../types';

interface TemplateGridProps {
  templates: TemplateResponse[];
  copiedId: number | null;
  onCopy: (template: TemplateResponse) => void;
  onDelete: (id: number) => void;
  onEdit?: (template: TemplateResponse) => void;
  themeColor?: string;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  copiedId,
  onCopy,
  onDelete,
  onEdit,
  themeColor
}) => {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl text-center">
        <div className="p-4 bg-slate-800 rounded-full mb-3 text-slate-400">
          <BookmarkX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">
          No se encontraron plantillas
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Intenta ajustar los criterios de búsqueda/filtros o crea una nueva plantilla desde el botón superior.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isCopied={copiedId === template.id}
          onCopy={onCopy}
          onDelete={onDelete}
          onEdit={onEdit}
          themeColor={themeColor}
        />
      ))}
    </div>
  );
};