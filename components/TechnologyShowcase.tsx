'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TechnologyShowcase = () => {
  const router = useRouter();

  const categories = [
    {
      name: 'Frontend',
      technologies: [
        { name: 'React', logo: '⚛️', popularity: 95, color: 'from-blue-400 to-blue-600' },
        { name: 'Vue.js', logo: '💚', popularity: 78, color: 'from-green-400 to-green-600' },
        { name: 'Angular', logo: '🅰️', popularity: 72, color: 'from-red-400 to-red-600' },
        { name: 'Svelte', logo: '🔥', popularity: 68, color: 'from-orange-400 to-orange-600' },
      ]
    },
    {
      name: 'Backend',
      technologies: [
        { name: 'Node.js', logo: '💚', popularity: 89, color: 'from-green-400 to-green-600' },
        { name: 'Python', logo: '🐍', popularity: 92, color: 'from-yellow-400 to-yellow-600' },
        { name: 'Go', logo: '🐹', popularity: 75, color: 'from-cyan-400 to-cyan-600' },
        { name: 'Rust', logo: '🦀', popularity: 71, color: 'from-orange-400 to-red-600' },
      ]
    },
    {
      name: 'Database',
      technologies: [
        { name: 'Appwrite', logo: '⚡', popularity: 85, color: 'from-purple-400 to-pink-600' },
        { name: 'MongoDB', logo: '🍃', popularity: 82, color: 'from-green-400 to-green-600' },
        { name: 'Redis', logo: '🔴', popularity: 76, color: 'from-red-400 to-red-600' },
        { name: 'MySQL', logo: '🐬', popularity: 79, color: 'from-blue-400 to-blue-600' },
      ]
    },
    {
      name: 'Cloud & DevOps',
      technologies: [
        { name: 'AWS', logo: '☁️', popularity: 94, color: 'from-orange-400 to-orange-600' },
        { name: 'Docker', logo: '🐳', popularity: 91, color: 'from-blue-400 to-blue-600' },
        { name: 'Kubernetes', logo: '☸️', popularity: 78, color: 'from-blue-400 to-indigo-600' },
        { name: 'Vercel', logo: '▲', popularity: 73, color: 'from-foreground/80 to-foreground/60' },
      ]
    }
  ];

  return (
    <section className="px-4 py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Technology Ecosystem
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore and compare the most popular technologies across different categories
          </p>
        </div>

        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search technologies..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-foreground"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">{category.name}</h3>
                <div className="space-y-3">
                  {category.technologies.map((tech, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/compare?tech=${tech.name.toLowerCase()}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{tech.logo}</span>
                        <span className="font-medium text-foreground">{tech.name}</span>
                      </div>
                      <Badge variant="outline" className="border-muted-foreground/30">
                        {tech.popularity}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/50 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={() => router.push(`/compare?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  View all {category.name} technologies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Can't find what you're looking for?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new technologies to our database. Request a technology or suggest an improvement.
          </p>
          <Button variant="outline" size="lg">
            Request a Technology
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
