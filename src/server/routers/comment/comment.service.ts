import z from 'zod'
import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'
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
