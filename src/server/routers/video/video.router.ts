import { protectedProcedure, router, youtuberProcedure } from '~/server/trpc'
import { uploadVideoSchema } from './video.dto'
import { deleteVideo, findProjectVideos, uploadVideo } from './video.service'
import { z } from 'zod'

export const videoRouter = router({
  uploadVideo: protectedProcedure
    .input(uploadVideoSchema)
    .mutation(({ input, ctx }) => uploadVideo(ctx.prisma, input, ctx.session)),

  findProjectVideos: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => findProjectVideos(ctx.prisma, input.id)),

  deleteVideo: youtuberProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => deleteVideo(ctx.prisma, input.id, ctx.session)),
})
