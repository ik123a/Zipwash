import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Zap, Ticket, History, ArrowRight, Star } from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  points: number;
  type: string;
  icon: React.ElementType;
}

const REWARDS: Reward[] = [
  { id: 1, title: "15% Off Your Next Order", points: 500, type: "Discount", icon: Ticket },
  { id: 2, title: "Free Steam Ironing (3 items)", points: 300, type: "Service", icon: Zap },
  { id: 3, title: "₹100 Wallet Top-up", points: 1000, type: "Wallet", icon: Gift }
];

export default function Rewards() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rewards Program</h1>
        <p className="text-slate-500 mt-2">Earn points for every order and redeem them for perks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative border-none shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <Star className="h-32 w-32 text-white/20" />
          </div>
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-white" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Current Point Balance</span>
            </div>
            <h2 className="text-6xl font-black mb-2">1,240</h2>
            <p className="text-sm opacity-90 max-w-[280px]">You're just 260 points away from becoming a Platinum Member!</p>
            <Button variant="secondary" className="mt-8 font-bold rounded-xl h-12 px-6">
              How to earn more <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm flex flex-col justify-center text-center p-6">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <History className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold">Points History</h3>
          <p className="text-xs text-slate-500 mt-2 mb-6">Track your earning and spending activity.</p>
          <Button variant="outline" className="w-full h-11 font-bold rounded-xl border-2">
            View Statement
          </Button>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Ticket className="h-5 w-5 text-blue-600" /> Available Rewards
          </h3>
          <Badge variant="outline" className="text-[10px] font-bold uppercase px-3 py-1 tracking-widest bg-blue-50 text-blue-600 border-blue-200">
            Fresh Offers
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REWARDS.map((reward) => (
            <Card key={reward.id} className="group overflow-hidden border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300">
              <div className="h-2 bg-slate-100 group-hover:bg-blue-200 transition-colors" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <reward.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{reward.type}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{reward.title}</h4>
                <div className="flex items-center gap-1.5 mb-6">
                  <Zap className="h-3 w-3 text-blue-600" />
                  <span className="text-sm font-black text-blue-600">{reward.points} Points</span>
                </div>
                <Button className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 hover:shadow-md">
                  Redeem Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
