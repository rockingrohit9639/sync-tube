'use client'

import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { cn } from '~/lib/utils/utils'
import NavLink from '../nav-link'
import Avatar from '~/components/avatar'
import Dropdown from '~/components/dropdown'
import { useRoutes } from '~/hooks/use-routes'

type AppShellProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function AppShell({ className, style, children }: AppShellProps) {
  const { setTheme, theme } = useTheme()
  const { data } = useSession()
  const routes = useRoutes()

  if (!data) {
    return null
  }

  return (
    <div className={cn(className)} style={style}>
      <div className="fixed left-0 top-0 z-50 h-16 w-full border-b bg-background/20 px-4 backdrop-blur-lg">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
            <div className="font-bold">SyncTube</div>
          </Link>
          <div className="flex items-center gap-4">
            {routes.map((route) =>
              route.type === 'NAV' ? (
                <NavLink
                  key={route.id}
                  href={route.path}
                  className="rounded px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-primary-foreground"
                  activeClassName="text-primary-foreground bg-primary"
                >
                  {route.name}
                </NavLink>
              ) : (
                route.item
              ),
            )}

            <Dropdown
              items={[
                {
                  id: 'theme',
                  label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
                  onClick: () => {
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                  },
                },
                {
                  id: 'logout',
                  label: 'Logout',
                  onClick: () => {
                    signOut()
                  },
                },
              ]}
              label={data.user.name}
            >
              <Avatar src={data.user.image!}>{data?.user?.name?.[0]}</Avatar>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 min-h-screen max-w-screen-xl p-4">{children}</div>
    </div>
  )
}
