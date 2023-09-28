'use client'

import { useParams } from 'next/navigation'
import { match } from 'ts-pattern'
import { Button } from '~/components/ui/button'
import { ErrorMessage } from '~/components/ui/error-message'
import { trpc } from '~/lib/trpc/client'
import { formatEnum } from '~/lib/utils/format'
import { VIDEO_STATUS_COLOR_MAP } from '~/lib/utils/video'
import UpdateVideoStatus from '../../_components/update-video-status'
import { Separator } from '~/components/ui/separator'

export default function VideDetails() {
  const { id } = useParams() as { id: string }
  const videoDetailsQuery = trpc.videos.findOneById.useQuery({ id }, { enabled: !!id })

  return match(videoDetailsQuery)
    .with({ status: 'loading' }, () => (
      <div className="w-full">
        <div className="w-full animate-pulse bg-muted-foreground" />
        <div className="w-1/2 animate-pulse bg-muted-foreground" />
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div>
        <ErrorMessage title="Could not load video details!" description={error?.message} />
      </div>
    ))
    .with({ status: 'success' }, ({ data: video }) => {
      const statusColor = VIDEO_STATUS_COLOR_MAP[video.status]

      return (
        <div>
          <div className="flex flex-col justify-between gap-4 lg:flex-row">
            <div>
              <div className="text-2xl font-bold">{video.title}</div>
              <div className="text-muted-foreground">{video.description}</div>
              <div className="text-muted-foreground">Uploaded By - {video.uploadedBy.name}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                color={statusColor}
                style={{ borderColor: statusColor, color: statusColor }}
                className="flex-grow opacity-50"
              >
                {formatEnum(video.status)}
              </Button>
              <UpdateVideoStatus video={video} />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="border">
            {/* Video Player */}
            <div className="flex h-96 items-center justify-center">Video box</div>
          </div>
        </div>
      )
    })
    .exhaustive()
}
