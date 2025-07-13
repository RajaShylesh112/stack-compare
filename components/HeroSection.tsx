'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Code, Server, Database, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TerminalLoader from './terminal-loader';

const HeroSection = () => {
  const router = useRouter();
  const [showTerminal, setShowTerminal] = useState(false);
  
  useEffect(() => {
    // Show terminal after a short delay
    const timer = setTimeout(() => {
      setShowTerminal(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/recommendations');
  };

  const features = [
    { icon: <Zap className="w-5 h-5 text-[#f72585]" />, text: 'Lightning Fast' },
    { icon: <Code className="w-5 h-5 text-[#4361ee]" />, text: 'Modern Stack' },
    { icon: <Server className="w-5 h-5 text-[#7209b7]" />, text: 'Scalable' },
    { icon: <Database className="w-5 h-5 text-[#4cc9f0]" />, text: 'Robust' },
    { icon: <Lock className="w-5 h-5 text-[#3a0ca3]" />, text: 'Secure' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f9f5ff] to-[#f0e9ff] dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-[#3a0ca3]/20 dark:border-[#3a0ca3]/30 rounded-full px-4 py-2 shadow-lg">
                <div className="w-2 h-2 bg-[#f72585] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium bg-gradient-to-r from-[#f72585] to-[#4361ee] bg-clip-text text-transparent">
                  AI-Powered Stack Intelligence
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Build Better Apps with the{' '}
                <span className="bg-gradient-to-r from-[#f72585] via-[#b5179e] to-[#7209b7] bg-clip-text text-transparent">
                  Right Stack
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Get personalized technology stack recommendations based on your project requirements, team size, and performance needs.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={handleGetStarted}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#7209b7] to-[#4361ee] hover:from-[#5a0a8f] hover:to-[#3a56c8] text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-[#3a0ca3] text-[#3a0ca3] dark:text-white dark:border-white/20 hover:bg-[#3a0ca3]/10 dark:hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {feature.icon}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Terminal */}
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
              className="relative z-10"
            >
              <TerminalLoader />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#f72585]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#4361ee]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#7209b7]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>
    </section>
  );
};

export default HeroSection;
