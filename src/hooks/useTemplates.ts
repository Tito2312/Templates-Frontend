import { useState, useEffect, useCallback } from 'react';
import type { TemplateResponse, TemplateRequest, Brand, Category } from '../types';
import { templateApi } from '../api/templateApi';
import { brandApi } from '../api/brandApi';
import { categoryApi } from '../api/categoryApi';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estados de Filtros
  const [query, setQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Estados de Interfaz
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar catálogos de marcas y categorías al montar el hook
    useEffect(() => {
    let isMounted = true;

    const loadFilters = async () => {
        try {
        const [brandsData, categoriesData] = await Promise.all([
            brandApi.getBrands(),
            categoryApi.getCategories(),
        ]);
        if (isMounted) {
            setBrands(brandsData);
            setCategories(categoriesData);
        }
        } catch (err) {
        console.error('Error al cargar marcas y categorías', err);
        }
    };

  loadFilters();

  return () => {
    isMounted = false;
  };
}, []);

  // Función principal de búsqueda de plantillas
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await templateApi.searchTemplates(query, selectedBrand, selectedCategory);
      setTemplates(data);
    } catch (err) {
      console.error('Error al consultar plantillas', err);
    } finally {
      setLoading(false);
    }
  }, [query, selectedBrand, selectedCategory]);

  // Debounce automático al escribir en la barra de búsqueda o cambiar filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemplates();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchTemplates]);

  // Copia rápida al portapapeles + Incremento optimista de uso (+1)
  const handleCopy = async (template: TemplateResponse) => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopiedId(template.id);

      // Incremento asíncrono en Backend
      await templateApi.incrementUsage(template.id);

      // Actualización optimista inmediata en la UI local
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
        )
      );

      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Error al copiar el texto al portapapeles', err);
    }
  };

  // Eliminar plantilla
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Deseas eliminar esta plantilla permanentemente?')) {
      try {
        await templateApi.deleteTemplate(id);
        await fetchTemplates();
      } catch (err) {
        console.error('Error al eliminar la plantilla', err);
      }
    }
  };

  // Crear nueva plantilla
  const handleCreate = async (payload: TemplateRequest) => {
    try {
      await templateApi.createTemplate(payload);
      await fetchTemplates();
    } catch (err) {
      console.error('Error al crear la plantilla', err);
      throw err;
    }
  };

  return {
    // Datos
    templates,
    brands,
    categories,
    // Filtros y mutadores
    query,
    setQuery,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    // Estado UI
    copiedId,
    loading,
    // Acciones
    handleCopy,
    handleDelete,
    handleCreate,
    refreshTemplates: fetchTemplates,
  };
};