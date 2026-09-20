import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronDown, Plus, EyeOff, AlertTriangle, Clock, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";

// Static Data for the mock
const pieData = [
  { name: 'Returning', value: 9 },
  { name: 'New', value: 2 }
];

export default function StaffAdminPanel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const COLORS = isDark ? ['#3b82f6', '#475569'] : ['#345381', '#9ca3af']; // Adjust pie colors for dark mode

  return (
    <div className="flex flex-col h-full w-full bg-transparent animate-fade-in pb-10">
      
      {/* Top Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="flex flex-col gap-6">
          
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          </div>

          {/* Orders Section Title */}
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Orders</h2>
            <button className="text-sm font-semibold text-[#345381] dark:text-blue-400 hover:underline">View All</button>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Add New Order Card */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl flex items-center justify-center min-h-[160px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/60">
              <Plus className="text-orange-500 w-8 h-8 stroke-[2.5]" />
            </div>

            {/* Order Card 1 */}
            <OrderCard 
              id="#00012" 
              status="On Progress" 
              statusColor="bg-amber-500" 
              date="6 Mar 2024" 
              name="John Doe" 
              service="Dry clean" 
              price="Rp25.000" 
            />

            {/* Order Card 2 */}
            <OrderCard 
              id="#00011" 
              status="On Progress" 
              statusColor="bg-amber-500" 
              date="5 Mar 2024" 
              name="Ann Smith" 
              service="Clean and press" 
              price="Rp31.500" 
            />

            {/* Order Card 3 */}
            <OrderCard 
              id="#00010" 
              status="Pending" 
              statusColor="bg-red-500" 
              date="9 Mar 2024" 
              name="Jim Park" 
              service="Clean and press" 
              price="Rp19.000" 
            />
          </div>

          {/* Divider Line */}
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

          {/* Bottom Left Area (Balance + Stats) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Financial Cards */}
            <div className="flex flex-col gap-4">
              
              {/* Balance Card */}
              <div className="bg-[#2f4b7c] dark:bg-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden h-[140px] flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[15px]">Balance</span>
                  <button className="flex items-center text-xs text-white/80 gap-1 hover:text-white">
                    Last 7 Days <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-extrabold tracking-tight">Rp132,242</span>
                  <EyeOff className="w-5 h-5 text-white/50 cursor-pointer hover:text-white" />
                </div>
                {/* Background decorative shape (optional) */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              </div>

              {/* Unpaid Orders Card */}
              <div className="bg-white dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between h-[140px] dark:bg-gradient-to-br">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[15px] text-slate-800 dark:text-slate-200">Unpaid Orders</span>
                  <button className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-1 hover:text-slate-300 dark:hover:text-slate-400">
                    Last 7 Days <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-baseline gap-2 mt-4 text-slate-900 dark:text-white">
                  <span className="text-4xl font-extrabold tracking-tight">Rp22,500</span>
                  <EyeOff className="w-5 h-5 text-slate-300 dark:text-slate-600 cursor-pointer hover:text-slate-500 dark:hover:text-slate-400" />
                </div>
              </div>

            </div>

            {/* Overall Stats Column */}
            <div className="flex flex-col gap-3">
              <StatRow icon={AlertTriangle} bg="bg-[#d2e2ec] dark:bg-blue-950/40" text="text-blue-900 dark:text-blue-400" title="Pending Orders" value="0" />
              <StatRow icon={Clock} bg="bg-orange-100 dark:bg-orange-950/40" text="text-orange-500 dark:text-orange-400" title="On Progress Orders" value="3" />
              <StatRow icon={ShoppingBag} bg="bg-[#2f4b7c] dark:bg-indigo-600/20" text="text-white dark:text-indigo-400" title="Finished Orders" value="9" />
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          
          {/* Date Info */}
          <div className="hidden xl:flex justify-end pt-2 mb-3">
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">9 Mar 2024, Saturday</span>
          </div>

          {/* Supply List */}
          <div className="bg-white dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 dark:bg-gradient-to-br">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Supply List</h3>
              <button className="text-xs font-semibold text-[#345381] dark:text-blue-400 hover:underline">Update</button>
            </div>

            <div className="flex flex-col gap-5">
              <SupplyItem name="Softener" left="2 pcs left" percent={10} isWarning />
              <SupplyItem name="Detergent" left="7 pcs left" percent={20} isWarning />
              <SupplyItem name="Plastic wrap" left="24 m left" percent={30} isWarning />
              <SupplyItem name="Plastic bag" left="34 pcs left" percent={80} />
              <SupplyItem name="Perfume" left="19 ml left" percent={65} />
            </div>
          </div>

          {/* Total Customer Card */}
          <div className="bg-slate-50 dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 mt-0 xl:mt-2 dark:bg-gradient-to-br">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Total Customer</h3>
              <button className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 gap-1 hover:text-slate-300 dark:hover:text-slate-400 font-medium">
                Last 7 Days <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="h-32 flex justify-center items-center my-2 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={0}
                      outerRadius={55}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-col items-center mt-2 text-xs font-medium gap-1 text-slate-700 dark:text-slate-200">
              <div className="text-[13px]"><strong>9</strong> returning customers</div>
              <div className="text-[13px]"><strong>2</strong> new customers</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ---------------- Components ---------------- //

function OrderCard({ id, status, statusColor, date, name, service, price }) {
  return (
    <div className="bg-white dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between min-h-[160px] hover:shadow-md transition-shadow relative dark:bg-gradient-to-br">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{id}</span>
        <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full text-white", statusColor)}>
          {status}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">{date}</p>
        <p className="font-bold text-[15px] text-slate-800 dark:text-slate-200 mb-1">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{service}</p>
      </div>
      <div className="flex items-end justify-between mt-4">
        <button className="text-[10px] font-bold text-[#345381] dark:text-blue-400 hover:underline uppercase tracking-wider">Update</button>
        <span className="font-extrabold text-[15px] text-slate-900 dark:text-white">{price}</span>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, bg, text, title, value }) {
  return (
    <div className="bg-white dark:from-slate-800/80 dark:to-slate-900/60 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between pl-5 pr-8 hover:shadow-md transition-shadow dark:bg-gradient-to-br">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bg)}>
          <Icon className={cn("w-5 h-5", text)} strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{title}</span>
      </div>
      <span className="font-bold text-2xl text-slate-800 dark:text-white">{value}</span>
    </div>
  );
}

function SupplyItem({ name, left, percent, isWarning = false }) {
  return (
    <div className="flex flex-col gap-1.5 focus-within:outline-none">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
          {name} 
          {isWarning && <span className="text-red-500 font-bold mb-0.5" style={{ fontSize: '10px' }}>△</span>}
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{left}</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", isWarning ? "bg-red-400" : "bg-[#2f4b7c] dark:bg-blue-500")} 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
