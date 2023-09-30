import z from 'zod'
import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'
import { TRPCError } from '@trpc/server'
import { createCommentSchema } from './comment.schema'
import { COMMENT_INCLUDE_FIELDS } from './comment.fields'

export async function createComment(
  prisma: PrismaClient,
  input: z.infer<typeof createCommentSchema>,
  session: Session,
) {
  return prisma.comment.create({
    data: {
      content: input.content,
      videoId: input.video,
      createdById: session.user.id,
    },
  })
}

export async function findVideoComments(prisma: PrismaClient, videoId: string) {
  return prisma.comment.findMany({ where: { videoId }, include: COMMENT_INCLUDE_FIELDS })
}

export async function findCommentById(prisma: PrismaClient, id: string) {
  const comment = await prisma.comment.findFirst({ where: { id } })
  if (!comment) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found!' })
  }
  return comment
}

export async function removeComment(prisma: PrismaClient, id: string, session: Session) {
  const comment = await findCommentById(prisma, id)
  if (comment.createdById !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to delete this comment!' })
  }
  return prisma.comment.delete({ where: { id } })
}
