import { Session } from 'next-auth'
import { z } from 'zod'
import dayjs from 'dayjs'
import { TRPCError } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { removeProjectMemberSchema, createProjectSchema, updateProjectSchema } from './project.schema'
import { OnGoingStatus } from '~/types/project'
import { PROJECT_INCLUDE_FIELDS } from './project.fields'

export async function createProject(
  prisma: PrismaClient,
  input: z.infer<typeof createProjectSchema>,
  session: Session,
) {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      deadline: input.deadline,
      archivedOn: input.archivedOn,
      isArchive: input.isArchive,
      visibility: input.visibility,
      admin: { connect: { id: session.user.id } },
    },
  })
}

export async function findUserProjects(prisma: PrismaClient, session: Session) {
  const userProjects = await prisma.project.findMany({
    where: { OR: [{ admin: { id: session.user.id } }, { members: { some: { id: session.user.id } } }] },
    include: PROJECT_INCLUDE_FIELDS,
  })

  return userProjects.map((project) => {
    let onGoingStatus: OnGoingStatus

    if (project.deadline) {
      const isDelayed = dayjs(project.deadline).isBefore(dayjs())
      if (isDelayed) {
        onGoingStatus = 'DELAYED'
      } else {
        onGoingStatus = 'ON-TIME'
      }
    }

    return {
      ...project,
      onGoingStatus,
    }
  })
}

export async function findProjectById(prisma: PrismaClient, id: string) {
  const projectFound = await prisma.project.findFirst({ where: { id }, include: PROJECT_INCLUDE_FIELDS })
  if (!projectFound) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found!' })
  }
  return projectFound
}

export async function archiveProject(prisma: PrismaClient, id: string, session: Session) {
  const project = await findProjectById(prisma, id)
  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to archive this project!' })
  }

  return prisma.project.update({ where: { id: project.id }, data: { isArchive: true, archivedOn: dayjs().toDate() } })
}

export async function deleteProject(prisma: PrismaClient, id: string, session: Session) {
  const project = await findProjectById(prisma, id)
  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to delete this project!' })
  }

  return prisma.project.delete({ where: { id: project.id } })
}

export async function updateProject(
  prisma: PrismaClient,
  input: z.infer<typeof updateProjectSchema>,
  session: Session,
) {
  const project = await findProjectById(prisma, input.id)
  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update this project!' })
  }

  return prisma.project.update({
    where: { id: project.id },
    data: {
      name: input.name,
      description: input.description,
      deadline: input.deadline,
      status: input.status,
      visibility: input.visibility,
    },
  })
}

export async function addProjectMember(prisma: PrismaClient, projectId: string, memberId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { members: { connect: { id: memberId } } },
  })
}

export async function findProjectWithMembers(prisma: PrismaClient, id: string) {
  const project = await prisma.project.findFirst({ where: { id }, include: { members: true } })
  if (!project) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found!' })
  }
  return project
}

export async function removeProjectMember(
  prisma: PrismaClient,
  input: z.infer<typeof removeProjectMemberSchema>,
  session: Session,
) {
  const project = await findProjectById(prisma, input.project)
  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You can not remove this member!' })
  }

  return prisma.project.update({
    where: { id: input.project },
    data: { members: { disconnect: { id: input.member } } },
  })
}

export async function leaveProject(prisma: PrismaClient, projectId: string, session: Session) {
  const project = await findProjectById(prisma, projectId)
  if (!project.members.find((member) => member.id === session?.user.id)) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'You are not in the list of project members!' })
  }

  return prisma.project.update({
    where: { id: project.id },
    data: { members: { disconnect: { id: session.user.id } } },
  })
}
