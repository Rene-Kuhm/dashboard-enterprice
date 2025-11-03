'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Filter, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils/date';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', activeTab],
    queryFn: async () => {
      const response = await api.get(`/notifications?filter=${activeTab}`);
      return response.data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await api.patch('/notifications/mark-read', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notifications marked as read');
      setSelectedIds([]);
    },
  });

  const handleSelectAll = () => {
    if (selectedIds.length === notifications?.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications?.data.map((n: any) => n.id) || []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage your notifications and alerts</p>
        </div>
        {selectedIds.length > 0 && (
          <Button onClick={() => markAsReadMutation.mutate(selectedIds)}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark {selectedIds.length} as Read
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.meta.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.meta.unread || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.meta.email || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.meta.sms || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Notifications</CardTitle>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedIds.length === notifications?.data.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : notifications?.data.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notifications found</p>
              ) : (
                notifications?.data.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg ${
                      notification.read ? 'opacity-60' : 'bg-accent'
                    }`}
                  >
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds([...selectedIds, notification.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== notification.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{notification.title}</p>
                        <Badge variant={notification.type === 'email' ? 'default' : 'secondary'}>
                          {notification.type}
                        </Badge>
                        {!notification.read && <Badge variant="destructive">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
