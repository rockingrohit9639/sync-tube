import { SuccessResponse, UppyFile } from '@uppy/core'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import invariant from 'tiny-invariant'
import { initializeUppy } from '~/lib/utils/uppy'

const uppy = initializeUppy()

type UseUppyUploadProps = {
  onUploadComplete?: (file: UppyFile, response: SuccessResponse) => void
}

export function useUppyUpload({ onUploadComplete }: UseUppyUploadProps) {
  const { data } = useSession()

  invariant(data?.user, 'Only authenticated user can upload!')

  useEffect(
    function handleUppyEvents() {
      uppy.on('upload-success', (file, response) => {
        uppy.removeFile(file.id)

        onUploadComplete?.(file, response)
      })
    },
    [data.user.id, onUploadComplete],
  )

  return { uppy }
}
