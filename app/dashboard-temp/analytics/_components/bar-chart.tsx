'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BarChartComponent({ data }: { data: any[] }) {
  const mockData = data.length > 0 ? data : [
    { category: 'Electronics', sales: 4000 },
    { category: 'Clothing', sales: 3000 },
    { category: 'Food', sales: 2000 },
    { category: 'Books', sales: 2780 },
    { category: 'Toys', sales: 1890 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
