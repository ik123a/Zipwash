import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Moon, ShieldCheck, Shirt, Sparkles, Sun, User } from 'lucide-react';

const demoMachines = [
  { code: 'M1', status: 'available' },
  { code: 'M2', status: 'available' },
  { code: 'M3', status: 'available' },
  { code: 'W1', status: 'available' },
  { code: 'W2', status: 'busy' },
];

export default function Login() {
  const navigate = useNavigate();
  const { loginStudent, loginAdmin, registerStudent } = useAuth();
  const { theme, toggleTheme } = useAppData();

  const [studentForm, setStudentForm] = useState({ name: '', rollNumber: '', phone: '', room: '', password: '' });
  const [adminForm, setAdminForm] = useState({ username: 'admin', password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await registerStudent(studentForm);
        toast.success('Student account created. Please sign in.');
        setIsRegistering(false);
        setStudentForm((prev) => ({ ...prev, password: '' }));
      } else {
        await loginStudent(studentForm.rollNumber, studentForm.password);
        toast.success('Welcome back to ZIPPWASH.');
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Unable to continue.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(adminForm.username, adminForm.password);
      toast.success('Admin access granted.');
      navigate('/admin');
    } catch (error) {
      setError(error.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20">
              <Shirt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ZIPPWASH</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Smart laundry management for students and staff</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="text-sm font-medium">Dark Mode</span>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-500 to-slate-900 p-8 text-white shadow-2xl shadow-blue-600/20">
              <Badge className="rounded-full bg-white/15 px-4 py-1.5 text-white">Complete working demo</Badge>
              <h2 className="mt-6 text-5xl font-bold leading-tight">A perfected ZIPPWASH experience for both students and admins.</h2>
              <p className="mt-4 max-w-2xl text-base text-blue-50">
                This build includes a working student portal, admin portal, dark mode, order tracking, dry-clean checkout, rewards, feedback capture and more.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  'Student dashboard with live machine cards',
                  'Admin controls for orders and machine statuses',
                  'Persistent demo data using local storage',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-blue-50">{item}</div>
                ))}
              </div>
            </div>

            <Card className="dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle>Live Machine Snapshot</CardTitle>
                <CardDescription>Mirrors the status visuals from the dashboard screenshots.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-5">
                  {demoMachines.map((machine) => (
                    <div key={machine.code} className={`rounded-2xl border p-4 text-center ${machine.status === 'available' ? 'border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10' : 'border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10'}`}>
                      <p className="text-xl font-bold">{machine.code}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{machine.status}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <Tabs defaultValue="student" className="w-full" onValueChange={() => { setError(''); setIsRegistering(false); }}>
              <TabsList className="grid h-14 w-full grid-cols-2 rounded-none border-b bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                <TabsTrigger value="student" className="gap-2 text-sm font-semibold"><User className="h-4 w-4" /> Student</TabsTrigger>
                <TabsTrigger value="admin" className="gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4" /> Admin</TabsTrigger>
              </TabsList>

              <div className="p-8">
                {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

                <TabsContent value="student" className="mt-0">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>{isRegistering ? 'Create Student Account' : 'Student Sign In'}</CardTitle>
                    <CardDescription>{isRegistering ? 'Register a new student profile to access the portal.' : 'Use the demo account or your registered profile to continue.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <form className="space-y-4" onSubmit={handleStudentSubmit}>
                      {isRegistering && (
                        <>
                          <FormField label="Full Name">
                            <Input value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} placeholder="Test Student" required />
                          </FormField>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Phone Number">
                              <Input value={studentForm.phone} onChange={(event) => setStudentForm({ ...studentForm, phone: event.target.value })} placeholder="9876543210" required />
                            </FormField>
                            <FormField label="Room">
                              <Input value={studentForm.room} onChange={(event) => setStudentForm({ ...studentForm, room: event.target.value })} placeholder="A-204" required />
                            </FormField>
                          </div>
                        </>
                      )}
                      <FormField label="Roll Number">
                        <Input value={studentForm.rollNumber} onChange={(event) => setStudentForm({ ...studentForm, rollNumber: event.target.value })} placeholder="TS001" required />
                      </FormField>
                      <FormField label="Password">
                        <Input type="password" value={studentForm.password} onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })} placeholder="••••••••" required />
                      </FormField>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>{loading ? 'Please wait...' : isRegistering ? 'Create Account' : 'Sign In'}</Button>
                    </form>
                    <Button variant="ghost" className="mt-3 w-full" onClick={() => setIsRegistering((value) => !value)}>
                      {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
                    </Button>
                    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
                      Demo student: <span className="font-mono font-semibold">TS001 / student123</span>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="admin" className="mt-0">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Admin Portal</CardTitle>
                    <CardDescription>Use the staff demo credentials to access machine and order management.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <form className="space-y-4" onSubmit={handleAdminSubmit}>
                      <FormField label="Username">
                        <Input value={adminForm.username} onChange={(event) => setAdminForm({ ...adminForm, username: event.target.value })} placeholder="admin" required />
                      </FormField>
                      <FormField label="Password">
                        <Input type="password" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} placeholder="••••••••" required />
                      </FormField>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700" disabled={loading}>{loading ? 'Authenticating...' : 'Sign In as Admin'}</Button>
                    </form>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                      Demo admin: <span className="font-mono font-semibold">admin / admin123</span>
                    </div>
                  </CardContent>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
