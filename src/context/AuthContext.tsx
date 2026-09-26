import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';
import type { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  loginStudent: (rollNumber: string, password: string) => Promise<{ user: User }>;
  loginAdmin: (username: string, password: string) => Promise<{ user: User }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const loginStudent = async (roll_number: string, password: string) => {
    const data = await authService.loginStudent(roll_number, password);
    setUser(data.user);
    return data;
  };

  const loginAdmin = async (username: string, password: string) => {
    const data = await authService.loginAdmin(username, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 animate-pulse" />
          <span className="text-lg font-semibold text-foreground">Loading ZIPPWASH...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loginStudent, loginAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
