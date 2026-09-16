import React, { useState, useEffect } from 'react'
import API from '../api/axios'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [AddHabits, setAddHabits] = useState(false)
  const [loading, setLoading] = useState(true)
  const [habits, setHabits] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    color: '#4caf50',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await API.post("/habits/create", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setHabits([...habits, response.data.habit])
      setAddHabits(false)
      setForm({
        title: '',
        description: '',
        frequency: 'daily',
        color: '#4caf50',
      })
    } catch (err) {
      console.error("Error creating habit:", err)
    }
  }

  const handleEditClick = (habit) => {
    setForm({
      title: habit.title,
      description: habit.description || '',
      frequency: habit.frequency || 'daily',
      color: habit.color || '#4caf50',
    })
    setEditId(habit._id)
    setIsEditing(true)
    setAddHabits(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await API.put(`/habits/list/${editId}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setHabits(habits.map((habit) =>
        habit._id === editId ? response.data.habit : habit
      ))
      setAddHabits(false)
      setIsEditing(false)
      setEditId(null)
      setForm({
        title: '',
        description: '',
        frequency: 'daily',
        color: '#4caf50',
      })
    } catch (err) {
      console.error("Error updating habit:", err)
    }
  }

  const handleDelete = async (habitId) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await API.delete(`/habits/list/${habitId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setHabits(habits.filter((habit) => habit._id !== habitId))
      setAddHabits(false)
    } catch (err) {
      console.error("Error deleting habit:", err)
    }
  }

  const handleToggle = async (habitId) => {
    const currentHabit = habits.find(habit => habit._id === habitId);
    const completeToday = isCompletedToday(currentHabit);

    const url = completeToday ? `/habits/list/${habitId}/uncompleted` :
      `/habits/list/${habitId}/completed`;

    try {
      const response = await API.post(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit._id === habitId ? response.data.habit : habit
        )
      )
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update habit");
    }
  }

  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates && habit.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };
  

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await API.get("/habits/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setHabits(response.data.habits || [])
      } catch (err) {
        console.error("Error fetching habits:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHabits()
  }, [])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get("/habits/analytics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setAnalytics(response.data.analytics || [])
      } catch (err) {
        console.error("Error fetching analytics:", err)
      }
    }

    fetchAnalytics()
  }, [])

  // Graph Data Generator Function ✅
  const getWeeklyGraphData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const data = []

    // Pichle 7 dino ke liye loop
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      d.setHours(0, 0, 0, 0)

      // Count completed habits for this specific date in database
      const count = habits.reduce((acc, habit) => {
        const isDone = habit.completedDates?.some(date => {
          const completedDate = new Date(date)
          completedDate.setHours(0, 0, 0, 0)
          return completedDate.getTime() === d.getTime()
        })
        return isDone ? acc + 1 : acc
      }, 0)

      data.push({
        day: days[d.getDay()],
        Completed: count,
      })
    }
    return data
  }

  if (loading) {
    return (
      <div className="min-h-[85vh] justify-center items-center flex text-xl font-semibold text-slate-500 bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Loading dashboard...
      </div>
    )
  }

  const completedTodayCount = habits.filter(habit => isCompletedToday(habit)).length;
  const pendingCount = habits.length - completedTodayCount;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak || 0)) : 0;

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ==================== CUTE BANNER ==================== */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 sm:p-10 text-white shadow-lg">
          <div className="relative z-10 space-y-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white">
              Consistency is Key
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hello, !
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-md">
              "Your habits define your future." Small steps every day lead to big changes.
            </p>
          </div>
          {/* Floating graphic element in banner background */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 hidden md:block select-none pointer-events-none">
            <span className="text-[120px] absolute right-10 bottom-2">🎯</span>
          </div>
        </div>

        {/* Create Habit (Empty State) */}
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-xs text-center px-6">
            <div className="w-14 h-12 rounded-2xl bg-indigo-50 text-indigo-600 text-xl font-bold flex items-center justify-center mb-4">
              ✨
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create your first habit!</h1>
            <p className="text-sm text-slate-500 max-w-sm mb-6">Start your journey towards a better you by creating your first habit.</p>

            <button
              onClick={() => setAddHabits(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
            >
              Create Habit
            </button>
          </div>
        ) : (

          /* ==================== SPLIT LAYOUT (HALF-HALF) ==================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT HALF - Habits Checklist */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Daily Checklist</h2>
                <button
                  onClick={() => setAddHabits(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs shadow-md transition duration-200 cursor-pointer"
                >
                  + Add Habit
                </button>
              </div>

              <div className="space-y-4">
                {habits.map((habit) => {
                  const completedToday = isCompletedToday(habit);

                  return (
                    <div
                      key={habit._id}
                      className={`border rounded-2xl p-5 bg-white shadow-xs hover:shadow-sm transition duration-200 relative overflow-hidden flex items-center justify-between gap-4 ${completedToday ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100"
                        }`}
                    >
                      {/* Left: Checkbox + Title Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => handleToggle(habit._id)}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${completedToday
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

                        <div>
                          <Link
                            to={`/habits/${habit._id}`} 
                            className={`text-base font-bold transition-all hover:text-indigo-600 hover:underline cursor-pointer ${completedToday ? "line-through text-slate-400" : "text-slate-800"
                              }`}
                          >
                            {habit.title}
                          </Link>
                          {habit.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{habit.description}</p>
                          )}
                          <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md mt-2 inline-block">
                            📅 {habit.frequency}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions (Edit/Delete) */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(habit)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(habit._id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT HALF - EMPTY (Tumhare graphs / analytics ke liye ready) */}




            <div className="lg:col-span-5 space-y-6">


              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Analytics & Insights</h2>

              {/* Placeholder Empty Card - Tum yahan apna graph banaogi */}
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center min-h-75 flex flex-col items-center justify-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-sm font-semibold text-slate-500">Your charts</p>
                <div className='cards bg-cyan-100 p-4 rounded-lg mt-4 grid grid-cols-2 gap-3'>
                  <div className='card bg-amber-200 p-3 rounded-lg h-1.55 flex items-center justify-center'>
                    Total Habits: {habits.length}
                  </div>
                  <div className='card bg-amber-200 p-3 rounded-lg h-1.55 flex items-center justify-center'>
                    Completed Habits: {completedTodayCount}
                  </div>
                  <div className='card bg-amber-200 p-3 rounded-lg h-1.55 flex items-center justify-center'>
                    Pending Habits: {pendingCount}
                  </div>
                  <div className='card bg-amber-200 p-3 rounded-lg h-1.55 flex items-center justify-center'>
                    Best Streak: {bestStreak}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-1">Here you will able to see your progress and insights.</p>
              </div>

              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center min-h-75 flex flex-col items-center justify-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-sm font-semibold text-slate-500">Your graph</p>
                {/* Placeholder Empty Card - Tum yahan apna graph banaogi */}
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 ...">
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm ">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-widest">
                      📈 Weekly Progress Flow
                    </h3>

                    <div className='h-50 w-full'>

                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getWeeklyGraphData()} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                          <defs>
                            {/* Gradient fill effect (Cool fade effect under the line) */}
                            <linearGradient id="dashboardColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>

                          {/* X-Axis (Days: Mon, Tue) & Y-Axis (Count: 1, 2) */}
                          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />

                          {/* Hover Tooltip (Black floating box on hover) */}
                          <Tooltip cursor={false} contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />

                          {/* The Actual Area Line */}
                          <Area type="monotone" dataKey="Completed" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#dashboardColor)" />
                        </AreaChart>
                      </ResponsiveContainer>

                    </div>
                  </div>
                </div>


                <p className="text-xs text-slate-400 mt-1">Here you will able to see your progress and insights.</p>
              </div>

            </div>

          </div>
        )}

        {/* ==================== CREATE & EDIT POPUP MODAL ==================== */}
        {AddHabits && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100">

              <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {isEditing ? "Edit Habit" : "Create New Habit"}
              </h2>

              <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-5 text-sm font-medium">
                {/* Title Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition"
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Read Books"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="description">
                    Description
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition"
                    type="text"
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Read 30 pages daily"
                  />
                </div>

                {/* Frequency Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="frequency">
                    Frequency
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white transition"
                    id="frequency"
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition duration-200 cursor-pointer text-sm"
                    type="submit"
                  >
                    {isEditing ? "Save Changes" : "Save Habit"}
                  </button>

                  <button
                    type="button"
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition duration-200 cursor-pointer text-sm"
                    onClick={() => {
                      setAddHabits(false)
                      setIsEditing(false)
                      setEditId(null)
                      setForm({ title: '', description: '', frequency: 'daily', color: '#4caf50' })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard