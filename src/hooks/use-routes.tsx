import { ColorScheme, NotificationBell, PopoverNotificationCenter } from '@novu/notification-center'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import NavLink from '~/app/(authenticated-app)/_components/nav-link'
import When from '~/components/when'
import { trpc } from '~/lib/trpc/client'
import { Route } from '~/types/routes'

export function useRoutes(): Route[] {
  const router = useRouter()
  const { theme } = useTheme()
  const { data } = trpc.invitations.totalInvitations.useQuery()

  return [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/',
      type: 'NAV',
    },
    {
      id: 'about',
      name: 'About Us',
      path: '/about-us',
      type: 'NAV',
    },
    {
      id: 'contact',
      name: 'Contact Us',
      path: '/contact-us',
      type: 'NAV',
    },
    {
      id: 'invitations',
      type: 'NODE',
      item: (
        <div className="relative">
          <When truthy={(data ?? 0) > 0}>
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          </When>
          <NavLink
            href="/invitations"
            className="rounded px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-primary-foreground"
            activeClassName="text-primary-foreground bg-primary"
          >
            Invitations
          </NavLink>
        </div>
      ),
    },
    {
      id: 'notifications',
      type: 'NODE',
      item: (
        <PopoverNotificationCenter
          colorScheme={theme as ColorScheme}
          onNotificationClick={(message) => {
            if (message?.cta?.data?.url) {
              router.push(message.cta.data.url)
            }
          }}
        >
          {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
        </PopoverNotificationCenter>
      ),
    },
  ]
}
