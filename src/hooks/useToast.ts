import { useState, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../components/ui/Toast';

/**
 * @param getInitial opcional: aviso con el que arranca la vista (p. ej. un flash pendiente)
 */
export const useToast = (getInitial?: () => { message: string; type: ToastType } | null) => {
  const [toasts, setToasts] = useState<ToastMessage[]>(() => {
    const initial = getInitial?.();
    return initial ? [{ id: 'initial', ...initial }] : [];
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};
