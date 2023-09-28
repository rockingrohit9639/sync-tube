'use client'

import { useSession } from 'next-auth/react'
import { trpc } from '~/lib/trpc/client'
import CreateProjectModal from './_components/create-project-modal'
import Project from './_components/project'
import When from '~/components/when'
import UserInfo from '~/components/user-info'

export default function Home() {
  const { data: session } = useSession()
  const { data } = trpc.projects.findUserProjects.useQuery()
  const { data: teamMembers } = trpc.users.findTeamMembers.useQuery(undefined, {
    enabled: session?.user.role === 'YOUTUBER',
  })

  if (!data) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <CreateProjectModal />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-full space-y-4 lg:col-span-2">
          <div>On-going projects ({data.length})</div>
          {data.map((project, index) => (
            <Project key={project.id} project={project} index={index} />
          ))}
        </div>
        <When truthy={session?.user?.role === 'YOUTUBER'}>
          <div className="hidden h-max rounded-md border lg:block">
            <div className="border-b p-4 text-lg">Team Members ({teamMembers?.length ?? 0})</div>
            {teamMembers?.map((member) => (
              <UserInfo
                key={member.id}
                user={member}
                className="cursor-pointer px-4 py-2 hover:bg-muted/40"
                extraContent={
                  <div className="text-muted-foreground">
                    Projects Joined - {member.projectsJoined.map((project) => project.name).join(', ')}
                  </div>
                }
              />
            ))}
          </div>
        </When>
      </div>
    </div>
  )
}
