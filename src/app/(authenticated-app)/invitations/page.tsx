'use client'

import { trpc } from '~/lib/trpc/client'
import Invitation from './_components/invitation'

export default function Invitations() {
  const { data } = trpc.invitations.findReceivedInvitations.useQuery()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((invitation) => <Invitation key={invitation.id} invitation={invitation} />)}
    </div>
  )
}
