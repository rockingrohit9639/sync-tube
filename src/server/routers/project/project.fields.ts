import { Prisma } from '@prisma/client'

export const PROJECT_INCLUDE_FIELDS = {
  admin: true,
} satisfies Prisma.ProjectInclude
