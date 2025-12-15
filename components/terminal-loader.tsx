'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TerminalLine = {
  text: string;
  prefix: string;
  delay: number;
  color?: string;
};

type StackItem = {
  type: 'frontend' | 'backend' | 'database' | 'auth' | 'other';
  name: string;
  icon: string;
  delay: number;
};

function TerminalLoader() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showStack, setShowStack] = useState(false);
  const [stackItems, setStackItems] = useState<StackItem[]>([]);

  const terminalLines: TerminalLine[] = [
    { text: 'Analyzing use-case...', prefix: '>', delay: 0 },
    { text: 'Matching relevant technologies...', prefix: '>', delay: 800 },
    { text: 'Evaluating performance needs...', prefix: '>', delay: 1600 },
    { text: 'Filtering by scalability...', prefix: '>', delay: 2400 },
    { text: 'Recommending best tech stacks...', prefix: '🧠', delay: 3200, color: '#f72585' },
  ];

  const stackBuilders: StackItem[] = [
    { type: 'frontend', name: 'React', icon: '⚛️', delay: 400 },
    { type: 'backend', name: 'Node.js + Express', icon: '⚙️', delay: 800 },
    { type: 'database', name: 'PostgreSQL', icon: '🛢️', delay: 1200 },
    { type: 'auth', name: 'JWT', icon: '🔐', delay: 1600 },
    { type: 'other', name: 'Generating Stack Recommendation...', icon: '📦', delay: 2000 },
  ];

  useEffect(() => {
    // Show terminal lines one by one
    const lineTimer = setTimeout(() => {
      if (currentLine < terminalLines.length) {
        setVisibleLines(prev => [...prev, currentLine]);
        setCurrentLine(prev => prev + 1);
      } else if (!showStack) {
        setShowStack(true);
        // Start showing stack items
        stackBuilders.forEach((item, index) => {
          setTimeout(() => {
            setStackItems(prev => [...prev, item]);
          }, item.delay);
        });
      }
    }, 500);

    return () => clearTimeout(lineTimer);
  }, [currentLine, showStack]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'frontend':
        return 'text-[#4cc9f0]';
      case 'backend':
        return 'text-[#4361ee]';
      case 'database':
        return 'text-[#7209b7]';
      case 'auth':
        return 'text-[#f72585]';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto min-h-[400px]">
      {/* Terminal Window */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden border border-[#3a0ca3]/50 shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-2 bg-gradient-to-r from-[#3a0ca3] to-[#4361ee]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-xs font-mono text-white/80">
            stack-recommendation-engine
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 font-mono text-sm text-gray-200 h-[300px] overflow-y-auto">
          <div className="space-y-1">
            {terminalLines.map((line, index) => (
              <AnimatePresence key={index}>
                {visibleLines.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start"
                  >
                    <span className="text-[#f72585] mr-2">{line.prefix}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                    {index === visibleLines.length - 1 && (
                      <span className="ml-1 w-2 h-5 bg-white/80 animate-pulse"></span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            ))}

            {/* Stack Building Animation */}
            {showStack && (
              <div className="mt-4 pt-4 border-t border-[#3a0ca3]/30">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3"
                >
                  {stackItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center ${getTypeColor(item.type)}`}
                    >
                      <span className="mr-2 text-lg">{item.icon}</span>
                      <span>
                        {item.type !== 'other' ? (
                          <>
                            Adding <span className="font-bold">{item.type}</span>:{' '}
                            <span className="text-white">{item.name}</span>
                          </>
                        ) : (
                          <span className="text-white">{item.name}</span>
                        )}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Tech Icons */}
      <AnimatePresence>
        {showStack && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-6">
            {['⚛️', '⚡', '🔌', '🛢️', '🔐', '📦'].map((icon, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{
                  y: [20, -10, 0],
                  opacity: [0, 1, 1],
                  scale: [0.8, 1.1, 1],
                }}
                transition={{
                  delay: 2 + index * 0.2,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 100,
                }}
                className="text-3xl"
              >
                {icon}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TerminalLoader;

