// Admin-specific types - EXTENDING existing types without modifying them

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  hostelId: string;
  roomNumber: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  hostelId: string;
  roomNumber: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate?: Date;
  joinedDate: Date;
  favoriteServices: string[];
  usageFrequency: 'frequent' | 'moderate' | 'inactive';
}

export interface CustomerDetail extends Customer {
  orderHistory: Order[];
  monthlyUsage: { month: string; orders: number; amount: number }[];
  mostUsedService: string;
  averageOrderValue: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  supplier: string;
  quantity: number;
  unit: string;
  minStock: number;
  pricePerUnit: number;
  lastRestocked: Date;
  category: 'detergent' | 'softener' | 'stain_remover' | 'equipment' | 'packaging' | 'other';
}

export interface PricingItem {
  id: string;
  name: string;
  price: number;
  category: 'dry_cleaning' | 'ironing' | 'laundry' | 'extras';
  unit: 'piece' | 'kg' | 'sqft';
  description?: string;
  lastUpdated: Date;
}

export interface MachineWithDetails {
  id: string;
  name: string;
  machineNumber: string;
  hostelId: string;
  hostelName: string;
  status: 'available' | 'busy' | 'reserved' | 'offline';
  timeRemaining?: number;
  currentUserId?: string;
  currentUserName?: string;
  currentOrderId?: string;
  lastUsed?: Date;
  totalUses: number;
  isOutOfOrder: boolean;
}

export interface AnalyticsData {
  totalOrders: { today: number; week: number; month: number };
  totalRevenue: { today: number; week: number; month: number };
  activeCustomers: number;
  ordersByDay: { date: string; orders: number }[];
  revenueByDay: { date: string; revenue: number }[];
  serviceUsage: { name: string; value: number }[];
  topCustomers: { id: string; name: string; orders: number; spent: number }[];
}
