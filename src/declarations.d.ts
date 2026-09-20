declare module '*.jsx' {
  import * as React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

declare module '../context/AuthContext' {
  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useAuth: () => {
    user: {
      id: string;
      name: string;
      email: string;
      hostelId: string;
      roomNumber: string;
      isAdmin: boolean;
      role: 'student' | 'staff';
      roll_number?: string;
    } | null;
    setUser: (user: any) => void;
    loginStudent: (roll_number: string, password: string) => Promise<any>;
    loginAdmin: (username: string, password: string) => Promise<any>;
    logout: () => void;
    loading: boolean;
  };
}

declare module '@/context/AuthContext' {
  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useAuth: () => {
    user: {
      id: string;
      name: string;
      email: string;
      hostelId: string;
      roomNumber: string;
      isAdmin: boolean;
      role: 'student' | 'staff';
      roll_number?: string;
    } | null;
    setUser: (user: any) => void;
    loginStudent: (roll_number: string, password: string) => Promise<any>;
    loginAdmin: (username: string, password: string) => Promise<any>;
    logout: () => void;
    loading: boolean;
  };
}

declare module './context/AuthContext' {
  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useAuth: () => {
    user: {
      id: string;
      name: string;
      email: string;
      hostelId: string;
      roomNumber: string;
      isAdmin: boolean;
      role: 'student' | 'staff';
      roll_number?: string;
    } | null;
    setUser: (user: any) => void;
    loginStudent: (roll_number: string, password: string) => Promise<any>;
    loginAdmin: (username: string, password: string) => Promise<any>;
    logout: () => void;
    loading: boolean;
  };
}

declare module './pages/Login' {
  const Login: React.ComponentType;
  export default Login;
}

declare module './pages/StudentDashboard' {
  const StudentDashboard: React.ComponentType;
  export default StudentDashboard;
}

declare module './pages/StaffAdminPanel' {
  const StaffAdminPanel: React.ComponentType;
  export default StaffAdminPanel;
}

declare module '../modals/ProfileSettingsModal' {
  export const ProfileSettingsModal: React.ComponentType<{
    isOpen: boolean;
    onClose: (open: boolean) => void;
  }>;
}

declare module '@/services/api' {
  import { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export const authService: {
    loginStudent: (roll_number: string, password: string) => Promise<any>;
    registerStudent: (name: string, roll_number: string, phone: string, password: string) => Promise<any>;
    loginAdmin: (username: string, password: string) => Promise<any>;
    logout: () => void;
    getCurrentUser: () => any;
  };
  export const slotService: {
    getBookedSlots: (date: string) => Promise<any[]>;
    bookSlot: (date: string, time: string) => Promise<any>;
  };
  export default api;
}

declare module '../services/api' {
  import { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export const authService: {
    loginStudent: (roll_number: string, password: string) => Promise<any>;
    loginAdmin: (username: string, password: string) => Promise<any>;
    registerStudent: (name: string, roll_number: string, phone_number: string, password: string) => Promise<any>;
    updateProfile: (name: string, phone_number: string, password: string) => Promise<any>;
    logout: () => void;
    getCurrentUser: () => any;
  };
  export const slotService: {
    getBookedSlots: (date: string) => Promise<any[]>;
    bookSlot: (date: string, time: string) => Promise<any>;
  };
  export default api;
}
