import { UppyFile } from '@uppy/core'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { initializeUppy } from '~/lib/utils/uppy'
import invariant from 'tiny-invariant'
import { env } from '~/lib/utils/env.mjs'
import { v4 as uuid } from 'uuid'

const uppy = initializeUppy()

export function useUppyUpload() {
  const { data } = useSession()

  invariant(data?.user, 'Only authenticated user can upload!')

  useEffect(function handleUppyEvents() {
    uppy.on('file-added', (file) => {
       /** Renaming file */
      const extension = file.type.split('/')[1] as string
      const filename = `${uuid()}.${extension}`

      /** Adding supabase metadata */
      file.meta = {
        ...file.meta,
        bucketName: env.NEXT_PUBLIC_SUPABASE_BUCKET,
        objectName: `${data.user.id}/${filename}`,
        contentType: file.type,
      }
      file.name = filename
    })

    uppy.on('upload-success', (file: UppyFile, response) => {
      console.log({ file, response })
    })
  }, [])

  return { uppy }
}
