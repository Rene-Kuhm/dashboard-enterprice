'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export function KpiCard({ title, value, change, icon, trend }: KpiCardProps) {
  const isPositive = trend === 'up';
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${changeColor}`}>
          <TrendIcon className="mr-1 h-3 w-3" />
          {Math.abs(change)}% from last month
        </div>
      </CardContent>
    </Card>
  );
}
