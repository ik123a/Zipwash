import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Minus,
  Package,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Trash2,
  Boxes,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  supplier: string;
  quantity: number;
  unit: string;
  threshold: number;
  category: string;
  lastRestocked: string;
  costPerUnit: number;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV001', name: 'Detergent Powder', supplier: 'CleanSupply Co.', quantity: 45, unit: 'kg', threshold: 20, category: 'Cleaning', lastRestocked: '2024-04-10', costPerUnit: 120 },
  { id: 'INV002', name: 'Liquid Detergent', supplier: 'FreshWash Supplies', quantity: 12, unit: 'L', threshold: 15, category: 'Cleaning', lastRestocked: '2024-04-08', costPerUnit: 180 },
  { id: 'INV003', name: 'Stain Remover', supplier: 'CleanSupply Co.', quantity: 8, unit: 'L', threshold: 10, category: 'Cleaning', lastRestocked: '2024-04-05', costPerUnit: 250 },
  { id: 'INV004', name: 'Fabric Softener', supplier: 'FreshWash Supplies', quantity: 25, unit: 'L', threshold: 12, category: 'Additives', lastRestocked: '2024-04-12', costPerUnit: 150 },
  { id: 'INV005', name: 'Bleach', supplier: 'Industrial Chem Ltd.', quantity: 18, unit: 'L', threshold: 10, category: 'Cleaning', lastRestocked: '2024-04-11', costPerUnit: 90 },
  { id: 'INV006', name: 'Laundry Bags', supplier: 'Packaging Plus', quantity: 150, unit: 'pcs', threshold: 100, category: 'Supplies', lastRestocked: '2024-04-01', costPerUnit: 5 },
  { id: 'INV007', name: 'Dryer Sheets', supplier: 'FreshWash Supplies', quantity: 5, unit: 'boxes', threshold: 8, category: 'Additives', lastRestocked: '2024-03-28', costPerUnit: 200 },
  { id: 'INV008', name: 'Ironing Water', supplier: 'PureWater Co.', quantity: 22, unit: 'L', threshold: 15, category: 'Ironing', lastRestocked: '2024-04-14', costPerUnit: 40 },
  { id: 'INV009', name: 'Starch Spray', supplier: 'FreshWash Supplies', quantity: 16, unit: 'cans', threshold: 10, category: 'Ironing', lastRestocked: '2024-04-09', costPerUnit: 120 },
  { id: 'INV010', name: 'Machine Filters', supplier: 'TechParts Ltd.', quantity: 3, unit: 'pcs', threshold: 5, category: 'Maintenance', lastRestocked: '2024-03-15', costPerUnit: 450 },
  { id: 'INV011', name: 'Drain Cleaner', supplier: 'Industrial Chem Ltd.', quantity: 7, unit: 'bottles', threshold: 5, category: 'Maintenance', lastRestocked: '2024-04-06', costPerUnit: 180 },
  { id: 'INV012', name: 'Machine Oil', supplier: 'TechParts Ltd.', quantity: 2, unit: 'L', threshold: 4, category: 'Maintenance', lastRestocked: '2024-02-20', costPerUnit: 550 },
];

const getStockStatus = (quantity: number, threshold: number): { status: 'adequate' | 'low' | 'critical'; label: string; color: string } => {
  const percentage = (quantity / threshold) * 100;
  if (percentage > 150) {
    return { status: 'adequate', label: 'Adequate', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  } else if (percentage >= 100) {
    return { status: 'adequate', label: 'Good', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  } else if (percentage >= 50) {
    return { status: 'low', label: 'Low Stock', color: 'bg-amber-100 text-amber-700 border-amber-200' };
  } else {
    return { status: 'critical', label: 'Critical', color: 'bg-rose-100 text-rose-700 border-rose-200' };
  }
};

const getDaysSinceRestock = (date: string): number => {
  const restockDate = new Date(date);
  const today = new Date('2024-04-14');
  return Math.floor((today.getTime() - restockDate.getTime()) / (1000 * 60 * 60 * 24));
};

export default function InventoryPage() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = React.useState<Partial<InventoryItem>>({
    name: '',
    supplier: '',
    quantity: 0,
    unit: 'pcs',
    threshold: 10,
    category: 'Cleaning',
    costPerUnit: 0,
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const status = getStockStatus(item.quantity, item.threshold);
    const matchesStatus = statusFilter === 'all' || status.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: inventory.length,
    adequate: inventory.filter(i => getStockStatus(i.quantity, i.threshold).status === 'adequate').length,
    low: inventory.filter(i => getStockStatus(i.quantity, i.threshold).status === 'low').length,
    critical: inventory.filter(i => getStockStatus(i.quantity, i.threshold).status === 'critical').length,
    totalValue: inventory.reduce((acc, i) => acc + (i.quantity * i.costPerUnit), 0),
  };

  const categories = ['all', 'Cleaning', 'Additives', 'Ironing', 'Maintenance', 'Supplies'];

  const handleAddItem = () => {
    if (!formData.name || !formData.supplier) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: InventoryItem = {
      id: `INV${String(inventory.length + 1).padStart(3, '0')}`,
      name: formData.name!,
      supplier: formData.supplier!,
      quantity: formData.quantity || 0,
      unit: formData.unit || 'pcs',
      threshold: formData.threshold || 10,
      category: formData.category || 'Cleaning',
      lastRestocked: new Date().toISOString().split('T')[0],
      costPerUnit: formData.costPerUnit || 0,
    };

    setInventory([...inventory, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success(`${newItem.name} added to inventory`);
  };

  const handleEditItem = () => {
    if (!selectedItem || !formData.name) return;

    setInventory(prev => prev.map(item =>
      item.id === selectedItem.id
        ? { ...item, ...formData, name: formData.name!, supplier: formData.supplier!, category: formData.category! }
        : item
    ));

    setIsEditDialogOpen(false);
    setSelectedItem(null);
    resetForm();
    toast.success('Item updated successfully');
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;

    setInventory(prev => prev.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Item removed from inventory');
  };

  const handleQuickUpdate = (itemId: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        const updatedItem = { ...item, quantity: newQuantity };
        if (delta > 0) {
          updatedItem.lastRestocked = new Date().toISOString().split('T')[0];
        }
        return updatedItem;
      }
      return item;
    }));
  };


  const openEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      supplier: item.supplier,
      quantity: item.quantity,
      unit: item.unit,
      threshold: item.threshold,
      category: item.category,
      costPerUnit: item.costPerUnit,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      supplier: '',
      quantity: 0,
      unit: 'pcs',
      threshold: 10,
      category: 'Cleaning',
      costPerUnit: 0,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-fade-up p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Track and manage supplies and materials</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Items</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-slate-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Adequate Stock</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.adequate}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-amber-600">{stats.low + stats.critical}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inventory Value</p>
              <p className="text-2xl font-bold text-slate-900">₹{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Boxes className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.critical > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <div>
            <p className="font-medium text-rose-900">Critical Stock Alert</p>
            <p className="text-sm text-rose-600">{stats.critical} item(s) are critically low and need immediate restocking.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by item name, supplier, or ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="adequate">Adequate</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Inventory List</CardTitle>
            <CardDescription>Showing {filteredInventory.length} items</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50">
                  <TableHead>Item</TableHead>
                  <TableHead className="hidden md:table-cell">Supplier</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No items found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item.quantity, item.threshold);
                    const daysSince = getDaysSinceRestock(item.lastRestocked);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{item.id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-3 w-3 text-slate-400" />
                            <span className="text-sm">{item.supplier}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuickUpdate(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium w-12 text-center">
                              {item.quantity} {item.unit}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuickUpdate(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color + ' text-[10px]'}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-500">
                          {daysSince === 0 ? 'Today' : `${daysSince} days ago`}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:text-rose-600"
                              onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add a new item to your inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Detergent Powder"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., CleanSupply Co."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Additives">Additives</SelectItem>
                    <SelectItem value="Ironing">Ironing</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="L">Liters</SelectItem>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="cans">Cans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Low Stock Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost per Unit (₹)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update inventory item details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Additives">Additives</SelectItem>
                    <SelectItem value="Ironing">Ironing</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="L">Liters</SelectItem>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="cans">Cans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Low Stock Threshold</Label>
              <Input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cost per Unit (₹)</Label>
              <Input
                type="number"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedItem?.name} from inventory? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-rose-600 hover:bg-rose-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
