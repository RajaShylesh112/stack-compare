import React from 'react';
import { Sparkles, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Platform': [
      'Compare Stacks',
      'AI Suggestions',
      'Technology Database',
      'Performance Analytics',
      'Team Collaboration'
    ],
    'Resources': [
      'Documentation',
      'API Reference',
      'Best Practices',
      'Case Studies',
      'Blog'
    ],
    'Community': [
      'Discord',
      'GitHub',
      'Twitter',
      'LinkedIn',
      'Newsletter'
    ],
    'Company': [
      'About Us',
      'Careers',
      'Contact',
      'Privacy Policy',
      'Terms of Service'
    ]
  };

  return (
    <footer className="px-4 py-16 border-t border-white/10 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/stack_compare_icon.jpeg" 
                  alt="StackCompare Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#A26DF8' }}>
                  StackCompare
                </h3>
                <p className="text-xs text-gray-400">Tech Stack Intelligence</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering developers and teams to make informed technology decisions with AI-powered insights and comprehensive comparisons.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-[#18181b]" style={{ background: '#18181b' }}>
                <Twitter className="w-5 h-5" style={{ color: '#A26DF8' }} />
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-[#18181b]" style={{ background: '#18181b' }}>
                <Mail className="w-5 h-5" style={{ color: '#A26DF8' }} />
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-[#18181b]" style={{ background: '#18181b' }}>
                <Linkedin className="w-5 h-5" style={{ color: '#A26DF8' }} />
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-[#18181b]" style={{ background: '#18181b' }}>
                <Github className="w-5 h-5" style={{ color: '#A26DF8' }} />
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-white font-semibold">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 p-8 rounded-3xl" style={{ background: '#18181b', border: '1px solid #232323' }}>
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get the latest technology trends, stack recommendations, and platform updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 bg-[#18181b] border border-[#232323] focus:border-[#A26DF8] focus:ring-1 focus:ring-[#A26DF8]"
              />
              <button className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#A26DF8]/25 text-white" style={{ background: '#A26DF8' }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 StackCompare. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
