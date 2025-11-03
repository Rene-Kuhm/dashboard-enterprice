'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Mail,
  MoreVertical,
  Shield,
  User as UserIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '@/lib/api';
import { User } from '@/types/user';
import { formatDate, formatRelativeTime } from '@/lib/utils/date';
import { UserDialog } from '../_components/user-dialog';
import { DeleteUserDialog } from '../_components/delete-user-dialog';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
  });

  const { data: activityLog } = useQuery({
    queryKey: ['users', userId, 'activity'],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/activity`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-2">
            The user you are looking for does not exist.
          </p>
          <Button onClick={() => router.push('/users')} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/users')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/users/${userId}/activity`)}>
                View Activity
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* User Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Personal Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Personal Information
              </CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={user.isActive ? 'success' : 'destructive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono">{user.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Role & Permissions
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Role</p>
                  <Badge variant="outline" className="text-base capitalize">
                    {user.role}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Permissions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getRolePermissions(user.role).map((permission) => (
                      <Badge key={permission} variant="secondary">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(user.createdAt)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="text-sm font-medium">
                    {user.lastLoginAt
                      ? formatDate(user.lastLoginAt)
                      : 'Never'}
                  </p>
                  {user.lastLoginAt && (
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(user.lastLoginAt)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity History</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions performed by this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityLog && activityLog.length > 0 ? (
                  <div className="space-y-4">
                    {activityLog.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No activity recorded yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Currently active login sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No active sessions
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>
                  Configure user preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Settings configuration coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <UserDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteUserDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}

function getRolePermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    admin: ['All Access', 'Manage Users', 'Manage Roles', 'System Settings'],
    moderator: ['Manage Content', 'View Users', 'Moderate Comments'],
    user: ['View Content', 'Edit Profile', 'Upload Files'],
    viewer: ['View Content'],
  };
  return permissions[role] || [];
}
