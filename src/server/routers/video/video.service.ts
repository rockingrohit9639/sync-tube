import fs from 'fs'
import { z } from 'zod'
import { Session } from 'next-auth'
import { PrismaClient, Project } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { google } from 'googleapis'
import { updateVideoStatusSchema, uploadVideoSchema } from './video.schema'
import { findProjectById, findProjectWithMembers } from '../project/project.service'
import { VIDEO_INCLUDE_FIELDS } from './video.fields'
import { env } from '~/lib/utils/env.mjs'

const OAuth2 = google.auth.OAuth2

export async function uploadVideo(prisma: PrismaClient, dto: z.infer<typeof uploadVideoSchema>, session: Session) {
  /** Only an admin or project members can upload the video */
  const project = await findProjectWithMembers(prisma, dto.projectId)
  if (project.adminId !== session.user.id || !project.members.find((member) => member.id === session.user.id)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Only admin or members can upload video in a project!',
    })
  }

  return prisma.video.create({
    data: {
      title: dto.title,
      description: dto.description,
      url: dto.url!,
      status: 'PENDING',
      projectId: dto.projectId,
      uploadedById: session.user.id,
      fileId: dto.fileId,
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

async function uploadVideoToYoutube(prisma: PrismaClient, videoId: string, project: Project, user: Session['user']) {
  if (user.role !== 'YOUTUBER') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only a youtuber can approve and upload video to youtube!' })
  }

  const video = await prisma.video.findFirst({ where: { id: videoId }, include: { file: true } })
  if (!video) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Video to be uploaded not found!' })
  }

  if (video.status !== 'APPROVED') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Video is not approved. Upload aborted!' })
  }

  if (!video.file) {
    throw new TRPCError({ code: 'CONFLICT', message: 'No file is associated with video!' })
  }

  const account = await prisma.account.findFirst({ where: { userId: user.id } })
  if (!account) {
    throw new TRPCError({ code: 'CONFLICT', message: 'No account associated with user!' })
  }

  const auth = new OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  })
  auth.setCredentials({
    access_token: account.access_token,
    expiry_date: account.expires_at,
    id_token: account.id_token,
    refresh_token: account.refresh_token,
    scope: account.scope!,
    token_type: account.token_type,
  })

  try {
    const youtube = google.youtube('v3')
    await youtube.videos.insert({
      auth,
      part: ['contentDetails', 'snippet', 'status'],
      requestBody: {
        snippet: {
          title: project.name,
          description: project.description,
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(video.file.path),
        mimeType: video.file.mimetype,
      },
    })
  } catch (error) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload video on youtube!' })
  }
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

  const updatedVideo = await prisma.video.update({ where: { id: video.id }, data: { status: dto.status } })

  /** If updated status is APPROVED then upload the video to youtube */
  await uploadVideoToYoutube(prisma, video.id, project, session.user)

  return updatedVideo
}
