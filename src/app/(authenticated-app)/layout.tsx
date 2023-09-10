import { checkAuth } from '~/lib/auth/utils'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await checkAuth()

  return <>{children}</>
}
