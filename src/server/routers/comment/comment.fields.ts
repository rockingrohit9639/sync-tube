import { Prisma } from '@prisma/client'

export const COMMENT_INCLUDE_FIELDS = {
  createdBy: true,
  seenBy: true,
  video: true,
} satisfies Prisma.CommentInclude
