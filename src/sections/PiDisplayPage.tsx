import { useState, useEffect } from 'react';
import type { WashingMachine } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Droplets, 
  Clock, 
  QrCode,
  Phone,
  Wifi,
  CheckCircle2,
  Timer,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PiDisplayPageProps {
  machines: WashingMachine[];
  hostels: { id: string; name: string; code: string }[];
  selectedHostel: string;
}

export function PiDisplayPage({ machines, hostels, selectedHostel }: PiDisplayPageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const blinkTimer = setInterval(() => setBlink(prev => !prev), 500);
    return () => {
      clearInterval(timeTimer);
      clearInterval(blinkTimer);
    };
  }, []);

  const hostelMachines = machines.filter(m => m.hostelId === selectedHostel);
  const availableCount = hostelMachines.filter(m => m.status === 'available').length;
  const busyCount = hostelMachines.filter(m => m.status === 'busy').length;
  const reservedCount = hostelMachines.filter(m => m.status === 'reserved').length;
  const offlineCount = hostelMachines.filter(m => m.status === 'offline').length;

  const nextFreeTime = Math.min(...hostelMachines
    .filter(m => m.status === 'busy' && m.timeRemaining)
    .map(m => m.timeRemaining || Infinity)
  ) || 0;

  const selectedHostelData = hostels.find(h => h.id === selectedHostel);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="w-12 h-12" />;
      case 'busy': return <Timer className="w-12 h-12" />;
      case 'reserved': return <AlertCircle className="w-12 h-12" />;
      case 'offline': return <XCircle className="w-12 h-12" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'reserved': return 'bg-amber-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'AVAILABLE';
      case 'busy': return 'IN USE';
      case 'reserved': return 'RESERVED';
      case 'offline': return 'OFFLINE';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Droplets className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold">WashWise</h1>
            <p className="text-lg md:text-2xl text-gray-400">{selectedHostelData?.name} Laundry Room</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl md:text-6xl font-bold font-mono">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-lg md:text-xl text-gray-400">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Status Summary Bar */}
      <div className="grid grid-cols-4 gap-3 md:gap-6 mb-6">
        <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-3 md:p-4 text-center">
          <p className="text-3xl md:text-5xl font-bold text-green-400">{availableCount}</p>
          <p className="text-sm md:text-lg text-green-300 mt-1">AVAILABLE</p>
        </div>
        <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-3 md:p-4 text-center">
          <p className="text-3xl md:text-5xl font-bold text-red-400">{busyCount}</p>
          <p className="text-sm md:text-lg text-red-300 mt-1">IN USE</p>
        </div>
        <div className="bg-amber-500/20 border-2 border-amber-500 rounded-xl p-3 md:p-4 text-center">
          <p className="text-3xl md:text-5xl font-bold text-amber-400">{reservedCount}</p>
          <p className="text-sm md:text-lg text-amber-300 mt-1">RESERVED</p>
        </div>
        <div className="bg-gray-500/20 border-2 border-gray-500 rounded-xl p-3 md:p-4 text-center">
          <p className="text-3xl md:text-5xl font-bold text-gray-400">{offlineCount}</p>
          <p className="text-sm md:text-lg text-gray-300 mt-1">OFFLINE</p>
        </div>
      </div>

      {/* Next Available Alert */}
      {availableCount === 0 && nextFreeTime > 0 && nextFreeTime !== Infinity && (
        <div className={cn(
          'bg-blue-500 rounded-xl p-4 md:p-6 mb-6 text-center',
          blink && 'bg-blue-600'
        )}>
          <p className="text-xl md:text-2xl font-semibold">Next Machine Available In</p>
          <p className="text-5xl md:text-7xl font-bold mt-2">{nextFreeTime} MINUTES</p>
        </div>
      )}

      {/* Machines Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {hostelMachines.map((machine) => (
          <Card
            key={machine.id}
            className={cn(
              'border-4 overflow-hidden',
              machine.status === 'available' && 'border-green-500 bg-green-500/10',
              machine.status === 'busy' && 'border-red-500 bg-red-500/10',
              machine.status === 'reserved' && 'border-amber-500 bg-amber-500/10',
              machine.status === 'offline' && 'border-gray-500 bg-gray-500/10',
            )}
          >
            <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center h-full text-center">
              <div className={cn(
                'w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-2 md:mb-4',
                getStatusColor(machine.status)
              )}>
                {getStatusIcon(machine.status)}
              </div>
              <p className="text-lg md:text-2xl font-bold">{machine.name}</p>
              <p className={cn(
                'text-sm md:text-lg font-semibold mt-1',
                machine.status === 'available' && 'text-green-400',
                machine.status === 'busy' && 'text-red-400',
                machine.status === 'reserved' && 'text-amber-400',
                machine.status === 'offline' && 'text-gray-400',
              )}>
                {getStatusText(machine.status)}
              </p>
              {machine.timeRemaining && machine.timeRemaining > 0 && (
                <p className="text-2xl md:text-4xl font-bold mt-2 text-white">
                  {machine.timeRemaining}<span className="text-lg md:text-2xl">min</span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-6 grid md:grid-cols-3 gap-4">
        {/* QR Code Section */}
        <Card className="bg-white text-gray-900 md:col-span-2">
          <CardContent className="p-4 md:p-6 flex items-center gap-4 md:gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <QrCode className="w-12 h-12 md:w-16 md:h-16 text-gray-800 mx-auto" />
              </div>
            </div>
            <div>
              <p className="text-xl md:text-3xl font-bold">Scan to Book a Slot</p>
              <p className="text-base md:text-xl text-gray-500 mt-1">
                Visit washwise.bennett.edu.in
              </p>
              <p className="text-sm md:text-base text-gray-400 mt-2">
                Book from your phone • Get notifications • Skip the wait
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Info */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Caretaker</p>
                  <p className="text-lg md:text-xl font-semibold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className={cn('w-5 h-5 md:w-6 md:h-6', blink ? 'text-green-400' : 'text-gray-500')} />
                <div>
                  <p className="text-sm text-gray-400">System Status</p>
                  <p className="text-lg md:text-xl font-semibold text-green-400">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-lg md:text-xl font-semibold">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
