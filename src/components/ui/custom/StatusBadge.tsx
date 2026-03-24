import type { MachineStatus } from '@/types';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: MachineStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  available: {
    label: 'Available',
    icon: CheckCircle2,
    bgColor: 'bg-green-500',
    textColor: 'text-green-500',
    lightBg: 'bg-green-50',
  },
  busy: {
    label: 'In Use',
    icon: Clock,
    bgColor: 'bg-red-500',
    textColor: 'text-red-500',
    lightBg: 'bg-red-50',
  },
  reserved: {
    label: 'Reserved',
    icon: AlertCircle,
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-500',
    lightBg: 'bg-amber-50',
  },
  offline: {
    label: 'Out of Order',
    icon: XCircle,
    bgColor: 'bg-gray-500',
    textColor: 'text-gray-500',
    lightBg: 'bg-gray-50',
  },
};

export function StatusBadge({ status, showLabel = true, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        config.lightBg,
        config.textColor,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export function StatusDot({ status, size = 'md', className }: { status: MachineStatus; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'rounded-full inline-block',
        config.bgColor,
        sizeClasses[size],
        status === 'busy' && 'animate-pulse',
        className
      )}
    />
  );
}

export function StatusCard({ status, timeRemaining, className }: { status: MachineStatus; timeRemaining?: number; className?: string }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-xl',
        config.lightBg,
        className
      )}
    >
      <Icon className={cn('w-8 h-8 mb-2', config.textColor)} />
      <span className={cn('font-semibold', config.textColor)}>{config.label}</span>
      {timeRemaining !== undefined && timeRemaining > 0 && (
        <span className="text-sm text-gray-600 mt-1">{timeRemaining} min left</span>
      )}
    </div>
  );
}
