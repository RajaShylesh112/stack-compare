'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Search, Plus, ArrowRight, Star, Download, Users, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CompareStacksPage = () => {
  const [selectedStacks, setSelectedStacks] = useState<any[]>([]);

  // Mock tech stacks data
  const techStacks = [
    {
      id: 1,
      name: 'MERN Stack',
      description: 'MongoDB, Express.js, React, Node.js',
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      metrics: {
        performance: 85,
        scalability: 90,
        learning: 75,
        community: 95,
        jobMarket: 88,
        maintenance: 80
      },
      stats: {
        githubStars: '847k',
        npmDownloads: '15.2M/week',
        jobOpenings: '23,456',
        companies: 'Netflix, Facebook, WhatsApp'
      }
    },
    {
      id: 2,
      name: 'LAMP Stack',
      description: 'Linux, Apache, MySQL, PHP',
      technologies: ['Linux', 'Apache', 'MySQL', 'PHP'],
      metrics: {
        performance: 80,
        scalability: 70,
        learning: 85,
        community: 85,
        jobMarket: 75,
        maintenance: 90
      },
      stats: {
        githubStars: 'N/A',
        npmDownloads: 'N/A',
        jobOpenings: '15,789',
        companies: 'WordPress, Wikipedia, Slack'
      }
    },
    {
      id: 3,
      name: 'JAMstack',
      description: 'JavaScript, APIs, Markup',
      technologies: ['JavaScript', 'APIs', 'Markup', 'Static Site Generators'],
      metrics: {
        performance: 95,
        scalability: 90,
        learning: 80,
        community: 85,
        jobMarket: 82,
        maintenance: 75
      },
      stats: {
        githubStars: '42k',
        npmDownloads: '8.7M/week',
        jobOpenings: '18,342',
        companies: 'Netlify, Vercel, Shopify'
      }
    }
  ];

  const toggleStackSelection = (stack: any) => {
    setSelectedStacks(prev => {
      if (prev.some(s => s.id === stack.id)) {
        return prev.filter(s => s.id !== stack.id);
      } else if (prev.length < 3) {
        return [...prev, stack];
      }
      return prev;
    });
  };

  // Define a type for the radar chart keys we are going to use (A, B, C)
  type RadarKey = 'A' | 'B' | 'C';

  // Define a type that represents one data point in the radar chart
  type RadarDataItem = {
    subject: string;
  } & Record<RadarKey, number>;

  // Initialise the radar data making use of the strongly-typed structure above
  const radarData: RadarDataItem[] = [
    { subject: 'Performance', A: 0, B: 0, C: 0 },
    { subject: 'Scalability', A: 0, B: 0, C: 0 },
    { subject: 'Learning', A: 0, B: 0, C: 0 },
    { subject: 'Community', A: 0, B: 0, C: 0 },
    { subject: 'Job Market', A: 0, B: 0, C: 0 },
    { subject: 'Maintenance', A: 0, B: 0, C: 0 },
  ];

  // Populate radar data with selected stacks
  selectedStacks.forEach((stack, index) => {
    // Convert 0 -> 'A', 1 -> 'B', 2 -> 'C' **and** tell TypeScript that it can
    // only ever be one of those three keys
    const key = String.fromCharCode(65 + index) as RadarKey;

    radarData[0][key] = stack.metrics.performance;
    radarData[1][key] = stack.metrics.scalability;
    radarData[2][key] = stack.metrics.learning;
    radarData[3][key] = stack.metrics.community;
    radarData[4][key] = stack.metrics.jobMarket;
    radarData[5][key] = stack.metrics.maintenance;
  });

  const barData = selectedStacks.map(stack => ({
    name: stack.name,
    'GitHub Stars': parseInt(stack.stats.githubStars.replace(/[^0-9]/g, '')) || 0,
    'Job Openings': parseInt(stack.stats.jobOpenings.replace(/[^0-9]/g, '')) || 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-4">
            <span className="text-purple-300 font-medium">Stack Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Compare Tech Stacks
          </h1>
          <p className="text-xl text-gray-300">Select up to 3 tech stacks to compare their features and metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Available Stacks */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stacks..."
                className="pl-10 glass rounded-xl"
              />
            </div>
            <div className="space-y-3">
              {techStacks.map((stack) => (
                <Card
                  key={stack.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedStacks.some(s => s.id === stack.id)
                      ? 'glass-card border-purple-500/50 shadow-lg shadow-purple-500/25'
                      : 'glass hover:bg-white/10'
                    }`}
                  onClick={() => toggleStackSelection(stack)}
                >
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{stack.name}</CardTitle>
                      {selectedStacks.some(s => s.id === stack.id) && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{stack.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {stack.technologies.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} className="glass border-white/20 text-white">{tech}</Badge>
                      ))}
                      {stack.technologies.length > 3 && (
                        <Badge className="glass border-white/20 text-white">+{stack.technologies.length - 3} more</Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison View */}
          <div className="lg:col-span-3 space-y-6">
            {selectedStacks.length > 0 ? (
              <>
                {/* Radar Chart */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Feature Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                          {selectedStacks.map((_, index) => (
                            <Radar
                              key={index}
                              name={selectedStacks[index].name}
                              dataKey={String.fromCharCode(65 + index)}
                              stroke={`hsl(${index * 120 + 240}, 70%, 60%)`}
                              fill={`hsla(${index * 120 + 240}, 70%, 60%, 0.3)`}
                              fillOpacity={0.6}
                            />
                          ))}
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Comparison */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Statistics Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                          <YAxis tick={{ fill: '#9CA3AF' }} />
                          <Bar dataKey="GitHub Stars" fill="#8B5CF6" name="GitHub Stars" />
                          <Bar dataKey="Job Openings" fill="#06B6D4" name="Job Openings" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Comparison */}
                <div className="grid md:grid-cols-3 gap-6">
                  {selectedStacks.map((stack) => (
                    <Card key={stack.id} className="glass-card hover:scale-105 transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-white">{stack.name}</CardTitle>
                        <p className="text-sm text-gray-400">{stack.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2 text-white">Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {stack.technologies.map((tech: string) => (
                              <Badge key={tech} className="glass border-white/20 text-white">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2 text-white">Stats</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">GitHub Stars</span>
                              <span className="font-medium text-white">{stack.stats.githubStars}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">NPM Downloads</span>
                              <span className="font-medium text-white">{stack.stats.npmDownloads}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Job Openings</span>
                              <span className="font-medium text-white">{stack.stats.jobOpenings}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Used By</span>
                              <span className="font-medium text-white text-right">{stack.stats.companies}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select Stacks to Compare</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    Choose up to 3 tech stacks from the left panel to compare their features, performance, and community metrics.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompareStacksPage;
