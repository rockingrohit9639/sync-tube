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
  item: React.ReactNode
}

export type Route = NavigationRoute | NodeRoute
