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
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    lightBg: 'bg-emerald-50/80',
    border: 'border-emerald-200/60',
    ring: 'ring-emerald-200',
  },
  busy: {
    label: 'In Use',
    icon: Clock,
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-700',
    lightBg: 'bg-rose-50/80',
    border: 'border-rose-200/60',
    ring: 'ring-rose-200',
  },
  reserved: {
    label: 'Reserved',
    icon: AlertCircle,
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    lightBg: 'bg-amber-50/80',
    border: 'border-amber-200/60',
    ring: 'ring-amber-200',
  },
  offline: {
    label: 'Out of Order',
    icon: XCircle,
    bgColor: 'bg-slate-400',
    textColor: 'text-slate-700',
    lightBg: 'bg-slate-50/80',
    border: 'border-slate-200/60',
    ring: 'ring-slate-200',
  },
};

export function StatusBadge({ status, showLabel = true, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border transition-all duration-200',
        config.lightBg,
        config.textColor,
        config.border,
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
        'rounded-full inline-block shadow-sm',
        config.bgColor,
        sizeClasses[size],
        status === 'available' && 'shadow-emerald-300/50',
        status === 'busy' && 'shadow-rose-300/50 animate-pulse',
        status === 'reserved' && 'shadow-amber-300/50',
        status === 'offline' && 'shadow-slate-300/50',
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
        'flex flex-col items-center justify-center p-5 rounded-2xl border bg-gradient-to-br',
        config.lightBg,
        config.border,
        status === 'available' && 'from-emerald-50/80 to-white',
        status === 'busy' && 'from-rose-50/80 to-white',
        status === 'reserved' && 'from-amber-50/80 to-white',
        status === 'offline' && 'from-slate-50/80 to-white',
        'shadow-sm',
        className
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg',
        config.bgColor,
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className={cn('font-bold', config.textColor)}>{config.label}</span>
      {timeRemaining !== undefined && timeRemaining > 0 && (
        <span className="text-sm text-slate-600 mt-1 font-medium">{timeRemaining} min left</span>
      )}
    </div>
  );
}

// New Pill component for inline status display
export function StatusPill({ status, className }: { status: MachineStatus; className?: string }) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.lightBg,
        config.textColor,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.bgColor, status === 'busy' && 'animate-pulse')} />
      {config.label}
    </span>
  );
}
