import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 bg-theme-surface border border-theme rounded-xl text-theme-primary hover:bg-theme-elevated transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        title="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-xs text-theme-muted font-medium px-3">
        Página <strong className="text-theme-primary">{currentPage + 1}</strong> de{' '}
        <strong className="text-theme-primary">{totalPages}</strong>
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-2 bg-theme-surface border border-theme rounded-xl text-theme-primary hover:bg-theme-elevated transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        title="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};