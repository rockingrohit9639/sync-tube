import { z } from 'zod'

export const createInvitationSchema = z.object({
  invitee: z.string(),
  project: z.string(),
})
