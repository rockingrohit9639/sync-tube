import { TRPCClientErrorLike } from '@trpc/client'
import { useCallback } from 'react'
import { useToast } from '~/components/ui/use-toast'

export function useError() {
  const { toast } = useToast()

  const handleError = useCallback(
    (error: TRPCClientErrorLike<any>) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      })
    },
    [toast],
  )

  return { handleError }
}
