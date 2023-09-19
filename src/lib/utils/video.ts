import { VideoStatus } from '@prisma/client'
import colors from 'tailwindcss/colors'

export const VIDEO_STATUS_COLOR_MAP: Record<VideoStatus, string> = {
  PENDING: colors.yellow['500'],
  APPROVED: colors.green['500'],
  REJECTED: colors.red['500'],
  CHANGES_REQUIRED: colors.orange['500'],
}
