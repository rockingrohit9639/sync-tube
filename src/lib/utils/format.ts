import { capitalize } from 'lodash'

/**
 * This function is helpful in converting enums from backend to better formatted strings like
 *
 * PENDING_WITH_STATE -> Pending With State
 */
export function formatEnum(value?: string) {
  return value?.split('_').map(capitalize).join(' ') ?? ''
}
