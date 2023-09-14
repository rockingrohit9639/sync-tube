'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { createProjectSchema } from '~/server/routers/project/project.schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import DatePicker from '~/components/date-picker'
import { trpc } from '~/lib/trpc/client'
import { useToast } from '~/components/ui/use-toast'

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      status: 'ONGOING',
    },
  })

  const createProjectMutation = trpc.projects.createProject.useMutation({
    onSuccess: (data) => {
      form.reset()

      toast({
        title: 'Project created successfully!',
        description: `${data.name} is created successfully, you can view it in your dashboard if it not archived.`,
      })

      setIsOpen(false)
    },
  })

  const isArchived = form.watch('isArchived')

  const handleSubmit = useCallback(
    (values: z.infer<typeof createProjectSchema>) => {
      createProjectMutation.mutate(values)
    },
    [createProjectMutation],
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
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
                      disabled={createProjectMutation.isLoading}
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
                      disabled={createProjectMutation.isLoading}
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
                    <Select disabled={createProjectMutation.isLoading} {...field}>
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
                    <DatePicker disabled={createProjectMutation.isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="items-top flex space-x-2">
                      <Checkbox
                        disabled={createProjectMutation.isLoading}
                        onCheckedChange={(state) => {
                          if (!state) {
                            form.setValue('archivedOn', undefined)
                          }
                          field.onChange(state)
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Is this project archived?
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Archived projects will not be visible on your dashboard but will be available to view anytime
                          on your profile.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isArchived ? (
              <FormField
                control={form.control}
                name="archivedOn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Archived On</FormLabel>
                    <FormControl>
                      <DatePicker disabled={createProjectMutation.isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <Button type="submit" loading={createProjectMutation.isLoading}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
