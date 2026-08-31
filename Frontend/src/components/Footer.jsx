import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        
        {/* Left Side: Brand & Tagline */}
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 text-xs">
            ⚡
          </span>
          <span className="font-semibold text-gray-800">HabitTracker</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="hidden sm:inline text-gray-400 text-xs">Build consistency daily</span>
        </div>

        {/* Right Side: Dynamic Copyright */}
        <div className="text-center sm:text-right text-xs sm:text-sm text-gray-400">
          &copy; {currentYear} HabitTracker. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer
