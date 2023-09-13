import { router } from '../trpc'
import { projectsRouter } from './project/project.router'

export const appRouter = router({
  projects: projectsRouter,
})

export type AppRouter = typeof appRouter
