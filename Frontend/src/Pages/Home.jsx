import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    
    <div className="min-h-[85vh] bg-linear-to-br from-indigo-200 via-white to-amber-50 flex items-center px-6 lg:px-16 py-12 overflow-hidden overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        
        
        <div className="flex flex-col space-y-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Change your habits, <br />
            <span className="text-indigo-600">change your life.</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md leading-relaxed mx-auto md:mx-0">
            Track your daily habits, monitor consistency streaks, and build better routines with our beautifully simple tracker.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
            >
              Get Started (Free)
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 text-base font-semibold rounded-xl shadow border border-gray-200 transition duration-300 text-center"
            >
              Login
            </Link>
          </div>
        </div>

        
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-102 transition duration-500">
            <img
              className="w-full h-full object-cover"
              src="https://i.pinimg.com/736x/c3/bf/02/c3bf021ff503e4614eaa15a61c5911f4.jpg"  
              alt="Habit tracking illustration"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home