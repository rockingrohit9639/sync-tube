import { Novu } from '@novu/node'
import { AdapterUser } from 'next-auth/adapters'
import { User } from 'next-auth'
import { AxiosError } from 'axios'
import { env } from '../utils/env.mjs'

export const novuClient = new Novu(env.NOVU_API_KEY)

export async function addNovuSubscriber(user: User | AdapterUser) {
  if (!user) return

  try {
    await novuClient.subscribers.get(user.id)
  } catch (error) {
    const _error = error as AxiosError
    if (_error?.response?.status === 404) {
      await novuClient.subscribers.identify(user.id, {
        email: user?.email!,
        avatar: user?.image!,
        firstName: user?.name!,
      })
    }
  }
}
