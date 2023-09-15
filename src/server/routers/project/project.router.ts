import { router, youtuberProcedure } from '~/server/trpc'
import { createProject, findUserProjects } from './project.service'
import { createProjectSchema } from './project.schema'

export const projectsRouter = router({
  createProject: youtuberProcedure
    .input(createProjectSchema)
    .mutation(({ input, ctx: { session } }) => createProject(input, session)),
  findUserProjects: youtuberProcedure.query(({ ctx: { session } }) => findUserProjects(session)),
})
