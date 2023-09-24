import { z } from 'zod'

const videoStatusEnumSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUIRED'])

export const uploadVideoSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().optional(),
  status: videoStatusEnumSchema.default('PENDING').optional(),
  url: z.string().optional(),
  projectId: z.string(),
  fileId: z.string(),
})

export const updateVideoStatusSchema = z.object({
  videoId: z.string(),
  status: videoStatusEnumSchema,
})
