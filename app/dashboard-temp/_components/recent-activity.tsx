'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils/date';

const activities = [
  { id: 1, user: 'John Doe', action: 'created a new user', time: new Date(Date.now() - 5 * 60 * 1000) },
  { id: 2, user: 'Jane Smith', action: 'updated role permissions', time: new Date(Date.now() - 15 * 60 * 1000) },
  { id: 3, user: 'Bob Johnson', action: 'uploaded a file', time: new Date(Date.now() - 30 * 60 * 1000) },
  { id: 4, user: 'Alice Brown', action: 'logged in', time: new Date(Date.now() - 60 * 60 * 1000) },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{activity.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
