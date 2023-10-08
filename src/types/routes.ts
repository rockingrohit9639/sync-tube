type BaseRoute = {
  id: string
}

type NavigationRoute = BaseRoute & {
  type: 'NAV'
  name: string
  path: string
}

type NodeRoute = BaseRoute & {
  type: 'NODE'
  item: (redirect: (path: string) => void, theme?: string) => React.ReactNode
}

export type Route = NavigationRoute | NodeRoute
