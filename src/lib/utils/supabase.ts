import { createClient } from '@supabase/supabase-js'
import { env } from './env.mjs'

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const supabaseStorageUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`

export { supabase, supabaseStorageUrl }
