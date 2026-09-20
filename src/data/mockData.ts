import type { WashingMachine, Booking, Hostel, User, Notification, UsageStats } from '@/types';

export const hostels: Hostel[] = [
  { id: 'h1', name: 'Hostel A', code: 'HA', totalMachines: 6, location: 'Ground Floor' },
  { id: 'h2', name: 'Hostel B', code: 'HB', totalMachines: 8, location: 'First Floor' },
  { id: 'h3', name: 'Hostel C', code: 'HC', totalMachines: 6, location: 'Basement' },
  { id: 'h4', name: 'Hostel D', code: 'HD', totalMachines: 10, location: 'Ground Floor' },
];

export const initialMachines: WashingMachine[] = [
  // Hostel A Machines
  { id: 'm1', name: 'Machine 1', hostelId: 'h1', status: 'available', isOutOfOrder: false },
  { id: 'm2', name: 'Machine 2', hostelId: 'h1', status: 'busy', timeRemaining: 18, currentUserId: 'u1', isOutOfOrder: false },
  { id: 'm3', name: 'Machine 3', hostelId: 'h1', status: 'reserved', isOutOfOrder: false },
  { id: 'm4', name: 'Machine 4', hostelId: 'h1', status: 'available', isOutOfOrder: false },
  { id: 'm5', name: 'Machine 5', hostelId: 'h1', status: 'busy', timeRemaining: 32, currentUserId: 'u2', isOutOfOrder: false },
  { id: 'm6', name: 'Machine 6', hostelId: 'h1', status: 'offline', isOutOfOrder: true },
  
  // Hostel B Machines
  { id: 'm7', name: 'Machine 1', hostelId: 'h2', status: 'available', isOutOfOrder: false },
  { id: 'm8', name: 'Machine 2', hostelId: 'h2', status: 'available', isOutOfOrder: false },
  { id: 'm9', name: 'Machine 3', hostelId: 'h2', status: 'busy', timeRemaining: 12, currentUserId: 'u3', isOutOfOrder: false },
  { id: 'm10', name: 'Machine 4', hostelId: 'h2', status: 'reserved', isOutOfOrder: false },
  { id: 'm11', name: 'Machine 5', hostelId: 'h2', status: 'busy', timeRemaining: 45, currentUserId: 'u4', isOutOfOrder: false },
  { id: 'm12', name: 'Machine 6', hostelId: 'h2', status: 'available', isOutOfOrder: false },
  { id: 'm13', name: 'Machine 7', hostelId: 'h2', status: 'available', isOutOfOrder: false },
  { id: 'm14', name: 'Machine 8', hostelId: 'h2', status: 'offline', isOutOfOrder: true },
  
  // Hostel C Machines
  { id: 'm15', name: 'Machine 1', hostelId: 'h3', status: 'busy', timeRemaining: 8, currentUserId: 'u5', isOutOfOrder: false },
  { id: 'm16', name: 'Machine 2', hostelId: 'h3', status: 'available', isOutOfOrder: false },
  { id: 'm17', name: 'Machine 3', hostelId: 'h3', status: 'reserved', isOutOfOrder: false },
  { id: 'm18', name: 'Machine 4', hostelId: 'h3', status: 'available', isOutOfOrder: false },
  { id: 'm19', name: 'Machine 5', hostelId: 'h3', status: 'busy', timeRemaining: 28, currentUserId: 'u6', isOutOfOrder: false },
  { id: 'm20', name: 'Machine 6', hostelId: 'h3', status: 'available', isOutOfOrder: false },
  
  // Hostel D Machines
  { id: 'm21', name: 'Machine 1', hostelId: 'h4', status: 'available', isOutOfOrder: false },
  { id: 'm22', name: 'Machine 2', hostelId: 'h4', status: 'available', isOutOfOrder: false },
  { id: 'm23', name: 'Machine 3', hostelId: 'h4', status: 'busy', timeRemaining: 22, currentUserId: 'u7', isOutOfOrder: false },
  { id: 'm24', name: 'Machine 4', hostelId: 'h4', status: 'reserved', isOutOfOrder: false },
  { id: 'm25', name: 'Machine 5', hostelId: 'h4', status: 'available', isOutOfOrder: false },
  { id: 'm26', name: 'Machine 6', hostelId: 'h4', status: 'busy', timeRemaining: 38, currentUserId: 'u8', isOutOfOrder: false },
  { id: 'm27', name: 'Machine 7', hostelId: 'h4', status: 'available', isOutOfOrder: false },
  { id: 'm28', name: 'Machine 8', hostelId: 'h4', status: 'offline', isOutOfOrder: true },
  { id: 'm29', name: 'Machine 9', hostelId: 'h4', status: 'available', isOutOfOrder: false },
  { id: 'm30', name: 'Machine 10', hostelId: 'h4', status: 'reserved', isOutOfOrder: false },
];

export const currentUser: User = {
  id: 'u1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@bennett.edu.in',
  hostelId: 'h1',
  roomNumber: 'A-204',
  isAdmin: false,
  role: 'student',
};

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    machineId: 'm2',
    userId: 'u1',
    userName: 'Rahul Sharma',
    hostelId: 'h1',
    startTime: new Date(Date.now() - 12 * 60000),
    endTime: new Date(Date.now() + 18 * 60000),
    status: 'active',
    qrCode: 'WASHWISE-B1-2024',
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'b2',
    machineId: 'm3',
    userId: 'u9',
    userName: 'Priya Patel',
    hostelId: 'h1',
    startTime: new Date(Date.now() + 30 * 60000),
    endTime: new Date(Date.now() + 75 * 60000),
    status: 'upcoming',
    qrCode: 'WASHWISE-B2-2024',
    createdAt: new Date(),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Booking Confirmed',
    message: 'Your slot for Machine 2 at 2:00 PM is confirmed.',
    type: 'booking_confirm',
    isRead: true,
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'Machine Free Soon',
    message: 'Machine 3 will be free in 5 minutes. Get ready!',
    type: 'machine_free',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60000),
  },
  {
    id: 'n3',
    userId: 'u1',
    title: 'Slot Expiring',
    message: 'Your reservation expires in 10 minutes.',
    type: 'expiry',
    isRead: false,
    createdAt: new Date(),
  },
];

export const usageStats: UsageStats[] = [
  { machineId: 'm1', totalUses: 145, averageDuration: 42, peakHours: [{ hour: 9, uses: 12 }, { hour: 18, uses: 20 }, { hour: 20, uses: 18 }], lastWeekUses: 23 },
  { machineId: 'm2', totalUses: 132, averageDuration: 45, peakHours: [{ hour: 10, uses: 15 }, { hour: 19, uses: 22 }, { hour: 21, uses: 16 }], lastWeekUses: 19 },
  { machineId: 'm3', totalUses: 158, averageDuration: 40, peakHours: [{ hour: 8, uses: 18 }, { hour: 17, uses: 25 }, { hour: 22, uses: 14 }], lastWeekUses: 28 },
];

export const timeSlots = [
  { time: '06:00', label: '6:00 AM', available: true },
  { time: '07:00', label: '7:00 AM', available: true },
  { time: '08:00', label: '8:00 AM', available: false },
  { time: '09:00', label: '9:00 AM', available: true },
  { time: '10:00', label: '10:00 AM', available: true },
  { time: '11:00', label: '11:00 AM', available: false },
  { time: '12:00', label: '12:00 PM', available: true },
  { time: '13:00', label: '1:00 PM', available: true },
  { time: '14:00', label: '2:00 PM', available: false },
  { time: '15:00', label: '3:00 PM', available: true },
  { time: '16:00', label: '4:00 PM', available: true },
  { time: '17:00', label: '5:00 PM', available: false },
  { time: '18:00', label: '6:00 PM', available: false },
  { time: '19:00', label: '7:00 PM', available: true },
  { time: '20:00', label: '8:00 PM', available: false },
  { time: '21:00', label: '9:00 PM', available: true },
  { time: '22:00', label: '10:00 PM', available: true },
];
