import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Analytics cards will go here */}
          <div className="p-6 bg-card rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Usage Statistics</h2>
            <p className="text-muted-foreground">View platform usage metrics</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;
