import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import CourseContent from '../components/Coursecontent'
import Navbar from '../components/Navbar'
import '../styles/coursecontent-page.css'

const CourseContentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const courseId = location.state?.courseId

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        navigate('/dashboard')
        return
      }

      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() })
        } else {
          navigate('/dashboard')
        }
      } catch (err) {
        console.log('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  if (loading) {
    return (
      <>
        <Navbar solid />
        <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px' }}>
          Loading course...
        </div>
      </>
    )
  }

  if (!course) return null

  return (
    <>
      <Navbar solid />

      <div className='course-page'>

      <CourseContent
        topics={course.topics || []}
        title={course.title}
        description={course.description}
        difficulty={course.difficulty}
        teacherName={course.teacherName}
        regularPrice={course.regularPrice}
        salePrice={course.salePrice}
        maxStudents={course.maxStudents}
      />


      </div>
    </>
  )
}

export default CourseContentPage