import { useCallback } from 'react'
import Alert from '~/components/alert'
import { useToast } from '~/components/ui/use-toast'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'

type DeleteVideoProps = {
  className?: string
  style?: React.CSSProperties
  id: string
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function DeleteVideo({ className, style, id, trigger }: DeleteVideoProps) {
  const { handleError } = useError()
  const utils = trpc.useContext()
  const { toast } = useToast()

  const deleteVideoMutation = trpc.videos.deleteVideo.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.videos.findProjectVideos.invalidate()
      toast({ title: 'Video deleted successfully!' })
    },
  })

  const handleDelete = useCallback(() => {
    deleteVideoMutation.mutate({ id })
  }, [])

  return (
    <Alert
      className={className}
      style={style}
      trigger={trigger}
      title="Are you sure you want to delete this video?"
      description="This video will be deleted permanently!"
      okText="Yes, Delete"
      cancelText="No, Don't delete"
      onOk={handleDelete}
    />
  )
}
