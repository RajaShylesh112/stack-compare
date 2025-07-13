'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure we're in the browser before rendering the theme provider
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until we're on the client to avoid hydration mismatches
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
      disableTransitionOnChange
      {...props}
    >
      <ThemeInitializer>
        {children}
      </ThemeInitializer>
    </NextThemesProvider>
  );
}

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Ensure dark theme is always set
    if (theme !== 'dark') {
      setTheme('dark');
    }
    
    // Add class to html element to ensure dark mode is applied
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    
    // Set data-theme attribute for other libraries that might need it
    root.setAttribute('data-theme', 'dark');
    
    // Cleanup function to ensure no memory leaks
    return () => {
      root.classList.remove('dark');
      root.style.colorScheme = '';
      root.removeAttribute('data-theme');
    };
  }, [setTheme, theme]);

  return <>{children}</>;
}