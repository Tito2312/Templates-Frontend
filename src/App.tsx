import { useState } from 'react';
import { Header } from './components/layout/Header';
import { SearchBar } from './components/ui/SearchBar';
import { FilterSelect } from './components/ui/FilterSelect';
import { TemplateGrid } from './components/templates/TemplateGrid';
import { NewTemplateModal } from './components/templates/NewTemplateModal';
import { useTemplates } from './hooks/useTemplates';

export default function App() {
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
  } = useTemplates();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Encabezado */}
      <Header onOpenModal={() => setIsModalOpen(true)} />

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

        {/* Indicador de Carga o Grid de Plantillas */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium animate-pulse">
            Cargando plantillas...
          </div>
        ) : (
          <TemplateGrid
            templates={templates}
            copiedId={copiedId}
            onCopy={handleCopy}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Modal para Crear Plantilla */}
      <NewTemplateModal
        isOpen={isModalOpen}
        brands={brands}
        categories={categories}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}