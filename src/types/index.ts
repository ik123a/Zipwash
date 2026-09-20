export type MachineStatus = 'available' | 'busy' | 'reserved' | 'offline';

export interface WashingMachine {
  id: string;
  name: string;
  hostelId: string;
  status: MachineStatus;
  timeRemaining?: number; // in minutes
  currentUserId?: string;
  lastUsed?: Date;
  isOutOfOrder: boolean;
}

export interface Booking {
  id: string;
  machineId: string;
  userId: string;
  userName: string;
  hostelId: string;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  qrCode?: string;
  createdAt: Date;
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  totalMachines: number;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  hostelId: string;
  roomNumber: string;
  isAdmin: boolean;
  role: 'student' | 'staff';
  roll_number?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_confirm' | 'reminder' | 'expiry' | 'machine_free' | 'system';
  isRead: boolean;
  createdAt: Date;
}

export interface UsageStats {
  machineId: string;
  totalUses: number;
  averageDuration: number;
  peakHours: { hour: number; uses: number }[];
  lastWeekUses: number;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}
