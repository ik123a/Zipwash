import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid,
  Box,
  Tag,
  Users,
  Archive,
  Settings,
  LogOut,
  Shirt
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutGrid, active: true },
  { title: 'Orders', url: '/admin/orders', icon: Box, active: false },
  { title: 'Pricelist', url: '/admin/pricing', icon: Tag, active: false },
  { title: 'Customers', url: '/admin/customers', icon: Users, active: false },
  { title: 'Supplies', url: '/admin/supplies', icon: Archive, active: false },
  { title: 'Settings', url: '/admin/settings', icon: Settings, active: false },
];

export function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <div className="w-[100px] h-screen bg-white shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] border-r border-border flex flex-col items-center py-6 fixed left-0 top-0 z-50">
      
      {/* Top Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#1a1c23] rounded-full flex items-center justify-center shadow-lg">
          <Shirt className="text-white w-6 h-6" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col w-full px-2 gap-4 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center py-4 rounded-xl transition-all w-full",
              isActive || item.active
                ? "bg-[#345381] text-white shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5 mb-1.5 stroke-[2]" />
            <span className="text-[10px] font-medium tracking-wide">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout button at bottom */}
      <div className="mt-auto pt-4 w-full px-2 flex justify-center">
        <button 
          onClick={logout}
          className="flex flex-col items-center justify-center py-4 rounded-xl text-[#ff5c5c] hover:bg-red-50 transition-all w-full"
        >
          <LogOut className="w-5 h-5 mb-1.5 stroke-[2]" />
          <span className="text-[10px] font-medium tracking-wide">Logout</span>
        </button>
      </div>

    </div>
  );
}
