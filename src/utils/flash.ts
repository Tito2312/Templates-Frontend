import type { ToastType } from '../components/ui/Toast';

const FLASH_KEY = 'app_flash';

export interface FlashMessage {
  type: ToastType;
  message: string;
}

/**
 * Aviso de un solo uso que sobrevive a un cambio de página (p. ej. "Bienvenido" tras el login
 * o "Sesión cerrada" al volver al inicio). Se guarda en sessionStorage y se consume al mostrarse.
 */
export const flash = {
  set: (message: string, type: ToastType = 'success') => {
    try {
      sessionStorage.setItem(FLASH_KEY, JSON.stringify({ message, type }));
    } catch {
      // Sin sessionStorage (modo privado estricto) simplemente no se muestra el aviso
    }
  },

  peek: (): FlashMessage | null => {
    try {
      const raw = sessionStorage.getItem(FLASH_KEY);
      return raw ? (JSON.parse(raw) as FlashMessage) : null;
    } catch {
      return null;
    }
  },

  clear: () => {
    try {
      sessionStorage.removeItem(FLASH_KEY);
    } catch {
      // ignorado
    }
  },
};
