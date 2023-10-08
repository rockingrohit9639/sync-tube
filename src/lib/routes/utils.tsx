import { ColorScheme, NotificationBell, PopoverNotificationCenter } from '@novu/notification-center'
import { Route } from '~/types/routes'

export const ROUTES: Route[] = [
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
    name: 'Invitations',
    path: '/invitations',
    type: 'NAV',
  },
  {
    id: 'notifications',
    type: 'NODE',
    item: (redirect, theme) => (
      <PopoverNotificationCenter
        colorScheme={theme as ColorScheme}
        onNotificationClick={(message) => {
          if (message?.cta?.data?.url) {
            redirect(message.cta.data.url)
          }
        }}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    ),
  },
]
