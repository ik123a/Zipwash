import { useState } from 'react';
import type { Booking, WashingMachine } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  WashingMachine as MachineIcon,
  CheckCircle2,
  XCircle,
  Timer,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MyBookingsPageProps {
  bookings: Booking[];
  machines: WashingMachine[];
  hostels: { id: string; name: string; code: string }[];
  onCancelBooking: (bookingId: string) => void;
}

export function MyBookingsPage({ bookings, machines, hostels, onCancelBooking }: MyBookingsPageProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onCancelBooking(bookingId);
    setCancellingId(null);
  };

  const getMachineName = (machineId: string) => {
    return machines.find(m => m.id === machineId)?.name || 'Unknown Machine';
  };

  const getHostelName = (hostelId: string) => {
    return hostels.find(h => h.id === hostelId)?.name || 'Unknown Hostel';
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming' || b.status === 'active');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Completed';
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min left`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m left`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <p className="text-gray-500 mt-1">Manage your laundry reservations</p>
      </div>

      {/* Upcoming Bookings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Upcoming & Active
        </h3>

        {upcomingBookings.length === 0 ? (
          <Card className="bg-gray-50 border-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">No upcoming bookings</h4>
              <p className="text-gray-500 text-sm mb-4">Book a slot to get started</p>
              <Button className="bg-soft-blue hover:bg-soft-blue/90">
                Book a Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <Card key={booking.id} className={cn(
                'overflow-hidden',
                booking.status === 'active' && 'border-green-300 bg-green-50/30'
              )}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Status Indicator */}
                    <div className={cn(
                      'w-full md:w-2 h-2 md:h-12 rounded-full',
                      booking.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                    )} />

                    {/* Machine Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        booking.status === 'active' ? 'bg-green-100' : 'bg-amber-100'
                      )}>
                        <MachineIcon className={cn('w-6 h-6',
                          booking.status === 'active' ? 'text-green-600' : 'text-amber-600'
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{getMachineName(booking.machineId)}</p>
                          <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}
                            className={cn(booking.status === 'active' && 'bg-green-500')}
                          >
                            {booking.status === 'active' ? 'In Progress' : 'Upcoming'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {getHostelName(booking.hostelId)}
                        </p>
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(booking.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                      </div>
                    </div>

                    {/* Timer (for active) */}
                    {booking.status === 'active' && (
                      <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                        <Timer className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {getTimeRemaining(booking.endTime)}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowQR(true);
                        }}
                      >
                        <QrCode className="w-4 h-4" />
                        Show QR
                      </Button>
                      {booking.status === 'upcoming' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            'Cancel'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gray-500" />
            History
          </h3>

          <div className="space-y-3">
            {pastBookings.map(booking => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      booking.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                    )}>
                      {booking.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{getMachineName(booking.machineId)}</p>
                        <Badge variant="outline" className={cn(
                          booking.status === 'completed' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                        )}>
                          {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.startTime)} • {formatTime(booking.startTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking QR Code</DialogTitle>
            <DialogDescription>
              Show this QR code at the laundry room to verify your booking
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <QrCode className="w-24 h-24 text-gray-800 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-mono">{selectedBooking?.qrCode}</p>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium">{selectedBooking && getMachineName(selectedBooking.machineId)}</p>
              <p className="text-sm text-gray-500">
                {selectedBooking && formatDate(selectedBooking.startTime)} • {selectedBooking && formatTime(selectedBooking.startTime)}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
