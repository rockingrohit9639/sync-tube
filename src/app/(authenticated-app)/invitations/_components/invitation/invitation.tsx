import { Prisma } from '@prisma/client'
import Avatar from '~/components/avatar'
import { Button } from '~/components/ui/button'
import { useToast } from '~/components/ui/use-toast'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'
import { cn } from '~/lib/utils/utils'
import { INVITATION_INCLUDE_FIELDS } from '~/server/routers/invitation/invitation.fields'

type InvitationProps = {
  className?: string
  style?: React.CSSProperties
  invitation: Prisma.InvitationGetPayload<{ include: typeof INVITATION_INCLUDE_FIELDS }>
}

export default function Invitation({ className, style, invitation }: InvitationProps) {
  const { handleError } = useError()
  const { toast } = useToast()
  const utils = trpc.useContext()

  const acceptInvitationMutation = trpc.invitations.accept.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.invitations.findReceivedInvitations.invalidate()
      toast({ title: 'Invitation accepted successfully!', description: 'Now you can start working on the project!' })
    },
  })

  const rejectInvitationMutation = trpc.invitations.reject.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.invitations.findReceivedInvitations.invalidate()
      toast({ title: 'Invitation rejected successfully!' })
    },
  })

  return (
    <div className={cn('space-y-4 rounded-md border p-4 hover:border-white/50', className)} style={style}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar src={invitation.inviter.image!}>{invitation.inviter.name?.[0]}</Avatar>
          <div>
            <div className="text-lg font-bold">{invitation.inviter.name}</div>
            <div className="text-sm text-slate-500">{invitation.inviter.email}</div>
          </div>
        </div>
        invited you to work on the project &lsquo;
        <span className="text-lg font-bold">{invitation.project.name}</span>&rsquo;
      </div>

      <div className="flex items-center gap-4">
        <Button
          className="bg-green-500 text-white hover:bg-green-700"
          loading={acceptInvitationMutation.isLoading}
          disabled={acceptInvitationMutation.isLoading}
          onClick={() => {
            acceptInvitationMutation.mutate({ invitation: invitation.id })
          }}
        >
          Accept
        </Button>
        <Button
          variant="destructive-outline"
          loading={rejectInvitationMutation.isLoading}
          disabled={rejectInvitationMutation.isLoading}
          onClick={() => {
            rejectInvitationMutation.mutate({ invitation: invitation.id })
          }}
        >
          Reject
        </Button>
      </div>
    </div>
  )
}
