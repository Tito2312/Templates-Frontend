import { useState } from 'react';
import { Header } from './components/layout/Header';
import { SearchBar } from './components/ui/SearchBar';
import { FilterSelect } from './components/ui/FilterSelect';
import { TemplateGrid } from './components/templates/TemplateGrid';
import { NewTemplateModal } from './components/templates/NewTemplateModal';
import { ManageCategoriesModal } from './components/ui/ManageCategoriesModal';
import { AuthModal } from './components/auth/AuthModal';
import { useTemplates } from './hooks/useTemplates';
import { session } from './utils/session';
import type { User, TemplateResponse, TemplateRequest } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => session.getUser());
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateResponse | null>(null);

  const {
    templates,
    brands,
    categories,
    query,
    setQuery,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    copiedId,
    loading,
    handleCopy,
    handleDelete,
    handleCreate,
    handleUpdate,
    refreshTemplates,
    clearData,
  } = useTemplates();

  const handleLoginSuccess = () => {
    const user = session.getUser();
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    refreshTemplates(); 
  };

  const handleLogout = () => {
    session.clearSession();
    setCurrentUser(null);
    clearData();
    setIsAuthModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditModal = (template: TemplateResponse) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleSubmitTemplate = async (data: Omit<TemplateRequest, 'userId'>) => {
    if (editingTemplate) {
      await handleUpdate(editingTemplate.id, data);
    } else {
      await handleCreate(data);
    }
    setEditingTemplate(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Encabezado */}
      <Header
        currentUser={currentUser}
        onOpenModal={handleOpenCreateModal}
        onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Barra de Filtros y Búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Escribe para buscar por título o contenido..."
            />
          </div>

          <div className="md:col-span-3">
            <FilterSelect
              label="Marca"
              value={selectedBrand}
              options={brands}
              onChange={setSelectedBrand}
              defaultText="Todas las Marcas"
            />
          </div>

          <div className="md:col-span-3">
            <FilterSelect
              label="Categoría"
              value={selectedCategory}
              options={categories}
              onChange={setSelectedCategory}
              defaultText="Todas las Categorías"
            />
          </div>
        </div>

        {/* Grid de Plantillas */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            Cargando plantillas...
          </div>
        ) : (
          <TemplateGrid
            templates={templates}
            copiedId={copiedId}
            onCopy={handleCopy}
            onDelete={handleDelete}
            onEdit={handleOpenEditModal}
          />
        )}
      </main>

      {/* Modal Crear / Editar Plantilla */}
      <NewTemplateModal
        key={editingTemplate ? `edit-${editingTemplate.id}` : 'new-template'}
        isOpen={isTemplateModalOpen}
        brands={brands}
        categories={categories}
        templateToEdit={editingTemplate}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleSubmitTemplate}
      />

      {/* Modal Marcas y Categorías */}
      <ManageCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        onRefresh={refreshTemplates}
      />

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}