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
import { Badge } from '@/components/ui/badge';
import api from '../services/api';
import {
    Activity,
    LogOut,
    PlusCircle,
    ShoppingBag,
    WashingMachine
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubmitLaundry, BookSlot } from '../components/student/LaundryForms';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [submitOpen, setSubmitOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const historyRes = await api.get('/student/laundry');
      setHistory(historyRes.data);

      const machinesRes = await api.get('/machines');
      setMachines(machinesRes.data);
    } catch (error) {
       console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
        case 'submitted': return <Badge variant="secondary">Submitted</Badge>;
        case 'processing': return <Badge variant="default" className="bg-blue-500">Processing</Badge>;
        case 'washing': return <Badge variant="default" className="bg-yellow-500">Washing</Badge>;
        case 'ready': return <Badge variant="default" className="bg-green-500">Ready for Pickup</Badge>;
        case 'delivered': return <Badge variant="outline">Delivered</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
  }

  const getMachineColor = (status) => {
      switch(status) {
          case 'available': return 'bg-green-100 text-green-700 border-green-200';
          case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'reserved': return 'bg-blue-100 text-blue-700 border-blue-200';
          default: return 'bg-red-100 text-red-700 border-red-200';
      }
  }

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
        <div className="flex flex-1 items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ZIPPWASH</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Hi, {user?.name}</span>
            <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5 text-slate-500 hover:text-red-500" />
                <span className="sr-only">Logout</span>
            </Button>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                    <Activity className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{history.length}</div>
                    <p className="text-xs text-slate-500">All time laundry requests</p>
                </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-sm font-medium">Machine Status</CardTitle>
                        <CardDescription className="text-xs">Live availability</CardDescription>
                    </div>
                    <WashingMachine className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {machines.map(m => (
                        <div key={m.id} className={`flex flex-col items-center justify-center p-3 rounded-lg border flex-1 min-w-[80px] ${getMachineColor(m.status)}`}>
                            <WashingMachine className="h-6 w-6 mb-1 opacity-80" />
                            <span className="text-sm font-bold">{m.machine_number}</span>
                            <span className="text-[10px] uppercase font-semibold tracking-wider">{m.status}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="xl:col-span-3 lg:col-span-2">
                <CardHeader>
                <CardTitle>Recent Laundry</CardTitle>
                <CardDescription>
                    Track the status of your submitted clothes.
                </CardDescription>
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
                                <TableCell colSpan={3} className="text-center py-8 text-slate-500">No laundry history found.</TableCell>
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

            <Card className="flex flex-col justify-between">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>What do you need to do?</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full flex justify-between items-center" size="lg">
                                Submit Laundry <PlusCircle className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <SubmitLaundry onSuccess={() => { setSubmitOpen(false); fetchData(); }} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={bookOpen} onOpenChange={setBookOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full flex justify-between items-center bg-white text-slate-900 border hover:bg-slate-100" variant="outline" size="lg">
                                Book a Slot <Activity className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                             <BookSlot machines={machines} />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
