import { z } from 'zod'
import { Session } from 'next-auth'
import { updateVideoStatusSchema, uploadVideoSchema } from './video.dto'
import { findProjectById } from '../project/project.service'
import { PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { VIDEO_INCLUDE_FIELDS } from './video.fields'

export async function uploadVideo(prisma: PrismaClient, dto: z.infer<typeof uploadVideoSchema>, session: Session) {
  return prisma.video.create({
    data: {
      title: dto.title,
      description: dto.description,
      url: dto.url!,
      status: 'PENDING',
      projectId: dto.projectId,
      uploadedById: session.user.id,
    },
  })
}

export async function findProjectVideos(prisma: PrismaClient, projectId: string) {
  const project = await findProjectById(prisma, projectId)
  return prisma.video.findMany({
    where: { projectId: project.id, OR: [{ status: 'PENDING' }, { status: 'CHANGES_REQUIRED' }] },
    include: VIDEO_INCLUDE_FIELDS,
  })
}

export async function findVideoById(prisma: PrismaClient, id: string) {
  const video = await prisma.video.findFirst({ where: { id } })
  if (!video) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found' })
  }
  return video
}

export async function deleteVideo(prisma: PrismaClient, videoId: string, session: Session) {
  const video = await findVideoById(prisma, videoId)
  const project = await findProjectById(prisma, video.projectId)

  /** Only the admin of the project can delete videos */
  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to delete this project!' })
  }
  return prisma.video.delete({ where: { id: videoId } })
}

export async function updateVideoStatus(
  prisma: PrismaClient,
  dto: z.infer<typeof updateVideoStatusSchema>,
  session: Session,
) {
  const video = await findVideoById(prisma, dto.videoId)
  const project = await findProjectById(prisma, video.projectId)

  if (project.adminId !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update status for this video!' })
  }

  return prisma.video.update({ where: { id: video.id }, data: { status: dto.status } })
}
