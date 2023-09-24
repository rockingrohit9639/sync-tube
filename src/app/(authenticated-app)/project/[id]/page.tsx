'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'
import UpdateProjectModal from '../../_components/update-project-modal'
import UploadVideoModal from '../../_components/upload-video-modal'
import Video from '../../_components/video/video'
import InviteMembersModal from '../../_components/invite-members-modal'

export default function ProjectDetails() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { handleError } = useError()
  const { data: session } = useSession()

  const { data: project } = trpc.projects.findProjectById.useQuery({ id })
  const { data: videos } = trpc.videos.findProjectVideos.useQuery({ id })

  const archiveProjectMutation = trpc.projects.archiveProject.useMutation({
    onSuccess: () => {
      router.replace('/')
    },
  })

  const deleteProjectMutation = trpc.projects.deleteProject.useMutation({
    onError: handleError,
    onSuccess: () => {
      router.replace('/')
    },
  })

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
        <div className="flex items-center gap-2">
          {session?.user.id === project.adminId ? (
            <>
              <UpdateProjectModal project={project} />
              <InviteMembersModal projectId={project.id} />
            </>
          ) : null}
          <UploadVideoModal projectId={project.id} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="min-h-[60vh] space-y-4">
        <div className="mb-2">Total Uploaded Videos ({videos?.length ?? 0})</div>
        {videos?.map((video) => <Video key={video.id} video={video} />)}
      </div>

      <Separator className="my-4" />
      <div className="space-y-4 rounded-md bg-red-950/20 p-4">
        <div className="text-2xl font-bold text-red-500">Danger Zone</div>

        <div className="flex items-center justify-between gap-2 rounded-md border px-4 py-2">
          <div>
            <div className="text-lg font-medium">Archive Project</div>
            <div className="text-gray-500">
              Project will not be permanently deleted, it will be hidden from your profile but you can view them under
              your archived projects section.
            </div>
          </div>
          <Button
            variant="destructive"
            loading={archiveProjectMutation.isLoading}
            disabled={archiveProjectMutation.isLoading}
            onClick={() => {
              archiveProjectMutation.mutate({ id: project.id })
            }}
          >
            Archive
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-md border px-4 py-2">
          <div>
            <div className="text-lg font-medium">Delete Project</div>
            <div className="text-gray-500">
              Project and its related videos will be permanently deleted from your account. This action can not be
              reverted!
            </div>
          </div>
          <Button
            variant="destructive"
            loading={deleteProjectMutation.isLoading}
            disabled={deleteProjectMutation.isLoading}
            onClick={() => {
              deleteProjectMutation.mutate({ id: project.id })
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
