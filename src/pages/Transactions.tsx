import { useEffect, useState } from 'react';

interface StudentLaundryRow {
  id: number | string;
  submission_time: string;
  number_of_clothes?: number;
  total_amount?: number;
  status: string;
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Hash, ShoppingBag, Calendar, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import api from '@/services/api';

interface Transaction {
  id: number | string;
  date: string;
  items?: string;
  amount: number;
  status: string;
  method?: string;
  submission_time?: string;
  number_of_clothes?: number;
}

const statusConfig: Record<string, string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  submitted: "bg-slate-100 text-slate-700 border-slate-200",
  Washing:   "bg-blue-100 text-blue-700 border-blue-200",
  Drying:    "bg-amber-100 text-amber-700 border-amber-200",
  Pending:   "bg-slate-100 text-slate-700 border-slate-200",
  processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ready:     "bg-green-100 text-green-700 border-green-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/student/laundry');
      const mapped = (res.data as StudentLaundryRow[]).map((item) => ({
        id: item.id,
        date: new Date(item.submission_time).toLocaleDateString(),
        items: `${item.number_of_clothes || 1} item(s)`,
        amount: item.total_amount || 0,
        status: item.status,
        method: "App Payment"
      }));
      setTransactions(mapped);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transaction history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t =>
    String(t.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.items && t.items.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transaction History</h1>
          <p className="text-muted-foreground mt-1">Full statement of your laundry orders and payments.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ID or items..."
              className="pl-9 h-11 bg-card border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading transactions...</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
          <Button variant="ghost" size="sm" className="ml-2" onClick={loadTransactions}>Retry</Button>
        </div>
      )}

      {!loading && !error && (
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">Statement Overview</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Items</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t) => (
                    <tr key={t.id} className="group hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3.5 w-3.5 text-primary opacity-50" />
                          <span className="font-bold text-sm text-foreground">{t.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{t.items}</p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{t.method} Payment</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{t.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-black text-sm text-foreground">₹{t.amount}</td>
                      <td className="px-6 py-5">
                        <Badge className={`${statusConfig[t.status] || "bg-slate-100 text-slate-700"} text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border shadow-none`}>
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <p className="text-muted-foreground font-medium">No transactions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
