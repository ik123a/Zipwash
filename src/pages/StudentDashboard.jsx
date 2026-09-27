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
      processing: <Badge className="bg-info text-white">Processing</Badge>,
      washing: <Badge className="bg-warning text-white">Washing</Badge>,
      ready: <Badge className="bg-success text-white">Ready for Pickup</Badge>,
      delivered: <Badge variant="outline">Delivered</Badge>,
    };
    return badges[status] || <Badge variant="secondary">{status}</Badge>;
  };

  const getMachineColor = (status) => {
    const colors = {
      available: 'bg-success-surface text-success-foreground border-success',
      busy: 'bg-warning-surface text-warning-foreground border-warning',
      reserved: 'bg-info-surface text-info-foreground border-info',
      offline: 'bg-error-surface text-error-foreground border-error',
    };
    return colors[status] || 'bg-muted text-text-strong border-border';
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
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-4 shadow-inner">
          <Loader2 className="h-8 w-8 animate-spin text-text-moderate dark:text-muted-foreground" />
        </div>
        <p className="text-muted-foreground dark:text-muted-foreground font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto w-full animate-fade-up bg-transparent">
      {/* Stats Row - Modern Glass Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card className="group bg-gradient-to-br from-muted/80 to-muted/60 border-border/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-text-moderate dark:text-muted-foreground">Total Submissions</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-muted-foreground to-muted-foreground flex items-center justify-center shadow-sm shadow-slate-200">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{history.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time laundry requests</p>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-success-surface/80 to-success-surface/60 border-success/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-success-foreground dark:text-success-foreground">Available</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success to-success flex items-center justify-center shadow-sm shadow-emerald-200">
              <WashingMachine className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-foreground">{stats.available}</div>
            <p className="text-xs text-success-foreground/70 mt-1">of {stats.total} machines</p>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-warning-surface/80 to-warning-surface/60 border-warning/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-warning-foreground dark:text-warning-foreground">In Use</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning to-warning flex items-center justify-center shadow-sm shadow-amber-200">
              <WashingMachine className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning-foreground">{stats.busy}</div>
            <p className="text-xs text-warning-foreground/70 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-error-surface/80 to-error-surface/60 border-error/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-error-foreground dark:text-error-foreground">Offline</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-error to-error flex items-center justify-center shadow-sm shadow-rose-200">
              <WashingMachine className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-error-foreground">{stats.offline}</div>
            <p className="text-xs text-error-foreground/70 mt-1">Maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="border-error bg-error-surface">
          <CardContent className="pt-6">
            <p className="text-sm text-error-foreground">Could not connect to the backend server. Showing last known data.</p>
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
            <CardDescription className="text-xs dark:text-muted-foreground">Live availability across all machines</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData}>
            <RefreshCw className="h-3 w-3 mr-2" /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {machines.length === 0 ? (
            <p className="text-sm text-muted-foreground dark:text-muted-foreground py-4">No machines found.</p>
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
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
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
            className="w-full flex justify-between items-center bg-info hover:bg-info text-white"
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