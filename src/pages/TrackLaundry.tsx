import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Clock, CheckCircle2, TrendingUp, Search, Loader2 } from "lucide-react";
import api from "@/services/api";

interface Order {
  id: string | number;
  status: string;
  number_of_clothes: number;
  submission_time: string;
  progress?: number;
}

interface TrackedOrderView {
  id: string;
  status: string;
  items: string;
  placedAt: string;
  expectedBy: string;
  progress: number;
}

const MOCK_ORDERS: TrackedOrderView[] = [
  { id: "ZW-10293", status: "washing", items: "5 Shirts, 2 Trousers", placedAt: "2026-04-07 10:30 AM", expectedBy: "2026-04-08 05:00 PM", progress: 45 },
  { id: "ZW-10294", status: "drying", items: "1 Suit, 1 Bedspread", placedAt: "2026-04-06 02:15 PM", expectedBy: "2026-04-07 08:00 PM", progress: 80 },
];

const statusStyles: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-slate-100 text-slate-700 border-slate-200" },
  submitted: { label: "Submitted", color: "bg-sky-100 text-sky-700 border-sky-200" },
  washing: { label: "Washing", color: "bg-sky-100 text-sky-700 border-sky-200" },
  processing: { label: "Processing", color: "bg-sky-100 text-sky-700 border-sky-200" },
  drying: { label: "Drying", color: "bg-amber-100 text-amber-700 border-amber-200" },
  ready: { label: "Ready", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

function getProgress(status: string): number {
  const progressMap: Record<string, number> = {
    submitted: 10,
    processing: 30,
    washing: 55,
    drying: 80,
    ready: 100,
    delivered: 100,
  };
  return progressMap[status] || 0;
}

export default function TrackLaundry() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/laundry");
      if (res.data.length > 0) {
        setOrders(res.data);
        setShowMock(false);
      } else {
        setOrders(MOCK_ORDERS as unknown as Order[]);
        setShowMock(true);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders(MOCK_ORDERS as unknown as Order[]);
      setShowMock(true);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders: TrackedOrderView[] = showMock
    ? MOCK_ORDERS
    : orders
        .filter((o) => o.status !== "delivered")
        .map((o) => ({
          ...o,
          id: String(o.id),
          items: `${o.number_of_clothes} item(s)`,
          placedAt: new Date(o.submission_time).toLocaleString(),
          expectedBy: "Check back for updates",
          progress: getProgress(o.status),
        }));

  const filtered = searchTerm
    ? activeOrders.filter((o) => String(o.id).toLowerCase().includes(searchTerm.toLowerCase()))
    : activeOrders;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 shadow-inner">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
        <p className="text-slate-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Track Laundry</h1>
          <p className="text-slate-500 mt-2">Monitor your active orders in real-time.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-11 bg-white border-slate-200"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold">No Active Orders</h3>
          <p className="text-slate-500 text-sm">When you drop off your laundry, it will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((order) => (
            <Card key={order.id} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b bg-slate-100/30 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{order.id}</CardTitle>
                      <CardDescription className="text-xs">{order.items}</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${statusStyles[order.status]?.color || "bg-slate-100 text-slate-700 border-slate-200"} border shadow-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                    {statusStyles[order.status]?.label || order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-500">Placed:</span>
                      <span className="font-medium text-foreground">{order.placedAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-slate-500">Expected:</span>
                      <span className="text-foreground">{order.expectedBy}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>Order Progress</span>
                      <span className="text-slate-900">{order.progress ?? getProgress(order.status)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${order.progress ?? getProgress(order.status)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      {[
                        { label: "Received", threshold: 10 },
                        { label: "Washing", threshold: 40 },
                        { label: "Drying", threshold: 70 },
                        { label: "Ready", threshold: 100 },
                      ].map((step) => {
                        const progress = order.progress ?? getProgress(order.status);
                        const active = progress >= step.threshold;
                        return (
                          <div key={step.label} className={`flex flex-col items-center gap-1 ${active ? "opacity-100" : "opacity-30"}`}>
                            <div className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-slate-100-foreground"}`} />
                            <span className={`text-[9px] font-bold uppercase ${active ? "text-slate-900" : "text-slate-500"}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
