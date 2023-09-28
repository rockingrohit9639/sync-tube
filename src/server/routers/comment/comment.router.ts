import z from 'zod'
import { protectedProcedure, router } from '~/server/trpc'
import { createCommentSchema } from './comment.schema'
import { createComment, findVideoComments } from './comment.service'

export const commentsRouter = router({
  create: protectedProcedure
    .input(createCommentSchema)
    .mutation(({ input, ctx }) => createComment(ctx.prisma, input, ctx.session)),

  findVideoComments: protectedProcedure
    .input(z.object({ video: z.string() }))
    .query(({ input, ctx }) => findVideoComments(ctx.prisma, input.video)),
})
