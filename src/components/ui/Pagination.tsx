import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // Total de plantillas que cumplen la búsqueda/filtros
  totalElements: number;
  onPageChange: (page: number) => void;
}

/**
 * Siempre informa cuántas plantillas hay y en qué página se está;
 * las flechas solo aparecen cuando hay más de una página.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  if (totalElements === 0) return null;

  const hasMultiplePages = totalPages > 1;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      {hasMultiplePages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 bg-theme-surface border border-theme rounded-xl text-theme-primary hover:bg-theme-elevated transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <span className="text-xs text-theme-muted font-medium px-3">
        <strong className="text-theme-primary">{totalElements}</strong>{' '}
        {totalElements === 1 ? 'plantilla' : 'plantillas'} · Página{' '}
        <strong className="text-theme-primary">{currentPage + 1}</strong> de{' '}
        <strong className="text-theme-primary">{Math.max(totalPages, 1)}</strong>
      </span>

      {hasMultiplePages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 bg-theme-surface border border-theme rounded-xl text-theme-primary hover:bg-theme-elevated transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
