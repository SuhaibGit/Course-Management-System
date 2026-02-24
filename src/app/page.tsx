'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, LogOut, User, Plus, Search, ChevronLeft, ChevronRight, Edit2, Trash2, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { trpc } from '@/trpc/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEMO_COURSES = [
  {
    id: 'demo-1',
    title: 'The Complete Next.js Developer Course',
    description: 'Master Next.js 14 with App Router, Server Components, and full-stack development.',
    instructor: 'Scott Morrison',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=340&fit=crop',
  },
  {
    id: 'demo-2',
    title: 'UI/UX Design Masterclass',
    description: 'Design beautiful and accessible user interfaces with Figma, from wireframes to production.',
    instructor: 'Lena Fischer',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop',
  },
  {
    id: 'demo-3',
    title: 'Python for Data Science & AI',
    description: 'Learn Python, Pandas, NumPy, and build real machine learning models from scratch.',
    instructor: 'Priya Nair',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=340&fit=crop',
  },
  {
    id: 'demo-4',
    title: 'Full-Stack TypeScript with tRPC',
    description: 'Build end-to-end type-safe applications using TypeScript, React, and tRPC.',
    instructor: 'James Okafor',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=340&fit=crop',
  },
  {
    id: 'demo-5',
    title: 'Advanced CSS & Tailwind Animations',
    description: 'Create stunning animations and micro-interactions that wow users on every device.',
    instructor: 'Maria Costa',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=340&fit=crop',
  },
  {
    id: 'demo-6',
    title: 'Cloud Architecture with AWS',
    description: 'Deploy scalable, resilient applications on AWS using EC2, S3, Lambda, and more.',
    instructor: 'Ahmed Hassan',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop',
  },
]

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()
  const supabase = createClient()

  // Only fetch real courses when user is logged in
  const { data, isLoading, refetch } = trpc.course.list.useQuery(
    { page, limit: 6 },
    { enabled: !!user, retry: false }
  )
  const deleteMutation = trpc.course.delete.useMutation({
    onSuccess: () => refetch()
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthChecked(true)
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CourseMaster
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/courses/new"
                  className="hidden sm:flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Course</span>
                </Link>
                <div className="h-8 w-[1px] bg-slate-800" />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {user ? 'Your Courses' : 'Discover Amazing Courses'}
            </h1>
            <p className="text-slate-400 text-lg">
              {user ? 'Manage and organize your courses.' : 'Learn from the best instructors around the world.'}
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* ========== GUEST VIEW: Demo Courses ========== */}
        {!user && authChecked && (
          <>
            <div className="mb-8 bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <p className="text-indigo-300 text-sm font-medium">
                  Showing sample courses — <span className="text-white">sign up</span> to create your own!
                </p>
              </div>
              <Link href="/signup" className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all">
                Get Started
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {DEMO_COURSES.map((course) => (
                <motion.div
                  layout
                  key={course.id}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-indigo-500/5"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute top-4 right-4 bg-slate-950/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-400 border border-indigo-500/20">
                      ${course.price}
                    </div>
                    <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                      Sample
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{course.instructor}</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Preview
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* ========== LOGGED IN VIEW: Real Courses ========== */}
        {user && (
          <>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-[380px] animate-pulse" />
                  ))}
                </div>
              ) : data && data.items.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {data.items.map((course) => (
                    <motion.div
                      layout
                      key={course.id}
                      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-indigo-500/5"
                    >
                      <div className="aspect-video bg-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700 group-hover:text-slate-600 w-12 h-12 transition-all group-hover:scale-110" />
                        <div className="absolute top-4 right-4 bg-slate-950/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-400 border border-indigo-500/20">
                          ${course.price}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {course.title}
                          </h3>
                          {user?.id === course.user_id && (
                            <div className="flex space-x-2">
                              <Link href={`/courses/edit/${course.id}`} className="text-slate-500 hover:text-white transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => deleteMutation.mutate(course.id)}
                                disabled={deleteMutation.isPending}
                                className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{course.instructor}</span>
                          </div>
                          <Link
                            href={`/courses/${course.id}`}
                            className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* Empty state for logged-in users */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                    <BookOpen className="text-slate-700 w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">No courses yet</h2>
                  <p className="text-slate-400 mb-8">Create your first course to get started!</p>
                  <Link
                    href="/courses/new"
                    className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Course</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {data && data.pageCount > 1 && (
              <div className="mt-12 flex items-center justify-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: data.pageCount }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                        page === p
                          ? "bg-indigo-600 text-white"
                          : "text-slate-500 hover:text-white hover:bg-slate-900"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === data.pageCount}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Initial loading before auth check */}
        {!authChecked && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-[380px] animate-pulse" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
