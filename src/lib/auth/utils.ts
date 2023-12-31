import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '~/app/api/auth/[...nextauth]/route'

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions)
  return { session }
}

export const checkAuth = async () => {
  const { session } = await getUserAuth()
  if (!session) redirect('/signin')
}
