'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils/date';
import { RoleDialog } from '../_components/role-dialog';
import { DeleteRoleDialog } from '../_components/delete-role-dialog';

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: role, isLoading } = useQuery({
    queryKey: ['roles', roleId],
    queryFn: async () => {
      const response = await api.get(`/roles/${roleId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Role not found</h2>
          <Button onClick={() => router.push('/roles')} className="mt-4">Back to Roles</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/roles')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{role.name}</h1>
              <p className="text-muted-foreground">{role.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setEditDialogOpen(true)} disabled={role.isSystem}>
              Edit Role
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} disabled={role.isSystem}>
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permissions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{role.permissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{role.usersCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">{formatDate(role.createdAt)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission: any) => (
                <Badge key={permission.id} variant="outline">
                  {permission.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <RoleDialog role={role} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <DeleteRoleDialog role={role} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
    </>
  );
}
