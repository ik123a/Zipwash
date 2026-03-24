import type { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Info,
  WashingMachine,
  CheckCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkRead: (notificationId: string) => void;
  onMarkAllRead: () => void;
}

const notificationIcons = {
  booking_confirm: CheckCircle2,
  reminder: Clock,
  expiry: AlertTriangle,
  machine_free: WashingMachine,
  system: Info,
};

const notificationColors = {
  booking_confirm: 'bg-green-100 text-green-600',
  reminder: 'bg-blue-100 text-blue-600',
  expiry: 'bg-red-100 text-red-600',
  machine_free: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600',
};

const notificationLabels = {
  booking_confirm: 'Booking',
  reminder: 'Reminder',
  expiry: 'Expiry Alert',
  machine_free: 'Machine Free',
  system: 'System',
};

export function NotificationsPage({ notifications, onMarkRead, onMarkAllRead }: NotificationsPageProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllRead} className="gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="bg-gray-50 border-gray-100">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">No notifications yet</h4>
            <p className="text-gray-500 text-sm">
              We'll notify you about your bookings and machine availability
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const colorClass = notificationColors[notification.type];
            const label = notificationLabels[notification.type];

            return (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all duration-200',
                  !notification.isRead && 'bg-blue-50/50 border-blue-100'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className={cn('font-medium', !notification.isRead && 'text-blue-900')}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <Badge variant="default" className="bg-blue-500 text-[10px] px-1.5 py-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className={cn('text-sm', !notification.isRead ? 'text-blue-800' : 'text-gray-600')}>
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-[10px]">
                          {label}
                        </Badge>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            onClick={() => onMarkRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Notification Settings */}
      <Card className="bg-gray-50 border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Notification Preferences</p>
              <p className="text-sm text-gray-500 mt-1">
                You can customize which notifications you receive in your settings.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">Booking Confirmations</Badge>
                <Badge variant="outline" className="text-xs">Machine Free Alerts</Badge>
                <Badge variant="outline" className="text-xs">Expiry Warnings</Badge>
                <Badge variant="outline" className="text-xs">Reminders</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
