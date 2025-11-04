'use client';

import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  gradient?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  gradient = "from-purple-500 to-blue-500"
}: StatsCardProps) {
  return (
    <div className="group relative">
      {/* Gradient glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500`} />

      {/* Main card */}
      <div className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </p>
          </div>

          {/* Icon with gradient background */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
            <div className={`relative flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {value}
          </h3>
        </div>

        {/* Description and Trend */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              trend.isPositive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-xs font-semibold">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>

        {/* Subtle bottom border gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </div>
    </div>
  );
}
