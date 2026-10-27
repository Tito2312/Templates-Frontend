import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterSelect } from '../components/ui/FilterSelect';
import { TemplateGrid } from '../components/templates/TemplateGrid';
import { NewTemplateModal } from '../components/templates/NewTemplateModal';
import { ManageCategoriesModal } from '../components/ui/ManageCategoriesModal';
import { FillVariablesModal } from '../components/templates/FillVariablesModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ToastContainer } from '../components/ui/Toast';
import { Pagination } from '../components/ui/Pagination';
import { useTemplates } from '../hooks/useTemplates';
import { useToast } from '../hooks/useToast';
import { extractVariables } from '../utils/templateUtils';
import { useAuth } from '../context/authContext';
import { generateThemeFromHex } from '../utils/themeGenerator';
import { paletteToStyle } from '../utils/themeStyle';
import { getApiErrorMessage } from '../utils/apiError';
import { flash } from '../utils/flash';
import type { TemplateResponse, TemplateRequest } from '../types';

/**
 * Vista principal (ruta privada /dashboard): búsqueda, filtros y gestión de plantillas.
 */
export default function DashboardPage() {
  const { user: currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateResponse | null>(null);

  // Estados para el Modal de Confirmación de Eliminación
  const [deletingTemplateId, setDeletingTemplateId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para el Modal de Variables Dinámicas
  const [variableTemplate, setVariableTemplate] = useState<TemplateResponse | null>(null);

  // Hook de Notificaciones Flotantes (arranca con el aviso pendiente, p. ej. "Bienvenido")
  const { toasts, showToast, removeToast } = useToast(flash.peek);

  // El aviso pendiente ya se mostró: se consume para que no reaparezca al recargar
  useEffect(() => {
    flash.clear();
  }, []);

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
  } = useTemplates();

  const handleLogout = () => {
    flash.set('Sesión cerrada correctamente', 'info');
    logout();
    navigate('/', { replace: true });
  };

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditModal = (template: TemplateResponse) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  // Si el guardado falla, el error se relanza: el modal sigue abierto y lo muestra sin perder lo escrito
  const handleSubmitTemplate = async (data: TemplateRequest) => {
    if (editingTemplate) {
      await handleUpdate(editingTemplate.id, data);
      showToast('Plantilla actualizada con éxito', 'success');
    } else {
      await handleCreate(data);
      showToast('Plantilla creada con éxito', 'success');
    }
    handleCloseTemplateModal();
  };

  const handleConfirmDelete = async () => {
    if (!deletingTemplateId) return;
    setIsDeleting(true);
    try {
      await handleDelete(deletingTemplateId);
      showToast('Plantilla eliminada correctamente', 'success');
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Error al eliminar la plantilla'), 'error');
    } finally {
      setIsDeleting(false);
      setDeletingTemplateId(null);
    }
  };

  const handleCopyClick = async (template: TemplateResponse) => {
    const vars = extractVariables(template.content);
    if (vars.length > 0) {
      setVariableTemplate(template);
    } else {
      const copied = await handleCopy(template);
      if (copied) {
        showToast('¡Texto copiado al portapapeles!', 'success');
      } else {
        showToast('No se pudo copiar al portapapeles', 'error');
      }
    }
  };

  // Copia desde el modal de variables: solo se cierra si la copia funcionó
  const handleCopyFilledText = async (formattedText: string) => {
    if (!variableTemplate) return false;
    const copied = await handleCopyFormatted(variableTemplate.id, formattedText);
    if (copied) {
      showToast('¡Texto formateado copiado!', 'success');
      setVariableTemplate(null);
    } else {
      showToast('No se pudo copiar al portapapeles', 'error');
    }
    return copied;
  };

  // 1. Obtener la marca seleccionada y calcular su paleta armónica
  const activeBrandObject = brands.find(
    (b) => b.name.toLowerCase() === selectedBrand?.toLowerCase()
  );

  const currentPalette = generateThemeFromHex(activeBrandObject?.colorHex);

  return (
    <div 
      className="min-h-screen bg-theme-base text-theme-primary flex flex-col font-sans relative transition-colors duration-500 overflow-x-hidden"
      style={paletteToStyle(currentPalette)}
    >
      {/* Línea Superior Accent de la Marca */}
      <div 
        className="h-1.5 w-full transition-all duration-500 z-50 shrink-0" 
        style={{ backgroundColor: currentPalette.primary }} 
      />

      {/* Atmósfera Suave de Fondo */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20 transition-all duration-700 ease-in-out z-0"
        style={{
          background: `radial-gradient(circle at 50% 15%, ${currentPalette.primary} 0%, transparent 65%)`
        }}
      />

      {/* Sistema Global de Notificaciones Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="relative z-10 flex flex-col flex-1">
        <Header
          currentUser={currentUser}
          isAdmin={isAdmin}
          onOpenModal={handleOpenCreateModal}
          onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
          onLogout={handleLogout}
          themeColor={currentPalette.primary}
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
            <div className="text-center py-12 text-theme-muted font-medium">
              Cargando plantillas...
            </div>
          ) : (
            <>
              <TemplateGrid
                templates={templates}
                copiedId={copiedId}
                onCopy={handleCopyClick}
                onDelete={isAdmin ? (id) => setDeletingTemplateId(id) : undefined}
                onEdit={isAdmin ? handleOpenEditModal : undefined}
                themeColor={currentPalette.primary}
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

      {/* Modales: se montan solo mientras están abiertos, así cada apertura empieza con el estado limpio */}
      {isTemplateModalOpen && (
        <NewTemplateModal
          key={editingTemplate ? `edit-${editingTemplate.id}` : 'new-template'}
          isOpen
          brands={brands}
          categories={categories}
          templateToEdit={editingTemplate}
          onClose={handleCloseTemplateModal}
          onSubmit={handleSubmitTemplate}
        />
      )}

      {isCategoriesModalOpen && (
        <ManageCategoriesModal
          isOpen
          onClose={() => setIsCategoriesModalOpen(false)}
          onRefresh={refreshTemplates}
          onNotify={showToast}
        />
      )}

      {variableTemplate && (
        <FillVariablesModal
          key={variableTemplate.id}
          isOpen
          template={variableTemplate}
          onClose={() => setVariableTemplate(null)}
          onCopyFilledText={handleCopyFilledText}
          themeColor={currentPalette.primary}
        />
      )}

      <ConfirmModal
        isOpen={deletingTemplateId !== null}
        title="¿Eliminar plantilla?"
        message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTemplateId(null)}
      />

    </div>
  );
}