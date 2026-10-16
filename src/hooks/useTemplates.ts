import { useState, useEffect, useCallback } from 'react';
import { templateApi } from '../api/templateApi';
import { brandApi } from '../api/brandApi';
import { categoryApi } from '../api/categoryApi';
import { session } from '../utils/session';
import type { TemplateResponse, Brand, Category, TemplateRequest } from '../types';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Estados para Paginación
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar metadatos (Marcas y Categorías)
  const fetchMetadata = useCallback(async () => {
    if (!session.getUser()) return;
    try {
      const [brandsData, categoriesData] = await Promise.all([
        brandApi.getBrands(),
        categoryApi.getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error al cargar marcas/categorías', err);
    }
  }, []);

  // Cargar plantillas paginadas
  const fetchTemplates = useCallback(async () => {
    if (!session.getUser()) return;
    setLoading(true);
    try {
      const data = await templateApi.searchTemplates(query, selectedBrand, selectedCategory, page, 9);
      setTemplates(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error('Error al consultar plantillas', err);
    } finally {
      setLoading(false);
    }
  }, [query, selectedBrand, selectedCategory, page]);

  // Refrescar metadatos y plantillas tras un cambio
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchMetadata(), fetchTemplates()]);
  }, [fetchMetadata, fetchTemplates]);

  // Limpiar estados al cerrar sesión
  const clearData = useCallback(() => {
    setTemplates([]);
    setBrands([]);
    setCategories([]);
    setSelectedBrand('');
    setSelectedCategory('');
    setQuery('');
    setPage(0);
    setTotalPages(0);
    setTotalElements(0);
  }, []);

  const handleSetQuery = (val: string) => {
    setQuery(val);
    setPage(0);
  };

  const handleSetBrand = (val: string) => {
    setSelectedBrand(val);
    setPage(0);
  };

  const handleSetCategory = (val: string) => {
    setSelectedCategory(val);
    setPage(0);
  };

  // Efecto único de sincronización con la API
  useEffect(() => {
    let isActive = true;
    const user = session.getUser();

    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [brandsData, categoriesData, templatesData] = await Promise.all([
          brandApi.getBrands(),
          categoryApi.getCategories(),
          templateApi.searchTemplates(query, selectedBrand, selectedCategory, page, 9),
        ]);

        if (isActive) {
          setBrands(brandsData);
          setCategories(categoriesData);
          setTemplates(templatesData.content);
          setTotalPages(templatesData.totalPages);
          setTotalElements(templatesData.totalElements);
        }
      } catch (err) {
        console.error('Error al consultar datos', err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [query, selectedBrand, selectedCategory, page]);

  // Acciones
  const handleCopy = async (template: TemplateResponse) => {
    try {
      await navigator.clipboard.writeText(template.content);
      await templateApi.incrementUsage(template.id);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
      fetchTemplates();
    } catch (err) {
      console.error('Error al copiar', err);
    }
  };

  const handleCopyFormatted = async (templateId: number, formattedContent: string) => {
    try {
      await navigator.clipboard.writeText(formattedContent);
      await templateApi.incrementUsage(templateId);
      setCopiedId(templateId);
      setTimeout(() => setCopiedId(null), 2000);
      fetchTemplates();
    } catch (err) {
      console.error('Error al copiar texto formateado', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await templateApi.deleteTemplate(id);
      await fetchTemplates();
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  const handleCreate = async (payload: TemplateRequest) => {
    if (!session.getUser()) return;
    await templateApi.createTemplate(payload);
    await fetchTemplates();
  };

  const handleUpdate = async (id: number, payload: TemplateRequest) => {
    if (!session.getUser()) return;
    await templateApi.updateTemplate(id, payload);
    await fetchTemplates();
  };

  return {
    templates,
    brands,
    categories,
    query,
    setQuery: handleSetQuery,
    selectedBrand,
    setSelectedBrand: handleSetBrand,
    selectedCategory,
    setSelectedCategory: handleSetCategory,
    page,
    setPage,
    totalPages,
    totalElements,
    copiedId,
    loading,
    handleCopy,
    handleCopyFormatted,
    handleDelete,
    handleCreate,
    handleUpdate,
    refreshTemplates: refreshAll,
    clearData,
  };
};