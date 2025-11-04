'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { Permission } from '@/types/role';

interface PermissionMatrixProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

export function PermissionMatrix({ selectedPermissions, onChange }: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  const { data } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await api.get('/permissions');
      return response.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      setPermissions(data.data);
      const modules = new Set(data.data.map((p: Permission) => p.module));
      setOpenModules(modules);
    }
  }, [data]);

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handlePermissionToggle = (permissionId: string) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    onChange(newPermissions);
  };

  const handleModuleToggle = (module: string) => {
    const modulePermissions = groupedPermissions[module];
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      onChange(selectedPermissions.filter(id => !modulePermissionIds.includes(id)));
    } else {
      onChange([...new Set([...selectedPermissions, ...modulePermissionIds])]);
    }
  };

  const toggleModule = (module: string) => {
    setOpenModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(module)) {
        newSet.delete(module);
      } else {
        newSet.add(module);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      {Object.entries(groupedPermissions).map(([module, perms]) => {
        const modulePermissionIds = perms.map(p => p.id);
        const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));
        const someSelected = modulePermissionIds.some(id => selectedPermissions.includes(id));

        return (
          <Collapsible
            key={module}
            open={openModules.has(module)}
            onOpenChange={() => toggleModule(module)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => handleModuleToggle(module)}
                  className={someSelected && !allSelected ? 'bg-primary/50' : ''}
                />
                <Label className="font-semibold capitalize text-base">{module}</Label>
                <span className="text-xs text-muted-foreground">
                  ({perms.length} permissions)
                </span>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openModules.has(module) ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4 ml-6 space-y-3">
              {perms.map((permission) => (
                <div key={permission.id} className="flex items-start gap-2">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
