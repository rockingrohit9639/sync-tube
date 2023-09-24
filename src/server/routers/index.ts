import { router } from '../trpc'
import { invitationRouter } from './invitation/invitation.router'
import { projectsRouter } from './project/project.router'
import { userRouter } from './user/user.router'
import { videoRouter } from './video/video.router'

export const appRouter = router({
  projects: projectsRouter,
  videos: videoRouter,
  invitations: invitationRouter,
  users: userRouter,
})

export type AppRouter = typeof appRouter
