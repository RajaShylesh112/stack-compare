'use client';

import { useState } from 'react';
import { RecommendationsForm } from '@/components/recommendations-form';
import { useRouter } from 'next/navigation';
import TerminalLoader from '@/components/terminal-loader';

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Redirect to results page with form data
    router.push(`/recommendations/results?data=${encodeURIComponent(JSON.stringify(data))}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <TerminalLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10a1 1 0 01-1.64 0l-7-10A1 1 0 012 7h5V2a1 1 0 011-1h3.3z" clipRule="evenodd" />
            </svg>
            AI-Powered Tech Stack Recommendations
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Find Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-500">Tech Stack</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Get personalized technology recommendations based on your project requirements, team size, and performance needs.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by real-time GitHub and Stack Overflow analysis
          </p>
        </div>
        
        {/* Form Section */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
              <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 w-1/3 rounded-full"></div>
            </div>
            {['Project Details', 'Team & Budget', 'Get Recommendations'].map((step, index) => (
              <div key={index} className="flex flex-col items-center z-10 bg-white dark:bg-gray-900 px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  index === 0 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-sm font-medium ${
                  index === 0 ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500"></div>
            <RecommendationsForm onSubmit={handleSubmit} />
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-br from-[#f0e9ff] to-[#e6d9ff] dark:from-violet-900/30 dark:to-violet-900/10 rounded-xl p-6 border border-[#e0d5ff] dark:border-violet-900/30">
          <h3 className="text-xl font-semibold text-[#3a0ca3] dark:text-violet-300 mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: '1',
                title: 'Tell Us About Your Project',
                description: 'Fill out the form with details about your project requirements, team, and constraints.'
              },
              {
                number: '2',
                title: 'We Analyze the Data',
                description: 'Our system compares your needs against thousands of successful projects and community data.'
              },
              {
                number: '3',
                title: 'Get Personalized Recommendations',
                description: 'Receive a detailed report with technology recommendations tailored to your project.'
              }
            ].map((step, index) => (
              <div key={index} className="group">
                <div className="relative z-10 p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-[#e0d5ff] dark:border-violet-900/30 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7209b7] to-[#3a0ca3] flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                    {step.number}
                  </div>
                  <h4 className="font-medium text-[#3a0ca3] dark:text-violet-200 text-center mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 -translate-x-1/2 text-[#b5179e]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
