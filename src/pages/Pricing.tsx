import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from '../services/api';

import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Shirt,
  Footprints,
  Home,
  Scissors,
  Package,
  Edit3,
  Save,
  X,
  IndianRupee,
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  icon: React.ElementType;
  category: string;
}

interface CartItem extends Item {
  qty: number;
}

const ITEMS: Item[] = [
  { id: '1', name: 'Pants', price: 60, icon: Footprints, category: 'Laundry' },
  { id: '2', name: 'Jacket', price: 150, icon: Shirt, category: 'Dry Wash' },
  { id: '3', name: 'Carpets', price: 450, icon: Home, category: 'Dry Wash' },
  { id: '4', name: 'Coat', price: 200, icon: Shirt, category: 'Dry Wash' },
  { id: '5', name: 'T-shirt', price: 40, icon: Shirt, category: 'Laundry' },
  { id: '6', name: 'Dress', price: 180, icon: Scissors, category: 'Laundry' },
  { id: '7', name: 'Suit', price: 400, icon: Package, category: 'Dry Wash' },
  { id: '8', name: 'Shirt', price: 40, icon: Shirt, category: 'Laundry' },
  { id: '9', name: 'Bed Pants', price: 80, icon: Home, category: 'Laundry' },
  { id: '10', name: 'Ironing - Pants', price: 30, icon: Footprints, category: 'Ironing' },
  { id: '11', name: 'Ironing - Shirt', price: 25, icon: Shirt, category: 'Ironing' },
  { id: '12', name: 'Ironing - Dress', price: 50, icon: Scissors, category: 'Ironing' },
];

export default function Pricing() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'All' | 'Laundry' | 'Dry Wash' | 'Ironing'>('All');
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editableItems, setEditableItems] = React.useState<Item[]>(ITEMS);
  const [editedPrices, setEditedPrices] = React.useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = React.useState(false);

  const isStaff = user?.role === 'staff';

  if (!user) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const number_of_clothes = cart.reduce((acc, i) => acc + i.qty, 0);
      await api.post('/student/laundry', { number_of_clothes });
      toast.success("Checkout Successful!");
      setCart([]);
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredItems = editableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    setEditedPrices(prev => ({
      ...prev,
      [itemId]: newPrice
    }));
    setHasChanges(true);
  };

  const handleSavePrices = () => {
    const updatedItems = editableItems.map(item => ({
      ...item,
      price: editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price
    }));
    setEditableItems(updatedItems);
    setEditedPrices({});
    setHasChanges(false);
    setIsEditMode(false);
    toast.success("Prices updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditedPrices({});
    setHasChanges(false);
    setIsEditMode(false);
    toast.info("Changes discarded");
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Group items by category for display
  const categories = ['All', 'Laundry', 'Dry Wash', 'Ironing'] as const;

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 animate-fade-up w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Grid Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pricing & Services
            </h1>
            <p className="text-slate-500 mt-1">View and manage laundry service pricing</p>
          </div>

          {/* Edit Mode Toggle (Staff Only) */}
          {isStaff && (
            <div className="flex items-center gap-4">
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="border-slate-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSavePrices}
                    disabled={!hasChanges}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Prices
                </Button>
              )}
            </div>
          )}

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search items..."
              className="pl-9 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-primary hover:border-blue-300 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === category
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Edit Mode Active</p>
                <p className="text-sm text-blue-600">Click on any price to edit it. Changes will be saved when you click Save.</p>
              </div>
            </div>
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                Unsaved Changes
              </Badge>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 px-1 pb-1">
            {filteredItems.map((item) => {
              const currentPrice = editedPrices[item.id] !== undefined ? editedPrices[item.id] : item.price;
              const isEdited = editedPrices[item.id] !== undefined && editedPrices[item.id] !== item.price;

              return (
                <div
                  key={item.id}
                  onClick={() => !isEditMode && addToCart(item)}
                  className={`group relative flex flex-col items-center justify-center aspect-square p-2 bg-white border border-slate-200 rounded-2xl transition-all duration-300 shadow-sm ${
                    isEditMode
                      ? ''
                      : 'hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg active:scale-95 cursor-pointer'
                  }`}
                >
                  <div className="h-12 w-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                    <item.icon className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-center text-slate-900 group-hover:text-blue-700 transition-colors px-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {item.name}
                  </span>

                  {/* Price Display / Edit */}
                  {isEditMode ? (
                    <div className="flex items-center gap-1 mt-2">
                      <IndianRupee className="h-3 w-3 text-slate-500" />
                      <Input
                        type="number"
                        value={currentPrice}
                        onChange={(e) => handlePriceChange(item.id, parseInt(e.target.value) || 0)}
                        className={`w-16 h-8 text-center text-sm font-bold ${
                          isEdited ? 'border-emerald-400 bg-emerald-50' : ''
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {isEdited && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px] text-white">✓</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className={`text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity ${isEdited ? 'text-emerald-600' : ''}`}>
                      ₹{currentPrice}
                    </span>
                  )}

                  {/* Category Badge - Hidden in edit mode to save space */}
                  {!isEditMode && (
                    <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {item.category}
                    </span>
                  )}

                  {cart.find(i => i.id === item.id) && !isEditMode && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-fade-up">
                      {cart.find(i => i.id === item.id)?.qty}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">No items found matching your filter.</p>
            </div>
          )}
        </div>

      </div>

      {/* Right Sidebar - Order Summary */}
      <Card className="w-full lg:w-[380px] bg-white/90 backdrop-blur-sm border-l border-slate-200 rounded-none lg:rounded-l-3xl shadow-2xl flex flex-col shrink-0 animate-fade-up">
        <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Current Order</CardTitle>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-2 py-0.5">
              {cart.length} ITEMS
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-y-auto custom-scrollbar">
          {cart.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {cart.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-none">{item.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter mt-1 block">
                          ₹{item.price} / unit ({item.category})
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹{item.price * item.qty}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm transition-all"
                        onClick={() => updateQty(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">{item.qty}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm transition-all"
                        onClick={() => updateQty(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                      onClick={() => updateQty(item.id, -item.qty)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full opacity-40">
              <div className="h-20 w-20 rounded-full border-4 border-dashed border-slate-400 flex items-center justify-center mb-4 bg-gradient-to-br from-slate-100 to-slate-200">
                <Package className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1 text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-[180px]">Select items from the grid to build your laundry order.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 p-6 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-bold font uppercase">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Tax (0%)</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-sm font-black uppercase text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-primary">₹{total}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              className="h-12 font-bold rounded-xl border-2 uppercase text-xs tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              onClick={() => setCart([])}
            >
              Clear
            </Button>
            <Button
              className="h-12 font-bold bg-primary text-primary-foreground rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              disabled={cart.length === 0 || isEditMode}
              onClick={handleCheckout}
            >
              {isCheckingOut ? 'Processing...' : 'Check Out'}
            </Button>
          </div>
          {isEditMode && cart.length > 0 && (
            <p className="text-xs text-center text-amber-600">
              Checkout disabled while editing prices
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
