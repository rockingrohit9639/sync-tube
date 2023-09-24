import Uppy from '@uppy/core'
import XHR from '@uppy/xhr-upload'
import { GB } from './constants'

export function initializeUppy() {
  return new Uppy({
    restrictions: {
      /** 5GB is max file size */
      maxFileSize: 5 * GB,
      /** 20MB is min file size */
      // minFileSize: 5 * MB,
      /** Upload one file at a time */
      maxNumberOfFiles: 1,
      /** Only videos uploads are allowed */
      allowedFileTypes: ['video/*'],
    },
  }).use(XHR, {
    endpoint: '/api/media',
    formData: true,
    fieldName: 'file',
  })
}
