import React from 'react';
import { TemplateCard } from './TemplateCard';
import type { TemplateResponse } from '../../types';

interface TemplateGridProps {
  templates: TemplateResponse[];
  copiedId: number | null;
  onCopy: (template: TemplateResponse) => void;
  onDelete: (id: number) => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  copiedId,
  onCopy,
  onDelete,
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
        No se encontraron plantillas que coincidan con los criterios de búsqueda.
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
        />
      ))}
    </div>
  );
};