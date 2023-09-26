import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'

/** Members who are not already invited for the project,
 * or the owner of the project
 * or the users who have already joined the project needs to be removed
 * */
export async function findMembersToInvite(prisma: PrismaClient, projectId: string, session: Session) {
  return prisma.user.findMany({
    where: {
      AND: [
        { id: { not: session.user.id } },
        { projectsJoined: { none: { id: projectId } } },
        { receivedInvitations: { none: { projectId } } },
      ],
    },
  })
}
