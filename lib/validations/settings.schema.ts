import { z } from "zod"

export const generalSettingsSchema = z.object({
  appName: z
    .string()
    .min(2, "App name must be at least 2 characters")
    .max(50, "App name must be less than 50 characters"),
  appDescription: z.string().max(200, "Description must be less than 200 characters").optional(),
  logo: z.string().url().optional().or(z.string().max(0)),
  favicon: z.string().url().optional().or(z.string().max(0)),
  supportEmail: z.string().email("Invalid email address"),
  timezone: z.string(),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  timeFormat: z.enum(["12h", "24h"]),
})

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.number().int().min(5).max(1440), // minutes
  maxLoginAttempts: z.number().int().min(3).max(10),
  passwordMinLength: z.number().int().min(8).max(32),
  passwordRequireUppercase: z.boolean().default(true),
  passwordRequireLowercase: z.boolean().default(true),
  passwordRequireNumbers: z.boolean().default(true),
  passwordRequireSpecialChars: z.boolean().default(true),
  allowedDomains: z.array(z.string()).optional(),
})

export const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().int().min(1).max(65535),
  smtpUser: z.string().min(1, "SMTP user is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  smtpSecure: z.boolean().default(true),
  fromEmail: z.string().email("Invalid email address"),
  fromName: z.string().min(1, "From name is required"),
})

export const storageSettingsSchema = z.object({
  provider: z.enum(["local", "s3", "cloudinary"]),
  s3Bucket: z.string().optional(),
  s3Region: z.string().optional(),
  s3AccessKeyId: z.string().optional(),
  s3SecretAccessKey: z.string().optional(),
  cloudinaryCloudName: z.string().optional(),
  cloudinaryApiKey: z.string().optional(),
  cloudinaryApiSecret: z.string().optional(),
  maxFileSize: z.number().int().min(1).max(100), // MB
})

export const observabilitySettingsSchema = z.object({
  sentryDsn: z.string().url().optional().or(z.string().max(0)),
  sentryEnvironment: z.string().optional(),
  prometheusEnabled: z.boolean().default(false),
  prometheusPort: z.number().int().min(1).max(65535).default(9090),
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
})

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>
export type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>
export type StorageSettingsFormData = z.infer<typeof storageSettingsSchema>
export type ObservabilitySettingsFormData = z.infer<typeof observabilitySettingsSchema>
