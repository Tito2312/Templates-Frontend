import type { User } from '../types';

const USER_KEY = 'app_user';
const TOKEN_KEY = 'app_jwt_token';

export const session = {
  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  getUserId: (): number | null => {
    const user = session.getUser();
    return user ? user.id : null;
  },
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  clearSession: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};