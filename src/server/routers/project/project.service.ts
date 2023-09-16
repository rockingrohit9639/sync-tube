import { Session } from 'next-auth'
import { z } from 'zod'
import { and, desc, eq, ne } from 'drizzle-orm'
import dayjs from 'dayjs'
import { TRPCError } from '@trpc/server'
import { db } from '~/db'
import { projects } from '~/db/schema/project'
import { createProjectSchema, updateProjectSchema } from './project.schema'
import { OnGoingStatus } from '~/types/project'

export async function createProject(dto: z.infer<typeof createProjectSchema>, session: Session) {
  const projectCreated = await db
    .insert(projects)
    .values({
      id: projects.id.default,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      deadline: dto.deadline,
      archivedOn: dto.archivedOn,
      isArchive: dto.isArchive,
      admin: session.user.id,
    })
    .returning()

  return projectCreated[0]
}

export async function findUserProjects(session: Session) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.admin, session.user.id), ne(projects.isArchive, true)))
    .orderBy(desc(projects.createdAt))

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

export async function findProjectById(id: number) {
  const projectsFound = await db.select().from(projects).where(eq(projects.id, id))
  if (projectsFound.length === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Project not found!',
    })
  }

  return projectsFound[0]
}

export async function archiveProject(id: number, session: Session) {
  const project = await findProjectById(id)
  if (project.admin !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to archive this project!' })
  }

  const updatedProject = await db
    .update(projects)
    .set({ isArchive: true, archivedOn: dayjs().toDate() })
    .where(eq(projects.id, id))
    .returning()
  return updatedProject[0]
}

export async function deleteProject(id: number, session: Session) {
  const project = await findProjectById(id)
  if (project.admin !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to delete this project!' })
  }

  const deletedProject = await db.delete(projects).where(eq(projects.id, id)).returning()
  return deletedProject[0]
}

export async function updateProject(dto: z.infer<typeof updateProjectSchema>, session: Session) {
  const project = await findProjectById(dto.id)
  if (project.admin !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update this project!' })
  }

  const updatedProject = await db
    .update(projects)
    .set({
      name: dto.name,
      description: dto.description,
      deadline: dto.deadline,
      status: dto.status,
    })
    .where(eq(projects.id, dto.id))
    .returning()

  return updatedProject[0]
}
