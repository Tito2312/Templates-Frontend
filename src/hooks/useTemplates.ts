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

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar metadatos (Marcas y Categorías) para eventos manuales
  const fetchMetadata = useCallback(async () => {
    if (!session.getUserId()) return;
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

  // Cargar plantillas para eventos manuales (crear, editar, eliminar)
  const fetchTemplates = useCallback(async () => {
    if (!session.getUserId()) return;
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

  // Refrescar metadatos y plantillas manualmente tras cambios
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
  }, []);

  // Efecto único de sincronización con la API (evita renders en cascada)
  useEffect(() => {
    let isActive = true;
    const userId = session.getUserId();

    if (!userId) {
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [brandsData, categoriesData, templatesData] = await Promise.all([
          brandApi.getBrands(),
          categoryApi.getCategories(),
          templateApi.searchTemplates(query, selectedBrand, selectedCategory),
        ]);

        if (isActive) {
          setBrands(brandsData);
          setCategories(categoriesData);
          setTemplates(templatesData);
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
  }, [query, selectedBrand, selectedCategory]);

  // Copia de texto directo
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

  // Copia de texto ya formateado con variables
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

  const handleCreate = async (payload: Omit<TemplateRequest, 'userId'>) => {
    const activeUserId = session.getUserId();
    if (!activeUserId) return;
    await templateApi.createTemplate({ ...payload, userId: activeUserId });
    await fetchTemplates();
  };

  const handleUpdate = async (id: number, payload: Omit<TemplateRequest, 'userId'>) => {
    const activeUserId = session.getUserId();
    if (!activeUserId) return;
    await templateApi.updateTemplate(id, { ...payload, userId: activeUserId });
    await fetchTemplates();
  };

  return {
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
    handleCopyFormatted,
    handleDelete,
    handleCreate,
    handleUpdate,
    refreshTemplates: refreshAll,
    clearData,
  };
};