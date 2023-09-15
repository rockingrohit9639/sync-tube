import { Session } from 'next-auth'
import { z } from 'zod'
import { and, desc, eq, ne } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '~/db'
import { projects } from '~/db/schema/project'
import { createProjectSchema } from './project.schema'
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
      isArchive: dto.isArchived,
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
