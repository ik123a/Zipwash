import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  Bell, 
  Settings, 
  Menu, 
  Droplets,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type PageType = 'home' | 'booking' | 'my-bookings' | 'notifications' | 'admin' | 'pi-display';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  unreadNotifications?: number;
  isAdmin?: boolean;
}

const navItems: { id: PageType; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: 'home', label: 'Live Status', icon: Home },
  { id: 'booking', label: 'Book Slot', icon: Calendar },
  { id: 'my-bookings', label: 'My Bookings', icon: ClipboardList },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'admin', label: 'Admin', icon: Settings, adminOnly: true },
  { id: 'pi-display', label: 'Pi Display', icon: Droplets },
];

export function Navigation({ currentPage, onPageChange, unreadNotifications = 0, isAdmin = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex', mobile ? 'flex-col gap-1' : 'flex-row gap-1')}>
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? 'default' : 'ghost'}
            className={cn(
              'relative justify-start gap-2',
              mobile ? 'w-full' : 'h-10 px-3',
              isActive && 'bg-soft-blue text-white hover:bg-soft-blue/90'
            )}
            onClick={() => {
              onPageChange(item.id);
              setIsOpen(false);
            }}
          >
            <Icon className="w-4 h-4" />
            <span className={mobile ? '' : 'hidden lg:inline'}>{item.label}</span>
            {item.id === 'notifications' && unreadNotifications > 0 && (
              <Badge 
                variant="destructive" 
                className={cn(
                  'text-xs px-1.5 py-0 min-w-[18px] h-[18px]',
                  mobile ? 'ml-auto' : 'absolute -top-1 -right-1'
                )}
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg leading-tight">WashWise</h1>
            <p className="text-xs text-gray-500">Bennett University</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <NavContent />
        </nav>

        {/* User Profile & Mobile Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-3 mr-2">
            <div className="text-right">
              <p className="text-sm font-medium">Rahul Sharma</p>
              <p className="text-xs text-gray-500">Room A-204</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Rahul Sharma</p>
                    <p className="text-sm text-gray-500">Room A-204</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <NavContent mobile />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function BottomNavigation({ currentPage, onPageChange, unreadNotifications = 0 }: Omit<NavigationProps, 'isAdmin'>) {
  const mainItems = navItems.filter(item => ['home', 'booking', 'my-bookings', 'notifications'].includes(item.id));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
              onClick={() => onPageChange(item.id)}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
