import { router, youtuberProcedure } from '~/server/trpc'
import { createInvitationSchema } from './invitation.schema'
import { createInvitation } from './invitation.service'

export const invitationRouter = router({
  create: youtuberProcedure
    .input(createInvitationSchema)
    .mutation(({ input, ctx }) => createInvitation(ctx.prisma, input, ctx.session)),
})
