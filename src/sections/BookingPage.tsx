import { useState } from 'react';
import type { WashingMachine } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  WashingMachine as MachineIcon,
  CheckCircle2,
  AlertTriangle,
  Timer,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeSlots } from '@/data/mockData';

interface BookingPageProps {
  machines: WashingMachine[];
  hostels: { id: string; name: string; code: string }[];
  selectedHostel: string;
  onHostelChange: (hostelId: string) => void;
  onBookSlot: (machineId: string, startTime: Date, endTime: Date) => void;
}

export function BookingPage({ 
  machines, 
  hostels, 
  selectedHostel, 
  onHostelChange, 
  onBookSlot 
}: BookingPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const hostelMachines = machines.filter(m => m.hostelId === selectedHostel);
  const availableMachines = hostelMachines.filter(m => m.status === 'available');

  const handleMachineSelect = (machineId: string) => {
    setSelectedMachine(machineId);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleBooking = async () => {
    if (!selectedMachine || !selectedTime) return;
    
    setIsBooking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes);
    const endTime = new Date(startTime.getTime() + 45 * 60000); // 45 min wash
    
    onBookSlot(selectedMachine, startTime, endTime);
    setIsBooking(false);
    setBookingComplete(true);
  };

  const resetBooking = () => {
    setSelectedMachine('');
    setSelectedTime('');
    setStep(1);
    setBookingComplete(false);
  };

  const selectedMachineData = machines.find(m => m.id === selectedMachine);

  if (bookingComplete) {
    return (
      <div className="max-w-md mx-auto py-8">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              Your laundry slot has been reserved successfully.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Machine</span>
                  <span className="font-medium">{selectedMachineData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">
                    {selectedTime} - {(() => {
                      const [h, m] = selectedTime.split(':').map(Number);
                      const end = new Date();
                      end.setHours(h, m + 45);
                      return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">45 minutes</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetBooking}>
                Book Another
              </Button>
              <Button className="flex-1 bg-soft-blue hover:bg-soft-blue/90">
                View My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Book a Slot</h2>
        <p className="text-gray-500 mt-1">Select a machine and time for your laundry</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          step >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
        )}>
          <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white text-xs">1</span>
          Select Machine
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          step >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
        )}>
          <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white text-xs">2</span>
          Choose Time
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          step >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
        )}>
          <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white text-xs">3</span>
          Confirm
        </div>
      </div>

      {/* Hostel Selector */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-2 block">Select Hostel</Label>
          <Select value={selectedHostel} onValueChange={onHostelChange}>
            <SelectTrigger className="w-full md:w-[280px]">
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
        </CardContent>
      </Card>

      {/* Step 1: Machine Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Machines</h3>
          
          {availableMachines.length === 0 ? (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h4 className="font-semibold text-amber-800 mb-1">No Machines Available</h4>
                <p className="text-amber-700 text-sm">
                  All machines are currently in use or reserved. Check back in a few minutes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hostelMachines.map(machine => (
                <Card
                  key={machine.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    machine.status === 'available' 
                      ? 'hover:shadow-lg border-green-200 bg-green-50/50' 
                      : 'opacity-60 cursor-not-allowed',
                    selectedMachine === machine.id && 'ring-2 ring-blue-500'
                  )}
                  onClick={() => machine.status === 'available' && handleMachineSelect(machine.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        machine.status === 'available' ? 'bg-green-100' : 'bg-gray-100'
                      )}>
                        <MachineIcon className={cn('w-6 h-6',
                          machine.status === 'available' ? 'text-green-600' : 'text-gray-400'
                        )} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{machine.name}</p>
                        <Badge variant={machine.status === 'available' ? 'default' : 'secondary'}
                          className={cn('text-xs',
                            machine.status === 'available' && 'bg-green-500'
                          )}
                        >
                          {machine.status === 'available' ? 'Available' : 
                           machine.status === 'busy' ? 'In Use' : 
                           machine.status === 'reserved' ? 'Reserved' : 'Offline'}
                        </Badge>
                      </div>
                      {machine.status === 'busy' && machine.timeRemaining && (
                        <div className="text-right">
                          <Timer className="w-4 h-4 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-500">{machine.timeRemaining}m</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Select Time Slot</h3>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Change Machine
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTime} onValueChange={handleTimeSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    {timeSlots.map((slot) => (
                      <SelectItem
                        key={slot.time}
                        value={slot.time}
                        disabled={!slot.available}
                        className={cn(
                          !slot.available && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <span className="flex items-center justify-between w-full gap-4">
                          <span>{slot.label}</span>
                          {!slot.available && <Badge variant="secondary" className="text-[10px]">Booked</Badge>}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTime && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Selected: <span className="font-medium">{selectedTime}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Confirm Booking</h3>
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              Change Time
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MachineIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{selectedMachineData?.name}</p>
                  <p className="text-sm text-gray-500">{hostels.find(h => h.id === selectedHostel)?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="font-medium">{selectedTime}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Estimated Duration</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your wash cycle will take approximately 45 minutes. 
                  Please arrive 5 minutes before your slot.
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Please bring your own detergent. Cancellation is allowed up to 15 minutes before your slot.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-soft-blue hover:bg-soft-blue/90"
              onClick={handleBooking}
              disabled={isBooking}
            >
              {isBooking ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
