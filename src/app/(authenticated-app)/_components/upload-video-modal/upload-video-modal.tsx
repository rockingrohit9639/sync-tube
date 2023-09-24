import { zodResolver } from '@hookform/resolvers/zod'
import { SuccessResponse, UppyFile } from '@uppy/core'
import { UploadIcon } from 'lucide-react'
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
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { useToast } from '~/components/ui/use-toast'
import Upload from '~/components/upload'
import { useError } from '~/hooks/use-error'
import { useUppyUpload } from '~/hooks/use-uppy-upload'
import { trpc } from '~/lib/trpc/client'
import { uploadVideoSchema } from '~/server/routers/video/video.schema'

type UploadVideoModalProps = {
  className?: string
  style?: React.CSSProperties
  projectId: string
}

export default function UploadVideoModal({ projectId }: UploadVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { handleError } = useError()
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<z.infer<typeof uploadVideoSchema>>({
    resolver: zodResolver(uploadVideoSchema.omit({ projectId: true, fileId: true })),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      status: 'PENDING',
    },
  })

  const uploadVideoMutation = trpc.videos.uploadVideo.useMutation({
    onError: handleError,
    onSuccess: () => {
      form.reset()
      utils.videos.findProjectVideos.invalidate()
      setIsOpen(false)
      toast({
        title: 'Video uploaded successfully!',
      })
    },
  })

  const handleSubmit = useCallback(
    (_: UppyFile, response: SuccessResponse) => {
      const formValues = form.getValues()
      uploadVideoMutation.mutate({ ...formValues, url: response.uploadURL, projectId, fileId: response.body.id })
    },
    [form, projectId, uploadVideoMutation],
  )

  const { uppy } = useUppyUpload({
    onUploadComplete: handleSubmit,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button icon={<UploadIcon />}>Upload Video</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Upload a video for the project</DialogTitle>
          <DialogDescription>Approved videos will be directly uploaded to a youtube channel.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => uppy.upload())} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={uploadVideoMutation.isLoading}
                      placeholder="What is your video about?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={uploadVideoMutation.isLoading}
                      rows={5}
                      placeholder="Give details about your video, have you done any changes ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <Upload />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" loading={uploadVideoMutation.isLoading} icon={<UploadIcon />}>
              Upload
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
