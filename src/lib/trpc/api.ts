import { cookies } from 'next/headers'
import { loggerLink } from '@trpc/client'
import { experimental_createTRPCNextAppDirServer as createTRPCNextAppDirServer } from '@trpc/next/app-dir/server'
import { experimental_nextCacheLink as nextCacheLink } from '@trpc/next/app-dir/links/nextCache'
import SuperJSON from 'superjson'
import { getUserAuth } from '../auth/utils'
import { appRouter } from '~/server/routers'
import { prisma } from '~/server/db'

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: () => true,
        }),
        nextCacheLink({
          revalidate: 1,
          router: appRouter,
          async createContext() {
            const { session } = await getUserAuth()
            return {
              prisma,
              session,
              headers: {
                cookie: cookies().toString(),
                'x-trpc-source': 'rsc-invoke',
              },
            }
          },
        }),
      ],
    }
  },
})
