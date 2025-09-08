import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Chat API
export const chatService = {
  sendMessage: (data) => api.post('/chat/message', data).then(res => res.data),
  getChatHistory: (params) => api.get('/chat/history', { params }).then(res => res.data),
  endSession: (data) => api.post('/chat/end-session', data).then(res => res.data),
};

// User API
export const userService = {
  getProfile: () => api.get('/user/profile').then(res => res.data),
  updateProfile: (data) => api.put('/user/profile', data).then(res => res.data),
  getDashboard: () => api.get('/user/dashboard').then(res => res.data),
  deleteAccount: () => api.delete('/user/account').then(res => res.data),
};

// Crisis API
export const crisisService = {
  getResources: (country) => api.get('/crisis/resources', { params: { country } }).then(res => res.data),
  reportCrisis: (data) => api.post('/crisis/report', data).then(res => res.data),
};

export default api;