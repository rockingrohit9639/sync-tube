'use client'

import '@uppy/core/dist/style.min.css'
import '@uppy/drag-drop/dist/style.min.css'
import '@uppy/status-bar/dist/style.min.css'
import { useEffect } from 'react'
import { InputProps } from '../ui/input'
import { Dashboard } from '@uppy/react'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/file-input/dist/style.css'
import '@uppy/progress-bar/dist/style.css'

import { useUppyUpload } from '~/hooks/use-uppy-upload'

type UploadProps = Omit<InputProps, 'type' | 'onChange'> & {
  label?: string
  onUpload?: (uploadedUrl: string) => void
}

export default function Upload({ label, onUpload, ...inputProps }: UploadProps) {
  const { uppy } = useUppyUpload({})

  useEffect(function resetDashboardInnerStyle() {
    /** We have to manually reset it, as Uppy does not provide anything to override it */
    const innerDashboard = document.querySelector('.uppy-Dashboard-inner') as HTMLDivElement
    if (innerDashboard) {
      innerDashboard.style.width = '100%'
      innerDashboard.style.height = '400px'
    }
  }, [])

  return <Dashboard uppy={uppy} hideUploadButton hideProgressAfterFinish theme="dark" />
}
