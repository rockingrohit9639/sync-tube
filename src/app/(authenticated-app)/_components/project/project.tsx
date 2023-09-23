import { Project as ProjectType } from '@prisma/client'
import dayjs from 'dayjs'
import Link from 'next/link'
import Tooltip from '~/components/tooltip'
import { DATE_FORMAT } from '~/lib/utils/constants'
import { ONGOING_STATUS_COLOR_MAP } from '~/lib/utils/project'
import { cn } from '~/lib/utils/utils'
import { OnGoingStatus } from '~/types/project'

type ProjectProps = {
  className?: string
  style?: React.CSSProperties
  project: ProjectType & { onGoingStatus: OnGoingStatus }
  index: number
}

export default function Project({ className, style, project, index }: ProjectProps) {
  return (
    <Link
      href={`/project/${project.id}`}
      key={project.id}
      className={cn('relative block space-y-2 rounded-md border px-4 py-2', className)}
      style={style}
    >
      {project.onGoingStatus ? (
        <Tooltip
          content={project.onGoingStatus}
          className="absolute right-4 top-2 h-3 w-3 rounded-full"
          style={{ backgroundColor: ONGOING_STATUS_COLOR_MAP[project.onGoingStatus] }}
        />
      ) : null}

      <div className="absolute right-4 top-8 text-5xl font-bold text-gray-500/20">{index + 1}</div>

      <div className="text-xl font-bold">{project.name}</div>
      <div className="text-sm text-gray-500">{project.description}</div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <div>Started On</div>
          <div>{dayjs(project.createdAt).format(DATE_FORMAT)}</div>
        </div>
        {project.deadline ? (
          <div className="flex items-center gap-2 text-sm">
            <div>Deadline</div>
            <div>{dayjs(project.createdAt).format(DATE_FORMAT)}</div>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
