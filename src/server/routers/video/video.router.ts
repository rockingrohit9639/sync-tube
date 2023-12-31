import { z } from 'zod'
import { protectedProcedure, router, youtuberProcedure } from '~/server/trpc'
import { updateVideoStatusSchema, uploadVideoSchema } from './video.schema'
import {
  deleteVideo,
  findProjectVideos,
  findVideoById,
  markVideoSeenByAdmin,
  updateVideoStatus,
  uploadVideo,
} from './video.service'

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

  updateVideoStatus: youtuberProcedure
    .input(updateVideoStatusSchema)
    .mutation(({ input, ctx }) => updateVideoStatus(ctx.prisma, input, ctx.session)),

  findOneById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => findVideoById(ctx.prisma, input.id)),

  markVideoSeenByAdmin: youtuberProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => markVideoSeenByAdmin(ctx.prisma, input.id, ctx.session)),
})
