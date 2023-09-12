import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'

type AvatarProps = {
  children?: React.ReactNode
  src?: string | null
}

export default function Avatar({ src, children }: AvatarProps) {
  return (
    <ShadAvatar>
      <AvatarImage src={src} />
      <AvatarFallback>{children ?? 'ST'}</AvatarFallback>
    </ShadAvatar>
  )
}
