'use client';

import React, { useState } from 'react';
import { Search, Code, Server, Cpu, Database, Smartphone, Cloud, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stackCategories = [
  {
    id: 'web',
    title: 'Web Development',
    icon: Code,
    description: 'Full-stack solutions for modern web applications',
    stacks: [
      { name: 'MERN', description: 'MongoDB, Express, React, Node.js' },
      { name: 'JAMstack', description: 'JavaScript, APIs, Markup' },
      { name: 'MEAN', description: 'MongoDB, Express, Angular, Node.js' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: Smartphone,
    description: 'Cross-platform and native mobile solutions',
    stacks: [
      { name: 'React Native', description: 'Build native mobile apps using React' },
      { name: 'Flutter', description: 'Google\'s UI toolkit for natively compiled apps' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    icon: Cloud,
    description: 'Infrastructure and deployment solutions',
    stacks: [
      { name: 'AWS', description: 'Amazon Web Services' },
      { name: 'GCP', description: 'Google Cloud Platform' },
      { name: 'Azure', description: 'Microsoft Azure' },
    ],
  },
];

const StacksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('web');

  const filteredCategories = stackCategories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.stacks.some(stack => 
      stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stack.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const currentCategory = stackCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Technology Stacks
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore and compare popular technology stacks for your next project
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stacks..."
              className="pl-10 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4 space-y-2">
            {stackCategories.map((category) => (
              <button
                key={category.id}
                className={`w-full text-left p-4 rounded-lg transition-colors flex items-center space-x-3 ${
                  activeCategory === category.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.title}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            {currentCategory && (
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
                    <currentCategory.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                    <p className="text-muted-foreground">{currentCategory.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {currentCategory.stacks.map((stack, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {stack.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {stack.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Compare <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StacksPage;
