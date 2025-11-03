'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/config/api.config';
import type { DashboardMetrics } from '@/types';
import { Users, Activity, DollarSign, ShoppingCart } from 'lucide-react';

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
      value: metrics?.totalUsers || 0,
      icon: Users,
      description: 'Total registered users',
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers || 0,
      icon: Activity,
      description: 'Active in last 30 days',
    },
    {
      title: 'Total Revenue',
      value: `$${metrics?.totalRevenue || 0}`,
      icon: DollarSign,
      description: 'Total revenue generated',
    },
    {
      title: 'Total Orders',
      value: metrics?.totalOrders || 0,
      icon: ShoppingCart,
      description: 'Total orders placed',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 animate-pulse bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse bg-gray-200 rounded mb-2" />
                <div className="h-3 w-32 animate-pulse bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Welcome to your enterprise dashboard. Here you can manage users, roles, view
              analytics, and more.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
