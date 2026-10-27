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

  // Función auxiliar para cargar metadatos desde acciones manuales
  const fetchMetadata = useCallback(async () => {
    if (!session.getUser()) return;
    try {
      const [brandsData, categoriesData] = await Promise.all([
        brandApi.getBrands(),
        categoryApi.getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);

      // Si el filtro activo apunta a una marca/categoría que se eliminó o renombró, vuelve a "Todas"
      setSelectedBrand((prev) => (prev && !brandsData.some((b) => b.name === prev) ? '' : prev));
      setSelectedCategory((prev) => (prev && !categoriesData.some((c) => c.name === prev) ? '' : prev));
    } catch (err) {
      console.error('Error al cargar marcas/categorías', err);
    }
  }, []);

  // Función auxiliar para cargar plantillas desde acciones manuales
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

  // Refrescar metadatos y plantillas tras una acción estructural
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchMetadata(), fetchTemplates()]);
  }, [fetchMetadata, fetchTemplates]);

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

  // 1. Carga inicial de metadatos (Marcas y Categorías) al montar
  useEffect(() => {
    let ignore = false;

    if (!session.getUser()) return;

    Promise.all([
      brandApi.getBrands(),
      categoryApi.getCategories(),
    ])
      .then(([brandsData, categoriesData]) => {
        if (!ignore) {
          setBrands(brandsData);
          setCategories(categoriesData);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Error al cargar marcas/categorías', err);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 2. Carga dinámica de plantillas al cambiar filtros o paginación
useEffect(() => {
    let ignore = false;

    if (!session.getUser()) return;

    // Se difiere la actualización de estado para evitar la ejecución sincrónica en el efecto
    queueMicrotask(() => {
      if (!ignore) {
        setLoading(true);
      }
    });

    templateApi
      .searchTemplates(query, selectedBrand, selectedCategory, page, 9)
      .then((data) => {
        if (!ignore) {
          setTemplates(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Error al consultar plantillas', err);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query, selectedBrand, selectedCategory, page]);

  // Acciones
 const handleCopy = async (template: TemplateResponse) => {
    // 1. Copia al portapapeles y actualización optimista de UI
    try {
      await navigator.clipboard.writeText(template.content);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);

      // Incremento optimista en la lista local
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id
            ? { ...t, usageCount: (t.usageCount || 0) + 1 }
            : t
        )
      );

      // 2. Notificación en segundo plano al backend
      await templateApi.incrementUsage(template.id);
    } catch (err) {
      console.error('Error al copiar', err);
    }
  };

const handleCopyFormatted = async (templateId: number, formattedContent: string) => {
    try {
      await navigator.clipboard.writeText(formattedContent);
      setCopiedId(templateId);
      setTimeout(() => setCopiedId(null), 2000);

      // Incremento optimista en la lista local
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? { ...t, usageCount: (t.usageCount || 0) + 1 }
            : t
        )
      );

      await templateApi.incrementUsage(templateId);
    } catch (err) {
      console.error('Error al copiar texto formateado', err);
    }
  };

const handleDelete = async (id: number) => {
    // 1. Guardar copia del estado previo para rollback
    const previousTemplates = [...templates];

    // 2. Eliminación optimista inmediata en la UI
    setTemplates((prev) => prev.filter((t) => t.id !== id));

    try {
      // 3. Ejecutar petición en segundo plano
      await templateApi.deleteTemplate(id);
    } catch (err) {
      console.error('Error al eliminar plantilla', err);
      // 4. Rollback: Restaurar la lista original si la API falla
      setTemplates(previousTemplates);
      throw err;
    }
  };

const handleCreate = async (payload: TemplateRequest) => {
    if (!session.getUser()) return;
    await templateApi.createTemplate(payload);
    await fetchTemplates();
  };;

const handleUpdate = async (id: number, payload: TemplateRequest) => {
    if (!session.getUser()) return;

    // 1. Guardar copia previa para rollback
    const previousTemplates = [...templates];

    // 2. Actualización optimista aplicando las propiedades del payload
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...payload,
            }
          : t
      )
    );

    try {
      // 3. Petición al backend; su respuesta trae brandName/categoryName actualizados
      const updated = await templateApi.updateTemplate(id, payload);
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Error al actualizar plantilla', err);
      // 4. Rollback en caso de error
      setTemplates(previousTemplates);
      throw err;
    }
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
  };
};