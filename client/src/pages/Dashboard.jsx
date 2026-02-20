import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Zap } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import { useAuth } from '../context/AuthContext'
import CivicScoreCard from '../components/dashboard/CivicScoreCard'
import ReliabilityMeter from '../components/dashboard/ReliabilityMeter'
import ContributionTimeline from '../components/dashboard/ContributionTimeline'
import BadgeCollection from '../components/dashboard/BadgeCollection'
import Leaderboard from '../components/dashboard/Leaderboard'
import IssueCard from '../components/common/IssueCard'
import { useIssueStore } from '../store/useIssueStore'

export default function Dashboard() {
  const { user, leaderboard, timeline, badges, fetchAllUserData, loading: userLoading } = useUserStore()
  const { issues, fetchIssues, loading: issuesLoading } = useIssueStore()
  const { user: authUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Fetch data when component mounts or user changes
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (authUser?.id) {
      // Fetch user profile, leaderboard, and badges
      fetchAllUserData()

      // Fetch issues for the user's society
      if (authUser.societyId) {
        fetchIssues(authUser.societyId)
      }
    }
  }, [authUser?.id, authUser?.societyId, isAuthenticated, fetchAllUserData, fetchIssues, navigate])

  // Show loading state
  if (userLoading || issuesLoading) {
    return (
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mb-4"></div>
            <p className="text-base-content/60">Loading your dashboard...</p>
          </div>
        </div>
      </motion.main>
    )
  }

  // Show error or redirect if not authenticated
  if (!user || !authUser) {
    return (
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center py-8">
          <p className="text-error mb-4">Unable to load dashboard</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Please log in again
          </button>
        </div>
      </motion.main>
    )
  }

  const myIssues = issues.slice(0, 3)

  return (
    <motion.main
      className="container mx-auto px-4 py-8 space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-meta text-primary">YOUR PROFILE</span>
          <h1 className="text-heading text-base-content mt-1">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => navigate('/volunteer/task_001')}
        >
          <Zap size={14} /> Pick a Task
        </button>
      </div>

      {/* Top row: Score + Reliability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <CivicScoreCard user={user} />
        </div>
        <div className="md:col-span-2">
          <ReliabilityMeter score={user.reliabilityScore} />
        </div>
      </div>

      {/* Middle row: Timeline + Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContributionTimeline timeline={timeline} />
        <Leaderboard leaderboard={leaderboard} currentUserId={user.id} />
      </div>

      {/* Badges */}
      <BadgeCollection badges={badges} earnedIds={user.badges} />

      {/* Recent Issues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">NEARBY ISSUES</span>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate('/map')}>
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {myIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => navigate('/map')} />
          ))}
        </div>
      </div>

      {/* Open tasks - Placeholder for now */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">AVAILABLE TASKS</span>
          <button className="btn btn-ghost btn-xs" onClick={() => navigate('/volunteer-task')}>
            View all →
          </button>
        </div>
        <div className="text-center py-8 text-base-content/60">
          <p>Tasks will be loaded from server</p>
        </div>
      </div>
    </motion.main>
  )
}
