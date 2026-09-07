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
    <div className="min-h-[85vh] justify-center items-center flex text-3xl font-bold text-gray-700">
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
            <div key={habit._id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold text-gray-700">{habit.title}</h2>
              <p className="text-gray-600">{habit.description}</p>
            </div>
          ))}


        </div>
        )}

    </div>
  )
}

export default Dashboard
