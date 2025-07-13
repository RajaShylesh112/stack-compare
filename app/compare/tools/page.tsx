'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Search,
  Plus,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CompareToolsPage = () => {
  const [selectedTools, setSelectedTools] = useState<any[]>([]);
  const [category, setCategory] = useState('Frontend Frameworks');

  // --- MOCK DATA (can be replaced with API later) ---
  const toolCategories = {
    'Frontend Frameworks': [
      {
        id: 1,
        name: 'React',
        description: 'A JavaScript library for building user interfaces',
        version: '18.2.0',
        license: 'MIT',
        firstRelease: '2013',
        metrics: { performance: 90, learning: 75, community: 95, ecosystem: 92, maintenance: 88 },
        stats: { githubStars: '213k', npmDownloads: '18.2M/week', contributors: '1,534', issues: '896' },
        features: {
          'TypeScript Support': true,
          'Server-Side Rendering': true,
          'Mobile Development': true,
          'Testing Tools': true,
          'Developer Tools': true,
          'Hot Reloading': true,
        },
      },
      {
        id: 2,
        name: 'Vue.js',
        description: 'The Progressive JavaScript Framework',
        version: '3.3.4',
        license: 'MIT',
        firstRelease: '2014',
        metrics: { performance: 85, learning: 90, community: 85, ecosystem: 80, maintenance: 90 },
        stats: { githubStars: '203k', npmDownloads: '4.1M/week', contributors: '424', issues: '567' },
        features: {
          'TypeScript Support': true,
          'Server-Side Rendering': true,
          'Mobile Development': false,
          'Testing Tools': true,
          'Developer Tools': true,
          'Hot Reloading': true,
        },
      },
    ],
  } as const;
  // --------------------------------------------------

  const tools = toolCategories[category as keyof typeof toolCategories] ?? [];

  const handleAddTool = (tool: any) => {
    if (selectedTools.length < 3 && !selectedTools.find((t) => t.id === tool.id)) {
      setSelectedTools((prev) => [...prev, tool]);
    }
  };

  const handleRemoveTool = (toolId: number) => {
    setSelectedTools((prev) => prev.filter((t) => t.id !== toolId));
  };

  const radarData = selectedTools.length
    ? [
      { metric: 'Performance', ...selectedTools.reduce((a, t) => ({ ...a, [t.name]: t.metrics.performance }), {}) },
      { metric: 'Learning', ...selectedTools.reduce((a, t) => ({ ...a, [t.name]: t.metrics.learning }), {}) },
      { metric: 'Community', ...selectedTools.reduce((a, t) => ({ ...a, [t.name]: t.metrics.community }), {}) },
      { metric: 'Ecosystem', ...selectedTools.reduce((a, t) => ({ ...a, [t.name]: t.metrics.ecosystem }), {}) },
      { metric: 'Maintenance', ...selectedTools.reduce((a, t) => ({ ...a, [t.name]: t.metrics.maintenance }), {}) },
    ]
    : [];

  const trendData = [
    { month: 'Jan', React: 85, 'Vue.js': 65 },
    { month: 'Feb', React: 87, 'Vue.js': 68 },
    { month: 'Mar', React: 89, 'Vue.js': 70 },
    { month: 'Apr', React: 91, 'Vue.js': 72 },
    { month: 'May', React: 90, 'Vue.js': 74 },
    { month: 'Jun', React: 92, 'Vue.js': 76 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-4">
            <span className="text-purple-300 font-medium">Tools & Frameworks</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-center">
            Compare Tools & Frameworks
          </h1>
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.keys(toolCategories).map((cat) => (
            <Button
              key={cat}
              className={`${cat === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0'
                  : 'glass border-white/20 hover:bg-white/10'
                }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* TOOLS LIST */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search tools…" className="pl-10 glass rounded-xl" />
            </div>
            {tools.map((tool) => (
              <Card
                key={tool.id}
                onClick={() => handleAddTool(tool)}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedTools.some((t) => t.id === tool.id)
                    ? 'glass-card border-purple-500/50 shadow-lg shadow-purple-500/25'
                    : 'glass hover:bg-white/10'
                  }`}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-white">{tool.name}</CardTitle>
                    {selectedTools.some((t) => t.id === tool.id) && (
                      <CheckCircle className="text-purple-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{tool.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* COMPARISON SECTION */}
          <div className="lg:col-span-3 space-y-8">
            {selectedTools.length === 0 && (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select Tools to Compare</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    Choose up to 3 tools from the left panel to start comparing their features and metrics.
                  </p>
                </CardContent>
              </Card>
            )}

            {selectedTools.length > 0 && (
              <>
                {/* Radar chart */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Metrics Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF' }} />
                          <PolarRadiusAxis tick={{ fill: '#9CA3AF' }} />
                          {selectedTools.map((tool, idx) => (
                            <Radar
                              key={tool.id}
                              name={tool.name}
                              dataKey={tool.name}
                              stroke={`hsl(${idx * 120 + 240}, 70%, 60%)`}
                              fill={`hsla(${idx * 120 + 240}, 70%, 60%, 0.3)`}
                            />
                          ))}
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Trend chart */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Search Popularity Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                          <YAxis tick={{ fill: '#9CA3AF' }} />
                          {selectedTools.map((tool, idx) => (
                            <Line
                              key={tool.id}
                              type="monotone"
                              dataKey={tool.name}
                              stroke={`hsl(${idx * 120 + 240}, 70%, 60%)`}
                              strokeWidth={2}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature support table */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Feature Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-white">Feature</TableHead>
                            {selectedTools.map((tool) => (
                              <TableHead key={tool.id} className="text-center text-white">
                                {tool.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.keys(selectedTools[0].features).map((feature) => (
                            <TableRow key={feature} className="border-white/10">
                              <TableCell className="text-white">{feature}</TableCell>
                              {selectedTools.map((tool) => (
                                <TableCell key={tool.id} className="text-center">
                                  {tool.features[feature] ? (
                                    <CheckCircle className="text-green-400 mx-auto" />
                                  ) : (
                                    <XCircle className="text-red-400 mx-auto" />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats table */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Key Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-white">Metric</TableHead>
                            {selectedTools.map((tool) => (
                              <TableHead key={tool.id} className="text-center text-white">
                                {tool.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {['githubStars', 'npmDownloads', 'contributors', 'issues'].map((stat) => (
                            <TableRow key={stat} className="border-white/10">
                              <TableCell className="text-white">{stat.replace(/([A-Z])/g, ' $1')}</TableCell>
                              {selectedTools.map((tool) => (
                                <TableCell key={tool.id} className="text-center text-white">
                                  {tool.stats[stat]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompareToolsPage;
