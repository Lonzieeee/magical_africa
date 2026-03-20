import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, userData, loading } = useAuth()

  // Still loading auth — show nothing yet
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  // Not logged in — redirect to login
  if (!user) return <Navigate to='/academy-SignIn' />

  // Logged in but wrong role — redirect to their correct page
  if (allowedRole && userData?.role !== allowedRole) {
    if (userData?.role === 'learner') return <Navigate to='/learner' />
    return <Navigate to='/academy-SignIn' />
  }

  return children
}

export default ProtectedRoute