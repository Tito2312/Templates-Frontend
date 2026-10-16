import React from 'react';
import { FileQuestion } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import type { TemplateResponse } from '../../types';

interface TemplateGridProps {
  templates: TemplateResponse[];
  copiedId: number | null;
  onCopy: (template: TemplateResponse) => void;
  onDelete: (id: number) => void;
  onEdit: (template: TemplateResponse) => void;
  themeColor?: string;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  copiedId,
  onCopy,
  onDelete,
  onEdit,
  themeColor,
}) => {
  if (templates.length === 0) {
    return (
      <div className="bg-theme-surface border border-theme rounded-2xl p-12 text-center max-w-md mx-auto shadow-xl transition-colors duration-300">
        <div className="p-3 bg-theme-elevated border border-theme rounded-2xl w-fit mx-auto mb-4 text-theme-accent">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-theme-primary mb-1">
          No se encontraron plantillas
        </h3>
        <p className="text-xs text-theme-muted">
          Intenta cambiar los términos de búsqueda o selecciona otra marca o categoría.
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