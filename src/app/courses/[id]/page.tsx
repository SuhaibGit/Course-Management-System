'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, User, DollarSign, Calendar, Globe, Star, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function CourseDetailsPage() {
    const params = useParams()
    const id = params.id as string

    const { data: course, isLoading } = trpc.course.getById.useQuery(id)

    if (isLoading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    )

    if (!course) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            Course not found
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Courses</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                {course.description}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                                <Star className="text-yellow-500 w-5 h-5 mb-2" />
                                <div className="text-white font-bold">4.9/5</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Rating</div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                                <Calendar className="text-emerald-500 w-5 h-5 mb-2" />
                                <div className="text-white font-bold">{new Date(course.created_at).toLocaleDateString()}</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Created</div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                                <Globe className="text-indigo-500 w-5 h-5 mb-2" />
                                <div className="text-white font-bold">English</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Language</div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                                <ShieldCheck className="text-indigo-500 w-5 h-5 mb-2" />
                                <div className="text-white font-bold">Certified</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Access</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">About the Instructor</h2>
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex items-center space-x-6">
                                <div className="w-20 h-20 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                    <User className="text-indigo-500 w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{course.instructor}</h3>
                                    <p className="text-slate-400">Expert Instructor & Content Creator</p>
                                    <div className="flex space-x-4 mt-4 text-xs font-bold text-indigo-400">
                                        <span>24 Courses</span>
                                        <span>12k Students</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24 shadow-2xl"
                        >
                            <div className="aspect-video bg-slate-800 rounded-xl mb-8 flex items-center justify-center border border-slate-700">
                                <BookOpen className="text-slate-700 w-16 h-16" />
                            </div>

                            <div className="flex items-baseline space-x-2 mb-8">
                                <span className="text-4xl font-black text-white">${course.price}</span>
                                <span className="text-slate-500 line-through text-lg">${(Number(course.price) * 1.5).toFixed(2)}</span>
                            </div>

                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all mb-4">
                                Enroll Now
                            </button>

                            <p className="text-center text-slate-500 text-sm">
                                30-Day Money-Back Guarantee
                            </p>

                            <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                                <div className="flex items-center text-sm text-slate-300">
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">✔️</div>
                                    Full lifetime access
                                </div>
                                <div className="flex items-center text-sm text-slate-300">
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">✔️</div>
                                    Access on mobile and TV
                                </div>
                                <div className="flex items-center text-sm text-slate-300">
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">✔️</div>
                                    Certificate of completion
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
