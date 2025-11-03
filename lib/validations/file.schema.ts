import { z } from "zod"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

export const fileUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 10MB")
    .refine(
      (file) => [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES].includes(file?.type),
      "Only .jpg, .jpeg, .png, .webp, .gif, .pdf, .doc, .docx formats are supported"
    ),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
})

export const imageUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 10MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, .webp, .gif formats are supported"
    ),
})

export const updateFileSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
})

export type FileUploadFormData = z.infer<typeof fileUploadSchema>
export type ImageUploadFormData = z.infer<typeof imageUploadSchema>
export type UpdateFileFormData = z.infer<typeof updateFileSchema>
