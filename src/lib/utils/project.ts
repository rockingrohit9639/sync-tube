import colors from 'tailwindcss/colors'
import { OnGoingStatus } from '~/types/project'

export const ONGOING_STATUS_COLOR_MAP: Record<NonNullable<OnGoingStatus>, string> = {
  DELAYED: colors.red['500'],
  'ON-TIME': colors.green['500'],
}
