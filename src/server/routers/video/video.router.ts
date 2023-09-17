import { protectedProcedure, router } from '~/server/trpc'
import { uploadVideoSchema } from './video.dto'
import { uploadVideo } from './video.service'

export const videoRouter = router({
  uploadVideo: protectedProcedure
    .input(uploadVideoSchema)
    .mutation(({ input, ctx }) => uploadVideo(input, ctx.session)),
})
