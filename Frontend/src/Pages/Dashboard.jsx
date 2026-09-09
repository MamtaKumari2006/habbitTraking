import React from 'react'
import { useState, useEffect } from 'react'

import API from '../api/axios'



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
    } catch (err) {
      console.error("Error creating habit:", err)
    }
  }

  const handleDelete = async (habitId) => {
    try {
      const response = await API.delete(`/habits/list/${habitId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setHabits(habits.filter((habit) => habit._id !== habitId))
    } catch (err) {
      console.error("Error deleting habit:", err)
    }
  }

  const handleComplete = async (habitId) => {
    try {
      const response = await API.post(`/habits/list/${habitId}/completed`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    } catch (err) {
      console.error("Error completing habit:", err)
    }
  }

  const completedToday = habits.some((habit) => habit.completedToday) // Check if any habit is completed today

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

  if (loading) {
    return (
      <div className="min-h-[85vh] justify-center items-center flex text-3xl font-bold text-gray-700">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-[85vh] text-gray-700">
      {/* create an habit */}
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-700">Create your first habit!</h1>
          <p className="text-lg text-gray-600">start your journey towards a better you by creating your first habit</p>

          <button onClick={() => setAddHabits(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Habit
          </button>
        </div>
      ) :
        (<div>


          {habits.map((habit) => (
            <div key={habit._id} className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">{habit.title}</h2>
              <p className="text-gray-600">{habit.description}</p>

              <button
                onClick={() => handleComplete(habit._id)}
                disabled={completedToday} // completed hone ke baad click block ho jaye
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${completedToday
                    ? "bg-emerald-500 border-emerald-500 text-white" // Clicked State (Green)
                    : "bg-white border-slate-300 hover:border-indigo-500 text-slate-400" // Normal State (White & Gray)
                  }`}
              >
                {/* Shart: Tick (SVG) tabhi dikhega jab completedToday true hoga */}
                {completedToday && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5" // Thick tick for better visibility
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>

              <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>Edit</button>


              <button
                onClick={() => handleDelete(habit._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Delete Habit
              </button>
            </div>
          ))}


        </div>
        )}

      {AddHabits && (
        <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold text-gray-700 mb-4'>Create New Habit</h2>
            <form className='' onSubmit={handleSubmit}>
              <div className=''>
                <label className='' htmlFor="title">Title </label>
                <input
                  className='border'
                  type="text"
                  id="title"
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder='eg. Read Books etc'
                />
              </div>
              <div>
                <label htmlFor="description">Description  </label>
                <input
                  className='border'
                  type="text"
                  id="description"
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder='eg. Read 30 pages daily'
                />
              </div>
              <div>
                <label htmlFor="frequency">Frequency  </label>
                <select
                  className='border'
                  id="frequency"
                  name='frequency'
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
              <div className='flex gap-4 m-2'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">save Habit</button>


                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => setAddHabits(false)}>
                  Cancel
                </button>
              </div>

            </form>


          </div>

        </div>
      )}
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-5 rounded" onClick={() => setAddHabits(true)}>
        Add Habit
      </button>

    </div>
  )
}

export default Dashboard
