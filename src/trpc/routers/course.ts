import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'

export const courseRouter = router({
    list: publicProcedure
        .input(
            z.object({
                page: z.number().min(1).default(1),
                limit: z.number().min(1).max(100).default(10),
            })
        )
        .query(async ({ ctx, input }) => {
            const from = (input.page - 1) * input.limit
            const to = from + input.limit - 1

            const { data, count, error } = await ctx.supabase
                .from('courses')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to)

            if (error) throw error

            return {
                items: data || [],
                total: count || 0,
                pageCount: Math.ceil((count || 0) / input.limit),
            }
        }),

    getById: publicProcedure
        .input(z.string().uuid())
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('courses')
                .select('*')
                .eq('id', input)
                .single()

            if (error) throw error
            return data
        }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                instructor: z.string().min(1),
                price: z.number().min(0),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('courses')
                .insert({
                    ...input,
                    user_id: ctx.user.id,
                })
                .select()
                .single()

            if (error) throw error
            return data
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
                instructor: z.string().min(1).optional(),
                price: z.number().min(0).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updates } = input
            const { data, error } = await ctx.supabase
                .from('courses')
                .update(updates)
                .eq('id', id)
                .eq('user_id', ctx.user.id) // Ensure ownership
                .select()
                .single()

            if (error) throw error
            return data
        }),

    delete: protectedProcedure
        .input(z.string().uuid())
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from('courses')
                .delete()
                .eq('id', input)
                .eq('user_id', ctx.user.id) // Ensure ownership

            if (error) throw error
            return { success: true }
        }),
})
