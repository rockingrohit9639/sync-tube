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

/**
 * The users who have joined any of the projects of current logged in user
 */
export async function findTeamMembers(prisma: PrismaClient, session: Session) {
  return prisma.user.findMany({
    where: {
      AND: [{ id: { not: session.user.id } }, { projectsJoined: { some: { adminId: session.user.id } } }],
    },
    include: { projectsJoined: true },
  })
}
