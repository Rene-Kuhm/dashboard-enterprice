'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Download, RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, Activity, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { KpiCard } from './_components/kpi-card';
import { LineChartComponent } from './_components/line-chart';
import { BarChartComponent } from './_components/bar-chart';
import { PieChartComponent } from './_components/pie-chart';
import { AreaChartComponent } from './_components/area-chart';
import { DateRangePicker } from './_components/date-range-picker';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const response = await api.get('/analytics', { params: dateRange });
      return response.data;
    },
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const handleExport = () => {
    // Export logic here
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Auto Refresh Toggle */}
      <div className="flex items-center gap-2">
        <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        <Label htmlFor="auto-refresh">Auto-refresh every 30 seconds</Label>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value="$45,231.89"
          change={20.1}
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />
        <KpiCard
          title="Active Users"
          value="2,350"
          change={12.5}
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <KpiCard
          title="Conversion Rate"
          value="3.24%"
          change={-2.3}
          icon={<Activity className="h-4 w-4" />}
          trend="down"
        />
        <KpiCard
          title="Total Products"
          value="573"
          change={8.2}
          icon={<Package className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartComponent data={analytics?.revenueData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Active users by month</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChartComponent data={analytics?.userGrowthData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Top performing categories</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={analytics?.categoryData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Distribution of user sources</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={analytics?.trafficData || []} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">Product {i}</span>
                  <span className="font-semibold">${(1000 * i).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'].map((period, i) => (
                <div key={period} className="flex items-center justify-between">
                  <span className="text-sm">{period}</span>
                  <span className="font-semibold">{50 - i * 10}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="font-semibold text-green-600">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <span className="font-semibold text-green-600">0.01%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
