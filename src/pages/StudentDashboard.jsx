import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { Activity, PlusCircle, WashingMachine, Loader2, RefreshCw, Calendar, ChevronRight } from 'lucide-react';
import { SubmitLaundry } from '../components/student/LaundryForms';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [preSelectedMachineId, setPreSelectedMachineId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [historyRes, machinesRes] = await Promise.all([
        api.get('/student/laundry'),
        api.get('/machines')
      ]);
      setHistory(historyRes.data);
      setMachines(machinesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      submitted: <Badge variant="secondary">Submitted</Badge>,
      processing: <Badge className="bg-blue-500 text-white">Processing</Badge>,
      washing: <Badge className="bg-yellow-500 text-white">Washing</Badge>,
      ready: <Badge className="bg-green-500 text-white">Ready for Pickup</Badge>,
      delivered: <Badge variant="outline">Delivered</Badge>,
    };
    return badges[status] || <Badge variant="secondary">{status}</Badge>;
  };

  const getMachineColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-700 border-green-200',
      busy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      reserved: 'bg-blue-100 text-blue-700 border-blue-200',
      offline: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const stats = {
    available: machines.filter(m => m.status === 'available').length,
    busy: machines.filter(m => m.status === 'busy').length,
    offline: machines.filter(m => m.status === 'offline').length,
    total: machines.length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-4 shadow-inner">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400" />
        </div>
        <p className="text-muted-foreground dark:text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto w-full animate-fade-up bg-transparent">
      {/* Stats Row - Modern Glass Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card className="group bg-gradient-to-br from-slate-50/80 to-slate-100/60 border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Submissions</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-sm shadow-slate-200">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{history.length}</div>
            <p className="text-xs text-slate-500 mt-1">All time laundry requests</p>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-emerald-50/80 to-emerald-100/60 border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Available</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <WashingMachine className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">{stats.available}</div>
            <p className="text-xs text-emerald-600/70 mt-1">of {stats.total} machines</p>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-amber-50/80 to-amber-100/60 border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-600 dark:text-amber-300">In Use</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm shadow-amber-200">
              <WashingMachine className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats.busy}</div>
            <p className="text-xs text-amber-600/70 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-rose-50/80 to-rose-100/60 border-rose-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-rose-600 dark:text-rose-300">Offline</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-sm shadow-rose-200">
              <WashingMachine className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700">{stats.offline}</div>
            <p className="text-xs text-rose-600/70 mt-1">Maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">Could not connect to the backend server. Showing last known data.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchData}>
              <RefreshCw className="h-3 w-3 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Machine Status Grid */}
      <Card className="dark:bg-slate-900/80 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium dark:text-white">Machine Status</CardTitle>
            <CardDescription className="text-xs dark:text-slate-400">Live availability across all machines</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData}>
            <RefreshCw className="h-3 w-3 mr-2" /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {machines.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No machines found.</p>
          ) : (
            machines.map(m => (
              <div
                key={m.id}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border flex-1 min-w-[80px] cursor-pointer transition-all hover:scale-105 active:scale-95 ${getMachineColor(m.status)}`}
                onClick={() => {
                  if (m.status !== 'offline') {
                    setPreSelectedMachineId(m.id);
                    setSubmitOpen(true);
                  }
                }}
              >
                <WashingMachine className="h-6 w-6 mb-1 opacity-80" />
                <span className="text-sm font-bold">{m.machine_number}</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider">{m.status}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Laundry</CardTitle>
          <CardDescription>Track the status of your submitted clothes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No laundry history found. Submit your first laundry order!
                  </TableCell>
                </TableRow>
              ) : (
                history.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.submission_time).toLocaleDateString()}</TableCell>
                    <TableCell>{item.number_of_clothes} clothes</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Submit your laundry for washing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full flex justify-between items-center bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
            onClick={() => {
              setPreSelectedMachineId(null);
              setSubmitOpen(true);
            }}
          >
            <span>Submit Laundry</span>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Booking/Laundry Modal */}
      {submitOpen && (
        <SubmitLaundry
          initialMachineId={preSelectedMachineId}
          onSuccess={() => { setSubmitOpen(false); setPreSelectedMachineId(null); fetchData(); }}
          onClose={() => { setSubmitOpen(false); setPreSelectedMachineId(null); }}
        />
      )}
    </div>
  );
}