'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Project } from '@prisma/client'
import dayjs from 'dayjs'
import { Edit } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import DatePicker from '~/components/date-picker'
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
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { useToast } from '~/components/ui/use-toast'
import { trpc } from '~/lib/trpc/client'
import { updateProjectSchema } from '~/server/routers/project/project.schema'

type UpdateProjectModalProps = {
  project: Project
}

export default function UpdateProjectModal({ project }: UpdateProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema.omit({ id: true })),
    defaultValues: {
      name: project.name,
      description: project.description ?? undefined,
      deadline: project.deadline ? dayjs(project.deadline).toDate() : undefined,
      status: project.status ?? undefined,
    },
  })

  const updateProjectMutation = trpc.projects.updateProject.useMutation({
    onSuccess: () => {
      utils.projects.findUserProjects.invalidate()

      toast({
        title: 'Project updated successfully!',
      })

      setIsOpen(false)
    },
  })

  const handleSubmit = useCallback(
    (values: Omit<z.infer<typeof updateProjectSchema>, 'id'>) => {
      updateProjectMutation.mutate({ ...values, id: project.id! })
    },
    [updateProjectMutation, project.id],
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" icon={<Edit />} className="h-full">
          Update Project
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Update project</DialogTitle>
          <DialogDescription>
            A project will keep track of your videos, raw videos and the history of editing
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={updateProjectMutation.isLoading}
                      placeholder="A title describing your project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={updateProjectMutation.isLoading}
                      rows={5}
                      placeholder="What is your project about ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select disabled={updateProjectMutation.isLoading} {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status of your project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Project Status</SelectLabel>
                          <SelectItem value="ONGOING">Ongoing</SelectItem>
                          <SelectItem value="DONE">Done</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project Deadline</FormLabel>
                  <FormControl>
                    <DatePicker disabled={updateProjectMutation.isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" loading={updateProjectMutation.isLoading}>
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
