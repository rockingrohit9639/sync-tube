import { protectedProcedure, router, youtuberProcedure } from '~/server/trpc'
import { createInvitationSchema } from './invitation.schema'
import { createInvitation, findReceivedInvitations } from './invitation.service'

export const invitationRouter = router({
  create: youtuberProcedure
    .input(createInvitationSchema)
    .mutation(({ input, ctx }) => createInvitation(ctx.prisma, input, ctx.session)),

  findReceivedInvitations: protectedProcedure.query(({ ctx }) => findReceivedInvitations(ctx.prisma, ctx.session)),
})
