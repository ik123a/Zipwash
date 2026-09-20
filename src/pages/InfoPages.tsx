import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface InfoPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function InfoPage({ title, lastUpdated, children }: InfoPageProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Button 
        variant="ghost" 
        className="mb-6 h-10 px-4 rounded-xl text-muted-foreground hover:bg-muted font-bold group"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </Button>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{title}</h1>
          <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-8 md:p-12 prose prose-slate dark:prose-invert max-w-none">
          {children}
        </CardContent>
      </Card>
      
      <div className="text-center mt-12 py-8 border-t border-border">
         <ShieldAlert className="h-5 w-5 text-muted-foreground/30 mx-auto mb-2" />
         <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">&copy; 2026 ZIPPWASH CLEANING SOLUTIONS PVT. LTD.</p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <InfoPage title="Privacy Center" lastUpdated="April 2026">
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us when you create an account, place an order, or communicate with us. This may include your name, roll number, phone number, and physical dormitory or laundry collection point.</p>
      
      <h2>2. How We Use Your Data</h2>
      <p>We use the data collected to provide, maintain, and improve our services, including processing transactions, sending order updates, and personalized offers. We do not sell your personal data to third parties.</p>
      
      <h2>3. Data Security</h2>
      <p>Your data is encrypted and stored in secure local and cloud servers. We implement strict access controls to ensure your personal information is only accessible by authorized staff.</p>
    </InfoPage>
  );
}

export function CookiePage() {
  return (
    <InfoPage title="Cookie Policy" lastUpdated="April 2026">
      <h2>1. What are Cookies?</h2>
      <p>Cookies are small text files stored on your device that help our website function correctly and remember your preferences. We use both session cookies (which disappear when you close your browser) and persistent cookies.</p>
      
      <h2>2. Essential Cookies</h2>
      <p>These are necessary for the website to work, including keeping you logged in and managing your laundry cart. Disabling these will prevent you from using many features of the ZIPPWASH app.</p>
      
      <h2>3. Performance & Analytics</h2>
      <p>We use these to understand how users interact with our dashboard, helping us improve UI responsiveness and overall service quality.</p>
    </InfoPage>
  );
}

export function TermsPage() {
  return (
    <InfoPage title="Terms & Conditions" lastUpdated="April 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>By using ZIPPWASH services, you agree to abide by these terms. We provide laundry and dry cleaning services specifically for campus students and staff.</p>
      
      <h2>2. Service Level Agreement</h2>
      <p>While we strive for 24-48 hour turnaround, peak times may extend this. We are not liable for minor color fading or button damage standard for mass washing, but we will compensate for major garment damage according to our policy.</p>
      
      <h2>3. Payment Terms</h2>
      <p>All payments must be made via the app or at drop-off points. Unpaid orders will not be processed or released.</p>
    </InfoPage>
  );
}
