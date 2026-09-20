import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa] dark:bg-slate-900/80 font-sans">
      <AdminSidebar />
      {/* 
        The sidebar is 100px fixed width, so we add 100px margin left 
        to ensure the content does not overlap.
      */}
      <div className="flex-1 ml-[100px] flex flex-col items-center">
        <div className="w-full max-w-[1400px] bg-white dark:bg-slate-900/80 rounded-3xl overflow-hidden shadow-2xl my-4 flex flex-col outline outline-[12px] outline-[#f0f4f8] dark:outline-slate-800/50">
            <AdminNavbar />
            <main className="flex-1 overflow-auto bg-[#fbfcfd] dark:bg-slate-900/50">
              {children}
            </main>
        </div>
      </div>
    </div>
  );
}
