import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

const SingleHabit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [habit, setHabit] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  
  const isCompletedToday = (h) => {
    if (!h) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return h.completedDates && h.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  
  const handleToggle = async () => {
    const completeToday = isCompletedToday(habit);
    const url = completeToday 
      ? `/habits/list/${id}/uncompleted` 
      : `/habits/list/${id}/completed`;

    try {
      const response = await API.post(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      
      setHabit(response.data.habit)

      
      const analyticsRes = await API.get(`/habits/list/${id}/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      setAnalytics(analyticsRes.data.analytics)

    } catch (err) {
      alert(err.response?.data?.message || "Failed to update habit");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitRes, analyticsRes] = await Promise.all([
          API.get(`/habits/list/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }),
          API.get(`/habits/list/${id}/analytics`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
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

  
  const completedToday = isCompletedToday(habit);

  const completionPercentage = parseInt(analytics?.completionRate) || 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius; 
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const getGitHubHeatmapData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const totalDays = 365

    const startDate = new Date()
    startDate.setDate(today.getDate() - totalDays)
    const startDayOffset = startDate.getDay()
    startDate.setDate(startDate.getDate() - startDayOffset)

    const days = []
    const months = []
    let prevMonth = -1

    const diffTime = Math.abs(today - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      currentDate.setHours(0, 0, 0, 0)

      const isDone = habit.completedDates?.some(date => {
        const completedD = new Date(date)
        completedD.setHours(0, 0, 0, 0) 
        return completedD.toDateString() === currentDate.toDateString() 
      })

      const monthIndex = currentDate.getMonth()
      const dayOfWeek = currentDate.getDay()
      const weekIndex = Math.floor(i / 7)

      if (monthIndex !== prevMonth && dayOfWeek === 0) {
        months.push({
          name: currentDate.toLocaleString('default', { month: 'short' }),
          colIndex: weekIndex
        })
        prevMonth = monthIndex
      }

      days.push({
        date: currentDate,
        isCompleted: isDone
      })
    }

    return { days, months }
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 lg:px-12 overflow-y-auto no-scrollbar">
      <div className="max-w-3xl mx-auto space-y-6 overflow-y-auto no-scrollbar">

        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold h-9 rounded-3xl p-2 bg-indigo-500 text-black hover:text-indigo-600 transition "
        >
          ← Back to Dashboard
        </Link>

        {/* Circular Progress Ring Card (Consistency) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Consistency</p>

          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-indigo-600 transition-all duration-500 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-slate-800">{analytics.completionRate}</span>
            </div>
          </div>
        </div>

        {/* Habit Header with Toggle */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleToggle}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
                completedToday
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-slate-200 hover:border-indigo-500 text-slate-400"
              }`}
            >
              {completedToday && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>
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
              <p className="text-xs font-semibold text-slate-500 uppercase">Total days</p>
              <p className="text-4xl font-extrabold text-rose-600 mt-2">{analytics.totalDays}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase">Completed Days</p>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2">{analytics.completedDays}</p>
            </div>
          </div>
        )}

        {/* Consistency Heatmap */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">📅 Consistency Heatmap</h2>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200"></div>
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600"></div>
              <span>More</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 select-none scrollbar-thin">
            <div className="grid grid-rows-7 gap-0.75 text-[9px] font-bold text-slate-400 uppercase pt-6 pr-1 h-23.75">
              <span>Sun</span>
              <span></span>
              <span>Tue</span>
              <span></span>
              <span>Thu</span>
              <span></span>
              <span>Sat</span>
            </div>

            <div className="flex flex-col gap-1 relative">
              <div className="relative h-4 text-[9px] font-bold text-slate-400 uppercase w-full">
                {getGitHubHeatmapData().months.map((month, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${month.colIndex * 13.5}px` }}
                  >
                    {month.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-rows-7 grid-flow-col gap-0.75 h-23.75">
                {getGitHubHeatmapData().days.map((day, index) => (
                  <div
                    key={index}
                    title={`${day.date.toDateString()} : ${day.isCompleted ? 'Completed! 🎉' : 'Not completed ⏳'}`}
                    className={`w-2.5 h-2.5 rounded-xs transition-all duration-300 border ${
                      day.isCompleted
                        ? "bg-emerald-500 border-emerald-600 shadow-[0_1px_2px_rgba(16,185,129,0.2)]"
                        : "bg-slate-100 border-slate-200/40 hover:border-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SingleHabit