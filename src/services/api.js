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
  
  loginAdmin: async (username, password) => {
    const response = await api.post('/auth/staff/login', { email: username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  registerStudent: async (name, roll_number, phone_number, password) => {
    const response = await api.post('/auth/student/register', { name, roll_number, phone_number, password });
    return response.data;
  },
  
  updateProfile: async (name, phone_number, password) => {
    const response = await api.put('/student/profile', { name, phone_number, password });
    if (response.data.message === 'Profile updated successfully') {
        const user = JSON.parse(localStorage.getItem('user'));
        const newUser = { ...user, name };
        localStorage.setItem('user', JSON.stringify(newUser));
    }
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

export const slotService = {
  getBookedSlots: async (date, machine_id = null) => {
    const url = machine_id ? `/slots?date=${date}&machine_id=${machine_id}` : `/slots?date=${date}`;
    const response = await api.get(url);
    if (machine_id) {
      return response.data.booked_slots || [];
    }
    return response.data.bookings || [];
  },

  bookSlot: async (date, time, machine_id = null) => {
    const response = await api.post('/slots', { date, time, machine_id });
    return response.data;
  },
};

export default api;

