'use client';

import * as React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info, Github, Database, HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the TrendChart component with SSR disabled
const TrendChart = dynamic(() => import('./TrendChart'), { ssr: false });
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricBadgeProps {
  metric: Metric;
  className?: string;
}

const MetricBadge = ({ metric, className = '' }: MetricBadgeProps) => {
  const getSourceIcon = () => {
    switch (metric.source) {
      case 'github':
        return <Github className="w-3.5 h-3.5 mr-1" />;
      case 'npm':
        return <Database className="w-3.5 h-3.5 mr-1" />;
      case 'stackoverflow':
        return <HelpCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const getBadgeColor = () => {
    if (typeof metric.value === 'string' && metric.value.endsWith('k+')) {
      const numValue = parseFloat(metric.value);
      if (numValue > 200) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      if (numValue > 100) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColor()} ${className}`}>
            {getSourceIcon()}
            <span className="font-semibold mr-1">{metric.value}</span>
            <span className="text-xs opacity-80">{metric.label.split(' ')[0]}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] text-sm">
          <p>{metric.label}: {metric.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Data pulled from {metric.source} as of {new Date(metric.lastUpdated).toLocaleDateString()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface Metric {
  value: number | string;
  label: string;
  icon: string;
  source: 'github' | 'stackoverflow' | 'npm';
  lastUpdated: string;
}

interface TechStack {
  id: number;
  name: string;
  type: string;
  description: string;
  technologies: string[];
  pros: { text: string; tooltip: string }[];
  cons: { text: string; tooltip: string }[];
  metrics: {
    stars: Metric;
    downloads: Metric;
    questions: Metric;
    performance: number;
    popularity: number;
    learning: number;
  };
}

const techStackData: TechStack[] = [
  {
    id: 1,
    name: 'React + Node.js',
    type: 'Full Stack JavaScript',
    description: 'Popular choice for rapid development with unified language',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    pros: [
      { text: 'Fast development', tooltip: 'Rapid prototyping and development cycles' },
      { text: 'Large community', tooltip: '>500k Stack Overflow posts' },
      { text: 'Single language', tooltip: 'JavaScript/TypeScript across the stack' }
    ],
    cons: [
      { text: 'Can be heavy', tooltip: 'Larger bundle sizes' },
      { text: 'SEO challenges', tooltip: 'Requires SSR/SSG for better SEO' }
    ],
    metrics: {
      stars: { value: '215k', label: 'GitHub Stars', icon: '⭐', source: 'github', lastUpdated: '2025-07-10' },
      downloads: { value: '25M+/w', label: 'Weekly Downloads', icon: '📦', source: 'npm', lastUpdated: '2025-07-12' },
      questions: { value: '1.2M+', label: 'Stack Overflow', icon: '❓', source: 'stackoverflow', lastUpdated: '2025-07-11' },
      performance: 85,
      popularity: 92,
      learning: 75
    }
  },
  {
    id: 2,
    name: 'Vue + Laravel',
    type: 'Progressive Framework',
    description: 'Balanced approach with elegant syntax and powerful backend',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
    pros: [
      { text: 'Clean syntax', tooltip: 'Intuitive and readable code' },
      { text: 'Great docs', tooltip: 'Comprehensive documentation' },
      { text: 'Stable ecosystem', tooltip: 'Mature and reliable' }
    ],
    cons: [
      { text: 'Smaller community', tooltip: '~150k Stack Overflow posts' },
      { text: 'Learning curve', tooltip: 'PHP and Vue.js concepts' }
    ],
    metrics: {
      stars: { value: '45k', label: 'GitHub Stars', icon: '⭐', source: 'github', lastUpdated: '2025-07-10' },
      downloads: { value: '8M+/w', label: 'Weekly Downloads', icon: '📦', source: 'npm', lastUpdated: '2025-07-12' },
      questions: { value: '450k+', label: 'Stack Overflow', icon: '❓', source: 'stackoverflow', lastUpdated: '2025-07-11' },
      performance: 88,
      popularity: 78,
      learning: 82
    }
  },
  {
    id: 3,
    name: 'Next.js + Prisma',
    type: 'Modern React Framework',
    description: 'Full-stack React with excellent developer experience',
    technologies: ['Next.js', 'Prisma', 'Appwrite', 'Vercel'],
    pros: [
      { text: 'Great DX', tooltip: 'Excellent developer experience' },
      { text: 'Built-in SSR', tooltip: 'Server-side rendering out of the box' },
      { text: 'Type safety', tooltip: 'Full TypeScript support' }
    ],
    cons: [
      { text: 'Opinionated', tooltip: 'Follows specific patterns' },
      { text: 'Vendor lock-in', tooltip: 'Tightly integrated with Vercel' }
    ],
    metrics: {
      stars: { value: '120k', label: 'GitHub Stars', icon: '⭐', source: 'github', lastUpdated: '2025-07-10' },
      downloads: { value: '15M+/w', label: 'Weekly Downloads', icon: '📦', source: 'npm', lastUpdated: '2025-07-12' },
      questions: { value: '750k+', label: 'Stack Overflow', icon: '❓', source: 'stackoverflow', lastUpdated: '2025-07-11' },
      performance: 92,
      popularity: 89,
      learning: 70
    }
  }
];

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-gray-500';
};

const getScoreText = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  return 'Average';
};

const ComparisonCards: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'stats' | 'summary'>('summary');

  // Sample trend data for the last 30 days
  const trendData = {
    'React': {
      icon: '⚛️',
      color: '#61dafb',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 100) + 50, // Random values between 50-150
      })),
    },
    'Vue': {
      icon: '🟢',
      color: '#42b883',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 80) + 30, // Random values between 30-110
      })),
    },
    'Next.js': {
      icon: '⏭️',
      color: '#000000',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 120) + 40, // Random values between 40-160
      })),
    },
  };

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compare Popular Tech Stacks
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            See how different technology combinations stack up against each other in terms of performance, community support, and learning curve.
          </p>
          
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'summary' ? 'bg-violet-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
            >
              View by Summary
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'stats' ? 'bg-violet-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
            >
              View by Stats
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStackData.map((stack) => {
            const totalScore = Math.round((stack.metrics.performance + stack.metrics.popularity + stack.metrics.learning) / 3);
            const scoreColor = getScoreColor(totalScore);
            const scoreText = getScoreText(totalScore);

            return (
              <div
                key={stack.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
              >
                {/* Header with Score Badge */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stack.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stack.type}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${scoreColor} text-white`}>
                      {totalScore}% {scoreText}
                    </div>
                  </div>
                  
                  {/* Metrics Badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <MetricBadge metric={stack.metrics.stars} />
                    <MetricBadge metric={stack.metrics.downloads} />
                    <MetricBadge metric={stack.metrics.questions} />
                  </div>
                </div>

                {/* Summary */}
                <div className="p-5 flex-1">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{stack.description}</p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {stack.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                        Pros
                        <span className="ml-1 text-green-500">•</span>
                      </h4>
                      <ul className="space-y-2">
                        {stack.pros.map((item, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start group cursor-help">
                                  <span className="text-green-500 mr-2">✓</span>
                                  <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {item.text}
                                  </span>
                                  <Info className="ml-1 h-3.5 w-3.5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px]">
                                <p className="text-sm">{item.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
                        Cons
                        <span className="ml-1 text-red-500">•</span>
                      </h4>
                      <ul className="space-y-2">
                        {stack.cons.map((item, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start group cursor-help">
                                  <span className="text-red-500 mr-2">✗</span>
                                  <span className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                    {item.text}
                                  </span>
                                  <Info className="ml-1 h-3.5 w-3.5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px]">
                                <p className="text-sm">{item.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Performance</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stack.metrics.performance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${stack.metrics.performance}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Popularity</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stack.metrics.popularity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${stack.metrics.popularity}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Learning</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stack.metrics.learning}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${stack.metrics.learning}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#7209b7] dark:text-purple-400 border-[#e0d6ff] dark:border-purple-900 hover:border-[#7209b7] dark:hover:border-purple-400 transition-colors"
                    onClick={() => router.push(`/compare/${stack.id}`)}
                  >
                    Compare this stack <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="text-base"
            onClick={() => router.push('/compare')}
          >
            Compare All Stacks
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Trend Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">30-Day Trend Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">Popularity trends for top frameworks</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="grid gap-4">
              {Object.entries(trendData).map(([name, { icon, color, data }]) => (
                <TrendChart 
                  key={name}
                  name={name}
                  icon={icon}
                  color={color}
                  data={data}
                />
              ))}
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Hover over the charts to see daily values</p>
              <div className="flex items-center justify-center mt-2 space-x-4">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span>Growing</span>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span>Declining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCards;
