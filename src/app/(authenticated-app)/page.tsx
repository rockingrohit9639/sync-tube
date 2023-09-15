'use client'

import dayjs from 'dayjs'
import Link from 'next/link'
import { trpc } from '~/lib/trpc/client'
import CreateProjectModal from './_components/create-project-modal'
import { DATE_FORMAT } from '~/lib/utils/constants'
import Tooltip from '~/components/tooltip'
import { ONGOING_STATUS_COLOR_MAP } from '~/lib/utils/project'

export default function Home() {
  const { data } = trpc.projects.findUserProjects.useQuery()

  if (!data) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-end">
        <CreateProjectModal />
      </div>

      <div className="grid lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <div>On-going projects ({data.length})</div>
          {data.map((project, index) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="relative block space-y-2 rounded-md border px-4 py-2"
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
          ))}
        </div>
        <div className="hidden lg:block">Team Members</div>
      </div>
    </div>
  )
}
