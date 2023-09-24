import { zodResolver } from '@hookform/resolvers/zod'
import { Prisma, VideoStatus } from '@prisma/client'
import { Edit } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'
import { formatEnum } from '~/lib/utils/format'
import { cn } from '~/lib/utils/utils'
import { updateVideoStatusSchema } from '~/server/routers/video/video.schema'
import { VIDEO_INCLUDE_FIELDS } from '~/server/routers/video/video.fields'

type UpdateVideoStatusProps = {
  className?: string
  style?: React.CSSProperties
  video: Prisma.VideoGetPayload<{ include: typeof VIDEO_INCLUDE_FIELDS }>
}

export default function UpdateVideoStatus({ className, style, video }: UpdateVideoStatusProps) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = trpc.useContext()
  const { handleError } = useError()
  const { toast } = useToast()

  const updateStatusMutation = trpc.videos.updateVideoStatus.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.videos.findProjectVideos.invalidate()
      toast({ title: 'Video status updated successfully!' })
      setIsOpen(false)
    },
  })

  const form = useForm<z.infer<typeof updateVideoStatusSchema>>({
    resolver: zodResolver(updateVideoStatusSchema.omit({ videoId: true })),
  })

  const handleSubmit = useCallback(
    (values: Omit<z.infer<typeof updateVideoStatusSchema>, 'videoId'>) => {
      updateStatusMutation.mutate({ ...values, videoId: video.id })
    },
    [updateStatusMutation, video.id],
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" icon={<Edit />}>
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className={cn('w-full max-w-screen-sm', className)} style={style}>
        <DialogHeader>
          <DialogTitle>Update video status for {video.title}</DialogTitle>
          <DialogDescription>
            Updating the video status to `APPROVED` will trigger the video to upload on your youtube channel
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      disabled={updateStatusMutation.isLoading}
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                      {...field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status of your project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Project Status</SelectLabel>
                          {Object.values(VideoStatus).map((videoStatus) => (
                            <SelectItem value={videoStatus} key={videoStatus}>
                              {formatEnum(videoStatus)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" loading={updateStatusMutation.isLoading} icon={<Edit />}>
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
