'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    BarChart3,
    Layers,
    Zap,
    TrendingUp,
    Users,
    Star,
    ArrowRight,
    Sparkles,
    ArrowRightCircle,
    GitBranch,
    MessageSquare,
    Flame,
    ChevronRight,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import Footer from '@/components/Footer';

const ComparePage = () => {
    // Section 1: Start Comparing (Explore Modes)
    const compareModes = [
        {
            id: 'guided',
            title: '🔍 Guided Compare',
            description: 'Answer a few questions, we build the compare set',
            icon: Sparkles,
            cta: 'Start',
            href: '/compare/guided',
            color: 'from-violet-500 to-blue-500',
            hoverColor: 'hover:from-violet-600 hover:to-blue-600',
            features: ['Personalized recommendations', 'Expert-curated comparisons', 'Step-by-step guidance']
        },
        {
            id: 'stack',
            title: '🧩 Stack-to-Stack',
            description: 'Pick 2–3 stacks to compare directly',
            icon: Layers,
            cta: 'Choose Stacks',
            href: '/compare/stack',
            color: 'from-blue-500 to-cyan-500',
            hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
            features: ['Full-stack comparisons', 'Performance metrics', 'Ecosystem analysis']
        },
        {
            id: 'deep-dive',
            title: '⚙️ Tool Deep-Dive',
            description: 'View deep insights about individual tools',
            icon: BarChart3,
            cta: 'View Tool',
            href: '/compare/tech',
            color: 'from-indigo-500 to-purple-500',
            hoverColor: 'hover:from-indigo-600 hover:to-purple-600',
            features: ['Detailed specifications', 'Version comparisons', 'Use case analysis']
        }
    ];

    // Section 2: Popular Comparisons
    const popularComparisons = [
        {
            id: 'next-laravel',
            title: 'Next.js vs. Laravel',
            description: 'Frontend framework vs. Full-stack PHP framework',
            tags: ['React', 'PHP', 'Fullstack'],
            comparisonCount: '12k',
            winner: 'next',
            verdict: 'Next.js for SPAs, Laravel for traditional web apps'
        },
        {
            id: 'react-svelte',
            title: 'React vs. Svelte',
            description: 'Virtual DOM vs. Compiler-based approach',
            tags: ['Frontend', 'UI', 'Performance'],
            comparisonCount: '8.5k',
            winner: 'svelte',
            verdict: 'Svelte for simplicity, React for ecosystem'
        },
        {
            id: 'mongo-postgres',
            title: 'MongoDB vs. PostgreSQL',
            description: 'NoSQL document DB vs. Relational database',
            tags: ['Database', 'NoSQL', 'SQL'],
            comparisonCount: '15.2k',
            winner: 'postgres',
            verdict: 'MongoDB for flexibility, PostgreSQL for complex queries'
        },
        {
            id: 'firebase-supabase',
            title: 'Firebase vs. Supabase',
            description: 'Google BaaS vs. Open-source alternative',
            tags: ['Backend', 'Database', 'Auth'],
            comparisonCount: '5.7k',
            winner: 'supabase',
            verdict: 'Supabase for open-source, Firebase for Google ecosystem'
        }
    ];

    // Section 3: Tech Comparison Insights
    const githubStats = [
        { name: 'React', stars: '220k', trend: 'up', change: '5%' },
        { name: 'Next.js', stars: '125k', trend: 'up', change: '8%' },
        { name: 'Fastify', stars: '32k', trend: 'up', change: '19%' },
        { name: 'Tailwind CSS', stars: '78k', trend: 'up', change: '12%' },
        { name: 'Svelte', stars: '75k', trend: 'up', change: '15%' }
    ];

    const stackOverflowStats = [
        { name: 'React', posts: '2.5M', trend: 'up' },
        { name: 'Node.js', posts: '1.8M', trend: 'up' },
        { name: 'Python', posts: '2.1M', trend: 'up' },
        { name: 'Tailwind', posts: '45k', trend: 'up' },
        { name: 'Next.js', posts: '95k', trend: 'up' }
    ];

    const trendingTools = [
        { name: 'Bun', change: '+42%', trend: 'up' },
        { name: 'Tauri', change: '+38%', trend: 'up' },
        { name: 'Deno', change: '+25%', trend: 'up' },
        { name: 'SvelteKit', change: '+31%', trend: 'up' },
        { name: 'Astro', change: '+47%', trend: 'up' }
    ];

    // Stats for the top of the page
    const stats = [
        { label: 'Technologies', value: '500+', icon: Zap },
        { label: 'Stacks', value: '100+', icon: Layers },
        { label: 'Tools', value: '200+', icon: Search },
        { label: 'Users', value: '10K+', icon: Users }
    ] as const;
    
    // Type definitions
    type Stat = typeof stats[number];
    type CompareMode = typeof compareModes[number];
    type PopularComparison = typeof popularComparisons[number];
    type GithubStat = typeof githubStats[number];
    type StackOverflowStat = typeof stackOverflowStats[number];
    type TrendingTool = typeof trendingTools[number];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#18181b]">
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-[#A26DF8]/10 backdrop-blur-sm border border-[#A26DF8]/20 px-6 py-3 rounded-full mb-6">
                        <Sparkles className="w-5 h-5" style={{ color: '#A26DF8' }} />
                        <span className="font-medium" style={{ color: '#A26DF8' }}>Compare & Analyze</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-gradient">
                        Compare Tech Stacks
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Make informed decisions with our comprehensive comparison tools.
                        Analyze performance, features, and compatibility across technologies.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                        {stats.map((stat: Stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="bg-[#A26DF8]/5 backdrop-blur-sm border border-[#A26DF8]/10 rounded-2xl p-6 hover:bg-[#A26DF8]/10 transition-all duration-300">
                                    <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#A26DF8' }} />
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Comparison Modes Section */}
                <section className="mb-20">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {compareModes.map((mode: CompareMode) => {
                            const ModeIcon = mode.icon;
                            return (
                                <div key={mode.id} className={`group relative p-6 rounded-2xl bg-gradient-to-br ${mode.color} ${mode.hoverColor} transition-all duration-300 hover:-translate-y-1`}>
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl group-hover:opacity-0 transition-opacity duration-300" />
                                    <div className="relative z-10">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <ModeIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-white">{mode.title}</h3>
                                        </div>
                                        <p className="text-gray-200 mb-4">{mode.description}</p>
                                        <ul className="space-y-2 mb-6">
                                            {mode.features.map((feature: string, i: number) => (
                                                <li key={i} className="flex items-center text-sm text-white/90">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-white/70" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href={mode.href}>
                                            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                                                {mode.cta}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 2: Popular Comparisons */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-white">Popular Comparisons</h2>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {popularComparisons.map((comparison: PopularComparison) => (
                            <div key={comparison.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-violet-500/30 transition-colors duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-white">{comparison.title}</h3>
                                    <Badge variant="secondary" className="bg-violet-900/30 text-violet-300 hover:bg-violet-800/40">
                                        {comparison.comparisonCount} compared
                                    </Badge>
                                </div>
                                <p className="text-gray-400 mb-4">{comparison.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {comparison.tags.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="bg-gray-700/50 border-gray-600 text-gray-300">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                    <div className="text-sm text-gray-400">
                                        <span className="text-white font-medium">Verdict:</span> {comparison.verdict}
                                    </div>
                                    <Button variant="outline" size="sm" className="border-violet-500 text-violet-400 hover:bg-violet-900/30 hover:text-violet-300">
                                        Compare Now
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Tech Comparison Insights */}
                <section className="mb-20">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Tech Comparison Insights</h2>
                        <p className="text-gray-400">Real-time metrics and trends from the developer community</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* GitHub Stats */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                            <div className="flex items-center space-x-3 mb-4">
                                <GitBranch className="w-5 h-5 text-gray-400" />
                                <h3 className="font-semibold text-white">GitHub Stars</h3>
                            </div>
                            <div className="space-y-4">
                                {githubStats.map((stat: GithubStat, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">{stat.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-white">{stat.stars}</span>
                                            {stat.trend === 'up' && (
                                                <span className="text-xs text-green-500 bg-green-900/30 px-2 py-0.5 rounded-full">
                                                    ↑ {stat.change}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stack Overflow Activity */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                            <div className="flex items-center space-x-3 mb-4">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                                <h3 className="font-semibold text-white">Stack Overflow</h3>
                            </div>
                            <div className="space-y-4">
                                {stackOverflowStats.map((stat: StackOverflowStat, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">{stat.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-white">{stat.posts}</span>
                                            <span className="text-xs text-blue-400">posts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Tools */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                            <div className="flex items-center space-x-3 mb-4">
                                <Flame className="w-5 h-5 text-orange-400" />
                                <h3 className="font-semibold text-white">Trending This Week</h3>
                            </div>
                            <div className="space-y-4">
                                {trendingTools.map((tool: TrendingTool, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">{tool.name}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            tool.trend === 'up' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                        }`}>
                                            {tool.change}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" size="sm" className="mt-6 text-violet-400 hover:bg-violet-900/30 hover:text-violet-300 w-full">
                                View Full Analytics
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </section>


            </main>

            <Footer />
        </div>
    );
};

export default ComparePage; 