import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully!', {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <nav className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6 lg:px-12">
        
        {/* Left Side: Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-extrabold text-indigo-600 hover:opacity-90 transition"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 text-base">
            ⚡
          </span>
          HabitTracker
        </Link>

        {/* Right Side: Navigation Links / Auth Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {token ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-indigo-600 font-semibold text-sm sm:text-base transition"
              >
                Dashboard
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm rounded-xl transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-indigo-600 font-semibold text-sm sm:text-base transition"
              >
                Login
              </Link>
              
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </nav>
    </header>
  )
}

export default Navbar
