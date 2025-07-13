'use client';

import { QueryProvider } from '@/components/query-provider';
import HeroSection from '@/components/HeroSection';
import ComparisonCards from '@/components/ComparisonCards';


export default function ClientApp() {
    return (
        <QueryProvider>
            <div className="w-full">
                <main>
                    <HeroSection />
                    <ComparisonCards />
                </main>
            </div>
        </QueryProvider>
    );
}