const USER_KEY = 'app_user';
const TOKEN_KEY = 'app_token';

export const session = {
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.warn('Error al parsear app_user del localStorage:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser: (user: unknown) => {
    if (user && user !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && token !== 'undefined' ? token : null;
  },

  setToken: (token: string) => {
    if (token && token !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  clear: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};