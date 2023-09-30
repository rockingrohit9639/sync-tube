import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MoreVertical, Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Dropdown from '~/components/dropdown'
import { useToast } from '~/components/ui/use-toast'
import UserInfo from '~/components/user-info'
import When from '~/components/when'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'
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
  const { handleError } = useError()
  const utils = trpc.useContext()
  const { toast } = useToast()
  const { data: session } = useSession()

  const removeCommentMutation = trpc.comments.remove.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.comments.findVideoComments.invalidate()
      toast({ title: 'Comment removed successfully!' })
    },
  })

  return (
    <div className={cn(className)} style={style}>
      <div className="top-0 h-16 w-[1px] translate-x-14 bg-border" />

      <div className="space-y-2 border px-8 py-2">
        <div className="flex justify-between py-2">
          <UserInfo user={comment.createdBy} />
          <When truthy={comment.createdById === session?.user.id}>
            <Dropdown
              items={[
                {
                  id: 'delete-comment',
                  label: 'Remove Comment',
                  icon: <Trash />,
                  onClick: () => {
                    removeCommentMutation.mutate({ id: comment.id })
                  },
                },
              ]}
            >
              <MoreVertical className="cursor-pointer opacity-50 hover:opacity-100" />
            </Dropdown>
          </When>
        </div>

        <div dangerouslySetInnerHTML={{ __html: comment.content }} />

        <div className="text-sm text-muted-foreground">{dayjs(comment.createdAt).fromNow()}</div>
      </div>
    </div>
  )
}
