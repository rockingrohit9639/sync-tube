import { zodResolver } from '@hookform/resolvers/zod'
import { UppyFile } from '@uppy/core'
import { UploadIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
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
import { env } from '~/lib/utils/env.mjs'
import { supabase } from '~/lib/utils/supabase'
import { uploadVideoSchema } from '~/server/routers/video/video.dto'

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
  const { data: session } = useSession()

  const uploadVideoMutation = trpc.videos.uploadVideo.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.videos.findProjectVideos.invalidate()
      setIsOpen(false)
      toast({
        title: 'Video uploaded successfully!',
      })
    },
  })

  const form = useForm<z.infer<typeof uploadVideoSchema>>({
    resolver: zodResolver(uploadVideoSchema.omit({ projectId: true })),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      status: 'PENDING',
    },
  })

  const handleSubmit = useCallback(
    (file: UppyFile) => {
      const filepath = `${session?.user.id}/${file.name}`
      try {
        const { data } = supabase.storage.from(env.NEXT_PUBLIC_SUPABASE_BUCKET).getPublicUrl(filepath)
        const formValues = form.getValues()

        uploadVideoMutation.mutate({ ...formValues, url: data.publicUrl, projectId })
      } catch (error) {
        /** Remove file from bucket */
        supabase.storage.from(env.NEXT_PUBLIC_SUPABASE_BUCKET).remove([filepath])
        toast({ title: 'Something went wrong while uploading your file!' })
      }
    },
    [form, projectId, session?.user.id, toast, uploadVideoMutation],
  )

  const { uppy } = useUppyUpload({
    onUploadComplete: handleSubmit,
  })

  const triggerFileUpload = () => {
    uppy.upload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button icon={<UploadIcon />}>Upload Video</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Upload a video for the project</DialogTitle>
          <DialogDescription>Approved videos will be directly uploaded to a youtube channel.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(triggerFileUpload)} className="space-y-4">
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
