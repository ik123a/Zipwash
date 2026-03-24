import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import api from '../services/api';
import { toast } from 'sonner';
import {
    Activity,
    LogOut,
    CheckCircle2,
    Settings,
    WashingMachine
} from 'lucide-react';

export default function StaffAdminPanel() {
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [submissionsRes, machinesRes] = await Promise.all([
          api.get('/staff/laundry'),
          api.get('/staff/machines')
      ]);
      setSubmissions(submissionsRes.data);
      setMachines(machinesRes.data);
    } catch (error) {
       console.error("Failed to fetch admin data", error);
       toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const updateLaundryStatus = async (id, newStatus) => {
      try {
          await api.put(`/staff/laundry/${id}/status`, { status: newStatus });
          toast.success("Status updated!");
          fetchData(); // Refresh
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update status");
      }
  };

  const updateMachineStatus = async (id, newStatus) => {
      try {
          await api.put(`/staff/machines/${id}/status`, { status: newStatus });
          toast.success("Machine updated!");
          fetchData(); // Refresh
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update machine");
      }
  }

  const getStatusColor = (status) => {
    switch (status) {
        case 'submitted': return "secondary";
        case 'processing': return "default";
        case 'washing': return "destructive"; // Just for color differentiation here
        case 'ready': return "outline";
        case 'delivered': return "secondary";
        default: return "secondary";
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading admin panel...</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
        <div className="flex flex-1 items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ZIPPWASH Admin</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">{user?.name} (Staff)</span>
            <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5 text-slate-500 hover:text-red-500" />
            </Button>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Machine Management Section */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle>Machine Fleet Management</CardTitle>
                    <CardDescription>Update the current status of all washing machines</CardDescription>
                </div>
                <WashingMachine className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {machines.map(m => (
                        <div key={m.id} className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center gap-3">
                            <span className="font-bold text-lg">{m.machine_number}</span>
                            <Select 
                                defaultValue={m.status} 
                                onValueChange={(val) => updateMachineStatus(m.id, val)}
                            >
                                <SelectTrigger className="w-full text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">🟢 Available</SelectItem>
                                    <SelectItem value="busy">🟡 Busy</SelectItem>
                                    <SelectItem value="reserved">🔵 Reserved</SelectItem>
                                    <SelectItem value="offline">🔴 Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Laundry Management Section */}
        <Card>
            <CardHeader>
                <CardTitle>Active Laundry Submissions</CardTitle>
                <CardDescription>
                    Manage student laundry queues and update processing stages.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border bg-white overflow-hidden">
                    <Table>
                        <TableHeader>
                        <TableRow className="bg-slate-100/50">
                            <TableHead>Student</TableHead>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Current Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">No active submissions.</TableCell>
                                </TableRow>
                            ) : (
                                submissions.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.student_name}</TableCell>
                                        <TableCell className="text-slate-500">{item.roll_number}</TableCell>
                                        <TableCell className="text-xs">{new Date(item.submission_time).toLocaleString()}</TableCell>
                                        <TableCell>{item.number_of_clothes}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(item.status)} className="capitalize">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Select 
                                                 defaultValue={item.status}
                                                 onValueChange={(val) => updateLaundryStatus(item.id, val)}
                                            >
                                                <SelectTrigger className="w-[140px] ml-auto h-8 text-xs">
                                                    <SelectValue placeholder="Update Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="submitted">Submitted</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="washing">Washing</SelectItem>
                                                    <SelectItem value="ready">Ready for Pickup</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
