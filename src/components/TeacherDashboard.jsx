import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import '../styles/teacher-dashboard.css'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => setAuthReady(true))
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
    localStorage.removeItem('currentCourseId')
    navigate('/teacher')
  }

  return (
    <>
      <Navbar solid />

      <div className='td-wrapper'>
        <div className='td-container'>

          <div className='td-header'>
            <h1>My Courses</h1>
            <button className='td-create-btn' onClick={handleCreateNew}>
              + Create New Course
            </button>
          </div>

          {loading && <p>Loading your courses...</p>}

          {!loading && courses.length === 0 && (
            <div className='td-empty'>
              <p>You haven't created any courses yet.</p>
              <button className='td-empty-btn' onClick={handleCreateNew}>
                Create Your First Course
              </button>
            </div>
          )}

          {courses.map(course => (
            <div key={course.id} className='td-course-card'>

              <div className='td-course-info'>
                <h3>{course.title || 'Untitled Course'}</h3>
                <p>{course.description?.slice(0, 80)}...</p>
                <div className='td-course-tags'>
                  <span className='td-tag-difficulty'>{course.difficulty}</span>
                  <span className='td-tag-price'>
                    {course.pricingModel === 'free' ? 'Free' : `$${course.salePrice || course.regularPrice}`}
                  </span>
                  <span className='td-tag-topics'>{course.topics?.length || 0} topics</span>
                </div>
              </div>

              <div className='td-course-actions'>
                <button className='td-edit-btn' onClick={() => handleEdit(course.id)}>
                  ✏️ Edit
                </button>
                <button className='td-delete-btn' onClick={() => handleDelete(course.id)}>
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