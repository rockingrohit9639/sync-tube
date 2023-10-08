'use client'

import { NovuProvider } from '@novu/notification-center'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import AppShell from './_components/app-shell'
import { env } from '~/lib/utils/env.mjs'
import Loader from '~/components/loader'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  if (status === 'loading') {
    return <Loader title="Fetching session..." />
  }

  if (!session?.user) {
    return null
  }

  return (
    <NovuProvider
      subscriberId={session.user.id}
      applicationIdentifier={env.NEXT_PUBLIC_NOVU_APPLICATION_ID}
      initialFetchingStrategy={{ fetchNotifications: true, fetchUserPreferences: true }}
    >
      <AppShell>{children}</AppShell>
    </NovuProvider>
  )
}
