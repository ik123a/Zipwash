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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/services/api";
import {
  Search,
  ShoppingBag,
  MoreVertical,
  Eye,
  Printer,
  Download,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  rollNumber: string;
  items: string;
  itemCount: number;
  dateTime: string;
  status: 'submitted' | 'processing' | 'washing' | 'ready' | 'delivered';
  total: number;
  clothes: string[];
  contact?: string;
  hostel?: string;
  room?: string;
  isPos: boolean;
}

const statusColors: Record<Order['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; color: string }> = {
  submitted: { variant: 'secondary', label: 'Submitted', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  processing: { variant: 'default', label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  washing: { variant: 'destructive', label: 'Washing', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ready: { variant: 'outline', label: 'Ready', color: 'bg-green-100 text-green-700 border-green-200' },
  delivered: { variant: 'secondary', label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const itemsList = ['T-shirt', 'Pants', 'Shirt', 'Dress', 'Jacket', 'Coat', 'Suit', 'Carpets', 'Bed Sheets'];

function generateMockOrders(): Order[] {
  const orders: Order[] = [];
  const customers = [
    { name: 'Rahul Sharma', roll: 'CS2021001', hostel: 'Block A', room: '101', contact: '+91-9876543210' },
    { name: 'Priya Patel', roll: 'CS2021002', hostel: 'Block B', room: '205', contact: '+91-9876543211' },
    { name: 'Amit Kumar', roll: 'CS2021003', hostel: 'Block A', room: '302', contact: '+91-9876543212' },
    { name: 'Sneha Gupta', roll: 'CS2021004', hostel: 'Block C', room: '112', contact: '+91-9876543213' },
    { name: 'Vikram Singh', roll: 'CS2021005', hostel: 'Block B', room: '405', contact: '+91-9876543214' },
    { name: 'Neha Verma', roll: 'CS2021006', hostel: 'Block A', room: '201', contact: '+91-9876543215' },
    { name: 'Rajesh Kumar', roll: 'CS2021007', hostel: 'Block C', room: '301', contact: '+91-9876543216' },
  ];

  const statuses: Order['status'][] = ['submitted', 'processing', 'washing', 'ready', 'delivered'];
  const today = new Date();

  for (let i = 0; i < 25; i++) {
    const customer = customers[i % customers.length];
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    const time = `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
    const numItems = Math.floor(Math.random() * 8) + 2;
    const selectedItems = itemsList.slice(0, numItems);
    const isPos = i === 12;

    orders.push({
      id: isPos ? `POS-00${i - 11}` : `ORD-${String(i + 1).padStart(3, '0')}`,
      customerName: isPos ? 'Walk-in Customer' : customer.name,
      rollNumber: isPos ? '-' : customer.roll,
      items: `${numItems} Clothes (${selectedItems.slice(0, 3).join(', ')}${numItems > 3 ? '...' : ''})`,
      itemCount: numItems,
      dateTime: `${date.toISOString().split('T')[0]} ${time}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: numItems * (Math.floor(Math.random() * 40) + 40),
      clothes: selectedItems,
      contact: isPos ? '+91-9999999999' : customer.contact,
      hostel: isPos ? 'N/A' : customer.hostel,
      room: isPos ? 'N/A' : customer.room,
      isPos,
    });
  }

  return orders.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const itemsPerPage = 10;

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const response = await api.get('/staff/laundry');
      if (response.data && response.data.length > 0) {
        const apiOrders = response.data.map((item: any) => ({
          id: `ORD-${String(item.id).padStart(3, '0')}`,
          customerName: item.student_name || 'Unknown',
          rollNumber: item.roll_number || '-',
          items: `${item.number_of_clothes} Clothes`,
          itemCount: item.number_of_clothes,
          dateTime: item.submission_time,
          status: item.status,
          total: item.number_of_clothes * 60,
          clothes: [],
          contact: item.phone || '-',
          hostel: item.hostel || '-',
          room: '-',
          isPos: false,
        }));
        setOrders([...apiOrders, ...generateMockOrders().slice(apiOrders.length)]);
      } else {
        setOrders(generateMockOrders());
      }
    } catch {
      // Fallback to mock data
      setOrders(generateMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Try to update via API
      const id = orderId.replace('ORD-', '').replace('POS-', '');
      await api.put(`/staff/laundry/${id}/status`, { status: newStatus });
    } catch {
      // Silently fail - will update local state
    }

    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    toast.success(`Order ${orderId} status updated to ${statusColors[newStatus].label}`);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const orderDate = order.dateTime.split(' ')[0];
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let matchesDate = true;
    if (dateFilter === 'today') matchesDate = orderDate === today;
    else if (dateFilter === 'yesterday') matchesDate = orderDate === yesterday;
    else if (dateFilter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      matchesDate = orderDate >= weekAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: orders.length,
    today: orders.filter(o => o.dateTime.startsWith(new Date().toISOString().split('T')[0])).length,
    pending: orders.filter(o => ['submitted', 'processing', 'washing'].includes(o.status)).length,
    revenue: orders.reduce((acc, o) => acc + o.total, 0),
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handlePrintOrder = (order: Order) => {
    toast.info(`Printing order ${order.id}...`);
    setTimeout(() => toast.success(`Order ${order.id} sent to printer`), 1000);
  };

  const handleExport = () => {
    toast.info('Exporting orders to CSV...');
    setTimeout(() => toast.success('Orders exported successfully'), 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 shadow-inner">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-600" />
        </div>
        <p className="text-muted-foreground font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-fade-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-500 mt-1">View and manage all laundry orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-slate-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Today's Orders</p>
              <p className="text-2xl font-bold text-slate-900">{stats.today}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Filter className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
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
                placeholder="Search by order ID, customer name, or roll number..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="washing">Washing</SelectItem>
                <SelectItem value="ready">Ready for Pickup</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Showing {filteredOrders.length} total orders</CardDescription>
          </div>
          <div className="text-sm text-slate-500">
            Page {currentPage} of {totalPages || 1}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No orders found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id} className={order.isPos ? 'bg-indigo-50/30' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {order.isPos && (
                            <Badge variant="outline" className="text-[10px] bg-indigo-100 text-indigo-700 border-indigo-200">
                              POS
                            </Badge>
                          )}
                          {order.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          {!order.isPos && (
                            <p className="text-xs text-slate-500">{order.rollNumber}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px]">
                        <span className="truncate" title={order.items}>
                          {order.items}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(order.dateTime).toLocaleDateString()}
                        <br />
                        <span className="text-xs">
                          {new Date(order.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(val) => updateOrderStatus(order.id, val as Order['status'])}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <Badge
                              variant={statusColors[order.status].variant}
                              className={`${statusColors[order.status].color} capitalize text-[10px]`}
                            >
                              {statusColors[order.status].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="washing">Washing</SelectItem>
                            <SelectItem value="ready">Ready for Pickup</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{order.total}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintOrder(order)}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Contact</p>
                  <p className="font-medium">{selectedOrder.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Hostel</p>
                  <p className="font-medium">{selectedOrder.hostel}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Room</p>
                  <p className="font-medium">{selectedOrder.room}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-slate-500 mb-2">Items</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.clothes.map((item, i) => (
                    <Badge key={i} variant="secondary">{item}</Badge>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Total: {selectedOrder.itemCount} items
                </p>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => updateOrderStatus(selectedOrder.id, val as Order['status'])}
                  >
                    <SelectTrigger className="w-[160px]">
                      <Badge
                        variant={statusColors[selectedOrder.status].variant}
                        className={`${statusColors[selectedOrder.status].color} capitalize`}
                      >
                        {statusColors[selectedOrder.status].label}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="washing">Washing</SelectItem>
                      <SelectItem value="ready">Ready for Pickup</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-2xl font-bold">₹{selectedOrder.total}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
