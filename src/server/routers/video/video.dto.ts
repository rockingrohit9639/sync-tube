import { z } from 'zod'

export const uploadVideoSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUIRED']).default('PENDING').optional(),
  url: z.string().optional(),
  projectId: z.string(),
})
