import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import SiteLayout from '@/components/site-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Stack Recommender - Technology Stack Recommendations',
  description: 'Get AI-powered technology stack recommendations for your next project. Compare technologies, explore compatibility, and make informed decisions.',
  keywords: 'technology stack, AI recommendations, software development, tech stack comparison',
  openGraph: {
    title: 'AI Stack Recommender',
    description: 'AI-powered technology stack recommendations for developers',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-white via-[#f9f5ff] to-[#f0e9ff] dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 min-h-screen`}>
        <ThemeProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}