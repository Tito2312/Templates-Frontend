import React, { useState } from 'react';
import { categoryApi } from '../../api/categoryApi';
import type { Category } from '../../types';

interface Props {
  categories: Category[];
  onCategoriesUpdated: () => void;
}

export const CategoryManager: React.FC<Props> = ({ categories, onCategoriesUpdated }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setLoading(true);
      await categoryApi.createCategory(newCategoryName.trim());
      setNewCategoryName('');
      onCategoriesUpdated();
    } catch (error) {
      console.error('Error al crear categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      setLoading(true);
      await categoryApi.updateCategory(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
      onCategoriesUpdated();
    } catch (error) {
      console.error('Error al actualizar categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseas eliminar esta categoria?')) return;

    try {
      setLoading(true);
      await categoryApi.deleteCategory(id);
      onCategoriesUpdated();
    } catch (error) {
      console.error('Error al eliminar categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-section">
      <form onSubmit={handleCreate} className="create-form">
        <input
          type="text"
          placeholder="Nueva categoria..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newCategoryName.trim()}>
          Agregar
        </button>
      </form>

      <ul className="item-list">
        {categories.map((cat) => (
          <li key={cat.id} className="item-row">
            {editingId === cat.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  disabled={loading}
                />
                <button onClick={() => handleSaveEdit(cat.id)} disabled={loading}>
                  Guardar
                </button>
                <button onClick={handleCancelEdit} disabled={loading}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="view-container">
                <span>{cat.name}</span>
                <div className="actions">
                  <button onClick={() => handleStartEdit(cat)} disabled={loading}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(cat.id)} disabled={loading}>
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};