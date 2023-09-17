'use client'

import Link from 'next/link'
import { trpc } from '~/lib/trpc/client'
import CreateProjectModal from './_components/create-project-modal'
import Project from './_components/project'

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

      <Link href="/upload">Move</Link>

      <div className="grid lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <div>On-going projects ({data.length})</div>
          {data.map((project, index) => (
            <Project key={project.id} project={project} index={index} />
          ))}
        </div>
        <div className="hidden lg:block">Team Members</div>
      </div>
    </div>
  )
}
