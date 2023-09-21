import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { GB, MB } from './constants'
import { supabaseStorageUrl } from './supabase'
import { env } from './env.mjs'

export function initializeUppy() {
  return new Uppy({
    restrictions: {
      /** 5GB is max file size */
      maxFileSize: 5 * GB,
      /** 20MB is min file size */
      // minFileSize: 20 * MB,
      /** Upload one file at a time */
      maxNumberOfFiles: 1,
      /** Only videos uploads are allowed */
      allowedFileTypes: ['video/*'],
    },
  }).use(Tus, {
    endpoint: supabaseStorageUrl,
    limit: 1,
    headers: {
      authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    chunkSize: 6 * MB,
    allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
  })
}
