'use client'

import { match } from 'ts-pattern'
import { range } from 'lodash'
import { trpc } from '~/lib/trpc/client'
import Invitation from './_components/invitation'
import { EmptyMessage } from '~/components/ui/empty-message'
import { ErrorMessage } from '~/components/ui/error-message'
import { Skeleton } from '~/components/ui/skeleton'

export default function Invitations() {
  const getInvitationsQuery = trpc.invitations.findReceivedInvitations.useQuery()

  return match(getInvitationsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {range(5).map((_, idx) => (
            <Skeleton key={idx} className="h-48 w-full" />
          ))}
        </div>
      )
    })
    .with({ status: 'error' }, ({ error }) => {
      return <ErrorMessage title="Could not load invitations!" description={error?.message} />
    })
    .with({ status: 'success' }, ({ data }) => {
      if (data.length === 0) {
        return <EmptyMessage title="No invitations!" description="No-one has invited you yet." />
      }

      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((invitation) => <Invitation key={invitation.id} invitation={invitation} />)}
        </div>
      )
    })
    .exhaustive()
}
