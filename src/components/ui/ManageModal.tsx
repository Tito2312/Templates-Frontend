import React, { useState } from 'react';
import { CategoryManager } from './CategoryManager';
import { BrandManager } from './BrandManager';
import type { Category, Brand } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
  onDataUpdated: () => void;
}

export const ManageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  brands,
  onDataUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="tabs-header">
          <button
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            Categorias
          </button>
          <button
            className={activeTab === 'brands' ? 'active' : ''}
            onClick={() => setActiveTab('brands')}
          >
            Marcas
          </button>
        </div>

        {activeTab === 'categories' ? (
          <CategoryManager categories={categories} onCategoriesUpdated={onDataUpdated} />
        ) : (
          <BrandManager brands={brands} onBrandsUpdated={onDataUpdated} />
        )}

        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>
    </div>
  );
};