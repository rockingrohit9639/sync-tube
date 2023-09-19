import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { Edit, Trash, View } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Tooltip from '~/components/tooltip'
import { Button } from '~/components/ui/button'
import { DATE_FORMAT } from '~/lib/utils/constants'
import { formatEnum } from '~/lib/utils/format'
import { cn } from '~/lib/utils/utils'
import { VIDEO_STATUS_COLOR_MAP } from '~/lib/utils/video'

type VideoProps = {
  className?: string
  style?: React.CSSProperties
  video: Prisma.VideoGetPayload<{ include: { uploadedBy: true } }>
}

export default function Video({ className, style, video }: VideoProps) {
  const { data: session } = useSession()
  const statusColor = VIDEO_STATUS_COLOR_MAP[video.status]
  const router = useRouter()

  return (
    <div className={cn('grid gap-4 rounded border p-4 lg:grid-cols-3', className)} style={style}>
      <div className="col-span-2">
        <div className="text-xl font-bold">{video.title}</div>
        <div className="text-gray-500">{video.description}</div>

        <div className="text-sm">Uploaded On - {dayjs(video.uploadedAt).format(DATE_FORMAT)}</div>
        <div className="text-sm text-gray-500">
          {session?.user.id === video.uploadedById ? 'You' : video.uploadedBy.name} uploaded this video.
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          icon={<View />}
          onClick={() => {
            router.push(`/video/${video.id}`)
          }}
        >
          View
        </Button>
        <Button variant="outline" icon={<Edit />}>
          Edit
        </Button>
        <Button variant="destructive-outline" icon={<Trash />}>
          Delete
        </Button>
        <div
          className="w-min rounded border px-2 py-1 text-center text-sm opacity-50"
          style={{ borderColor: statusColor, color: statusColor }}
        >
          {formatEnum(video.status)}
        </div>
      </div>
    </div>
  )
}
