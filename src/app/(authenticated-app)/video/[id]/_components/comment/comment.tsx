import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UserInfo from '~/components/user-info'
import { cn } from '~/lib/utils/utils'
import { COMMENT_INCLUDE_FIELDS } from '~/server/routers/comment/comment.fields'

dayjs.extend(relativeTime)

type CommentProps = {
  className?: string
  style?: React.CSSProperties
  comment: Prisma.CommentGetPayload<{ include: typeof COMMENT_INCLUDE_FIELDS }>
  isFirst?: boolean
}

export default function Comment({ className, style, comment }: CommentProps) {
  return (
    <div className={cn(className)} style={style}>
      <div className="top-0 h-16 w-[1px] translate-x-14 bg-border" />

      <div className="space-y-2 border px-8 py-2">
        <UserInfo user={comment.createdBy} />
        <div dangerouslySetInnerHTML={{ __html: comment.content }} />

        <div className="text-sm text-muted-foreground">{dayjs(comment.createdAt).fromNow()}</div>
      </div>
    </div>
  )
}
