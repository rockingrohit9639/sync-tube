import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_YOUTUBE_REDIRECT_URI: z.string().url(),
    GOOGLE_EDITOR_REDIRECT_URI: z.string().url(),
    UPLOAD_DIR: z.string(),
    NOVU_API_KEY: z.string(),
    NOVU_APPLICATION_ID: z.string(),
    NOVU_ENV_ID: z.string(),
    NOVU_WORKFLOW_ID: z.string(),
  },
  client: {
    // NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    // NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    // NEXT_PUBLIC_SUPABASE_BUCKET: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_YOUTUBE_REDIRECT_URI: process.env.GOOGLE_YOUTUBE_REDIRECT_URI,
    GOOGLE_EDITOR_REDIRECT_URI: process.env.GOOGLE_EDITOR_REDIRECT_URI,
    // NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    // NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // NEXT_PUBLIC_SUPABASE_BUCKET: process.env.NEXT_PUBLIC_SUPABASE_BUCKET,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    NOVU_API_KEY: process.env.NOVU_API_KEY,
    NOVU_APPLICATION_ID: process.env.NOVU_APPLICATION_ID,
    NOVU_ENV_ID: process.env.NOVU_ENV_ID,
    NOVU_WORKFLOW_ID: process.env.NOVU_WORKFLOW_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
