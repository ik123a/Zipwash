import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, CheckCircle2, Package, Info, Zap } from 'lucide-react';

interface Reminder {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  urgent: boolean;
}

const INITIAL_REMINDERS: Reminder[] = [
  { id: 1, type: "ready", title: "Order Ready for Pickup!", description: "Your laundry is ready for pickup at the main counter.", time: "2 hours ago", urgent: true },
  { id: 2, type: "promo", title: "Happy Hour: 20% Off", description: "Drop off your laundry between 2PM - 5PM today to get 20% off.", time: "5 hours ago", urgent: false },
  { id: 3, type: "info", title: "System Maintenance", description: "The app will be down for maintenance tonight at 12 AM.", time: "1 day ago", urgent: false }
];

export default function Reminders() {
  const [reminders, setReminders] = React.useState<Reminder[]>(INITIAL_REMINDERS);

  const deleteReminder = (id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    setReminders([]);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reminders & Alerts</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your order status and offers.</p>
        </div>
        {reminders.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 h-9"
            onClick={clearAll}
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" /> Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {reminders.map((r) => (
          <Card key={r.id} className={`border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${r.urgent ? 'border-l-4 border-l-amber-500' : ''}`}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  r.type === 'ready' ? 'bg-green-100 text-green-600' :
                  r.type === 'promo' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {r.type === 'ready' ? <Package className="h-6 w-6" /> :
                   r.type === 'promo' ? <Zap className="h-6 w-6 fill-primary" /> :
                   <Info className="h-6 w-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      {r.title}
                      {r.urgent && <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                    </h3>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {r.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mr-8">{r.description}</p>
                  <div className="flex gap-4 mt-4">
                    <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary hover:no-underline">
                      Mark as read
                    </Button>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs font-bold text-muted-foreground hover:text-red-600 hover:no-underline"
                      onClick={() => deleteReminder(r.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reminders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">You're all caught up!</h3>
            <p className="text-muted-foreground text-sm">No new reminders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
