import z from 'zod'

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(5, { message: 'Please enter at least 5 characters' })
    .max(1000, { message: 'Please enter at most 1000 characters!' }),
  video: z.string(),
})
