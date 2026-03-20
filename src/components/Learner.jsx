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
  const [filtering, setFiltering] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [filteredCourses, setFilteredCourses] = useState([])
  const [animate, setAnimate] = useState(false)
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
        setFilteredCourses(courseList) // show all by default
      } catch (err) {
        console.log('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleFilter = (type) => {
    // If clicking the same filter, clear it
    if (activeFilter === type) {
      setActiveFilter(null)
      setFilteredCourses(courses)
      setAnimate(false)
      return
    }

    setActiveFilter(type)
    setFiltering(true)
    setAnimate(false)

    setTimeout(() => {
      const matched = courses.filter(
       c => c.courseType?.trim().toLowerCase() === type.trim().toLowerCase()
      )
      setFilteredCourses(matched)
      setFiltering(false)
      setAnimate(true) // trigger slide-in animation
    }, 600) // short delay to show "Loading courses..."
  }

  const categories = ['Artisan', 'Pottery', 'Language', 'Woodwork']

  return (
    <>
      <Navbar solid />

      <div className='learners-div'>

        <h1>Courses Offered</h1>

        {/* Category filter buttons */}
        <div className='learner2'>
          {categories.map(cat => (
            <div
              key={cat}
              className={`learner2-a ${activeFilter === cat ? 'learner2-active' : ''}`}
              onClick={() => handleFilter(cat)}
              style={{ cursor: 'pointer' }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Loading state */}
        {(loading || filtering) && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            Loading courses...
          </p>
        )}

        {/* No courses message */}
        {!loading && !filtering && filteredCourses.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            No courses available {activeFilter ? `for ${activeFilter}` : 'yet'}.
          </p>
        )}

        {/* Course cards */}
        {!loading && !filtering && (
          <div className='learner1'>
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => navigate('/course-content', { state: { courseId: course.id } })}
                style={{
                  cursor: 'pointer',
                  opacity: animate ? 1 : 1,
                  transform: animate ? 'translateX(0)' : 'translateX(0)',
                  animation: animate ? `slideInLeft 0.4s ease forwards ${index * 0.1}s` : 'none'
                }}
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
                  courseType={course.courseType}  // ✅ pass courseType
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  )
}

export default Learner