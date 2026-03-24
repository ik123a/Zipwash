import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StaffAdminPanel from './pages/StaffAdminPanel';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
      // Redirect based on role if they try to access wrong dashboard
      return <Navigate to={user.role === 'staff' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'staff' ? '/admin' : '/dashboard'} replace /> : <Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="staff">
             <StaffAdminPanel />
          </ProtectedRoute>
        }
      />
      {/* Default route */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'staff' ? '/admin' : '/dashboard') : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
