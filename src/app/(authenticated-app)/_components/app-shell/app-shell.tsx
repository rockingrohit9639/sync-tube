import Image from 'next/image'
import { ROUTES } from '~/lib/routes/utils'
import { cn } from '~/lib/utils'
import NavLink from '../nav-link'

type AppShellProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function AppShell({ className, style, children }: AppShellProps) {
  return (
    <div className={cn(className)} style={style}>
      <div className="fixed left-0 top-0 h-16 w-full border-b bg-black/10 px-4 backdrop-blur-lg">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
            <div className="font-bold">SyncTube</div>
          </div>
          <div className="flex items-center gap-4">
            {ROUTES.map((route) => (
              <NavLink
                key={route.id}
                href={route.path}
                className="rounded bg-transparent px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-slate-950"
                activeClassName="text-slate-950 bg-primary"
              >
                {route.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-16 min-h-screen p-4">{children}</div>
    </div>
  )
}
