import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Users,
  Phone,
  MapPin,
  Package,
  IndianRupee,
  TrendingUp,
  Calendar,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: string;
  services: string[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  hostel: string;
  room: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate: string;
  orders: Order[];
}

// Generate mock customer data
const generateMockCustomers = (): Customer[] => {
  const customers: Customer[] = [
    {
      id: 'C001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@college.edu',
      phone: '+91-9876543210',
      rollNumber: 'CS2021001',
      hostel: 'Block A',
      room: '101',
      totalOrders: 24,
      totalSpent: 3240,
      joinedDate: '2023-08-15',
      lastOrderDate: '2024-04-13',
      orders: [
        { id: 'ORD-001', date: '2024-04-13', items: 5, total: 340, status: 'delivered', services: ['Laundry', 'Ironing'] },
        { id: 'ORD-015', date: '2024-04-10', items: 3, total: 260, status: 'delivered', services: ['Dry Wash'] },
        { id: 'ORD-028', date: '2024-04-07', items: 8, total: 520, status: 'delivered', services: ['Laundry'] },
      ],
    },
    {
      id: 'C002',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      phone: '+91-9876543211',
      rollNumber: 'CS2021002',
      hostel: 'Block B',
      room: '205',
      totalOrders: 18,
      totalSpent: 2580,
      joinedDate: '2023-08-20',
      lastOrderDate: '2024-04-14',
      orders: [
        { id: 'ORD-002', date: '2024-04-14', items: 3, total: 260, status: 'ready', services: ['Laundry'] },
        { id: 'ORD-016', date: '2024-04-11', items: 4, total: 320, status: 'delivered', services: ['Laundry', 'Dry Wash'] },
      ],
    },
    {
      id: 'C003',
      name: 'Amit Kumar',
      email: 'amit.kumar@college.edu',
      phone: '+91-9876543212',
      rollNumber: 'CS2021003',
      hostel: 'Block A',
      room: '302',
      totalOrders: 31,
      totalSpent: 4850,
      joinedDate: '2023-08-10',
      lastOrderDate: '2024-04-14',
      orders: [
        { id: 'ORD-003', date: '2024-04-14', items: 8, total: 520, status: 'washing', services: ['Laundry', 'Ironing'] },
        { id: 'ORD-022', date: '2024-04-09', items: 6, total: 420, status: 'delivered', services: ['Laundry'] },
      ],
    },
    {
      id: 'C004',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@college.edu',
      phone: '+91-9876543213',
      rollNumber: 'CS2021004',
      hostel: 'Block C',
      room: '112',
      totalOrders: 12,
      totalSpent: 1680,
      joinedDate: '2023-09-01',
      lastOrderDate: '2024-04-14',
      orders: [
        { id: 'ORD-004', date: '2024-04-14', items: 4, total: 200, status: 'submitted', services: ['Laundry'] },
      ],
    },
    {
      id: 'C005',
      name: 'Vikram Singh',
      email: 'vikram.singh@college.edu',
      phone: '+91-9876543214',
      rollNumber: 'CS2021005',
      hostel: 'Block B',
      room: '405',
      totalOrders: 42,
      totalSpent: 6240,
      joinedDate: '2023-08-01',
      lastOrderDate: '2024-04-13',
      orders: [
        { id: 'ORD-005', date: '2024-04-13', items: 6, total: 360, status: 'delivered', services: ['Laundry', 'Ironing'] },
        { id: 'ORD-017', date: '2024-04-11', items: 7, total: 440, status: 'delivered', services: ['Laundry'] },
      ],
    },
    {
      id: 'C006',
      name: 'Neha Verma',
      email: 'neha.verma@college.edu',
      phone: '+91-9876543215',
      rollNumber: 'CS2021006',
      hostel: 'Block A',
      room: '201',
      totalOrders: 15,
      totalSpent: 2360,
      joinedDate: '2023-08-25',
      lastOrderDate: '2024-04-13',
      orders: [
        { id: 'ORD-006', date: '2024-04-13', items: 3, total: 360, status: 'ready', services: ['Dry Wash'] },
      ],
    },
    {
      id: 'C007',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@college.edu',
      phone: '+91-9876543216',
      rollNumber: 'CS2021007',
      hostel: 'Block C',
      room: '301',
      totalOrders: 36,
      totalSpent: 4920,
      joinedDate: '2023-08-05',
      lastOrderDate: '2024-04-13',
      orders: [
        { id: 'ORD-007', date: '2024-04-13', items: 10, total: 450, status: 'delivered', services: ['Laundry'] },
      ],
    },
    {
      id: 'C008',
      name: 'Ananya Reddy',
      email: 'ananya.reddy@college.edu',
      phone: '+91-9876543217',
      rollNumber: 'CS2021008',
      hostel: 'Block A',
      room: '108',
      totalOrders: 8,
      totalSpent: 1120,
      joinedDate: '2023-09-15',
      lastOrderDate: '2024-04-08',
      orders: [],
    },
    {
      id: 'C009',
      name: 'Karan Malhotra',
      email: 'karan.malhotra@college.edu',
      phone: '+91-9876543218',
      rollNumber: 'CS2021009',
      hostel: 'Block B',
      room: '312',
      totalOrders: 28,
      totalSpent: 3840,
      joinedDate: '2023-08-12',
      lastOrderDate: '2024-04-12',
      orders: [],
    },
    {
      id: 'C010',
      name: 'Divya Sharma',
      email: 'divya.sharma@college.edu',
      phone: '+91-9876543219',
      rollNumber: 'CS2021010',
      hostel: 'Block C',
      room: '215',
      totalOrders: 3,
      totalSpent: 420,
      joinedDate: '2024-01-10',
      lastOrderDate: '2024-04-05',
      orders: [],
    },
  ];
  return customers;
};

type CustomerTag = 'frequent' | 'moderate' | 'inactive';

const getCustomerTag = (totalOrders: number, lastOrderDate: string): { tag: CustomerTag; label: string; color: string } => {
  const daysSinceLastOrder = Math.floor((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24));

  if (totalOrders >= 25) {
    return { tag: 'frequent', label: 'Frequent', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  } else if (totalOrders >= 10 && daysSinceLastOrder < 14) {
    return { tag: 'moderate', label: 'Moderate', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  } else {
    return { tag: 'inactive', label: 'Inactive', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

const getFavoriteServices = (orders: Order[]): { service: string; count: number; percentage: number }[] => {
  const serviceCounts: Record<string, number> = {};
  orders.forEach(order => {
    order.services.forEach(service => {
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
  });

  const total = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count, percentage: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
};

const getOrderFrequency = (totalOrders: number, joinedDate: string): string => {
  const daysSinceJoined = Math.floor((Date.now() - new Date(joinedDate).getTime()) / (1000 * 60 * 60 * 24));
  const ordersPerWeek = (totalOrders / (daysSinceJoined / 7)).toFixed(1);
  return `${ordersPerWeek} orders/week`;
};

export default function CustomersPage() {
  const [customers] = React.useState<Customer[]>(generateMockCustomers());
  const [loading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [tagFilter, setTagFilter] = React.useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const tag = getCustomerTag(customer.totalOrders, customer.lastOrderDate);
    const matchesTag = tagFilter === 'all' || tag.tag === tagFilter;

    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: customers.length,
    frequent: customers.filter(c => getCustomerTag(c.totalOrders, c.lastOrderDate).tag === 'frequent').length,
    moderate: customers.filter(c => getCustomerTag(c.totalOrders, c.lastOrderDate).tag === 'moderate').length,
    inactive: customers.filter(c => getCustomerTag(c.totalOrders, c.lastOrderDate).tag === 'inactive').length,
    totalRevenue: customers.reduce((acc, c) => acc + c.totalSpent, 0),
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
        <RefreshCw className="h-8 w-8 animate-spin text-slate-600 mb-4" />
        <p className="text-muted-foreground font-medium">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-fade-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage and view customer information</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            <Users className="h-3 w-3 mr-1" />
            {stats.total} customers
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Frequent</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.frequent}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Moderate</p>
              <p className="text-2xl font-bold text-blue-600">{stats.moderate}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by name, roll number, or phone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="frequent">Frequent Users</SelectItem>
                <SelectItem value="moderate">Moderate Users</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>Showing {filteredCustomers.length} total customers</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Roll Number</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No customers found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => {
                    const tag = getCustomerTag(customer.totalOrders, customer.lastOrderDate);
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                              <span className="text-sm font-bold text-slate-600">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{customer.name}</p>
                              <p className="text-xs text-slate-500">{customer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-sm">
                          {customer.rollNumber}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {customer.hostel}, Room {customer.room}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{customer.totalOrders}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{customer.totalSpent.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={tag.color}>
                            {tag.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog with Insights */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-600">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <span className="block">{selectedCustomer.name}</span>
                    <span className="text-sm font-normal text-slate-500">{selectedCustomer.email}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="history">Order History</TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[400px] mt-4">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-slate-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-500">Contact</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <p className="font-medium">{selectedCustomer.phone}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-500">Roll Number</p>
                          <p className="font-medium font-mono">{selectedCustomer.rollNumber}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-500">Location</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <p className="font-medium">{selectedCustomer.hostel}, Room {selectedCustomer.room}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-slate-500">Joined</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <p className="font-medium">{new Date(selectedCustomer.joinedDate).toLocaleDateString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                        <p className="text-2xl font-bold text-emerald-700">{selectedCustomer.totalOrders}</p>
                        <p className="text-sm text-emerald-600">Total Orders</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                        <p className="text-2xl font-bold text-blue-700">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                        <p className="text-sm text-blue-600">Total Spent</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-2xl font-bold text-slate-700">
                          ₹{Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                        </p>
                        <p className="text-sm text-slate-600">Avg per Order</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Insights Tab */}
                  <TabsContent value="insights" className="space-y-4">
                    {(() => {
                      const tag = getCustomerTag(selectedCustomer.totalOrders, selectedCustomer.lastOrderDate);
                      const favoriteServices = getFavoriteServices(selectedCustomer.orders);
                      const frequency = getOrderFrequency(selectedCustomer.totalOrders, selectedCustomer.joinedDate);
                      const daysSinceLastOrder = Math.floor((Date.now() - new Date(selectedCustomer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <>
                          {/* Customer Tag */}
                          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border">
                            <div>
                              <p className="text-sm text-slate-500">Customer Category</p>
                              <p className="text-lg font-medium">{tag.label} Customer</p>
                            </div>
                            <Badge variant="outline" className={tag.color + ' text-base px-3 py-1'}>
                              {tag.label}
                            </Badge>
                          </div>

                          {/* Usage Stats */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">Order Frequency</span>
                                  </div>
                                  <span className="font-medium">{frequency}</span>
                                </div>
                                <Progress value={Math.min(100, (parseFloat(frequency) / 2) * 100)} className="h-2" />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">Last Order</span>
                                  </div>
                                  <span className="font-medium">{daysSinceLastOrder} days ago</span>
                                </div>
                                <Progress value={Math.max(0, 100 - (daysSinceLastOrder / 14) * 100)} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Favorite Services */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Favorite Services</CardTitle>
                              <CardDescription>Most used service types</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {favoriteServices.length > 0 ? (
                                favoriteServices.map((service, i) => (
                                  <div key={service.service}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium">{service.service}</span>
                                      <span className="text-sm text-slate-500">{service.count} orders ({service.percentage}%)</span>
                                    </div>
                                    <Progress
                                      value={service.percentage}
                                      className="h-2"
                                      style={{
                                        backgroundColor: i === 0 ? '#10b981' : i === 1 ? '#3b82f6' : '#f59e0b'
                                      }}
                                    />
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500 text-center py-4">No service history available</p>
                              )}
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </TabsContent>

                  {/* Order History Tab */}
                  <TabsContent value="history" className="space-y-4">
                    {selectedCustomer.orders.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCustomer.orders.map((order) => (
                          <Card key={order.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{order.id}</p>
                                  <p className="text-sm text-slate-500">{order.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{order.total}</p>
                                  <Badge variant="outline" className="text-[10px]">
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <Package className="h-4 w-4" />
                                <span>{order.items} items</span>
                                <span className="mx-2">•</span>
                                <span>{order.services.join(', ')}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No order history available</p>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
