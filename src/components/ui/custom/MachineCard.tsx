import type { WashingMachine } from '@/types';
import { StatusBadge, StatusDot } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, WashingMachine as MachineIcon, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MachineCardProps {
  machine: WashingMachine;
  onBook?: (machineId: string) => void;
  onClick?: (machine: WashingMachine) => void;
  compact?: boolean;
  className?: string;
}

export function MachineCard({ machine, onBook, onClick, compact = false, className }: MachineCardProps) {
  const isAvailable = machine.status === 'available';
  const isBusy = machine.status === 'busy';
  const isReserved = machine.status === 'reserved';
  const isOffline = machine.status === 'offline';

  const statusColors = {
    available: 'border-green-200 bg-green-50/50 hover:bg-green-50',
    busy: 'border-red-200 bg-red-50/50',
    reserved: 'border-amber-200 bg-amber-50/50',
    offline: 'border-gray-200 bg-gray-50/50 opacity-75',
  };

  if (compact) {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          statusColors[machine.status],
          className
        )}
        onClick={() => onClick?.(machine)}
      >
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              machine.status === 'available' && 'bg-green-100',
              machine.status === 'busy' && 'bg-red-100',
              machine.status === 'reserved' && 'bg-amber-100',
              machine.status === 'offline' && 'bg-gray-100',
            )}>
              <MachineIcon className={cn('w-5 h-5',
                machine.status === 'available' && 'text-green-600',
                machine.status === 'busy' && 'text-red-600',
                machine.status === 'reserved' && 'text-amber-600',
                machine.status === 'offline' && 'text-gray-600',
              )} />
            </div>
            <div>
              <p className="font-medium text-sm">{machine.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StatusDot status={machine.status} size="sm" />
                <span className="text-xs text-gray-500">
                  {isBusy && machine.timeRemaining ? `${machine.timeRemaining} min` : 
                   isAvailable ? 'Ready' : isReserved ? 'Booked' : 'Maintenance'}
                </span>
              </div>
            </div>
          </div>
          {isAvailable && onBook && (
            <Button size="sm" className="h-8 px-3 text-xs bg-soft-blue hover:bg-soft-blue/90">
              Book
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200',
        statusColors[machine.status],
        isAvailable && 'hover:shadow-lg cursor-pointer',
        className
      )}
      onClick={() => isAvailable && onClick?.(machine)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            machine.status === 'available' && 'bg-green-100',
            machine.status === 'busy' && 'bg-red-100',
            machine.status === 'reserved' && 'bg-amber-100',
            machine.status === 'offline' && 'bg-gray-100',
          )}>
            <MachineIcon className={cn('w-6 h-6',
              machine.status === 'available' && 'text-green-600',
              machine.status === 'busy' && 'text-red-600',
              machine.status === 'reserved' && 'text-amber-600',
              machine.status === 'offline' && 'text-gray-600',
            )} />
          </div>
          <StatusBadge status={machine.status} size="sm" />
        </div>

        <h3 className="font-semibold text-lg mb-1">{machine.name}</h3>
        
        <div className="space-y-2 mb-4">
          {isBusy && machine.timeRemaining !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Timer className="w-4 h-4" />
              <span>{machine.timeRemaining} minutes remaining</span>
            </div>
          )}
          {isAvailable && (
            <p className="text-sm text-green-600 font-medium">Ready to use</p>
          )}
          {isReserved && (
            <p className="text-sm text-amber-600 font-medium">Reserved slot</p>
          )}
          {isOffline && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Under maintenance</span>
            </div>
          )}
        </div>

        {isAvailable && onBook && (
          <Button 
            className="w-full bg-soft-blue hover:bg-soft-blue/90"
            onClick={(e) => {
              e.stopPropagation();
              onBook(machine.id);
            }}
          >
            Book Slot
          </Button>
        )}
        
        {isBusy && (
          <Button variant="outline" className="w-full" disabled>
            In Progress
          </Button>
        )}
        
        {isReserved && (
          <Button variant="outline" className="w-full border-amber-300 text-amber-700" disabled>
            Reserved
          </Button>
        )}
        
        {isOffline && (
          <Button variant="outline" className="w-full" disabled>
            Unavailable
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
