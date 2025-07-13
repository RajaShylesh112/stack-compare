'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Search, Plus, Star, Download, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CompareTechPage = () => {
  const [selectedTools, setSelectedTools] = useState<any[]>([]);
  const [category, setCategory] = useState('Frontend Frameworks');

  // Mock tools data
  const toolCategories = {
    'Frontend Frameworks': [
      {
        id: 1,
        name: 'React',
        description: 'A JavaScript library for building user interfaces',
        version: '18.2.0',
        license: 'MIT',
        firstRelease: '2013',
        metrics: {
          performance: 90,
          learning: 75,
          community: 95,
          ecosystem: 92,
          maintenance: 88
        },
        stats: {
          githubStars: '213k',
          npmDownloads: '18.2M/week',
          contributors: '1,534',
          issues: '896'
        },
        features: {
          'TypeScript Support': true,
          'Server-Side Rendering': true,
          'Mobile Development': true,
          'Testing Tools': true,
          'Developer Tools': true,
          'Hot Reloading': true
        }
      },
      {
        id: 2,
        name: 'Vue.js',
        description: 'The Progressive JavaScript Framework',
        version: '3.3.0',
        license: 'MIT',
        firstRelease: '2014',
        metrics: {
          performance: 88,
          learning: 85,
          community: 90,
          ecosystem: 88,
          maintenance: 85
        },
        stats: {
          githubStars: '204k',
          npmDownloads: '3.2M/week',
          contributors: '412',
          issues: '1,245'
        },
        features: {
          'TypeScript Support': true,
          'Server-Side Rendering': true,
          'Mobile Development': true,
          'Testing Tools': true,
          'Developer Tools': true,
          'Hot Reloading': true
        }
      },
      {
        id: 3,
        name: 'Angular',
        description: 'The modern web developer\'s platform',
        version: '16.0.0',
        license: 'MIT',
        firstRelease: '2010',
        metrics: {
          performance: 85,
          learning: 65,
          community: 88,
          ecosystem: 90,
          maintenance: 92
        },
        stats: {
          githubStars: '89.2k',
          npmDownloads: '2.8M/week',
          contributors: '1,245',
          issues: '2,356'
        },
        features: {
          'TypeScript Support': true,
          'Server-Side Rendering': true,
          'Mobile Development': true,
          'Testing Tools': true,
          'Developer Tools': true,
          'Hot Reloading': false
        }
      }
    ],
    'Backend Frameworks': [
      {
        id: 4,
        name: 'Express.js',
        description: 'Fast, unopinionated, minimalist web framework for Node.js',
        version: '4.18.2',
        license: 'MIT',
        firstRelease: '2010',
        metrics: {
          performance: 88,
          learning: 85,
          community: 95,
          ecosystem: 92,
          maintenance: 90
        },
        stats: {
          githubStars: '61.5k',
          npmDownloads: '26.8M/week',
          contributors: '283',
          issues: '56'
        },
        features: {
          'Middleware Support': true,
          'Routing': true,
          'Templates': true,
          'WebSockets': false,
          'API Documentation': true,
          'Built-in Security': true
        }
      },
      {
        id: 5,
        name: 'NestJS',
        description: 'A progressive Node.js framework for building efficient, reliable and scalable server-side applications',
        version: '10.0.0',
        license: 'MIT',
        firstRelease: '2017',
        metrics: {
          performance: 90,
          learning: 75,
          community: 85,
          ecosystem: 88,
          maintenance: 92
        },
        stats: {
          githubStars: '58.7k',
          npmDownloads: '3.2M/week',
          contributors: '412',
          issues: '1,245'
        },
        features: {
          'Dependency Injection': true,
          'Modular Architecture': true,
          'Microservices': true,
          'GraphQL': true,
          'WebSockets': true,
          'CLI': true
        }
      }
    ]
  };

  const toggleToolSelection = (tool: any) => {
    setSelectedTools(prev => {
      if (prev.some(t => t.id === tool.id)) {
        return prev.filter(t => t.id !== tool.id);
      } else if (prev.length < 5) {
        return [...prev, tool];
      }
      return prev;
    });
  };

  // Define allowed radar keys explicitly for better type safety
  type RadarKey = 'A' | 'B' | 'C' | 'D' | 'E';

  const radarData = [
    { subject: 'Performance', A: 0, B: 0, C: 0, D: 0, E: 0 },
    { subject: 'Learning', A: 0, B: 0, C: 0, D: 0, E: 0 },
    { subject: 'Community', A: 0, B: 0, C: 0, D: 0, E: 0 },
    { subject: 'Ecosystem', A: 0, B: 0, C: 0, D: 0, E: 0 },
    { subject: 'Maintenance', A: 0, B: 0, C: 0, D: 0, E: 0 },
  ];

  // Populate radar data with selected tools
  selectedTools.forEach((tool, index) => {
    const key = String.fromCharCode(65 + index) as RadarKey;
    radarData[0][key] = tool.metrics.performance;
    radarData[1][key] = tool.metrics.learning;
    radarData[2][key] = tool.metrics.community;
    radarData[3][key] = tool.metrics.ecosystem;
    radarData[4][key] = tool.metrics.maintenance;
  });

  // Get all unique features from selected tools
  const allFeatures = Array.from(
    new Set(
      selectedTools.flatMap(tool => Object.keys(tool.features || {}))
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#18181b]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#A26DF8]/10 backdrop-blur-sm border border-[#A26DF8]/20 px-6 py-3 rounded-full mb-4">
            <span className="font-medium" style={{ color: '#A26DF8' }}>Technology Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-gradient">
            Compare Development Tools
          </h1>
          <p className="text-xl text-gray-300">Select up to 5 tools to compare their features and metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Available Tools */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#A26DF8' }} />
                <Input
                  placeholder="Search tools..."
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(toolCategories).map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    size="sm"
                    className={`truncate ${category === cat
                      ? 'bg-[#A26DF8] text-white border-0'
                      : 'border-[#A26DF8] text-[#A26DF8] hover:bg-[#A26DF8]/10'
                      }`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {(toolCategories[category as keyof typeof toolCategories] || []).map((tool: any) => (
                <Card
                  key={tool.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedTools.some(t => t.id === tool.id)
                    ? 'border-[#A26DF8] bg-[#A26DF8]/10 shadow-lg'
                    : 'hover:bg-[#A26DF8]/5'
                    }`}
                  onClick={() => toggleToolSelection(tool)}
                >
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{tool.name}</CardTitle>
                      {selectedTools.some(t => t.id === tool.id) && (
                        <Badge className="bg-[#A26DF8] text-white border-0">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{tool.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="border-[#A26DF8] text-[#A26DF8]">v{tool.version}</Badge>
                      <Badge className="border-[#A26DF8] text-[#A26DF8]">{tool.license}</Badge>
                      <div className="flex items-center text-xs text-gray-400 ml-auto">
                        <Star className="h-3.5 w-3.5 mr-1" style={{ color: '#A26DF8' }} />
                        {tool.stats.githubStars}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison View */}
          <div className="lg:col-span-3 space-y-6">
            {selectedTools.length > 0 ? (
              <>
                {/* Radar Chart */}
                <Card className="border-[#A26DF8]">
                  <CardHeader>
                    <CardTitle className="text-white">Metrics Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#A26DF8" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#A26DF8' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A26DF8' }} />
                          {selectedTools.map((_, index) => (
                            <Radar
                              key={index}
                              name={selectedTools[index].name}
                              dataKey={String.fromCharCode(65 + index) as RadarKey}
                              stroke="#A26DF8"
                              fill="#A26DF8"
                              fillOpacity={0.2}
                            />
                          ))}
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Features Comparison */}
                <Card className="border-[#A26DF8]">
                  <CardHeader>
                    <CardTitle className="text-white">Features Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#A26DF8]/20">
                            <TableHead className="text-white">Feature</TableHead>
                            {selectedTools.map(tool => (
                              <TableHead key={tool.id} className="text-center text-white">
                                {tool.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allFeatures.map((feature) => (
                            <TableRow key={feature} className="border-[#A26DF8]/20">
                              <TableCell className="font-medium text-white">{feature}</TableCell>
                              {selectedTools.map(tool => (
                                <TableCell key={`${tool.id}-${feature}`} className="text-center">
                                  {tool.features[feature] ? (
                                    <CheckCircle className="h-5 w-5" style={{ color: '#A26DF8' }} />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-400/70 mx-auto" />
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

                {/* Detailed Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedTools.map((tool) => (
                    <Card key={tool.id} className="border-[#A26DF8] hover:scale-105 transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-white">{tool.name}</CardTitle>
                        <p className="text-sm text-gray-400">{tool.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2 text-white">Version & License</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-400">Version</p>
                              <p className="font-medium text-white">{tool.version}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-400">License</p>
                              <p className="font-medium text-white">{tool.license}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-400">First Release</p>
                              <p className="font-medium text-white">{tool.firstRelease}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2 text-white">Community Stats</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-2" style={{ color: '#A26DF8' }} />
                                <span className="text-sm text-gray-400">GitHub Stars</span>
                              </div>
                              <span className="font-medium text-white">{tool.stats.githubStars}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Download className="h-4 w-4 mr-2" style={{ color: '#A26DF8' }} />
                                <span className="text-sm text-gray-400">Weekly Downloads</span>
                              </div>
                              <span className="font-medium text-white">{tool.stats.npmDownloads}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" style={{ color: '#A26DF8' }} />
                                <span className="text-sm text-gray-400">Contributors</span>
                              </div>
                              <span className="font-medium text-white">{tool.stats.contributors}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2" style={{ color: '#A26DF8' }} />
                                <span className="text-sm text-gray-400">Open Issues</span>
                              </div>
                              <span className="font-medium text-white">{tool.stats.issues}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="border-[#A26DF8]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#A26DF8' }}>
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select Tools to Compare</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    Choose up to 5 development tools from the left panel to start comparing their features, metrics, and community stats.
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

export default CompareTechPage;
