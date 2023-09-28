'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'

import SuperJSON from 'superjson'
import { trpc } from '~/lib/trpc/client'
import { getUrl } from '~/lib/trpc/utils'

export default function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: getUrl(),
        }),
      ],
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
