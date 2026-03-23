import React, { useState, useRef, useEffect } from 'react'
import '../styles/teacher.css'
import Navbar from '../components/Navbar'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const Teacher = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userData } = useAuth()

  // ✅ Check if we're editing an existing course
  const editCourseId = location.state?.editCourseId || null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [maxStudents, setMaxStudents] = useState('')
  const [courseType, setCourseType] = useState('')
  const [pricingModel, setPricingModel] = useState('free')
  const [regularPrice, setRegularPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null)  // base64 string or Firebase URL
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  const fileInputRef = useRef(null)

  // ✅ Wait for auth to be ready
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthReady(true)
    })
    return () => unsubscribe()
  }, [])

  // ✅ If editing, load that course. If new, clear localStorage and start fresh
  useEffect(() => {
    if (!authReady) return

    if (editCourseId) {
      // Editing existing course — load it
      localStorage.setItem('currentCourseId', editCourseId)
      const loadCourse = async () => {
        try {
          const courseDoc = await getDoc(doc(db, 'courses', editCourseId))
          if (courseDoc.exists()) {
            const data = courseDoc.data()
            setTitle(data.title || '')
            setDescription(data.description || '')
            setDifficulty(data.difficulty || 'Beginner')
            setMaxStudents(data.maxStudents || '')
            setCourseType(data.courseType || '')
            setPricingModel(data.pricingModel || 'free')
            setRegularPrice(data.regularPrice || '')
            setSalePrice(data.salePrice || '')
            // ✅ Load saved image — from Firestore first, fallback to localStorage
            if (data.featuredImage) {
              setFeaturedImage(data.featuredImage)
            } else {
              const savedImage = localStorage.getItem('courseImage')
              if (savedImage) setFeaturedImage(savedImage)
            }
          }
        } catch (err) {
          console.log('Error loading course:', err)
        }
      }
      loadCourse()
    } else {
      // ✅ New course — clear localStorage so no old data is reused
      localStorage.removeItem('currentCourseId')
      localStorage.removeItem('courseImage')
    }
  }, [authReady, editCourseId])

  // ✅ Converts image to base64 and saves to localStorage for preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result
        setFeaturedImage(base64)                     // ✅ live preview in the box
        localStorage.setItem('courseImage', base64)  // ✅ persist in localStorage
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = async () => {
    if (!title || !description) {
      setError('Please fill in at least a title and description.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('You must be logged in to create a course.')
        setLoading(false)
        return
      }

      const teacherName = userData
        ? `${userData.firstName} ${userData.secondName}`
        : currentUser.displayName || 'Unknown Teacher'

      const existingCourseId = localStorage.getItem('currentCourseId')
      let courseId

      if (existingCourseId) {
        // ✅ Use updateDoc so topics are NOT wiped out
        await updateDoc(doc(db, 'courses', existingCourseId), {
          title,
          description,
          difficulty,
          maxStudents: maxStudents || 'Unlimited',
          courseType: courseType || '',
          pricingModel,
          regularPrice: regularPrice || '0',
          salePrice: salePrice || '0',
          featuredImage: featuredImage || '',   // ✅ save base64 to Firestore
          teacherName,
          teacherId: currentUser.uid,
          updatedAt: new Date().toISOString(),
        })
        courseId = existingCourseId
      } else {
        // ✅ Create brand new course
        const docRef = await addDoc(collection(db, 'courses'), {
          title,
          description,
          difficulty,
          maxStudents: maxStudents || 'Unlimited',
          courseType: courseType || '',
          pricingModel,
          regularPrice: regularPrice || '0',
          salePrice: salePrice || '0',
          featuredImage: featuredImage || '',   // ✅ save base64 to Firestore
          teacherName,
          teacherId: currentUser.uid,
          createdAt: new Date().toISOString(),
        })
        courseId = docRef.id
        localStorage.setItem('currentCourseId', courseId)
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/curriculum', { state: { courseId } })
      }, 1500)

    } catch (err) {
      console.log('Error saving course:', err)
      setError('Failed to save course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar solid />
      <div className='teacher-div'>

        <h1>eLearning solution that <span>works for you</span></h1>
        <p>Teach anyone, anything, from anywhere. Your best bet to create, manage, and sell <span>eLearning courses – all in one place!</span></p>

        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '8px', padding: '12px 16px', margin: '0 auto 16px', textAlign: 'center', fontWeight: '500', maxWidth: '600px' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '8px', padding: '12px 16px', margin: '0 auto 16px', textAlign: 'center', fontWeight: '500', maxWidth: '600px' }}>
            🎉 Course saved successfully! Redirecting...
          </div>
        )}

        <div className='teachers-decription-div'>
          <div className='teachers-dec'>

            <div className='teacher-dec1'>
              <div className='dec1'>
                <label>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter course title..." />

                <div className='dec2'>
                  <label>Description</label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter course description..." />
                </div>

                <div className='dec3'>
                  <label>Options</label>
                  <div className='dec3-a'>
                    <div className='dec3-b'>
                      <button className='general'>General</button>
                      <button className='content-drip'>Content Drip</button>
                    </div>
                    <div className='dec3-c'>
                      <div className='max-students'>
                        <label>Maximum Students</label>
                        <input type="text" value={maxStudents} onChange={e => setMaxStudents(e.target.value)} />
                      </div>

                      <div className='course-type'>
                        <label>Type of Course</label>
                        <input
                          type="text"
                          value={courseType}
                          onChange={e => setCourseType(e.target.value)}
                          placeholder="e.g. Artisan, Pottery, Language..."
                        />
                      </div>

                      <div className='difficulty-level'>
                        <label>Difficulty Level</label>
                        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                          <option value="Beginner">Beginner</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='teacher-next-div'></div>
            </div>

            <div className='teacher-dec2'>
              <div className='dec2-a'>
                <label>Featured Image</label>
                {/* ✅ Click div to open file picker */}
                <div
                  className='featured-image-box'
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    backgroundImage: featuredImage ? `url(${featuredImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {!featuredImage && (
                    <span className='upload-placeholder'>&#43; Click to upload image</span>
                  )}
                </div>
                {/* ✅ Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>

              <div className='dec2-b'>
                <label>Intro Video</label>
                <div></div>
              </div>

              <div className='dec2-c'>
                <label>Pricing Model</label>
                <div>
                  <label>
                    <input type="radio" name="pricing" value="free" checked={pricingModel === 'free'} onChange={e => setPricingModel(e.target.value)} /> Free
                  </label>
                  <label>
                    <input type="radio" name="pricing" value="paid" checked={pricingModel === 'paid'} onChange={e => setPricingModel(e.target.value)} /> Paid
                  </label>
                </div>
              </div>

              <div className='dec2-d'>
                <div className='reg-price'>
                  <label>Regular Price ($)</label>
                  <input type="text" value={regularPrice} onChange={e => setRegularPrice(e.target.value)} placeholder="e.g. 64.99" />
                </div>
                <div className='sale-price'>
                  <label>Sale Price ($)</label>
                  <input type="text" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="e.g. 11.99" />
                </div>
              </div>

              <div className='teacher-next-btn-div'>
                <button className='teacher-next-btn' onClick={handleNext} disabled={loading || success}>
                  {loading ? 'Saving...' : 'Next ›'}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </>
  )
}

export default Teacher