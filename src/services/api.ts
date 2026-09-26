import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth Service ───────────────────────────────────────────────────
export const authService = {
  loginStudent: async (roll_number: string, password: string) => {
    const { data } = await api.post('/auth/student/login', { roll_number, password });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    return data;
  },

  registerStudent: async (name: string, roll_number: string, phone: string, password: string) => {
    const { data } = await api.post('/auth/student/register', {
      name, roll_number, phone_number: phone, password
    });
    return data;
  },

  loginAdmin: async (username: string, password: string) => {
    const { data } = await api.post('/auth/staff/login', { email: username, password });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

// ─── Slot Service ───────────────────────────────────────────────────
export const slotService = {
  getBookedSlots: async (date: string) => {
    const { data } = await api.get(`/slots?date=${date}`);
    return data.booked_slots || data.booked || [];
  },

  bookSlot: async (date: string, time: string) => {
    const { data } = await api.post('/slots', { date, time });
    return data;
  },
};

export default api;
