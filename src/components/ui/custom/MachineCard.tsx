import type { WashingMachine } from '@/types';
import { StatusBadge, StatusDot } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Timer,
  WashingMachine as MachineIcon,
  AlertTriangle,
  Droplets,
  User,
  Package,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MachineCardProps {
  machine: WashingMachine;
  onBook?: (machineId: string) => void;
  onClick?: (machine: WashingMachine) => void;
  compact?: boolean;
  className?: string;
  // New props for enhanced info
  currentUser?: {
    name: string;
    rollNumber?: string;
    orderId?: string;
    items?: number;
    startTime?: string;
  };
  timeRemaining?: number; // in minutes
}

export function MachineCard({
  machine,
  onBook,
  onClick,
  compact = false,
  className,
  currentUser,
  timeRemaining
}: MachineCardProps) {
  const isAvailable = machine.status === 'available';
  const isBusy = machine.status === 'busy';
  const isReserved = machine.status === 'reserved';
  const isOffline = machine.status === 'offline';

  // Calculate remaining time if provided or fallback
  const remainingTime = timeRemaining ?? machine.timeRemaining;

  // Format time as mm:ss or hours if > 60
  const formatTime = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes} min`;
  };

  // Calculate progress percentage
  const progressPercent = remainingTime
    ? Math.max(0, Math.min(100, 100 - (remainingTime / 60) * 100))
    : 0;

  const statusConfig = {
    available: {
      border: 'border-emerald-200/60',
      bg: 'bg-gradient-to-br from-emerald-50/80 to-white',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-500',
      iconColor: 'text-white',
      shadow: 'shadow-emerald-100',
      shimmer: 'from-emerald-400/10',
    },
    busy: {
      border: 'border-blue-200/60',
      bg: 'bg-gradient-to-br from-blue-50/80 to-white',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-500',
      iconColor: 'text-white',
      shadow: 'shadow-blue-100',
      shimmer: 'from-blue-400/10',
    },
    reserved: {
      border: 'border-amber-200/60',
      bg: 'bg-gradient-to-br from-amber-50/80 to-white',
      iconBg: 'bg-gradient-to-br from-amber-400 to-amber-500',
      iconColor: 'text-white',
      shadow: 'shadow-amber-100',
      shimmer: 'from-amber-400/10',
    },
    offline: {
      border: 'border-slate-200/60',
      bg: 'bg-gradient-to-br from-slate-50/80 to-white',
      iconBg: 'bg-gradient-to-br from-slate-300 to-slate-400',
      iconColor: 'text-white',
      shadow: 'shadow-slate-100',
      shimmer: 'from-slate-400/10',
    },
  };

  const config = statusConfig[machine.status];

  if (compact) {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 overflow-hidden relative group',
          config.bg,
          config.border,
          className
        )}
        onClick={() => onClick?.(machine)}
      >
        <div className={cn("absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl opacity-20 rounded-full -translate-y-1/2 translate-x-1/2", config.shimmer)} />
        <CardContent className="p-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg',
              config.iconBg,
            )}>
              <MachineIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">{machine.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StatusDot status={machine.status} size="sm" />
                <span className="text-xs text-slate-500">
                  {isBusy && remainingTime ? `${formatTime(remainingTime)} remaining` :
                  isAvailable ? 'Ready to use' : isReserved ? 'Booked' : 'Maintenance'}
                </span>
              </div>
            </div>
          </div>
          {isAvailable && onBook && (
            <Button size="sm" className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800 shadow-md">
              Book
            </Button>
          )}
        </CardContent>

        {/* Compact Mode - Progress Bar for Busy Machines */}
        {isBusy && remainingTime !== undefined && (
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300 relative group',
        config.bg,
        config.border,
        isAvailable && 'hover:-translate-y-1 hover:shadow-xl cursor-pointer',
        className
      )}
      onClick={() => isAvailable && onClick?.(machine)}
    >
      {/* Decorative shimmer */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl opacity-20 rounded-full -translate-y-1/2 translate-x-1/2", config.shimmer)} />

      {/* Status indicator line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        isAvailable && 'bg-gradient-to-r from-emerald-400 to-emerald-500',
        isBusy && 'bg-gradient-to-r from-blue-400 to-blue-500',
        isReserved && 'bg-gradient-to-r from-amber-400 to-amber-500',
        isOffline && 'bg-gradient-to-r from-slate-300 to-slate-400',
      )} />

      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105',
            config.iconBg,
          )}>
            <Droplets className="w-7 h-7 text-white" />
          </div>
          <StatusBadge status={machine.status} size="sm" />
        </div>

        <h3 className="font-bold text-lg mb-1 text-slate-900">{machine.name}</h3>
        <p className="text-xs text-slate-500 mb-3">Machine #{machine.name}</p>

        {/* Enhanced Info Section */}
        <div className="space-y-2.5">
          {isBusy && (
            <>
              {/* Current User Info */}
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700 bg-white/60 rounded-lg px-3 py-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="font-medium truncate">{currentUser.name}</span>
                  </div>

                  {currentUser.rollNumber && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Badge variant="outline" className="text-[10px]">
                        {currentUser.rollNumber}
                      </Badge>
                    </div>
                  )}

                  {currentUser.orderId && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-xs">{currentUser.orderId}</span>
                    </div>
                  )}

                  {currentUser.items && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-xs">{currentUser.items} items</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">Unknown user</span>
                </div>
              )}

              {/* Time Remaining */}
              {remainingTime !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2">
                    <Timer className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{formatTime(remainingTime)} remaining</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round(progressPercent)}% complete</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Start Time */}
                  {currentUser?.startTime && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>Started at {currentUser.startTime}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {isAvailable && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">Ready to use now</span>
            </div>
          )}

          {isReserved && currentUser && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold">Reserved by {currentUser.name}</span>
              </div>
              {currentUser.startTime && (
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Clock className="w-3 h-3" />
                  <span>Slot: {currentUser.startTime}</span>
                </div>
              )}
            </div>
          )}

          {isReserved && !currentUser && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-semibold">Reserved slot</span>
            </div>
          )}

          {isOffline && (
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Under maintenance</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          {isAvailable && onBook && (
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-shadow font-semibold"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onBook(machine.id);
              }}
            >
              Book Slot
            </Button>
          )}

          {isBusy && (
            <Button variant="outline" className="w-full border-slate-200 text-slate-400 cursor-not-allowed" disabled>
              <Timer className="w-4 h-4 mr-2" />
              In Progress
            </Button>
          )}

          {isReserved && (
            <Button variant="outline" className="w-full border-amber-200 text-amber-600 bg-amber-50/50 cursor-not-allowed" disabled>
              Reserved
            </Button>
          )}

          {isOffline && (
            <Button variant="outline" className="w-full border-slate-200 text-slate-400 cursor-not-allowed" disabled>
              Unavailable
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Export a demo version with mock user data
export function MachineCardWithDemo({
  machine,
  ...props
}: MachineCardProps & { demoUser?: boolean }) {
  // Generate demo user data based on machine status
  const demoCurrentUser = machine.status === 'busy' ? {
    name: 'Rahul Sharma',
    rollNumber: 'CS2021001',
    orderId: 'ORD-089',
    items: 8,
    startTime: '10:30 AM',
  } : machine.status === 'reserved' ? {
    name: 'Priya Patel',
    rollNumber: 'CS2021002',
    startTime: '02:00 PM',
  } : undefined;

  const demoTimeRemaining = machine.status === 'busy' ? 35 : undefined;

  return (
    <MachineCard
      machine={machine}
      currentUser={props.demoUser ? demoCurrentUser : undefined}
      timeRemaining={props.demoUser ? demoTimeRemaining : machine.timeRemaining}
      {...props}
    />
  );
}

export default MachineCard;
