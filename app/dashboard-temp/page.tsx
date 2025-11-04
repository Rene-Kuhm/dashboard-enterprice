'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/config/api.config';
import type { DashboardMetrics } from '@/types';
import { Users, Activity, DollarSign, ShoppingCart, TrendingUp, Zap, Target } from 'lucide-react';
import { StatsCard } from './_components/stats-card';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardMetrics>(ENDPOINTS.analytics.dashboard);
      return response.data;
    },
  });

  const stats = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers || 2847,
      icon: Users,
      description: 'Registered users',
      trend: { value: 12.5, isPositive: true },
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers || 1826,
      icon: Activity,
      description: 'Last 30 days',
      trend: { value: 8.3, isPositive: true },
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Revenue',
      value: `$${metrics?.totalRevenue?.toLocaleString() || '128,459'}`,
      icon: DollarSign,
      description: 'Monthly revenue',
      trend: { value: 18.2, isPositive: true },
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Total Orders',
      value: metrics?.totalOrders || 892,
      icon: ShoppingCart,
      description: 'Orders this month',
      trend: { value: 3.1, isPositive: false },
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div className="animate-pulse">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance Card */}
        <div className="lg:col-span-4 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
          <div className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Overview</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your business metrics at a glance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversion Rate</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3.24%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +0.3%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Engagement Score</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8.9/10</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +0.4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-3 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
          <div className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Create New User', icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: 'Generate Report', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
                { label: 'View Analytics', icon: Activity, color: 'from-emerald-500 to-teal-500' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group/btn border border-gray-200 dark:border-gray-600"
                >
                  <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg shadow-lg group-hover/btn:scale-110 transition-transform`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
