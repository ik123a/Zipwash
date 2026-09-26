import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, ShoppingBag, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileSettingsModal } from '../modals/ProfileSettingsModal';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 md:px-6 shadow-sm shadow-slate-200/5 dark:shadow-none dark:text-white">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 hover:bg-slate-100 transition-colors rounded-lg" />
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-md ring-1 ring-white/20">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">ZIPPWASH</h1>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</span>
          <span className="text-xs text-slate-500 capitalize font-medium">{user?.role}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-slate-100 hover:border-slate-200 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur border-slate-200 shadow-xl">
            <DropdownMenuLabel className="font-semibold">
              <div className="flex flex-col">
                <span className="text-slate-900">{user?.name}</span>
                <span className="text-xs font-normal text-slate-500 mt-0.5">{user?.email || user?.roll_number}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer focus:bg-slate-50 text-slate-700 hover:text-slate-900"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={setIsProfileModalOpen}
      />
    </header>
  );
}
