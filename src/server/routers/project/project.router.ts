import { router, youtuberProcedure } from '~/server/trpc'
import { createProject } from './project.service'
import { createProjectSchema } from './project.schema'

export const projectsRouter = router({
  createProject: youtuberProcedure
    .input(createProjectSchema)
    .mutation(({ input, ctx: { session } }) => createProject(input, session)),
})
