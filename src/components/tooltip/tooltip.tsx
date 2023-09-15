import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

type TooltipProps = {
  children?: React.ReactNode
  content: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Tooltip({ children, content, className, style }: TooltipProps) {
  return (
    <TooltipProvider>
      <ShadTooltip>
        <TooltipTrigger className={className} style={style}>
          {children}
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </ShadTooltip>
    </TooltipProvider>
  )
}
