import { DefaultSession, NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import { db } from '~/db'
import { type User as UserType } from '~/db/schema/auth'
import CustomGoogleProvider from '~/lib/auth/custom-google-provider'
import { DrizzleAdapter } from '~/db/adapter/drizzle.adapter'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: UserType['role']
    }
  }

  interface User {
    role: UserType['role']
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      }
    },
  },
  providers: [
    CustomGoogleProvider({
      id: 'youtube',
      name: 'Youtube',
      role: 'YOUTUBER',
      redirect_uri: process.env.GOOGLE_YOUTUBE_REDIRECT_URI!,
    }),
    CustomGoogleProvider({
      id: 'editor',
      name: 'Editor',
      role: 'EDITOR',
      redirect_uri: process.env.GOOGLE_EDITOR_REDIRECT_URI!,
    }),
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
