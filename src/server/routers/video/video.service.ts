import { z } from 'zod'
import { Session } from 'next-auth'
import { uploadVideoSchema } from './video.dto'
import { findProjectById } from '../project/project.service'
import { PrismaClient } from '@prisma/client'

export async function uploadVideo(prisma: PrismaClient, dto: z.infer<typeof uploadVideoSchema>, session: Session) {
  return prisma.video.create({
    data: {
      title: dto.title,
      description: dto.description,
      url: dto.url,
      status: 'PENDING',
      projectId: dto.projectId,
      uploadedById: session.user.id,
    },
  })
}

export async function findProjectVideos(prisma: PrismaClient, projectId: string) {
  const project = await findProjectById(prisma, projectId)
  return prisma.video.findMany({ where: { projectId: project.id }, include: { uploadedBy: true } })
}
