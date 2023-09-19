import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { getUserAuth } from '../auth/utils'
import { prisma } from '~/server/db'

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const { session } = await getUserAuth()

  return {
    session,
    headers: opts && Object.fromEntries(opts.req.headers),
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
