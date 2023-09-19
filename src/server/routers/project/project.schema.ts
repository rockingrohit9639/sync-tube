import * as z from 'zod'

const projectStatus = z.enum(['ONGOING', 'DONE']).default('ONGOING')

export const createProjectSchema = z
  .object({
    name: z.string().min(2).max(255),
    description: z.string().min(10).max(4000),
    deadline: z.date().optional(),
    isArchive: z.boolean().default(false).optional(),
    archivedOn: z.date().optional(),
    status: projectStatus.optional(),
  })
  .superRefine((values, ctx) => {
    if (values.isArchive) {
      if (!values.archivedOn) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'Archived date is required!',
        })
      }
    }
  })

export const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(155).optional(),
  description: z.string().max(4000).optional(),
  deadline: z.date().optional(),
  status: projectStatus.optional(),
})
