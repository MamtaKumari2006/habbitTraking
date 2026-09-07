import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

const HabitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [habit, setHabit] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitRes, analyticsRes] = await Promise.all([
          API.get(`/habits/${id}`),
          API.get(`/habits/${id}/analytics`)
        ])
        setHabit(habitRes.data.habit)
        setAnalytics(analyticsRes.data.analytics)
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/dashboard")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-50">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
    )
  }

  if (!habit) return null

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          ← Back to Dashboard
        </Link>

        {/* Habit Header */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-5 rounded-full" style={{ backgroundColor: habit.color || "#4CAF50" }}></span>
            <h1 className="text-3xl font-extrabold text-slate-900">{habit.title}</h1>
          </div>
          {habit.description && (
            <p className="text-slate-500 mb-4">{habit.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="capitalize">📅 {habit.frequency}</span>
            <span>Started: {new Date(habit.startDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Current Streak</p>
              <p className="text-4xl font-extrabold text-indigo-600 mt-2">{analytics.currentStreak} 🔥</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Longest Streak</p>
              <p className="text-4xl font-extrabold text-amber-600 mt-2">{analytics.longestStreak} 🏆</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Completed Days</p>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2">{analytics.completedDays}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Completion Rate</p>
              <p className="text-4xl font-extrabold text-rose-600 mt-2">{analytics.completionRate}</p>
            </div>
          </div>
        )}

        {/* Completion History */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">📅 Completion History</h2>
          {habit.completedDates && habit.completedDates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {habit.completedDates
                .sort((a, b) => new Date(b) - new Date(a))
                .map((date, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100"
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No completions yet. Start tracking!</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default HabitDetails