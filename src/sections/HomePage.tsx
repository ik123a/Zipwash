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
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Status</h2>
          <p className="text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span className="mx-2">•</span>
            <MapPin className="w-4 h-4" />
            {selectedHostelData?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedHostel} onValueChange={onHostelChange}>
            <SelectTrigger className="w-[180px]">
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
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{availableMachines.length}</p>
                <p className="text-sm text-green-600">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Timer className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{busyMachines.length}</p>
                <p className="text-sm text-red-600">In Use</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{reservedMachines.length}</p>
                <p className="text-sm text-amber-600">Reserved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{hostelMachines.length}</p>
                <p className="text-sm text-blue-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Available Alert */}
      {availableCount === 0 && nextAvailableTime > 0 && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Next Machine Free In</p>
                <p className="text-blue-100">Approximately {nextAvailableTime} minutes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{nextAvailableTime}</p>
              <p className="text-sm text-blue-100">min</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Clear Message */}
      {availableCount > 0 && availableCount >= hostelMachines.length / 2 && (
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Great timing! {availableCount} machines available</p>
              <p className="text-green-100">Book your slot now and skip the wait</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Machines Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Washing Machines</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Busy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Reserved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostelMachines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onBook={onBookMachine}
            />
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
