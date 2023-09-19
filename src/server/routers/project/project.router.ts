import { z } from 'zod'
import { protectedProcedure, router, youtuberProcedure } from '~/server/trpc'
import {
  createProject,
  findUserProjects,
  findProjectById,
  archiveProject,
  deleteProject,
  updateProject,
} from './project.service'
import { createProjectSchema, updateProjectSchema } from './project.schema'

export const projectsRouter = router({
  createProject: youtuberProcedure
    .input(createProjectSchema)
    .mutation(({ input, ctx }) => createProject(ctx.prisma, input, ctx.session)),

  findUserProjects: protectedProcedure.query(({ ctx }) => findUserProjects(ctx.prisma, ctx.session)),

  findProjectById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx: { prisma } }) => findProjectById(prisma, input.id)),

  archiveProject: youtuberProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => archiveProject(ctx.prisma, input.id, ctx.session)),

  deleteProject: youtuberProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => deleteProject(ctx.prisma, input.id, ctx.session)),

  updateProject: youtuberProcedure
    .input(updateProjectSchema)
    .mutation(({ input, ctx }) => updateProject(ctx.prisma, input, ctx.session)),
})
