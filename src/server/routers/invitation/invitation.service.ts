import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { Session } from 'next-auth'
import { createInvitationSchema } from './invitation.schema'

export async function createInvitation(
  prisma: PrismaClient,
  dto: z.infer<typeof createInvitationSchema>,
  session: Session,
) {
  return prisma.invitation.create({
    data: {
      inviterId: session.user.id,
      inviteeId: dto.invitee,
      projectId: dto.project,
    },
  })
}
