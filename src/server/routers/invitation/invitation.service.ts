import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { Session } from 'next-auth'
import { createInvitationSchema } from './invitation.schema'
import { INVITATION_INCLUDE_FIELDS } from './invitation.fields'

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

export async function findReceivedInvitations(prisma: PrismaClient, session: Session) {
  return prisma.invitation.findMany({
    where: {
      inviteeId: session.user.id,
    },
    include: INVITATION_INCLUDE_FIELDS,
  })
}
