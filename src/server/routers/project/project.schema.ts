import { z } from 'zod'

export const createProjectSchema = z
  .object({
    name: z.string().min(2).max(255),
    description: z.string().max(4000).optional(),
    deadline: z.date().optional(),
    isArchived: z.boolean().default(false).optional(),
    archivedOn: z.date().optional(),
    status: z.enum(['ONGOING', 'DONE']).default('ONGOING').optional(),
  })
  .superRefine((values, ctx) => {
    if (values.isArchived) {
      if (!values.archivedOn) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'Archived date is required!',
        })
      }
    }
  })
