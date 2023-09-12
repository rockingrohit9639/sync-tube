'use client'

import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import Loader from '~/components/loader'
import { Button } from '~/components/ui/button'

export default function Signin() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <Loader title="Fetching session..." />
  }

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 p-8 text-white">
      <div className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-center rounded-md p-4">
        <Image className="h-28 w-28 rounded-full object-cover" width={200} height={200} src="/logo.png" alt="logo" />
        <div className="mb-4">
          Login to <span className="text-lg font-bold text-foreground">SyncTube</span>
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            className="bg-slate-800 text-gray-100 hover:bg-slate-700"
            onClick={() => {
              signIn('youtube')
            }}
          >
            Continue as Youtuber
          </Button>
          <Button
            className="bg-slate-800 text-gray-100 hover:bg-slate-700"
            onClick={() => {
              signIn('editor')
            }}
          >
            Continue as Editor
          </Button>
        </div>
      </div>
    </div>
  )
}
