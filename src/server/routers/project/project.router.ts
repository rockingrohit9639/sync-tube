import { z } from 'zod'
import { protectedProcedure, router, youtuberProcedure } from '~/server/trpc'
import { createProject, findUserProjects, findProjectById, archiveProject, deleteProject } from './project.service'
import { createProjectSchema } from './project.schema'

export const projectsRouter = router({
  createProject: youtuberProcedure
    .input(createProjectSchema)
    .mutation(({ input, ctx: { session } }) => createProject(input, session)),
  findUserProjects: protectedProcedure.query(({ ctx: { session } }) => findUserProjects(session)),
  findProjectById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findProjectById(input.id)),
  archiveProject: youtuberProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => archiveProject(input.id, ctx.session)),
  deleteProject: youtuberProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => deleteProject(input.id, ctx.session)),
})
