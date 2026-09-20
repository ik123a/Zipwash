import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

// Mock data for charts
const ordersData = [
  { day: 'Mon', orders: 12 },
  { day: 'Tue', orders: 19 },
  { day: 'Wed', orders: 15 },
  { day: 'Thu', orders: 25 },
  { day: 'Fri', orders: 22 },
  { day: 'Sat', orders: 30 },
  { day: 'Sun', orders: 18 },
];

const revenueData = [
  { day: 'Mon', revenue: 2400 },
  { day: 'Tue', revenue: 3800 },
  { day: 'Wed', revenue: 3000 },
  { day: 'Thu', revenue: 5000 },
  { day: 'Fri', revenue: 4400 },
  { day: 'Sat', revenue: 6000 },
  { day: 'Sun', revenue: 3600 },
];

const serviceUsageData = [
  { name: 'Laundry', value: 65, color: '#0ea5e9' },
  { name: 'Dry Cleaning', value: 25, color: '#10b981' },
  { name: 'Ironing', value: 10, color: '#f59e0b' },
];

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: number;
  trendLabel: string;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'amber' | 'rose';
  delay: string;
}

function KPICard({ title, value, subtitle, trend, trendLabel, icon: Icon, color, delay }: KPICardProps) {
  const isPositive = trend >= 0;

  const colorConfig = {
    emerald: {
      bg: 'from-emerald-50/80 to-emerald-100/60',
      border: 'border-emerald-200/50',
      iconBg: 'from-emerald-400 to-emerald-500',
      text: 'text-emerald-700',
      secondary: 'text-emerald-600',
    },
    blue: {
      bg: 'from-blue-50/80 to-blue-100/60',
      border: 'border-blue-200/50',
      iconBg: 'from-blue-400 to-blue-500',
      text: 'text-blue-700',
      secondary: 'text-blue-600',
    },
    amber: {
      bg: 'from-amber-50/80 to-amber-100/60',
      border: 'border-amber-200/50',
      iconBg: 'from-amber-400 to-amber-500',
      text: 'text-amber-700',
      secondary: 'text-amber-600',
    },
    rose: {
      bg: 'from-rose-50/80 to-rose-100/60',
      border: 'border-rose-200/50',
      iconBg: 'from-rose-400 to-rose-500',
      text: 'text-rose-700',
      secondary: 'text-rose-600',
    },
  };

  const config = colorConfig[color];

  return (
    <Card
      className={cn(
        "group bg-gradient-to-br border shadow-sm hover:shadow-md transition-all duration-200 animate-fade-up",
        config.bg,
        config.border
      )}
      style={{ animationDelay: delay }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-slate-600">{title}</CardTitle>
        <div className={cn(
          "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm",
          config.iconBg
        )}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", config.text)}>{value}</div>
        <div className="flex items-center gap-1 mt-1">
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={cn(
              "text-[10px] font-medium",
              isPositive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {Math.abs(trend)}%
          </Badge>
          <span className="text-xs text-slate-500">{trendLabel}</span>
        </div>
        <p className={cn("text-xs mt-2", config.secondary)}>{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Orders Today"
          value="28"
          subtitle="vs 24 yesterday"
          trend={16.7}
          trendLabel="increase"
          icon={ShoppingBag}
          color="blue"
          delay="0ms"
        />
        <KPICard
          title="Orders This Week"
          value="161"
          subtitle="vs 142 last week"
          trend={13.4}
          trendLabel="growth"
          icon={Calendar}
          color="emerald"
          delay="100ms"
        />
        <KPICard
          title="Total Revenue"
          value="₹28,200"
          subtitle="vs ₹25,400 last week"
          trend={11.0}
          trendLabel="increase"
          icon={IndianRupee}
          color="amber"
          delay="200ms"
        />
        <KPICard
          title="Active Customers"
          value="42"
          subtitle="Unique customers this week"
          trend={5.2}
          trendLabel="new this week"
          icon={Users}
          color="rose"
          delay="300ms"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders Over Time */}
        <Card className="animate-fade-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Orders Over Time</CardTitle>
                <CardDescription>Daily order volume for the past 7 days</CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                +17%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value} orders`, 'Orders']}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#0ea5e9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="animate-fade-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Revenue Trends</CardTitle>
                <CardDescription>Daily revenue for the past 7 days</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                +11%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Service Usage */}
      <Card className="animate-fade-up" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Service Usage Distribution</CardTitle>
              <CardDescription>Breakdown of services ordered this week</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {serviceUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value}%`, 'Usage']}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Service Details */}
            <div className="flex-1 grid grid-cols-1 gap-4 w-full">
              {serviceUsageData.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 rounded-xl border bg-white/60 hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="font-medium text-slate-900">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">{service.value}%</span>
                    <p className="text-xs text-slate-500">
                      {service.name === 'Laundry' ? '105 orders' :
                       service.name === 'Dry Cleaning' ? '40 orders' :
                       '16 orders'}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Total Orders</span>
                  <span className="text-xl font-bold text-slate-900">161</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsDashboard;
