export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  usersCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}
