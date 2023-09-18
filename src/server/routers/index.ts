import { router } from '../trpc'
import { projectsRouter } from './project/project.router'
import { videoRouter } from './video/video.router'

export const appRouter = router({
  projects: projectsRouter,
  videos: videoRouter,
})

export type AppRouter = typeof appRouter
