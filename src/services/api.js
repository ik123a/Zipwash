import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  loginStudent: async (roll_number, password) => {
    const response = await api.post('/auth/student/login', { roll_number, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  loginStaff: async (username, password) => {
    // Implement when staff login API is ready. For now, simulate.
    const response = await api.post('/auth/staff/login', { username, password });
    return response.data;
  },

  registerStudent: async (name, roll_number, phone_number, password) => {
    const response = await api.post('/auth/student/register', { name, roll_number, phone_number, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

export default api;
