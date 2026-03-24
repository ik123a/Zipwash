import { useState, useEffect, useCallback } from 'react';
import type { WashingMachine, Booking, Notification, MachineStatus } from '@/types';
import { initialMachines, mockBookings, mockNotifications, hostels } from '@/data/mockData';

export function useLaundry() {
  const [machines, setMachines] = useState<WashingMachine[]>(initialMachines);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedHostel, setSelectedHostel] = useState<string>('h1');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate machine timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setMachines(prev => prev.map(machine => {
        if (machine.status === 'busy' && machine.timeRemaining && machine.timeRemaining > 0) {
          const newTime = machine.timeRemaining - 1;
          if (newTime <= 0) {
            return { ...machine, status: 'available' as MachineStatus, timeRemaining: undefined, currentUserId: undefined };
          }
          return { ...machine, timeRemaining: newTime };
        }
        return machine;
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getMachinesByHostel = useCallback((hostelId: string) => {
    return machines.filter(m => m.hostelId === hostelId);
  }, [machines]);

  const getMachineById = useCallback((machineId: string) => {
    return machines.find(m => m.id === machineId);
  }, [machines]);

  const getBookingsByUser = useCallback((userId: string) => {
    return bookings.filter(b => b.userId === userId).sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [bookings]);

  const getUserNotifications = useCallback((userId: string) => {
    return notifications.filter(n => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notifications]);

  const bookSlot = useCallback((machineId: string, userId: string, userName: string, startTime: Date, endTime: Date) => {
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      machineId,
      userId,
      userName,
      hostelId: selectedHostel,
      startTime,
      endTime,
      status: 'upcoming',
      qrCode: `WASHWISE-${Date.now()}`,
      createdAt: new Date(),
    };
    
    setBookings(prev => [...prev, newBooking]);
    setMachines(prev => prev.map(m => 
      m.id === machineId ? { ...m, status: 'reserved' as MachineStatus } : m
    ));
    
    // Add notification
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      userId,
      title: 'Booking Confirmed',
      message: `Your slot for ${getMachineById(machineId)?.name} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} is confirmed.`,
      type: 'booking_confirm',
      isRead: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    return newBooking;
  }, [selectedHostel, getMachineById]);

  const cancelBooking = useCallback((bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ));
      setMachines(prev => prev.map(m => 
        m.id === booking.machineId ? { ...m, status: 'available' as MachineStatus } : m
      ));
    }
  }, [bookings]);

  const markMachineStatus = useCallback((machineId: string, status: MachineStatus) => {
    setMachines(prev => prev.map(m => 
      m.id === machineId ? { ...m, status, isOutOfOrder: status === 'offline' } : m
    ));
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  }, []);

  const getNextAvailableTime = useCallback((hostelId: string) => {
    const hostelMachines = getMachinesByHostel(hostelId);
    const busyMachines = hostelMachines.filter(m => m.status === 'busy' && m.timeRemaining);
    if (busyMachines.length === 0) return 0;
    return Math.min(...busyMachines.map(m => m.timeRemaining || Infinity));
  }, [getMachinesByHostel]);

  const getAvailableCount = useCallback((hostelId: string) => {
    return getMachinesByHostel(hostelId).filter(m => m.status === 'available').length;
  }, [getMachinesByHostel]);

  const getStats = useCallback(() => {
    const totalMachines = machines.length;
    const available = machines.filter(m => m.status === 'available').length;
    const busy = machines.filter(m => m.status === 'busy').length;
    const reserved = machines.filter(m => m.status === 'reserved').length;
    const offline = machines.filter(m => m.status === 'offline').length;
    return { totalMachines, available, busy, reserved, offline };
  }, [machines]);

  return {
    machines,
    bookings,
    notifications,
    selectedHostel,
    setSelectedHostel,
    currentTime,
    hostels,
    getMachinesByHostel,
    getMachineById,
    getBookingsByUser,
    getUserNotifications,
    bookSlot,
    cancelBooking,
    markMachineStatus,
    markNotificationRead,
    getNextAvailableTime,
    getAvailableCount,
    getStats,
  };
}
