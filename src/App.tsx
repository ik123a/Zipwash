import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StaffAdminPanel from './pages/StaffAdminPanel';
import TrackLaundry from './pages/TrackLaundry';
import Pricing from './pages/Pricing';
import Rewards from './pages/Rewards';
import Transactions from './pages/Transactions';
import Reminders from './pages/Reminders';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import { PrivacyPage, CookiePage, TermsPage } from './pages/InfoPages';

const StudentGuard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'student') return <Navigate to="/admin" replace />;
  return <Outlet />;
};

const StaffGuard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'staff') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'staff' ? '/admin' : '/dashboard'} replace /> : <Login />} />

      {/* Student routes - require auth + student role */}
      <Route element={<StudentGuard />}>
        <Route element={<AppLayout><Outlet /></AppLayout>}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/track" element={<TrackLaundry />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiePage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
      </Route>

      {/* Staff routes - require auth + staff role */}
      <Route element={<StaffGuard />}>
        <Route element={<AppLayout><Outlet /></AppLayout>}>
          <Route path="/admin" element={<StaffAdminPanel />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'staff' ? '/admin' : '/dashboard') : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <Toaster position="top-right" richColors />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
