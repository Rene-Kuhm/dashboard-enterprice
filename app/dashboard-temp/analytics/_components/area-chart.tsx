'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AreaChartComponent({ data }: { data: any[] }) {
  const mockData = data.length > 0 ? data : [
    { month: 'Jan', users: 1000 },
    { month: 'Feb', users: 1200 },
    { month: 'Mar', users: 1500 },
    { month: 'Apr', users: 1800 },
    { month: 'May', users: 2200 },
    { month: 'Jun', users: 2500 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={mockData}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
