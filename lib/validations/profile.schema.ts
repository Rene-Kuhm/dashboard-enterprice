import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  avatar: z.string().url().optional().or(z.string().max(0)),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.string().max(0)),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  language: z.enum(["en", "es", "fr", "de"]).default("en"),
  timezone: z.string().optional(),
})

export const twoFactorSetupSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
})

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  securityAlerts: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
})

export const sessionSchema = z.object({
  id: z.string(),
  device: z.string(),
  location: z.string().optional(),
  ipAddress: z.string(),
  lastActive: z.date(),
  current: z.boolean(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type TwoFactorSetupFormData = z.infer<typeof twoFactorSetupSchema>
export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>
export type SessionData = z.infer<typeof sessionSchema>
