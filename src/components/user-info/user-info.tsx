import { User } from '@prisma/client'
import Avatar from '../avatar'
import { cn } from '~/lib/utils/utils'

type UserInfoProps = {
  className?: string
  style?: React.CSSProperties
  user: User
  extraContent?: React.ReactNode
}

export default function UserInfo({ className, style, user, extraContent }: UserInfoProps) {
  return (
    <div className={cn('space-y-2', className)} style={style}>
      <div className="flex items-center gap-2">
        <Avatar src={user.image!}>{user.name?.[0]}</Avatar>
        <div>
          <div>{user.name}</div>
          <div className="truncate text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>
      <>{extraContent}</>
    </div>
  )
}
