import React from 'react'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import Footer from './components/Footer'

import ProtectedRoutes from './routes/ProtectedRoute'
import SingleHabit from './Pages/SingleHabit'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'




const App = () => {
  const location = window.location;

  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);
  return (
    <div>
      <ToastContainer />
      {!hideHeaderFooter && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        <Route

          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/habit/:id"
          element={
            <ProtectedRoutes>
              <SingleHabit />
            </ProtectedRoutes>
          } />

        


        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}

export default App
