import { z } from 'zod'
import { protectedProcedure, router, youtuberProcedure } from '~/server/trpc'
import { createInvitationSchema } from './invitation.schema'
import { acceptInvitation, createInvitation, findReceivedInvitations, rejectInvitation } from './invitation.service'

const invitationIdSchema = z.object({
  invitation: z.string(),
})

export const invitationRouter = router({
  create: youtuberProcedure
    .input(createInvitationSchema)
    .mutation(({ input, ctx }) => createInvitation(ctx.prisma, input, ctx.session)),

  findReceivedInvitations: protectedProcedure.query(({ ctx }) => findReceivedInvitations(ctx.prisma, ctx.session)),

  accept: protectedProcedure
    .input(invitationIdSchema)
    .mutation(({ ctx, input }) => acceptInvitation(ctx.prisma, input.invitation, ctx.session)),

  reject: protectedProcedure
    .input(invitationIdSchema)
    .mutation(({ input, ctx }) => rejectInvitation(ctx.prisma, input.invitation, ctx.session)),
})
