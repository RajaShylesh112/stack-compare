"use client";
import React, { useState } from 'react';
import { Search, Menu, ArrowDown, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Recommendations', href: '/recommendations' },
    {
      label: 'Compare',
      href: '/compare',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Compare Technologies', href: '/compare/tech' },
        { label: 'Compare Stacks', href: '/compare/stack' },
        { label: 'Compare Tools', href: '/compare/tools' }
      ]
    },
    {
      label: 'Insights',
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Analytics Dashboard', href: '/analytics' },
        { label: 'Compatibility Explorer', href: '/insights/compatibility' }
      ]
    }
  ];

  return (
    <header className="relative z-50 w-full">
      {/* Main Header */}
      <div className="mx-0 px-0 py-0" style={{ background: '#0D0D0D' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: 'transparent' }}>
              <img 
                src="/stack_compare_icon.jpeg" 
                alt="StackCompare Logo" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#A26DF8' }}>
                  StackCompare
                </h1>
                <p className="text-xs text-gray-400">Compare. Analyze. Decide.</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.href === '#' ? (
                  <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#18181b] focus-visible:ring-2 focus-visible:ring-[#A26DF8]">
                    <span className="font-medium">{item.label}</span>
                    {item.hasDropdown && (
                      <ArrowDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#18181b] focus-visible:ring-2 focus-visible:ring-[#A26DF8]"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.hasDropdown && (
                      <ArrowDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                )}
                {item.hasDropdown && item.dropdownItems && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" style={{ background: '#18181b', border: '1px solid #232323' }}>
                    <div className="space-y-2">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#232323] focus-visible:ring-2 focus-visible:ring-[#A26DF8]"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search technologies..."
                className="pl-10 pr-4 py-2 w-64 rounded-xl text-white placeholder:text-gray-400 focus:border-[#A26DF8] focus:ring-1 focus:ring-[#A26DF8] bg-[#18181b] border border-[#232323] shadow-lg"
              />
            </div>
            <div className="relative group">
              <button className="p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-[#18181b] focus-visible:ring-2 focus-visible:ring-[#A26DF8]">
                <User className="w-5 h-5 text-white" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" style={{ background: '#18181b', border: '1px solid #232323' }}>
                <div className="space-y-2">
                  <Link href="/profile" className="block text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#232323] focus-visible:ring-2 focus-visible:ring-[#A26DF8]">My Profile</Link>
                  <Link href="/profile/settings" className="block text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#232323] focus-visible:ring-2 focus-visible:ring-[#A26DF8]">Settings</Link>
                  <Link href="/workspace" className="block text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#232323] focus-visible:ring-2 focus-visible:ring-[#A26DF8]">Saved Stacks</Link>
                  <hr className="border-white/10 my-2" />
                  <a href="#" className="block text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#232323] focus-visible:ring-2 focus-visible:ring-[#A26DF8]">Logout</a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-[#18181b] focus-visible:ring-2 focus-visible:ring-[#A26DF8]"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl p-6 z-40 shadow-xl" style={{ background: '#18181b', border: '1px solid #232323' }}>
          <div className="space-y-4">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.href === '#' ? (
                  <div className="text-gray-300 py-2 border-b border-white/10">
                    <span className="font-medium">{item.label}</span>
                    {item.dropdownItems && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block text-gray-400 hover:text-white transition-all duration-300 py-1 px-3 rounded-xl hover:bg-[#232323] focus-visible:ring-2 focus-visible:ring-[#A26DF8]"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-[#232323] border-b border-white/10 focus-visible:ring-2 focus-visible:ring-[#A26DF8]"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-3">
              <Input
                placeholder="Search technologies..."
                className="w-full rounded-xl text-white placeholder:text-gray-400 bg-[#18181b] border border-[#232323] focus:border-[#A26DF8] focus:ring-1 focus:ring-[#A26DF8]"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
