import type { User } from '../types';

export const session = {
  getUserId: (): number => {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : 1;
  },

  setUserId: (id: number): void => {
    localStorage.setItem('userId', id.toString());
  },

  setUser: (user: User): void => {
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  clearSession: (): void => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  },
};