import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { AppLayout } from './components/layout/AppLayout';

const Login = lazy(() => import('./pages/Login'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StaffAdminPanel = lazy(() => import('./pages/StaffAdminPanel'));
const TrackLaundry = lazy(() => import('./pages/TrackLaundry'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Rewards = lazy(() => import('./pages/Rewards'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Reminders = lazy(() => import('./pages/Reminders'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PrivacyPage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.PrivacyPage })));
const CookiePage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.CookiePage })));
const TermsPage = lazy(() => import('./pages/InfoPages').then((m) => ({ default: m.TermsPage })));

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

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-accent" />
        <span className="text-sm font-medium text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
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
