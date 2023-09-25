import { Session } from 'next-auth'
import { z } from 'zod'
import dayjs from 'dayjs'
import { TRPCError } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { createProjectSchema, updateProjectSchema } from './project.schema'
import { OnGoingStatus } from '~/types/project'

export async function createProject(prisma: PrismaClient, dto: z.infer<typeof createProjectSchema>, session: Session) {
  return prisma.project.create({
    data: {
      name: dto.name,
      description: dto.description,
      status: dto.status,
      deadline: dto.deadline,
      archivedOn: dto.archivedOn,
      isArchive: dto.isArchive,
      admin: { connect: { id: session.user.id } },
    },
  })
}

export async function findUserProjects(prisma: PrismaClient, session: Session) {
  const userProjects = await prisma.project.findMany({
    where: { OR: [{ admin: { id: session.user.id } }, { members: { some: { id: session.user.id } } }] },
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
  const projectFound = await prisma.project.findFirst({ where: { id } })
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

export async function updateProject(prisma: PrismaClient, dto: z.infer<typeof updateProjectSchema>, session: Session) {
  const project = await findProjectById(prisma, dto.id)
  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update this project!' })
  }

  return prisma.project.update({
    where: { id: project.id },
    data: {
      name: dto.name,
      description: dto.description,
      deadline: dto.deadline,
      status: dto.status,
    },
  })
}

export async function addProjectMember(prisma: PrismaClient, projectId: string, memberId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      members: { connect: { id: memberId } },
    },
  })
}
