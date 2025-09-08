import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};