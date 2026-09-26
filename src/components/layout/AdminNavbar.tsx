import { useAuth } from '../../context/AuthContext';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminNavbar() {
  const { user, logout } = useAuth();
  
  // Use "Max Brown" as the fallback to match the screenshot if the user name isn't provided
  const displayName = user?.name || "Max Brown"; 

  return (
    <header className="h-[80px] flex items-center justify-between px-8 bg-[#f5f7fa] dark:bg-slate-900/80 w-full">
      
      {/* Left side: Search */}
      <div className="flex-1 flex max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-white dark:bg-slate-800 focus:ring-0 focus:outline-none text-sm placeholder-slate-400 dark:placeholder-slate-500 dark:text-white shadow-sm"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors focus:outline-none">
              <Avatar className="h-8 w-8 rounded-lg">
                {/* Fallback image style similar to the screenshot */}
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} />
                <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 text-xs font-semibold">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-white">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-lg rounded-xl">
            <DropdownMenuItem className="cursor-pointer font-medium text-slate-600 dark:text-slate-200">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 font-medium focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
