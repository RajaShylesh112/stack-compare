'use client'

import dynamicImport from 'next/dynamic';

export const dynamic = "force-dynamic";

const ClientApp = dynamicImport(() => import('@/components/ClientApp'), { ssr: false });

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ClientApp />
    </div>
  );
}