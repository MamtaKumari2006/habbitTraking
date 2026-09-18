import React, { useState, useEffect } from 'react' // 1. useEffect import kiya ✅
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await API.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false)
    }
  }
  return (
    
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 overflow-hidden overflow-y-auto no-scrollbar">

      
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-slate-50">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Log in to your account and continue building your streak.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="ABC@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-xs"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer Redirect */}
          <div className="text-center lg:text-left text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
            >
              Create one for free
            </Link>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: Beautiful Rounded Floating Image Card (With deep Slate overlay) */}
      <div className="hidden lg:block relative m-4 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1713788833251-3a5165de100b?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&w=4800"
          alt="Serene study desk"
        />
        {/* Deep Slate/Indigo dark overlay to make text pop */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Dynamic Text Badge */}
        <div className="absolute bottom-16 left-16 right-16 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">
            Today is a fresh start
          </p>
          <h3 className="text-3xl font-extrabold leading-tight text-white/95">
            "Your habits will determine your future."
          </h3>
          <p className="text-xs text-slate-400 mt-2">Build consistency, build legacy.</p>
        </div>
      </div>

    </div>
  )
}

export default Login