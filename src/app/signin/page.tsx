'use client'

import { VideoIcon, Youtube } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
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
    <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome to SyncTube</h1>
            <p className="text-sm text-muted-foreground">Streamlining Collaboration for YouTubers and Editors</p>
          </div>

          <div className="grid gap-6">
            <Button
              onClick={() => {
                signIn('youtube')
              }}
            >
              <Youtube className="mr-2 h-4 w-4" />
              Continue as Youtuber
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                signIn('editor')
              }}
            >
              <VideoIcon className="mr-2 h-4 w-4" />
              Continue as Editor
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image
          src="/login-bg.jpg"
          width={1200}
          height={600}
          alt="background"
          className="absolute inset-0 h-full w-full bg-zinc-900 object-cover opacity-60"
        />
        <div className="relative z-20 mt-auto">
          <p className="text-lg">
            SyncTube is your go-to platform for hassle-free video editing collaboration. Say goodbye to the complexity
            and streamline your workflow.
          </p>
        </div>
      </div>
    </div>
  )
}
