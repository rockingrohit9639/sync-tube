import { z } from 'zod'
import { Session } from 'next-auth'
import { uploadVideoSchema } from './video.dto'
import { db } from '~/db'
import { videos } from '~/db/schema/video'

export async function uploadVideo(dto: z.infer<typeof uploadVideoSchema>, session: Session) {
  const uploadedVideo = await db
    .insert(videos)
    .values({
      title: dto.title,
      description: dto.description,
      projectId: dto.projectId,
      url: dto.url,
      uploadedById: session.user.id,
    })
    .returning()

  return uploadedVideo[0]
}
