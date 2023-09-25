import { Prisma } from '@prisma/client'

export const INVITATION_INCLUDE_FIELDS = {
  inviter: true,
  project: true,
} satisfies Prisma.InvitationInclude
