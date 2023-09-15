'use client'

import { useParams } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { trpc } from '~/lib/trpc/client'

export default function ProjectDetails() {
  const { id } = useParams()
  const { data: project } = trpc.projects.findProjectById.useQuery({ id: Number(id) })

  if (!project) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{project.name}</div>
          <div className="text-gray-500">{project.description}</div>
        </div>
        <div />
      </div>

      <Separator className="my-4" />

      <div className="flex min-h-screen items-center justify-center">Work in progress</div>

      <div className="space-y-4 rounded-md bg-red-950/20 p-4">
        <div className="text-2xl font-bold text-red-500">Danger Zone</div>

        <div className="flex items-center justify-between rounded-md border px-4 py-2">
          <div>
            <div className="text-lg font-medium">Archive Project</div>
            <div className="text-gray-500">
              Project will not be permanently deleted, it will be hidden from your profile but you can view them under
              your archived projects section.
            </div>
          </div>
          <Button variant="destructive">Archive</Button>
        </div>

        <div className="flex items-center justify-between rounded-md border px-4 py-2">
          <div>
            <div className="text-lg font-medium">Delete Project</div>
            <div className="text-gray-500">
              Project and its related videos will be permanently deleted from your account. This action can not be
              reverted!
            </div>
          </div>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  )
}
