import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../context/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import CourseContent from '../components/Coursecontent'
import Quiz from '../components/Quiz'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const CourseContentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userData } = useAuth()
  const courseId = location.state?.courseId

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)

  // Ref to scroll to quiz section
  const quizRef = useRef(null)
  const sessionStartedAtRef = useRef(Date.now())

  const toDateKey = (dateInput = new Date()) => {
    const d = new Date(dateInput)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const isYesterday = (fromDateKey, toDateKeyValue) => {
    if (!fromDateKey) return false
    const fromDate = new Date(`${fromDateKey}T00:00:00`)
    const toDate = new Date(`${toDateKeyValue}T00:00:00`)
    const diff = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    return diff === 1
  }

  const upsertCourseProgress = async (buildUpdate) => {
    if (!user || !courseId || !course) return

    const progressRef = doc(db, 'learnerProgress', user.uid)
    const snapshot = await getDoc(progressRef)
    const progressData = snapshot.exists() ? snapshot.data() : {}
    const courseProgress = progressData.courses?.[courseId] || {}
    const nextCourseProgress = buildUpdate(courseProgress)

    await setDoc(progressRef, {
      courses: {
        ...(progressData.courses || {}),
        [courseId]: nextCourseProgress
      },
      updatedAt: new Date().toISOString()
    }, { merge: true })
  }

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
  }, [courseId, navigate])

  useEffect(() => {
    const initializeProgress = async () => {
      if (!user || !courseId || !course) return

      const totalLessons = (course.topics || []).reduce((acc, topic) => acc + (topic.lessons?.length || 0), 0)
      const today = toDateKey()

      await upsertCourseProgress((existing) => {
        let streak = existing.streak || 0
        const previousDate = existing.lastActiveDate || ''

        if (previousDate !== today) {
          if (isYesterday(previousDate, today)) {
            streak = Math.max(1, streak + 1)
          } else {
            streak = 1
          }
        }

        const lessonsCompleted = Math.max(existing.lessonsCompleted || 0, 1)
        const completion = totalLessons > 0
          ? Math.min(100, Math.round((lessonsCompleted / totalLessons) * 100))
          : existing.completion || 0

        return {
          ...existing,
          started: true,
          status: completion >= 100 ? 'Completed' : 'In Progress',
          totalLessons,
          lessonsCompleted,
          completion,
          streak,
          lastActiveDate: today,
          lastActiveAt: new Date().toISOString(),
          courseTitle: course.title || 'Course',
          teacherId: course.teacherId || '',
          teacherName: course.teacherName || ''
        }
      })

      await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
        learnerId: user.uid,
        teacherId: course.teacherId || '',
        studentName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email || 'Learner',
        studentEmail: user.email || '',
        courseId,
        courseTitle: course.title || 'Course',
        completion: 0,
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })
    }

    initializeProgress()
  }, [user, userData, courseId, course])

  useEffect(() => {
    return () => {
      const persistTimeSpent = async () => {
        if (!user || !courseId || !course) return
        const minutesSpent = Math.max(1, Math.round((Date.now() - sessionStartedAtRef.current) / (1000 * 60)))

        await upsertCourseProgress((existing) => ({
          ...existing,
          timeSpentMinutes: (existing.timeSpentMinutes || 0) + minutesSpent,
          lastActiveAt: new Date().toISOString()
        }))
      }

      persistTimeSpent()
    }
  }, [user, courseId, course])

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

  const handleQuizResult = async ({ score, total }) => {
    if (!user || !courseId || !course) return

    const topicCount = (course.topics || []).length
    const lessonCount = (course.topics || []).reduce((acc, topic) => acc + (topic.lessons?.length || 0), 0)

    await upsertCourseProgress((existing) => {
      const previousLessons = existing.lessonsCompleted || 0
      const nextLessons = Math.min(Math.max(topicCount, lessonCount), previousLessons + 1)
      const quizPercent = total > 0 ? Math.round((score / total) * 100) : 0
      const lessonCompletion = lessonCount > 0 ? Math.round((nextLessons / lessonCount) * 100) : 0
      const nextCompletion = Math.max(existing.completion || 0, Math.round((lessonCompletion * 0.7) + (quizPercent * 0.3)))

      return {
        ...existing,
        lessonsCompleted: nextLessons,
        completion: Math.min(100, nextCompletion),
        status: nextCompletion >= 100 ? 'Completed' : 'In Progress',
        lastQuizScore: `${score}/${total}`,
        lastActiveAt: new Date().toISOString()
      }
    })

    await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
      completion: total > 0 ? Math.min(100, Math.round((score / total) * 100)) : 0,
      lastActiveAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true })
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
                  onSubmitResult={handleQuizResult}
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