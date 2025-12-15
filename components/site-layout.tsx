import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './ui/sonner';

interface SiteLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function SiteLayout({ children, className = '' }: SiteLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
