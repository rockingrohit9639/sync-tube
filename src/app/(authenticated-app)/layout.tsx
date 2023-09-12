import { checkAuth } from '~/lib/auth/utils'
import AppShell from './_components/app-shell'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await checkAuth()

  return <AppShell>{children}</AppShell>
}
