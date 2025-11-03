'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/config/api.config';
import type { User, PaginatedResponse } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<User>>(ENDPOINTS.users.list);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading users. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({data?.meta.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.data.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-4">
              {data?.data.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {user.role.name}
                    </span>
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.meta.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" disabled={data.meta.page === 1}>
            Previous
          </Button>
          <span className="text-sm">
            Page {data.meta.page} of {data.meta.lastPage}
          </span>
          <Button variant="outline" disabled={data.meta.page === data.meta.lastPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
