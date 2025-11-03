'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical, Shield, Users, Edit, Trash2, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Role } from '@/types/role';
import { formatDate } from '@/lib/utils/date';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{role.name}</p>
                {role.isSystem && (
                  <Badge variant="secondary">System</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{role.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {role.permissions.length} permissions
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {role.usersCount} users
                </span>
                <span>Created {formatDate(role.createdAt)}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(role)} disabled={role.isSystem}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(role)}
                disabled={role.isSystem}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
