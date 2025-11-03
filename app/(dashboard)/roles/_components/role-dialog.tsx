'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { api } from '@/lib/api';
import { Role } from '@/types/role';
import { PermissionMatrix } from './permission-matrix';

const roleFormSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleDialogProps {
  role?: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDialog({ role, open, onOpenChange }: RoleDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!role;
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      const permissionIds = role.permissions.map(p => p.id);
      form.reset({
        name: role.name,
        description: role.description,
        permissions: permissionIds,
      });
      setSelectedPermissions(permissionIds);
    } else {
      form.reset({
        name: '',
        description: '',
        permissions: [],
      });
      setSelectedPermissions([]);
    }
  }, [role, form]);

  const createMutation = useMutation({
    mutationFn: async (data: RoleFormValues) => {
      const response = await api.post('/roles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create role');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: RoleFormValues) => {
      const response = await api.patch(`/roles/${role?.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePermissionsChange = (permissions: string[]) => {
    setSelectedPermissions(permissions);
    form.setValue('permissions', permissions);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update role information and permissions'
              : 'Create a new role with specific permissions'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Content Manager" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this role
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this role..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <FormDescription>
                    Select the permissions for this role
                  </FormDescription>
                  <PermissionMatrix
                    selectedPermissions={selectedPermissions}
                    onChange={handlePermissionsChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
