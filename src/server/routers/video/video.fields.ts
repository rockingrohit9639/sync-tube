import { Prisma } from '@prisma/client'

export const VIDEO_INCLUDE_FIELDS = {
  uploadedBy: { select: { id: true, name: true } },
  project: { include: { admin: { select: { id: true } } } },
} satisfies Prisma.VideoInclude
