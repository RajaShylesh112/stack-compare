'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  value: number;
}

interface TrendChartProps {
  data: TrendData[];
  color: string;
  name: string;
  icon: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, color, name, icon }) => {
  return (
    <div className="flex items-center space-x-4 py-2">
      <div className="w-8 text-center">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{name}</div>
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
              <defs>
                <linearGradient id={`color${name}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                        <p className="text-sm">{`${payload[0].payload.date}`}</p>
                        <p className="text-sm font-medium">{`${name}: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                fill={`url(#color${name})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
