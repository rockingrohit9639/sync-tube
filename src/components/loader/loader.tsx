import { Loader as LoadingIcon } from 'lucide-react'
import { cn } from '~/lib/utils/utils'

type LoaderProps = {
  className?: string
  style?: React.CSSProperties
  title?: string
}

export default function Loader({ className, style, title }: LoaderProps) {
  return (
    <div className={cn('fixed inset-0 z-50 flex h-screen w-full items-center justify-center', className)} style={style}>
      <LoadingIcon className="mr-2 h-6 w-6 animate-spin" />
      <span className="text-sm text-muted-foreground">{title ?? 'Loading...'}</span>
    </div>
  )
}
