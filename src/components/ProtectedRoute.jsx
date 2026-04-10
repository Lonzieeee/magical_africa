import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { buildLearnerDashboardPath, buildTeacherDashboardPath } from '../utils/dashboardRoute'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, userData, loading } = useAuth()
  const normalizeRole = (role) => {
    const value = String(role || '').trim().toLowerCase()
    if (!value) return ''
    if (value.includes('teacher') || value.includes('tutor') || value.includes('educator')) return 'teacher'
    if (value.includes('learner') || value.includes('student')) return 'learner'
    return ''
  }
  const currentRole = normalizeRole(userData?.role)
  const expectedRole = normalizeRole(allowedRole)

  // Still loading auth — show nothing yet
  if (loading) {
    return (
      <div className='app-loading-wrap app-loading-wrap--fullscreen'>
        <div className='app-loading-text' role='status' aria-live='polite' aria-label='Loading account access'>
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
    )
  }

  // Not logged in — redirect to login
  if (!user) return <Navigate to='/academy-signIn' replace />

  // If auth is valid but role is missing/legacy, avoid redirect loops.
  if (expectedRole && !currentRole) return children

  // Logged in but wrong role — redirect to their correct page
  if (expectedRole && currentRole !== expectedRole) {
    if (currentRole === 'learner') return <Navigate to={buildLearnerDashboardPath('store')} replace />
    if (currentRole === 'teacher') return <Navigate to={buildTeacherDashboardPath('courses')} replace />
    return <Navigate to='/academy-signIn' replace />
  }

  return children
}

export default ProtectedRoute