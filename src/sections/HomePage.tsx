import { useState, useEffect } from 'react';
import type { WashingMachine } from '@/types';
import { MachineCard } from '@/components/ui/custom/MachineCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  MapPin, 
  RefreshCw, 
  TrendingUp, 
  Users,
  CheckCircle2,
  AlertCircle,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomePageProps {
  machines: WashingMachine[];
  hostels: { id: string; name: string; code: string; location: string }[];
  selectedHostel: string;
  onHostelChange: (hostelId: string) => void;
  onBookMachine: (machineId: string) => void;
  getNextAvailableTime: (hostelId: string) => number;
  getAvailableCount: (hostelId: string) => number;
}

export function HomePage({ 
  machines, 
  hostels, 
  selectedHostel, 
  onHostelChange, 
  onBookMachine,
  getNextAvailableTime,
  getAvailableCount
}: HomePageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const hostelMachines = machines.filter(m => m.hostelId === selectedHostel);
  const availableMachines = hostelMachines.filter(m => m.status === 'available');
  const busyMachines = hostelMachines.filter(m => m.status === 'busy');
  const reservedMachines = hostelMachines.filter(m => m.status === 'reserved');
  // const offlineMachines = hostelMachines.filter(m => m.status === 'offline');

  const nextAvailableTime = getNextAvailableTime(selectedHostel);
  const availableCount = getAvailableCount(selectedHostel);

  const selectedHostelData = hostels.find(h => h.id === selectedHostel);

  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-fade-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Live Status</h2>
          <p className="text-slate-500 flex items-center gap-2 mt-2 text-sm">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span className="mx-2 text-slate-300">•</span>
            <MapPin className="w-4 h-4" />
            {selectedHostelData?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedHostel} onValueChange={onHostelChange}>
            <SelectTrigger className="w-[200px] bg-white shadow-sm border-slate-200 hover:border-slate-300 transition-colors">
              <SelectValue placeholder="Select Hostel" />
            </SelectTrigger>
            <SelectContent>
              {hostels.map(hostel => (
                <SelectItem key={hostel.id} value={hostel.id}>
                  {hostel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="hover:bg-slate-50 shadow-sm">
            <RefreshCw className={cn('w-4 h-4 text-slate-600', isRefreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Stats Overview - Modern Glass Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="group bg-gradient-to-br from-emerald-50/80 to-emerald-100/60 border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-700">{availableMachines.length}</p>
                <p className="text-sm text-emerald-600 font-medium">Available</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </Card>

        <Card className="group bg-gradient-to-br from-rose-50/80 to-rose-100/60 border-rose-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 shadow-lg shadow-rose-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-rose-700">{busyMachines.length}</p>
                <p className="text-sm text-rose-600 font-medium">In Use</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </Card>

        <Card className="group bg-gradient-to-br from-amber-50/80 to-amber-100/60 border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-700">{reservedMachines.length}</p>
                <p className="text-sm text-amber-600 font-medium">Reserved</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </Card>

        <Card className="group bg-gradient-to-br from-sky-50/80 to-sky-100/60 border-sky-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-default overflow-hidden relative">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-sky-700">{hostelMachines.length}</p>
                <p className="text-sm text-sky-600 font-medium">Total</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-sky-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </Card>
      </div>

      {/* Next Available Alert */}
      {availableCount === 0 && nextAvailableTime > 0 && (
        <Card className="bg-gradient-to-r from-sky-500 to-sky-600 text-white border-0 shadow-lg shadow-sky-200 animate-fade-up overflow-hidden relative">
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-lg">Next Machine Free In</p>
                <p className="text-sky-100 text-sm">Approximately {nextAvailableTime} minutes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{nextAvailableTime}</p>
              <p className="text-sm text-sky-100 font-medium">min</p>
            </div>
          </CardContent>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </Card>
      )}

      {/* All Clear Message */}
      {availableCount > 0 && availableCount >= hostelMachines.length / 2 && (
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-200 animate-fade-up overflow-hidden relative">
          <CardContent className="p-5 flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Great timing! {availableCount} machines available</p>
              <p className="text-emerald-100 text-sm">Book your slot now and skip the wait</p>
            </div>
          </CardContent>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Card>
      )}

      {/* Machines Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-slate-900">Washing Machines</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-100">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Busy
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-100">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Reserved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hostelMachines.map((machine, index) => (
            <div key={machine.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <MachineCard
                machine={machine}
                onBook={onBookMachine}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Usage Tips */}
      <Card className="bg-gray-50 border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Peak Hours Tip</p>
              <p className="text-sm text-gray-500 mt-1">
                Weekdays 6-8 PM and weekends 10 AM-12 PM are usually the busiest. 
                Try booking during off-peak hours for quicker availability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
