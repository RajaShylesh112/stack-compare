'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

type ProjectType = 'web' | 'mobile' | 'desktop' | 'api' | 'database' | 'ml' | 'other';
type TeamSize = 'solo' | 'small' | 'medium' | 'large';
type BudgetLevel = 'low' | 'medium' | 'high' | 'enterprise';

interface RecommendationsFormProps {
  onSubmit?: (data: any) => void;
}

export function RecommendationsForm(props: RecommendationsFormProps) {
  const [formData, setFormData] = useState({
    projectType: '' as ProjectType | '',
    description: '',
    needsRealtime: false,
    teamSize: '' as TeamSize | '',
    budgetLevel: '' as BudgetLevel | '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.onSubmit) {
      props.onSubmit(formData);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-1 sm:p-6">
      {/* Section 1: Project Details */}
      <div className="space-y-6 p-6 bg-white/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="projectType" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              Project Type
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(required)</span>
            </Label>
            <Select 
              value={formData.projectType} 
              onValueChange={(value) => handleChange('projectType', value as ProjectType)}
              required
            >
              <SelectTrigger className="mt-2 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 focus:ring-2 focus:ring-violet-500/20">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                <SelectItem value="web" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Web Application
                  </div>
                </SelectItem>
                <SelectItem value="mobile" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Mobile Application
                  </div>
                </SelectItem>
                <SelectItem value="desktop" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    Desktop Application
                  </div>
                </SelectItem>
                <SelectItem value="api" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm1 3a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    API/Backend Service
                  </div>
                </SelectItem>
                <SelectItem value="database" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                    Database System
                  </div>
                </SelectItem>
                <SelectItem value="ml" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Machine Learning Project
                  </div>
                </SelectItem>
                <SelectItem value="other" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              Project Description
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(required)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell us about your project, its goals, target audience, and any specific requirements or constraints..."
              className="mt-2 h-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              rows={4}
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              The more details you provide, the better our recommendations will be.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
            <div>
              <Label htmlFor="needsRealtime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Real-time Features Required
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">E.g., chat, live updates, notifications, etc.</p>
            </div>
            <Switch
              id="needsRealtime"
              checked={formData.needsRealtime}
              onCheckedChange={(checked) => handleChange('needsRealtime', checked)}
              className="data-[state=checked]:bg-violet-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700"
            />
          </div>

        </div>
      </div>

      {/* Team & Budget Section */}
      <div className="space-y-6 p-6 bg-white/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700/50">

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="teamSize" className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Size</Label>
            <Select 
              value={formData.teamSize} 
              onValueChange={(value) => handleChange('teamSize', value as TeamSize)}
              required
            >
              <SelectTrigger className="mt-2 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                <SelectItem value="solo" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Solo Developer
                  </div>
                </SelectItem>
                <SelectItem value="small" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                    </svg>
                    Small Team (2-5)
                  </div>
                </SelectItem>
                <SelectItem value="medium" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Medium Team (6-15)
                  </div>
                </SelectItem>
                <SelectItem value="large" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                      <path d="M10 10a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    Large Team (15+)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budgetLevel" className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Level</Label>
            <Select 
              value={formData.budgetLevel} 
              onValueChange={(value) => handleChange('budgetLevel', value as BudgetLevel)}
              required
            >
              <SelectTrigger className="mt-2 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Select budget level" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                <SelectItem value="low" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Low (Open Source/Freemium)
                  </div>
                </SelectItem>
                <SelectItem value="medium" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.542 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Medium (Paid Services)
                  </div>
                </SelectItem>
                <SelectItem value="high" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm1 3a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    High (Enterprise Solutions)
                  </div>
                </SelectItem>
                <SelectItem value="enterprise" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    Enterprise (Custom Solutions)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Get My Recommendations
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
