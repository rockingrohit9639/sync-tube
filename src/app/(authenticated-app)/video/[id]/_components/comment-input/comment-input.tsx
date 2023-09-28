import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import TextEditor from '~/components/text-editor'
import { Button } from '~/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'
import { cn } from '~/lib/utils/utils'
import { createCommentSchema } from '~/server/routers/comment/comment.schema'

type CommentInputProps = {
  className?: string
  style?: React.CSSProperties
  videoId: string
}

type NewCommentSchema = Omit<z.infer<typeof createCommentSchema>, 'video'>

export default function CommentInput({ className, style, videoId }: CommentInputProps) {
  const { handleError } = useError()
  const utils = trpc.useContext()

  const form = useForm<NewCommentSchema>({
    resolver: zodResolver(createCommentSchema.omit({ video: true })),
  })

  const createCommentMutation = trpc.comments.create.useMutation({
    onError: handleError,
    onSuccess: () => {
      form.setValue('content', '')
      utils.comments.findVideoComments.invalidate()
    },
  })

  const handleCreateComment = (values: NewCommentSchema) => {
    createCommentMutation.mutate({ ...values, video: videoId })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateComment)}
        className={cn('mt-4 space-y-2 border px-4 py-2', className)}
        style={style}
      >
        <div className="text-lg font-medium">Leave a comment</div>
        <div className="flex items-center">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <TextEditor className="border px-4 py-2" placeholder="Write your comment here..." {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="ghost"
            type="submit"
            icon={<Send />}
            disabled={createCommentMutation.isLoading}
            loading={createCommentMutation.isLoading}
          />
        </div>
      </form>
    </Form>
  )
}
