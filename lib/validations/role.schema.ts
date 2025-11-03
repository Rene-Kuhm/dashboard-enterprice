import { z } from "zod"

export const permissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  resource: z.string(),
  action: z.enum(["create", "read", "update", "delete", "manage"]),
  enabled: z.boolean().default(false),
})

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Name can only contain letters, numbers, hyphens and underscores"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  permissions: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
  priority: z.number().int().min(0).max(100).default(50),
})

export const assignRoleSchema = z.object({
  userId: z.string().or(z.number()),
  roleIds: z.array(z.string().or(z.number())).min(1, "At least one role is required"),
})

export type PermissionFormData = z.infer<typeof permissionSchema>
export type RoleFormData = z.infer<typeof roleSchema>
export type AssignRoleFormData = z.infer<typeof assignRoleSchema>
