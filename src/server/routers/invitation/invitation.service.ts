import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { Session } from 'next-auth'
import { TRPCError } from '@trpc/server'
import { createInvitationSchema } from './invitation.schema'
import { INVITATION_INCLUDE_FIELDS } from './invitation.fields'
import { addProjectMember } from '../project/project.service'
import { novuClient } from '~/lib/novu/client'
import { env } from '~/lib/utils/env.mjs'

export async function createInvitation(
  prisma: PrismaClient,
  input: z.infer<typeof createInvitationSchema>,
  session: Session,
) {
  const createdInvitation = await prisma.invitation.create({
    data: {
      inviterId: session.user.id,
      inviteeId: input.invitee,
      projectId: input.project,
    },
    include: { inviter: true, project: true, invitee: true },
  })

  /** Send notification */
  await novuClient.trigger(env.NOVU_WORKFLOW_ID, {
    to: { subscriberId: createdInvitation.inviteeId },
    payload: {
      inviterName: createdInvitation.inviter.name!,
      projectName: createdInvitation.project.name,
      inviteeName: createdInvitation.invitee.name!,
    },
  })

  return createdInvitation
}

export async function findReceivedInvitations(prisma: PrismaClient, session: Session) {
  return prisma.invitation.findMany({
    where: {
      inviteeId: session.user.id,
    },
    include: INVITATION_INCLUDE_FIELDS,
  })
}

export async function findInvitationById(prisma: PrismaClient, id: string) {
  const invitation = await prisma.invitation.findFirst({ where: { id }, include: INVITATION_INCLUDE_FIELDS })
  if (!invitation) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Invitation not found!' })
  }
  return invitation
}

export async function acceptInvitation(prisma: PrismaClient, id: string, session: Session) {
  const invitation = await findInvitationById(prisma, id)
  if (invitation.inviteeId !== session.user.id) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only invitee can accept an invitation!' })
  }

  /** Add the invitee to members of project and delete the invitation */
  await addProjectMember(prisma, invitation.projectId, session.user.id)

  return prisma.invitation.delete({ where: { id: invitation.id } })
}

export async function rejectInvitation(prisma: PrismaClient, id: string, session: Session) {
  const invitation = await findInvitationById(prisma, id)
  if (invitation.inviteeId !== session.user.id) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only invitee can reject an invitation!' })
  }

  return prisma.invitation.delete({ where: { id: invitation.id } })
}

export async function getTotalInvitations(prisma: PrismaClient, session: Session) {
  return prisma.invitation.count({ where: { inviteeId: session.user.id } })
}
