import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from './MainSidebar';
import { Navbar } from './Navbar';
import { ChatBot } from '@/components/ui/ChatBot';
import { AnimatedBackground } from './AnimatedBackground';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AnimatedBackground>
      <SidebarProvider>
        <MainSidebar />
        <SidebarInset className="relative flex h-svh w-full flex-col overflow-hidden bg-transparent">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-transparent">
            {children}
          </main>
          <ChatBot />
        </SidebarInset>
      </SidebarProvider>
    </AnimatedBackground>
  );
}
