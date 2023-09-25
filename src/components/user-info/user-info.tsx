import { User } from '@prisma/client'
import Avatar from '../avatar'
import { cn } from '~/lib/utils/utils'

type UserInfoProps = {
  className?: string
  style?: React.CSSProperties
  user: User
}

export default function UserInfo({ className, style, user }: UserInfoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} style={style}>
      <Avatar src={user.image!}>{user.name?.[0]}</Avatar>
      <div>
        <div>{user.name}</div>
        <div className="text-sm text-slate-500">{user.email}</div>
      </div>
    </div>
  )
}
