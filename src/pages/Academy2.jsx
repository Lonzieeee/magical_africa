import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/academy-signIn.css'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { auth, db } from '../context/AuthContext'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const Academy2 = () => {
  const [role, setRole] = useState('learner')
  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleCreate = async () => {
    // Validation
    if (!firstName || !secondName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (role === 'teacher' && !subject) {
      setError('Please enter your subject or expertise.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Set display name
      await updateProfile(user, {
        displayName: `${firstName} ${secondName}`
      })

      // 3. Save extra details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        secondName,
        email,
        role,
        subject: role === 'teacher' ? subject : null,
        createdAt: new Date().toISOString()
      })

      // 4. Show success message
      setSuccess(true)

      // 5. Redirect after 2 seconds
      setTimeout(() => {
        if (role === 'teacher') {
          navigate('/teacher-dashboard')
        } else {
          navigate('/academy') // 👈 change to your learner page
        }
      }, 2000)

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>


<Helmet>
  <title>Magical Africa Academy — Learn African Skills & Courses</title>
  <meta name="description" content="Join Magical Africa Academy and learn African skills from talented educators across the continent. Browse courses in Artisan, Pottery, Language, Woodwork and more." />
  <meta name="keywords" content="Magical Africa Academy, African courses, learn African skills, African educators, Artisan, Pottery, African language courses, Woodwork" />
  <meta property="og:title" content="Magical Africa Academy — Learn African Skills & Courses" />
  <meta property="og:description" content="Browse and enroll in courses taught by talented African educators. Learn Artisan, Pottery, Language, Woodwork and more." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://magical.africa/academy2" />
</Helmet>


      <Navbar solid />

      <div className="academy-signIn">

        <div className='academy-title'>
          <img src="/images/magivcal-logo2-removebg-preview.png" alt="" />
          <h1>Magical Africa <span>Academy</span></h1>
        </div>

        <div className='academy-form'>

          <h1>Create your Account</h1>
          <h2>Join as learner or educator</h2>

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
              🎉 Your account has been successfully created! Redirecting...
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

          <div className='academy-category'>
            <button
              className={role === 'learner' ? 'learner' : 'teacher'}
              onClick={() => setRole('learner')}
            >
              Learner
            </button>
            <button
              className={role === 'teacher' ? 'learner' : 'teacher'}
              onClick={() => setRole('teacher')}
            >
              Tutor
            </button>
          </div>

          <div className='academy-info1'>
            <div className='academy-info1-a'>
              <label>FirstName</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className='academy-info1-b'>
              <label>SecondName</label>
              <input
                type="text"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
              />
            </div>
          </div>

          <div className='academy-info2'>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='academy-info3'>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Extra field shown only for teachers */}
          {role === 'teacher' && (
            <div className='academy-info3'>
              <label>Subject / Expertise</label>
              <input
                type="text"
                placeholder="e.g. Artisan, Pottery, Language, Woodwork...."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}

          <div className='academy-create'>
            <button onClick={handleCreate} disabled={loading || success}>
              {loading
                ? 'Creating Account...'
                : role === 'learner'
                  ? 'Create Learner Account'
                  : 'Create Teacher Account'
              }
            </button>
          </div>

          <div className='academy-or'>
            <hr /><p>Or</p><hr />
          </div>

          <div className='academy-already'>
            <p>Already have an account? <a href="#" onClick={() => navigate('/academy-SignIn')}>Sign In</a></p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Academy2