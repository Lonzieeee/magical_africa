import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthReady(true)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!authReady) return
    fetchCourses()
  }, [authReady])

  const fetchCourses = async () => {
    try {
      const q = query(
        collection(db, 'courses'),
        where('teacherId', '==', auth.currentUser?.uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setCourses(list)
    } catch (err) {
      console.log('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await deleteDoc(doc(db, 'courses', courseId))
      setCourses(courses.filter(c => c.id !== courseId))
    } catch (err) {
      console.log('Error deleting course:', err)
    }
  }

  const handleEdit = (courseId) => {
    navigate('/teacher', { state: { editCourseId: courseId } })
  }

  const handleCreateNew = () => {
    localStorage.removeItem('currentCourseId') // ✅ clear so new course is created
    navigate('/teacher')
  }

  return (
    <>
      <Navbar solid />
      <div style={{ backgroundColor: '#f0f0f0', height: '100vh' }}>
      <div style={{ padding: '140px', maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>My Courses</h1>
          <button
            onClick={handleCreateNew}
            style={{ backgroundColor: '#1f6f43', color: 'white', border: 'none', padding: '10px 20px',  cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}
          >
            + Create New Course
          </button>
        </div>

        {loading && <p>Loading your courses...</p>}

        {!loading && courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '18px' }}>You haven't created any courses yet.</p>
            <button
              onClick={handleCreateNew}
              style={{ marginTop: '16px', backgroundColor: '#1f6f43', color: 'white', border: 'none', padding: '10px 24px', cursor: 'pointer', fontWeight: '600' }}
            >
              Create Your First Course
            </button>
          </div>
        )}

        {courses.map(course => (
          <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #e0e0e0', marginBottom: '16px', backgroundColor: '#fff' }}>

            <div>
              <h3 style={{ margin: '0 0 6px' }}>{course.title || 'Untitled Course'}</h3>
              <p style={{ margin: '0 0 4px', color: '#666', fontSize: '14px' }}>{course.description?.slice(0, 80)}...</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', backgroundColor: '#e8f5e9', color: '#1f6f43', padding: '2px 8px', borderRadius: '4px' }}>{course.difficulty}</span>
                <span style={{ fontSize: '12px', backgroundColor: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '4px' }}>{course.pricingModel === 'free' ? 'Free' : `$${course.salePrice || course.regularPrice}`}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{course.topics?.length || 0} topics</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(course.id)}
                style={{ backgroundColor: '#4284f4', color: 'white', border: 'none', padding: '8px 18px',  cursor: 'pointer', fontWeight: '500' }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                style={{ backgroundColor: '#c62828', color: 'white', border: 'none', padding: '8px 18px', cursor: 'pointer', fontWeight: '500' }}
              >
                🗑️ Delete
              </button>
            </div>

          </div>
        ))}

      </div>
      </div>
    </>
  )
}

export default TeacherDashboard