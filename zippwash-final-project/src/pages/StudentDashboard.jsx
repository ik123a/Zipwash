import React, { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, getOrderProgress, statusLabel, studentOrderItemsLabel } from '@/lib/zippwashStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Bell,
  Gift,
  History,
  Home,
  Info,
  LogOut,
  MessageCircle,
  MessageSquare,
  Moon,
  RefreshCw,
  Search,
  Shirt,
  Sparkles,
  Star,
  Sun,
  Ticket,
  WashingMachine,
  Package,
  BadgeIndianRupee,
  Clock3,
  CheckCircle2,
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'track', label: 'Track Laundry', icon: WashingMachine },
  { id: 'pricing', label: 'Dry Clean Pricing', icon: BadgeIndianRupee },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'transactions', label: 'Transaction History', icon: History },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'about', label: 'About', icon: Info },
];

const slotOptions = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '5:00 PM', '8:15 PM'];
const dayOptions = ['Today', 'Tomorrow', 'This Weekend'];

const offers = [
  { id: 'offer-1', title: 'Fresh Offers', cost: 80, description: 'Redeem for a 20% wash voucher on your next booking.' },
  { id: 'offer-2', title: 'Express Finish', cost: 120, description: 'Priority processing for one dry-clean order.' },
  { id: 'offer-3', title: 'Free Shirt Press', cost: 60, description: 'One complimentary shirt press service.' },
];

const orderBadgeClass = {
  submitted: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
  washing: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  drying: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  ready: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200',
  picked_up: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
};

const notificationAccent = {
  success: 'border-l-green-500',
  promo: 'border-l-blue-500',
  warning: 'border-l-amber-500',
  info: 'border-l-slate-500',
};

function formatDateLabel(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const {
    db,
    theme,
    toggleTheme,
    submitLaundry,
    checkoutDryClean,
    clearNotificationsForUser,
    removeNotification,
    markNotificationRead,
    submitFeedback,
    redeemOffer,
    resetAllData,
    selectors,
  } = useAppData();

  const student = selectors.getStudent(user?.id) || user;
  const orders = useMemo(
    () => selectors.getStudentOrders(user.id).slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [selectors, user.id, db.orders],
  );
  const notifications = useMemo(
    () => selectors.getStudentNotifications(user.id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [selectors, user.id, db.notifications],
  );
  const rewardEvents = useMemo(
    () => selectors.getStudentRewards(user.id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [selectors, user.id, db.rewardEvents],
  );
  const feedbackList = useMemo(
    () => selectors.getStudentFeedback(user.id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [selectors, user.id, db.feedback],
  );
  const transactions = useMemo(
    () => selectors.getStudentTransactions(user.id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [selectors, user.id, db.transactions],
  );

  const machineStats = selectors.getMachineStats();
  const machines = db.machines;
  const unreadCount = notifications.filter((entry) => !entry.read).length;

  const [page, setPage] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(machines.find((entry) => entry.status === 'available')?.id || machines[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('8:15 PM');
  const [quantity, setQuantity] = useState(3);
  const [submitNote, setSubmitNote] = useState('');
  const [pricingSearch, setPricingSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [trackingSearch, setTrackingSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const pricingItems = db.pricingItems.filter((item) => {
    const query = pricingSearch.trim().toLowerCase();
    if (!query) return true;
    return item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
  });

  const filteredOrders = orders.filter((order) => {
    const query = trackingSearch.trim().toLowerCase();
    if (!query) return true;
    return order.id.toLowerCase().includes(query) || studentOrderItemsLabel(order).toLowerCase().includes(query);
  });

  const filteredTransactions = transactions.filter((entry) => {
    const query = transactionSearch.trim().toLowerCase();
    if (!query) return true;
    return entry.description.toLowerCase().includes(query) || entry.id.toLowerCase().includes(query);
  });

  const activeOrders = filteredOrders.filter((order) => order.status !== 'picked_up');
  const selectedMachine = machines.find((entry) => entry.id === selectedMachineId);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openSubmitModal = (machineId) => {
    setSelectedMachineId(machineId || machines.find((entry) => entry.status === 'available')?.id || '');
    setSubmitOpen(true);
  };

  const addCartItem = (item) => {
    setCart((previous) => {
      const found = previous.find((entry) => entry.id === item.id);
      if (found) {
        return previous.map((entry) => (entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry));
      }
      return [...previous, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to current order.`);
  };

  const updateCartQty = (itemId, delta) => {
    setCart((previous) => previous
      .map((entry) => (entry.id === itemId ? { ...entry, quantity: Math.max(0, entry.quantity + delta) } : entry))
      .filter((entry) => entry.quantity > 0));
  };

  const handleQuickSubmit = () => {
    if (!selectedMachineId || !selectedMachine || selectedMachine.status === 'offline') {
      toast.error('Please choose an active machine.');
      return;
    }
    const created = submitLaundry({
      studentId: user.id,
      machineId: selectedMachineId,
      quantity,
      slot: selectedSlot,
      dateLabel: selectedDay,
      notes: submitNote,
    });
    setSubmitOpen(false);
    setQuantity(3);
    setSubmitNote('');
    setPage('track');
    toast.success(`Laundry booked on ${selectedMachine.code}. Order ${created.id} created.`);
  };

  const handleCheckout = () => {
    if (!cart.length) {
      toast.error('Your cart is empty.');
      return;
    }
    const created = checkoutDryClean({ studentId: user.id, cartItems: cart });
    setCart([]);
    setPage('transactions');
    toast.success(`Checkout complete. Order ${created.id} submitted successfully.`);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackMessage.trim()) {
      toast.error('Please write your feedback before submitting.');
      return;
    }
    submitFeedback({ studentId: user.id, rating: feedbackRating, message: feedbackMessage.trim() });
    setFeedbackMessage('');
    setFeedbackRating(5);
    toast.success('Thanks! Your feedback has been recorded.');
  };

  const renderHome = () => (
    <div className="space-y-6">
      <SectionHeading
        title="Student Dashboard"
        subtitle="Monitor machine availability and submit new laundry requests in one place."
        action={
          <Button variant="outline" className="gap-2" onClick={() => toast.success('Machine status refreshed.') }>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Available" value={machineStats.available} subtitle={`of ${machineStats.total} machines`} tone="green" />
        <StatCard title="In Use" value={machineStats.busy} subtitle="Currently running" tone="amber" />
        <StatCard title="Offline" value={machineStats.offline} subtitle="Maintenance" tone="red" />
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Machines</CardTitle>
            <CardDescription>Tap an available machine to open the booking form.</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">Live status</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {machines.map((machine) => {
              const isAvailable = machine.status === 'available';
              return (
                <button
                  key={machine.id}
                  type="button"
                  onClick={() => isAvailable && openSubmitModal(machine.id)}
                  className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 ${
                    machine.status === 'available'
                      ? 'border-green-200 bg-green-50 hover:bg-green-100/70 dark:border-green-500/30 dark:bg-green-500/10'
                      : machine.status === 'busy'
                        ? 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{machine.code}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{machine.type}</p>
                    </div>
                    <WashingMachine className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-8 flex items-center gap-2 rounded-xl border border-slate-300/70 bg-white/70 px-3 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-950/60">
                    <span className={`h-2.5 w-2.5 rounded-full ${machine.status === 'available' ? 'bg-green-500' : machine.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    {machine.status === 'available' ? 'Available' : machine.status === 'busy' ? 'Busy' : 'Offline'}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track the latest submissions from your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 4).map((order) => (
                    <tr key={order.id} className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{order.id}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDateLabel(order.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-500">{order.totalItems}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderBadgeClass[order.status] || 'bg-slate-100 text-slate-700'}`}>
                          {statusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Quick Action</CardTitle>
            <CardDescription>Open the unified booking modal and submit your next load.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between rounded-2xl bg-blue-600 py-6 text-base hover:bg-blue-700" onClick={() => openSubmitModal()}>
              Submit Laundry <Package className="h-5 w-5" />
            </Button>
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Tip: use Home for machine bookings, Track Laundry for live progress, and Dry Clean Pricing for itemized checkout.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTrack = () => (
    <div className="space-y-6">
      <SectionHeading
        title="Track Laundry"
        subtitle="Monitor the current progress of all your active laundry orders in real time."
        action={
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={trackingSearch} onChange={(event) => setTrackingSearch(event.target.value)} placeholder="Search Order ID..." className="pl-9" />
          </div>
        }
      />

      <div className="space-y-4">
        {activeOrders.length === 0 ? (
          <EmptyCard title="No active laundry orders" description="Once you submit laundry, progress updates will appear here." icon={<WashingMachine className="h-10 w-10 text-slate-300" />} />
        ) : (
          activeOrders.map((order) => {
            const progress = getOrderProgress(order.status);
            const stages = ['Received', 'Washing', 'Drying', 'Ready'];
            const activeIndex = Math.max(0, Math.min(3, Math.round(progress / 35)));
            return (
              <Card key={order.id} className="overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{order.id}</p>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderBadgeClass[order.status] || 'bg-slate-100 text-slate-700'}`}>
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{order.slotLabel}</p>
                      <p className="mt-1 text-sm text-slate-500">{studentOrderItemsLabel(order)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{progress}%</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order Progress</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 px-6 pb-6 pt-5 dark:border-slate-800">
                    <div className="mb-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] uppercase tracking-[0.15em] text-slate-400">
                      {stages.map((stage, index) => (
                        <div key={stage} className={index <= activeIndex ? 'text-blue-600 dark:text-blue-300' : ''}>
                          <div className={`mx-auto mb-2 h-2.5 w-2.5 rounded-full ${index <= activeIndex ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          {stage}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <SectionHeading title="Dry Clean Pricing" subtitle="Build an order from the catalog and check out with one click." />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Service Catalog</CardTitle>
                <CardDescription>Search and add items to your current order.</CardDescription>
              </div>
              <div className="relative w-full lg:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={pricingSearch} onChange={(event) => setPricingSearch(event.target.value)} placeholder="Search items..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pricingItems.map((item) => (
                <button key={item.id} type="button" onClick={() => addCartItem(item)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">{item.icon}</div>
                  <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-400">{item.category}</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(item.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="sticky top-6 h-fit dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Order</CardTitle>
              <Badge variant="outline">{cartCount} items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
                <Package className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-lg font-semibold text-slate-500">Your cart is empty</p>
                <p className="mt-1 text-sm text-slate-400">Select items from the grid to build your laundry order.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700">
                        <button type="button" onClick={() => updateCartQty(item.id, -1)} className="h-6 w-6 rounded-full bg-slate-100 text-sm dark:bg-slate-800">-</button>
                        <span className="min-w-5 text-center text-sm font-semibold">{item.quantity}</span>
                        <button type="button" onClick={() => updateCartQty(item.id, 1)} className="h-6 w-6 rounded-full bg-slate-100 text-sm dark:bg-slate-800">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
              <div className="flex items-center justify-between text-slate-500"><span>Tax (0%)</span><span>{formatCurrency(0)}</span></div>
              <div className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white"><span>Total Amount</span><span className="text-blue-600">{formatCurrency(cartSubtotal)}</span></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCart([])}>Clear</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleCheckout}>Check Out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <SectionHeading title="Rewards & Loyalty" subtitle="Track your points, balance and offers, then redeem them for perks." />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <Card className="overflow-hidden border-0 bg-blue-600 text-white shadow-xl">
          <CardContent className="relative p-8">
            <Star className="absolute right-8 top-8 h-24 w-24 opacity-20" />
            <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Rewards Balance</p>
            <h3 className="mt-6 text-5xl font-bold">{student?.points || 0}</h3>
            <p className="mt-2 text-blue-100">Points available to redeem right now.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary" className="bg-white/15 px-4 py-2 text-white">{student?.streak || 0}-day streak</Badge>
              <Badge variant="secondary" className="bg-white/15 px-4 py-2 text-white">Fresh member tier</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <CardDescription>Track your earning and spending activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rewardEvents.slice(0, 4).map((event) => (
              <div key={event.id} className="flex items-start justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{event.message}</p>
                  <p className="text-sm text-slate-500">{formatDateLabel(event.createdAt)}</p>
                </div>
                <span className={`text-sm font-bold ${event.points >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {event.points > 0 ? '+' : ''}{event.points} pts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.id} className="dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">Fresh Offers</Badge>
              <CardTitle className="pt-2">{offer.title}</CardTitle>
              <CardDescription>{offer.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-2xl font-bold text-blue-600">{offer.cost} pts</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  try {
                    redeemOffer({ studentId: user.id, points: offer.cost, title: offer.title });
                    toast.success(`${offer.title} redeemed successfully.`);
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
              >
                Redeem Offer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6">
      <SectionHeading title="Feedback" subtitle="Tell us what’s working well and what should improve next." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Share Feedback</CardTitle>
            <CardDescription>Your comments help us polish the ZIPPWASH experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setFeedbackRating(value)} className={`rounded-full p-2 ${value <= feedbackRating ? 'text-amber-400' : 'text-slate-300'}`}>
                    <Star className={`h-6 w-6 ${value <= feedbackRating ? 'fill-amber-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Your message</p>
              <Textarea value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="Write your feedback here..." rows={6} />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleFeedbackSubmit}>Submit Feedback</Button>
          </CardContent>
        </Card>
        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Previous Feedback</CardTitle>
            <CardDescription>Everything you submitted is saved here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedbackList.length === 0 ? (
              <EmptyCard title="No feedback yet" description="Once you submit feedback, it will appear here." icon={<MessageSquare className="h-10 w-10 text-slate-300" />} />
            ) : (
              feedbackList.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < entry.rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{formatDateLabel(entry.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{entry.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <SectionHeading
        title="Transaction History"
        subtitle="Review previous order payments and submissions."
        action={
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={transactionSearch} onChange={(event) => setTransactionSearch(event.target.value)} placeholder="Search ID or items..." className="pl-9" />
          </div>
        }
      />
      <Card className="dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-10">
              <EmptyCard title="No transactions found" description="Transactions will appear here after you submit or check out an order." icon={<History className="h-10 w-10 text-slate-300" />} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((entry) => (
                    <tr key={entry.id} className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{entry.description}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDateLabel(entry.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-white">{formatCurrency(entry.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderBadgeClass[entry.status] || 'bg-slate-100 text-slate-700'}`}>{statusLabel(entry.status)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReminders = () => (
    <div className="space-y-6">
      <SectionHeading
        title="Reminders & Alerts"
        subtitle="Get notified about order status updates, offers and service notices."
        action={
          <Button variant="outline" onClick={() => clearNotificationsForUser('student', user.id)}>Clear All</Button>
        }
      />
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <EmptyCard title="No reminders available" description="You’re all caught up right now." icon={<Bell className="h-10 w-10 text-slate-300" />} />
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`border-l-4 ${notificationAccent[notification.kind] || 'border-l-slate-400'} dark:border-slate-800 dark:bg-slate-900`}>
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                    {!notification.read && <Badge className="bg-blue-600">New</Badge>}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">{formatDateLabel(notification.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {!notification.read && <Button variant="outline" size="sm" onClick={() => markNotificationRead(notification.id)}>Mark Read</Button>}
                  <Button variant="ghost" size="sm" onClick={() => removeNotification(notification.id)}>Remove</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <SectionHeading title="About ZIPPWASH" subtitle="A polished campus laundry platform for students and staff." />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>What’s included</CardTitle>
            <CardDescription>This build includes a complete demo experience for both student and admin portals.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              'Working student login & registration',
              'Live machine dashboard and booking modal',
              'Track Laundry progress with stage bars',
              'Itemized dry-clean cart & checkout',
              'Rewards, reminders, feedback and history',
              'Admin controls for machines and orders',
            ].map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">{feature}</div>
            ))}
          </CardContent>
        </Card>
        <Card className="dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Support & Demo Controls</CardTitle>
            <CardDescription>Handy shortcuts for showcasing the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Student demo</p>
              <p className="mt-1">Roll Number: <span className="font-mono">TS001</span></p>
              <p>Password: <span className="font-mono">{import.meta.env.VITE_STUDENT_PASSWORD || 'student123'}</span></p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Admin demo</p>
              <p className="mt-1">Username: <span className="font-mono">admin</span></p>
              <p>Password: <span className="font-mono">{import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'}</span></p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => { resetAllData(); logout(); }}>Reset Demo Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const pageContent = {
    home: renderHome(),
    track: renderTrack(),
    pricing: renderPricing(),
    rewards: renderRewards(),
    feedback: renderFeedback(),
    transactions: renderTransactions(),
    reminders: renderReminders(),
    about: renderAbout(),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {mobileNavOpen && <div className="fixed inset-0 z-40 bg-slate-950/50 md:hidden" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="rounded-xl bg-blue-600 p-2 text-white"><Shirt className="h-5 w-5" /></div>
          <div>
            <p className="text-2xl font-bold tracking-tight">ZIPPWASH</p>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Student Portal</p>
          </div>
        </div>
        <div className="px-6 pt-6 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Main Menu</div>
        <nav className="mt-4 flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setPage(item.id);
                  setMobileNavOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === 'reminders' && unreadCount > 0 && <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs text-current">{unreadCount}</span>}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Dark Mode
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-xl border border-slate-200 p-2 dark:border-slate-800 md:hidden" onClick={() => setMobileNavOpen(true)}>
              <Sparkles className="h-4 w-4" />
            </button>
            <div>
              <p className="text-lg font-semibold">Welcome back, {student?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{student?.role === 'student' ? 'Student' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{student?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">TS</div>
            <Button variant="ghost" size="icon" onClick={logout}><LogOut className="h-5 w-5" /></Button>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8">{pageContent[page]}</main>
      </div>

      <button
        type="button"
        onClick={() => setSupportOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 transition hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="max-w-2xl border-0 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Submit Laundry</DialogTitle>
            <DialogDescription className="text-slate-400">Choose your machine, preferred slot and quantity in a single step.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Select Machine</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {machines.map((machine) => (
                    <button
                      key={machine.id}
                      type="button"
                      disabled={machine.status === 'offline'}
                      onClick={() => setSelectedMachineId(machine.id)}
                      className={`rounded-2xl border p-4 text-left transition ${selectedMachineId === machine.id ? 'border-blue-500 bg-blue-500/15' : 'border-slate-800 bg-slate-900'} ${machine.status === 'offline' ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <p className="font-semibold">{machine.code}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-400">{machine.status}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Select Day</p>
                <div className="flex gap-2">
                  {dayOptions.map((value) => (
                    <button key={value} type="button" onClick={() => setSelectedDay(value)} className={`flex-1 rounded-2xl border px-4 py-3 text-sm ${selectedDay === value ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>{value}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Time Slot</p>
                <div className="grid grid-cols-2 gap-2">
                  {slotOptions.map((value) => (
                    <button key={value} type="button" onClick={() => setSelectedSlot(value)} className={`rounded-xl border px-3 py-2 text-sm ${selectedSlot === value ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>{value}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Quantity</p>
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" className="h-10 w-10 rounded-full bg-slate-800 text-lg" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
                  <div className="flex-1 rounded-2xl bg-slate-800 px-4 py-3 text-center text-2xl font-bold">{quantity}</div>
                  <button type="button" className="h-10 w-10 rounded-full bg-slate-800 text-lg" onClick={() => setQuantity((value) => Math.min(10, value + 1))}>+</button>
                </div>
                <p className="mt-3 text-sm text-slate-400">Up to 10 clothes per request.</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Note (optional)</p>
                <Textarea value={submitNote} onChange={(event) => setSubmitNote(event.target.value)} className="border-slate-800 bg-slate-900 text-white" placeholder="Any special handling instructions..." rows={5} />
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                Selected: <span className="font-semibold">{selectedMachine?.code || 'None'}</span> · {selectedDay} · {selectedSlot}
              </div>
              <Button className="w-full bg-blue-600 py-6 text-base hover:bg-blue-700" onClick={handleQuickSubmit}>Confirm Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Support & Help</DialogTitle>
            <DialogDescription>Quick answers for the most common student questions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">How do I book a machine?</p>
              <p className="mt-2">Open Home, tap any available machine and confirm your slot in the booking modal.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Where can I check order progress?</p>
              <p className="mt-2">Use Track Laundry to monitor submitted, washing, drying and ready stages with live progress bars.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">How do rewards work?</p>
              <p className="mt-2">Every order earns points, and you can redeem Fresh Offers from the Rewards page.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, subtitle, tone }) {
  const tones = {
    green: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-200 dark:border-green-500/20',
    amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20',
    red: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-500/20',
  };

  return (
    <Card className={`${tones[tone]} border shadow-sm`}>
      <CardContent className="p-6">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="mt-4 text-4xl font-bold">{value}</p>
        <p className="mt-1 text-sm opacity-80">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function EmptyCard({ title, description, icon }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">{icon}</div>
      <p className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
