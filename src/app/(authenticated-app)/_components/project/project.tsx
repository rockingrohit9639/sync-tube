import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import Tooltip from '~/components/tooltip'
import UserInfo from '~/components/user-info'
import When from '~/components/when'
import { DATE_FORMAT } from '~/lib/utils/constants'
import { ONGOING_STATUS_COLOR_MAP } from '~/lib/utils/project'
import { cn } from '~/lib/utils/utils'
import { PROJECT_INCLUDE_FIELDS } from '~/server/routers/project/project.fields'
import { OnGoingStatus } from '~/types/project'

type ProjectProps = {
  className?: string
  style?: React.CSSProperties
  project: Prisma.ProjectGetPayload<{ include: typeof PROJECT_INCLUDE_FIELDS }> & { onGoingStatus: OnGoingStatus }
  index: number
}

export default async function Project({ className, style, project, index }: ProjectProps) {
  const session = await getSession()

  return (
    <Link
      href={`/project/${project.id}`}
      key={project.id}
      className={cn('relative block space-y-2 rounded-md border px-4 py-2 hover:bg-muted/40', className)}
      style={style}
    >
      <When truthy={session?.user.id !== project.adminId}>
        <UserInfo user={project.admin} className="mb-2" />
      </When>

      {project.onGoingStatus ? (
        <Tooltip
          content={project.onGoingStatus}
          className="absolute right-4 top-2 h-3 w-3 rounded-full"
          style={{ backgroundColor: ONGOING_STATUS_COLOR_MAP[project.onGoingStatus] }}
        />
      ) : null}

      <div className="absolute right-4 top-8 text-5xl font-bold text-muted-foreground">{index + 1}</div>

      <div className="text-xl font-bold">{project.name}</div>
      <div className="text-sm text-muted-foreground">{project.description}</div>
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
