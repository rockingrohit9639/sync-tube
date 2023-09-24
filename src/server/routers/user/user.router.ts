import { z } from 'zod'
import { router, youtuberProcedure } from '~/server/trpc'
import { findMembersToInvite } from './user.service'

export const userRouter = router({
  findMembersToInvite: youtuberProcedure
    .input(z.object({ project: z.string() }))
    .query(({ input, ctx }) => findMembersToInvite(ctx.prisma, input.project, ctx.session)),
})
