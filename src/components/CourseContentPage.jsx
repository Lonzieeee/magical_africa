import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import CourseContent from '../components/Coursecontent'
import Quiz from '../components/Quiz'
import Navbar from '../components/Navbar'

const CourseContentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const courseId = location.state?.courseId

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)

  // Ref to scroll to quiz section
  const quizRef = useRef(null)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) { navigate('/learner'); return }
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))
        if (courseDoc.exists()) {
          const data = { id: courseDoc.id, ...courseDoc.data() }
          setCourse(data)
          const firstQuizTopic = data.topics?.find(t => t.quiz && t.quiz.length > 0)
          if (firstQuizTopic) setSelectedTopic(firstQuizTopic)
        } else {
          navigate('/learner')
        }
      } catch (err) {
        console.log('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  if (loading) return (
    <>
      <Navbar solid />
      <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px' }}>Loading course...</div>
    </>
  )

  if (!course) return null

  const topicsWithQuiz = course.topics?.filter(t => t.quiz && t.quiz.length > 0) || []

  // Toggle quiz visibility and scroll to it when opening
  const handleQuizClick = () => {
    setShowQuiz(prev => {
      const next = !prev
      if (next) {
        setTimeout(() => {
          quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
      return next
    })
  }

  return (
    <>
      <Navbar solid />
      <CourseContent
        topics={course.topics || []}
        title={course.title}
        description={course.description}
        difficulty={course.difficulty}
        teacherName={course.teacherName}
        regularPrice={course.regularPrice}
        salePrice={course.salePrice}
        maxStudents={course.maxStudents}
        featuredImage={course.featuredImage}
        courseType={course.courseType}
        onQuizClick={handleQuizClick}  //  uses new handler
        showQuiz={showQuiz}
      />

      {/* Quiz section — ref attached so we can scroll to it */}
      {showQuiz && (
        <div ref={quizRef} style={{  width: '1200px', maxWidth: '100%' , margin: '0 auto', paddingBottom: '4rem' }}>

          {topicsWithQuiz.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              border: '1px dashed #e5e3e3',
              color: '#9ca3af',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.9rem',
              margin: '2rem 0'
            }}>
              📝 No quizzes available for this course yet.
            </div>
          ) : (
            <>
              {topicsWithQuiz.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', margin: '2rem 0 1rem', flexWrap: 'wrap' }}>
                  <p style={{ fontSize: '0.85rem', color: '#555', marginRight: '8px', alignSelf: 'center' }}>
                    Select topic quiz:
                  </p>
                  {topicsWithQuiz.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopic(t)}
                      style={{
                        padding: '6px 16px',
                        border: '1px solid',
                        borderColor: selectedTopic?.id === t.id ? '#1f6f43' : '#e5e3e3',
                        backgroundColor: selectedTopic?.id === t.id ? '#1f6f43' : 'white',
                        color: selectedTopic?.id === t.id ? 'white' : 'rgb(48,48,48)',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {t.title || 'Untitled Topic'}
                    </button>
                  ))}
                </div>
              )}

              {selectedTopic && (
                <Quiz
                  quiz={selectedTopic.quiz}
                  topicTitle={selectedTopic.title}
                />
              )}
            </>
          )}

        </div>
      )}
    </>
  )
}

export default CourseContentPage