import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/academy-login.css'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AcademyLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)  // ✅ added

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Get user details from Firestore to check their role
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()

        // 3. Show success message then redirect based on role
        setSuccess(true)
        setTimeout(() => {
          if (userData.role === 'teacher') {
            navigate('/teacher-dashboard')
          } else {
            navigate('/learner') // 👈 change to your learner page
          }
        }, 2000)

      } else {
        // User exists in Auth but not Firestore
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 2000)
      }

    } catch (err) {
      console.log('Login error:', err.code, err.message)
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar solid />

      <div className="signIn-page">

        <div className="signIn-title">
          <img src="/images/magivcal-logo2-removebg-preview.png" alt="" />
          <h1>Magical Africa <span>Academy</span></h1>
        </div>

        <div className="signIn-form">

          <h1>Welcome Back</h1>
          <h2>Sign in to your account</h2>

          {/* ✅ Success Message */}
          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              🎉 Logged in successfully! Redirecting...
            </div>
          )}

          {/* ❌ Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="signIn-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="signIn-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="signIn-forgot">
              <a href="#">Forgot password?</a>
            </div>

            <div className="signIn-submit">
              <button type="submit" disabled={loading || success}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

          </form>

          <div className="signIn-or">
            <hr />
            <p>Or</p>
            <hr />
          </div>

          <div className="signIn-register">
            <p>Don't have an account? <a href="#" onClick={() => navigate('/academy2')}>Create Account</a></p>
          </div>

        </div>
      </div>
    </>
  )
}

export default AcademyLogin