import { UserRole } from '@prisma/client'
import { GoogleProfile } from 'next-auth/providers/google'
import { OAuthConfig } from 'next-auth/providers/oauth'

type CustomGoogleProviderOptions = {
  id: string
  name: string
  role: UserRole
  redirect_uri: string
}

export default function CustomGoogleProvider<P extends GoogleProfile>(
  options: CustomGoogleProviderOptions,
): OAuthConfig<P> {
  return {
    id: options.id,
    name: options.name,
    type: 'oauth',
    wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
    idToken: true,
    checks: ['pkce', 'state'],
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        redirect_uri: options.redirect_uri,
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code',
        scope: 'openid email profile https://www.googleapis.com/auth/youtube.upload',
      },
    },
    profile(profile: GoogleProfile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: options.role,
      }
    },
  }
}
