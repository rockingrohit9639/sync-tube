import { match } from 'ts-pattern'
import { range } from 'lodash'
import { ErrorMessage } from '~/components/ui/error-message'
import { trpc } from '~/lib/trpc/client'
import { cn } from '~/lib/utils/utils'
import CommentInput from '../comment-input'
import Comment from '../comment'

type CommentsProps = {
  className?: string
  style?: React.CSSProperties
  videoId: string
}

export default function Comments({ className, style, videoId }: CommentsProps) {
  const findCommentsQuery = trpc.comments.findVideoComments.useQuery({ video: videoId })

  return match(findCommentsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => {
      return (
        <div className="space-y-16">
          {range(5).map((_, index) => (
            <div key={index} className="h-36 w-full animate-pulse bg-muted" />
          ))}
        </div>
      )
    })
    .with({ status: 'error' }, ({ error }) => <ErrorMessage title="Could not comments" description={error?.message} />)
    .with({ status: 'success' }, ({ data: comments }) => {
      return (
        <div className={cn(className)} style={style}>
          {comments.map((comment, index) => (
            <Comment key={comment.id} comment={comment} isFirst={index === 0} />
          ))}

          <CommentInput videoId={videoId} />
        </div>
      )
    })
    .exhaustive()
}
