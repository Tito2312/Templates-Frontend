const USER_ID_KEY = 'sac_user_id';

export const session = {
  getUserId: (): number => {
    const id = localStorage.getItem(USER_ID_KEY);
    return id ? Number(id) : 1; 
  },

  setUserId: (id: number): void => {
    localStorage.setItem(USER_ID_KEY, id.toString());
  },

  clearSession: (): void => {
    localStorage.removeItem(USER_ID_KEY);
  },
};