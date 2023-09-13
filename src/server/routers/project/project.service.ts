import { Session } from 'next-auth'
import { z } from 'zod'
import { db } from '~/db'
import { projects } from '~/db/schema/project'
import { createProjectSchema } from './project.schema'

export async function createProject(dto: z.infer<typeof createProjectSchema>, session: Session) {
  const projectCreated = await db
    .insert(projects)
    .values({
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
