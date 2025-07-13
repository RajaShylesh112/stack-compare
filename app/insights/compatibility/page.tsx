import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CompatibilityExplorerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Compatibility Explorer</h1>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground">Explore compatibility between different technologies.</p>
          {/* Compatibility explorer will go here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompatibilityExplorerPage;
