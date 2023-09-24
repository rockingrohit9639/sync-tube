import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'

/** Members who are not already invited for the project,
 * or the owner of the project
 * or the users who have already joined the project needs to be removed
 * */
export async function findMembersToInvite(prisma: PrismaClient, projectId: string, session: Session) {
  return prisma.user.findMany({
    where: {
      OR: [
        { id: { not: session.user.id } },
        { receivedInvitations: { some: { projectId: { not: projectId } } } },
        { projectsJoined: { some: { id: { not: projectId } } } },
      ],
    },
  })
}
