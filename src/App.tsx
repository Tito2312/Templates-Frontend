import { useState } from 'react';
import { Header } from './components/layout/Header';
import { SearchBar } from './components/ui/SearchBar';
import { FilterSelect } from './components/ui/FilterSelect';
import { TemplateGrid } from './components/templates/TemplateGrid';
import { NewTemplateModal } from './components/templates/NewTemplateModal';
import { ManageCategoriesModal } from './components/ui/ManageCategoriesModal';
import { FillVariablesModal } from './components/templates/FillVariablesModal';
import { AuthModal } from './components/auth/AuthModal';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { ToastContainer } from './components/ui/Toast';
import { Pagination } from './components/ui/Pagination';
import { useTemplates } from './hooks/useTemplates';
import { useToast } from './hooks/useToast';
import { extractVariables } from './utils/templateUtils';
import { session } from './utils/session';
import type { User, TemplateResponse, TemplateRequest } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => session.getUser());
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateResponse | null>(null);

  // Estados para el Modal de Confirmación de Eliminación
  const [deletingTemplateId, setDeletingTemplateId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para el Modal de Variables Dinámicas
  const [variableTemplate, setVariableTemplate] = useState<TemplateResponse | null>(null);
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);

  // Hook de Notificaciones Flotantes
  const { toasts, showToast, removeToast } = useToast();

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
    page,
    setPage,
    totalPages,
    copiedId,
    loading,
    handleCopy,
    handleCopyFormatted,
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
    showToast(`¡Bienvenido de nuevo, ${user?.username || ''}!`, 'success');
  };

  const handleLogout = () => {
    session.clear();
    setCurrentUser(null);
    clearData();
    setIsAuthModalOpen(true);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditModal = (template: TemplateResponse) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleSubmitTemplate = async (data: TemplateRequest) => {
    try {
      if (editingTemplate) {
        await handleUpdate(editingTemplate.id, data);
        showToast('Plantilla actualizada con éxito', 'success');
      } else {
        await handleCreate(data);
        showToast('Plantilla creada con éxito', 'success');
      }
      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
    } catch {
      showToast('Error al guardar la plantilla', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTemplateId) return;
    setIsDeleting(true);
    try {
      await handleDelete(deletingTemplateId);
      showToast('Plantilla eliminada correctamente', 'success');
    } catch {
      showToast('Error al eliminar la plantilla', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingTemplateId(null);
    }
  };

  const handleCopyClick = async (template: TemplateResponse) => {
    const vars = extractVariables(template.content);
    if (vars.length > 0) {
      setVariableTemplate(template);
      setDetectedVariables(vars);
    } else {
      await handleCopy(template);
      showToast('¡Texto copiado al portapapeles!', 'success');
    }
  };

  // COLOR DE LA MARCA O COLOR DEFAULT (Índigo #6366f1)
  const activeBrandObject = brands.find(
    (b) => b.name.toLowerCase() === selectedBrand?.toLowerCase()
  );
  const themeColor = activeBrandObject?.colorHex || '#6366f1';

  return (
    <div 
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative transition-colors duration-500 overflow-x-hidden"
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      {/* 1. Línea Superior de Marca */}
      <div 
        className="h-1.5 w-full transition-all duration-500 z-50 shrink-0" 
        style={{ backgroundColor: themeColor }} 
      />

      {/* 2. Atmósfera Masiva de Fondo (Degradado Radial Envolvente) */}
      <div
        className="pointer-events-none fixed inset-0 opacity-25 transition-all duration-700 ease-in-out z-0"
        style={{
          background: `radial-gradient(circle at 50% 15%, ${themeColor} 0%, transparent 65%)`
        }}
      />

      {/* Sistema Global de Notificaciones Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="relative z-10 flex flex-col flex-1">
        <Header
          currentUser={currentUser}
          onOpenModal={handleOpenCreateModal}
          onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          themeColor={themeColor} // Pass color to header
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
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

          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium">
              Cargando plantillas...
            </div>
          ) : (
            <>
              <TemplateGrid
                templates={templates}
                copiedId={copiedId}
                onCopy={handleCopyClick}
                onDelete={(id) => setDeletingTemplateId(id)}
                onEdit={handleOpenEditModal}
                themeColor={themeColor}
              />

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </main>
      </div>

      {/* Modales */}
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

      <ManageCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        onRefresh={refreshTemplates}
      />

      <FillVariablesModal
        isOpen={!!variableTemplate}
        template={variableTemplate}
        variables={detectedVariables}
        onClose={() => setVariableTemplate(null)}
        onCopyFormatted={async (formattedText) => {
          if (variableTemplate) {
            await handleCopyFormatted(variableTemplate.id, formattedText);
            showToast('¡Texto formateado copiado!', 'success');
          }
        }}
      />

      <ConfirmModal
        isOpen={deletingTemplateId !== null}
        title="¿Eliminar plantilla?"
        message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTemplateId(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}