import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Tooltip from '~/components/tooltip'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'
import { useError } from '~/hooks/use-error'
import { trpc } from '~/lib/trpc/client'
import { cn } from '~/lib/utils/utils'
import { createInvitationSchema } from '~/server/routers/invitation/invitation.schema'

type InviteMembersModalProps = {
  className?: string
  style?: React.CSSProperties
  projectId: string
}

export default function InviteMembersModal({ className, style, projectId }: InviteMembersModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { handleError } = useError()
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<z.infer<typeof createInvitationSchema>>({
    resolver: zodResolver(createInvitationSchema.omit({ project: true })),
  })

  const { data: membersToInvite } = trpc.users.findMembersToInvite.useQuery({ project: projectId })
  const inviteMemberMutation = trpc.invitations.create.useMutation({
    onError: handleError,
    onSuccess: () => {
      utils.users.findMembersToInvite.invalidate()
      form.reset()
      toast({
        title: 'Invitation sent successfully!',
      })
      setIsOpen(false)
    },
  })

  const handleCreateInvitation = (values: Omit<z.infer<typeof createInvitationSchema>, 'project'>) => {
    inviteMemberMutation.mutate({ ...values, project: projectId })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content="Invite Members">
        <DialogTrigger asChild>
          <Button variant="outline" icon={<Mail />} />
        </DialogTrigger>
      </Tooltip>
      <DialogContent className={cn('w-full max-w-screen-sm', className)} style={style}>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            Member will be added to your project and will be able to post videos in the project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateInvitation)} className="space-y-4">
            <FormField
              control={form.control}
              name="invitee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Member</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)} {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member for the project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Member</SelectLabel>
                          {membersToInvite?.map((member) => (
                            <SelectItem value={member.id} key={member.id}>
                              <div>{member.name}</div>
                              <div className="text-sm">{member.email}</div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              icon={<Send />}
              loading={inviteMemberMutation.isLoading}
              disabled={inviteMemberMutation.isLoading}
            >
              Send Invite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
