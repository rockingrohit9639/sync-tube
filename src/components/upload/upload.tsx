'use client'

import { Loader } from 'lucide-react'
import { ChangeEvent, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Label } from '../ui/label'
import { Input, InputProps } from '../ui/input'
import { uploadFile } from './queries'
import { useToast } from '../ui/use-toast'

type UploadProps = Omit<InputProps, 'type' | 'onChange'> & {
  label?: string
  onUpload?: (uploadedUrl: string) => void
}

export default function Upload({ label, onUpload, ...inputProps }: UploadProps) {
  const { toast } = useToast()
  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: ({ uploadedUrl }) => {
      toast({
        title: 'File uploaded successfully!',
      })
      onUpload?.(uploadedUrl)
    },
  })

  const handleFileUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.[0]
      if (file) {
        uploadFileMutation.mutate(file)
      }
    },
    [uploadFileMutation],
  )

  return uploadFileMutation.isLoading ? (
    <div className="flex items-center justify-center gap-2 rounded-md border px-4 py-2">
      <Loader className="mr-2 h-6 w-6 animate-spin" />
      <div className="text-sm text-muted-foreground">Uploading File...</div>
    </div>
  ) : (
    <div className="grid w-full items-center gap-1.5 lg:max-w-sm">
      <Label htmlFor="uploader">{label ?? 'Upload'}</Label>
      <Input id="uploader" type="file" onChange={handleFileUpload} {...inputProps} />
    </div>
  )
}
