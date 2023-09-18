import { z } from 'zod'
import { Session } from 'next-auth'
import { uploadVideoSchema } from './video.dto'
import { db } from '~/db'
import { videos } from '~/db/schema/video'
import { findProjectById } from '../project/project.service'
import { eq } from 'drizzle-orm'
import { users } from '~/db/schema/auth'

export async function uploadVideo(dto: z.infer<typeof uploadVideoSchema>, session: Session) {
  const uploadedVideo = await db
    .insert(videos)
    .values({
      title: dto.title,
      description: dto.description,
      projectId: dto.projectId,
      url: dto.url,
      uploadedById: session.user.id,
      status: 'PENDING',
    })
    .returning()

  return uploadedVideo[0]
}

export async function findProjectVideos(projectId: number) {
  const project = await findProjectById(projectId)
  return db
    .select({
      id: videos.id,
      title: videos.title,
      description: videos.description,
      status: videos.status,
      seenByAdmin: videos.seenByAdmin,
      uploadedAt: videos.uploadedAt,
      uploadedBy: { id: users.id, name: users.name },
    })
    .from(videos)
    .where(eq(videos.projectId, project.id))
    .fullJoin(users, eq(videos.uploadedById, users.id))
}
