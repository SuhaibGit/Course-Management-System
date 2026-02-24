'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, User, DollarSign, Loader2, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditCoursePage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        price: 0,
    })

    const { data: course, isLoading: fetching } = trpc.course.getById.useQuery(id)

    const updateMutation = trpc.course.update.useMutation({
        onSuccess: () => {
            router.push('/')
            router.refresh()
        },
    })

    const deleteMutation = trpc.course.delete.useMutation({
        onSuccess: () => {
            router.push('/')
            router.refresh()
        },
    })

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title,
                description: course.description,
                instructor: course.instructor,
                price: Number(course.price),
            })
        }
    }, [course])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateMutation.mutate({ id, ...formData })
    }

    if (fetching) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Courses</span>
                    </Link>

                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this course?')) {
                                deleteMutation.mutate(id)
                            }
                        }}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Course</span>
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-slate-800">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Edit Course</h1>
                            <p className="text-slate-400">Update your course details</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Course Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Instructor Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                value={formData.instructor}
                                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Price ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Course Description</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Update Course</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
