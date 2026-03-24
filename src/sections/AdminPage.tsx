import { useState } from 'react';
import type { WashingMachine, MachineStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Power, 
  AlertTriangle, 
  RotateCcw,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usageStats } from '@/data/mockData';

interface AdminPageProps {
  machines: WashingMachine[];
  hostels: { id: string; name: string; code: string }[];
  selectedHostel: string;
  onHostelChange: (hostelId: string) => void;
  onMarkMachineStatus: (machineId: string, status: MachineStatus) => void;
}

export function AdminPage({ 
  machines, 
  hostels, 
  selectedHostel, 
  onHostelChange, 
  onMarkMachineStatus 
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState('machines');

  const hostelMachines = machines.filter(m => m.hostelId === selectedHostel);
  
  const stats = {
    total: hostelMachines.length,
    available: hostelMachines.filter(m => m.status === 'available').length,
    busy: hostelMachines.filter(m => m.status === 'busy').length,
    reserved: hostelMachines.filter(m => m.status === 'reserved').length,
    offline: hostelMachines.filter(m => m.status === 'offline').length,
  };

  const peakHours = [
    { hour: '8 AM', usage: 45 },
    { hour: '10 AM', usage: 72 },
    { hour: '12 PM', usage: 58 },
    { hour: '2 PM', usage: 35 },
    { hour: '4 PM', usage: 48 },
    { hour: '6 PM', usage: 95 },
    { hour: '8 PM', usage: 88 },
    { hour: '10 PM', usage: 62 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage machines and view analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Settings className="w-3 h-3" />
            Caretaker Mode
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-700">{stats.available}</p>
            <p className="text-sm text-green-600">Available</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-700">{stats.busy}</p>
            <p className="text-sm text-red-600">In Use</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-700">{stats.reserved}</p>
            <p className="text-sm text-amber-600">Reserved</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-100">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-700">{stats.offline}</p>
            <p className="text-sm text-gray-600">Offline</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Machines Tab */}
        <TabsContent value="machines" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Machine Control</h3>
            <Select value={selectedHostel} onValueChange={onHostelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map(hostel => (
                  <SelectItem key={hostel.id} value={hostel.id}>
                    {hostel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostelMachines.map(machine => (
              <Card key={machine.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        machine.status === 'available' && 'bg-green-100',
                        machine.status === 'busy' && 'bg-red-100',
                        machine.status === 'reserved' && 'bg-amber-100',
                        machine.status === 'offline' && 'bg-gray-100',
                      )}>
                        <Power className={cn('w-5 h-5',
                          machine.status === 'available' && 'text-green-600',
                          machine.status === 'busy' && 'text-red-600',
                          machine.status === 'reserved' && 'text-amber-600',
                          machine.status === 'offline' && 'text-gray-600',
                        )} />
                      </div>
                      <div>
                        <p className="font-medium">{machine.name}</p>
                        <Badge variant="outline" className={cn('text-xs',
                          machine.status === 'available' && 'border-green-200 text-green-700',
                          machine.status === 'busy' && 'border-red-200 text-red-700',
                          machine.status === 'reserved' && 'border-amber-200 text-amber-700',
                          machine.status === 'offline' && 'border-gray-200 text-gray-700',
                        )}>
                          {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {machine.status !== 'available' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => onMarkMachineStatus(machine.id, 'available')}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Reset
                        </Button>
                      )}
                      {machine.status !== 'offline' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-gray-600"
                          onClick={() => onMarkMachineStatus(machine.id, 'offline')}
                        >
                          <XCircle className="w-4 h-4" />
                          Offline
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Usage Analytics</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Uses Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">127</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Avg. Wait Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">8 min</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  -3 min from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Peak Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">6:00 PM</p>
                <p className="text-sm text-gray-500 mt-1">
                  95% utilization
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {peakHours.map((hour) => (
                  <div key={hour.hour} className="flex items-center gap-3">
                    <span className="text-sm w-16">{hour.hour}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all',
                          hour.usage > 80 ? 'bg-red-500' : 
                          hour.usage > 50 ? 'bg-amber-500' : 'bg-green-500'
                        )}
                        style={{ width: `${hour.usage}%` }}
                      />
                    </div>
                    <span className="text-sm w-12 text-right">{hour.usage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Machine Usage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageStats.map((stat) => (
                  <div key={stat.machineId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Machine {stat.machineId.replace('m', '')}</p>
                      <p className="text-sm text-gray-500">
                        {stat.totalUses} total uses • Avg {stat.averageDuration} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{stat.lastWeekUses} this week</p>
                      <p className="text-xs text-gray-500">Last 7 days</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <h3 className="text-lg font-semibold">Maintenance Requests</h3>

          <div className="space-y-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">Machine 6 - Water Leakage</p>
                    <p className="text-sm text-red-700 mt-1">
                      Reported by student at 2:30 PM. Water leaking from bottom panel.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="border-red-300 text-red-700">High Priority</Badge>
                      <span className="text-xs text-red-600">2 hours ago</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300">
                    Mark Resolved
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Machine 3 - Unusual Noise</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Making loud grinding noise during spin cycle.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline">Medium Priority</Badge>
                      <span className="text-xs text-gray-400">5 hours ago</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Mark Resolved
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Machine 2 - Regular Service</p>
                    <p className="text-sm text-green-700 mt-1">
                      Monthly maintenance completed successfully.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="border-green-300 text-green-700">Resolved</Badge>
                      <span className="text-xs text-green-600">Yesterday</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-xs">Reset All</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Power className="w-5 h-5" />
                  <span className="text-xs">Emergency Stop</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs">Export Data</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Settings className="w-5 h-5" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
