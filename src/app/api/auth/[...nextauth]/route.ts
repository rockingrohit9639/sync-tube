import { DefaultSession, NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import CustomGoogleProvider from '~/lib/auth/custom-google-provider'
import { prisma } from '~/server/db'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: UserRole
    }
  }

  interface User {
    role: UserRole
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  adapter: PrismaAdapter(prisma) as any,
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
