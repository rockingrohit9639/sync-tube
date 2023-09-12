'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

type NavLinkProps = LinkProps & {
  className?: string
  children: React.ReactNode
  activeClassName?: string
}

export default function NavLink({ className, children, activeClassName, ...restProps }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === restProps.href

  return (
    <Link className={cn(className, isActive && activeClassName)} {...restProps}>
      {children}
    </Link>
  )
}
