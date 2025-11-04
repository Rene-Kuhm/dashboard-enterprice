'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, FileText, Settings } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    { icon: Plus, label: 'New User', onClick: () => router.push('/users') },
    { icon: Shield, label: 'Manage Roles', onClick: () => router.push('/roles') },
    { icon: FileText, label: 'Upload Files', onClick: () => router.push('/files') },
    { icon: Settings, label: 'Settings', onClick: () => router.push('/settings') },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you might need</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex flex-col items-center p-4"
                onClick={action.onClick}
              >
                <Icon className="h-5 w-5 mb-2" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
