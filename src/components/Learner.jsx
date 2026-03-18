import React, { useState, useEffect } from 'react'
import '../styles/learner.css'
import Navbar from '../components/Navbar'
import CourseCard from './Coursecard'
import { db } from '../context/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Learner = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'courses'))
        const courseList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCourses(courseList)
      } catch (err) {
        console.log('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <>
      <Navbar solid />

      <div className='learners-div'>

        <h1>Courses Offered</h1>

        {loading && <p>Loading courses...</p>}

        <div className='learner1'>
          {!loading && courses.length === 0 && (
            <p>No courses available yet.</p>
          )}

          {courses.map(course => (
            // ✅ Wrap each card in a clickable div
            <div
              key={course.id}
              onClick={() => navigate('/course-content', { state: { courseId: course.id } })}
              style={{ cursor: 'pointer' }}
            >
              <CourseCard
                title={course.title}
                description={course.description}
                difficulty={course.difficulty}
                regularPrice={course.regularPrice}
                salePrice={course.salePrice}
                teacherName={course.teacherName}
                maxStudents={course.maxStudents}
                featuredImage={course.featuredImage}
              />
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default Learner