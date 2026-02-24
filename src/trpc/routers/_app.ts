import { router } from '../trpc'
import { courseRouter } from './course'

export const appRouter = router({
    course: courseRouter,
})

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>

import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
