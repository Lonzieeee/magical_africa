import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../context/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import CourseContent from '../components/Coursecontent'
import Quiz from '../components/Quiz'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { FaCheckCircle, FaUndoAlt } from 'react-icons/fa'
import { MdQuiz } from 'react-icons/md'
import { FaStar } from 'react-icons/fa'

const CourseContentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userData } = useAuth()
  const courseId = location.state?.courseId
  const isPreviewMode = Boolean(location.state?.preview)

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [completedLessonIds, setCompletedLessonIds] = useState([])
  const [toast, setToast] = useState(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSaving, setReviewSaving] = useState(false)
  const [previewOwned, setPreviewOwned] = useState(false)
  const [previewActionLoading, setPreviewActionLoading] = useState(false)

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

  const computeCompletionFromState = (lessonCount, completedIdsLength, quizPercent = 0) => {
    const lessonCompletion = lessonCount > 0
      ? Math.min(100, Math.round((completedIdsLength / lessonCount) * 100))
      : 0
    const weighted = Math.round((lessonCompletion * 0.8) + (quizPercent * 0.2))
    return Math.min(100, Math.max(lessonCompletion, weighted))
  }

  const getCoursePrice = () => {
    if (!course) return 0
    if (course.pricingModel === 'free') return 0
    const sale = Number(course.salePrice || 0)
    const regular = Number(course.regularPrice || 0)
    return sale > 0 ? sale : regular
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
      if (isPreviewMode || !user || !courseId || !course) return

      const totalLessons = (course.topics || []).reduce((acc, topic) => acc + (topic.lessons?.length || 0), 0)
      const today = toDateKey()

      await upsertCourseProgress((existing) => {
        let streak = existing.streak || 0
        const previousDate = existing.lastActiveDate || ''
        const savedCompletedLessonIds = existing.completedLessonIds || []

        if (previousDate !== today) {
          if (isYesterday(previousDate, today)) {
            streak = Math.max(1, streak + 1)
          } else {
            streak = 1
          }
        }

        setCompletedLessonIds(savedCompletedLessonIds)

        const lessonsCompleted = savedCompletedLessonIds.length || existing.lessonsCompleted || 0
        const quizPercent = existing.lastQuizPercent || 0
        const completion = computeCompletionFromState(totalLessons, lessonsCompleted, quizPercent)

        return {
          ...existing,
          started: true,
          status: completion >= 100 ? 'Completed' : 'In Progress',
          totalLessons,
          lessonsCompleted,
          completedLessonIds: savedCompletedLessonIds,
          completion,
          lastQuizPercent: quizPercent,
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
        completion: totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0,
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })
    }

    initializeProgress()
  }, [user, userData, courseId, course, isPreviewMode])

  useEffect(() => {
    return () => {
      const persistTimeSpent = async () => {
        if (isPreviewMode || !user || !courseId || !course) return
        const minutesSpent = Math.max(1, Math.round((Date.now() - sessionStartedAtRef.current) / (1000 * 60)))

        await upsertCourseProgress((existing) => ({
          ...existing,
          timeSpentMinutes: (existing.timeSpentMinutes || 0) + minutesSpent,
          lastActiveAt: new Date().toISOString()
        }))
      }

      persistTimeSpent()
    }
  }, [user, courseId, course, isPreviewMode])

  useEffect(() => {
    const loadExistingReview = async () => {
      if (isPreviewMode || !user || !courseId) return
      const reviewDoc = await getDoc(doc(db, 'reviews', `${user.uid}_${courseId}`))
      if (reviewDoc.exists()) {
        const reviewData = reviewDoc.data()
        setReviewRating(reviewData.rating || 0)
        setReviewComment(reviewData.comment || '')
      }
    }

    loadExistingReview()
  }, [user, courseId, isPreviewMode])

  useEffect(() => {
    const checkPreviewOwnership = async () => {
      if (!isPreviewMode || !user || !courseId) return

      try {
        const progressDoc = await getDoc(doc(db, 'learnerProgress', user.uid))
        if (!progressDoc.exists()) {
          setPreviewOwned(false)
          return
        }

        const savedCourse = progressDoc.data()?.courses?.[courseId] || {}
        const alreadyOwned = Boolean(
          savedCourse.addedToLibrary ||
          savedCourse.paid ||
          savedCourse.started ||
          (savedCourse.completion || 0) > 0
        )

        setPreviewOwned(alreadyOwned)
      } catch (error) {
        console.log('Error checking preview ownership:', error)
        setPreviewOwned(false)
      }
    }

    checkPreviewOwnership()
  }, [isPreviewMode, user, courseId])

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
    if (isPreviewMode) return
    if (!user || !courseId || !course) return

    const lessonCount = (course.topics || []).reduce((acc, topic) => acc + (topic.lessons?.length || 0), 0)
    const quizPercent = total > 0 ? Math.round((score / total) * 100) : 0
    const completion = computeCompletionFromState(lessonCount, completedLessonIds.length, quizPercent)

    await upsertCourseProgress((existing) => {
      return {
        ...existing,
        lessonsCompleted: completedLessonIds.length,
        completion,
        status: completion >= 100 ? 'Completed' : 'In Progress',
        lastQuizPercent: quizPercent,
        lastQuizScore: `${score}/${total}`,
        lastActiveAt: new Date().toISOString()
      }
    })

    await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
      completion,
      lastActiveAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true })
  }

  const handleToggleLessonComplete = async (lessonId, meta = {}) => {
    if (isPreviewMode) return
    if (!user || !courseId || !course) return

    const isCompleted = completedLessonIds.includes(lessonId)
    const action = meta.action || (isCompleted ? 'undo' : 'complete')

    if (action === 'complete' && isCompleted) return
    if (action === 'undo' && !isCompleted) return

    const lessonCount = (course.topics || []).reduce((acc, topic) => acc + (topic.lessons?.length || 0), 0)
    const nextCompletedIds = action === 'undo'
      ? completedLessonIds.filter(id => id !== lessonId)
      : [...completedLessonIds, lessonId]

    setCompletedLessonIds(nextCompletedIds)

    const progressRef = doc(db, 'learnerProgress', user.uid)
    const snapshot = await getDoc(progressRef)
    const existingProgress = snapshot.exists() ? snapshot.data().courses?.[courseId] || {} : {}
    const quizPercent = existingProgress.lastQuizPercent || 0
    const nextCompletion = computeCompletionFromState(lessonCount, nextCompletedIds.length, quizPercent)

    await upsertCourseProgress((existing) => ({
      ...existing,
      completedLessonIds: nextCompletedIds,
      lessonsCompleted: nextCompletedIds.length,
      completion: nextCompletion,
      status: nextCompletion >= 100 ? 'Completed' : 'In Progress',
      lastActiveAt: new Date().toISOString()
    }))

    await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
      completion: nextCompletion,
      lastActiveAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true })

    if (action === 'undo') {
      setToast({ type: 'info', message: 'Lesson completion removed.' })
    } else if (meta.source === 'manual') {
      setToast({ type: 'success', message: 'Lesson marked as complete.' })
    } else {
      setToast({ type: 'success', message: 'Lesson auto-marked complete from activity.' })
    }

    setTimeout(() => setToast(null), 2200)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (isPreviewMode) return
    if (!user || !courseId || !course || reviewRating < 1) return

    setReviewSaving(true)
    try {
      await setDoc(doc(db, 'reviews', `${user.uid}_${courseId}`), {
        learnerId: user.uid,
        learnerEmail: user.email || '',
        learnerName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email || 'Learner',
        teacherId: course.teacherId || '',
        courseId,
        courseTitle: course.title || 'Course',
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      setToast({ type: 'success', message: 'Review submitted successfully.' })
      setTimeout(() => setToast(null), 2200)
    } catch (error) {
      console.log('Failed to submit review:', error)
      setToast({ type: 'info', message: 'Could not submit review. Try again.' })
      setTimeout(() => setToast(null), 2200)
    } finally {
      setReviewSaving(false)
    }
  }

  const handlePreviewAcquire = async () => {
    if (!user || !course || !courseId || previewActionLoading) return

    if (previewOwned) {
      navigate('/course-content', { state: { courseId } })
      return
    }

    setPreviewActionLoading(true)
    const price = getCoursePrice()

    try {
      const progressRef = doc(db, 'learnerProgress', user.uid)
      const progressSnapshot = await getDoc(progressRef)
      const progressData = progressSnapshot.exists() ? progressSnapshot.data() : {}
      const existingCourse = progressData.courses?.[courseId] || {}

      const nextCourseProgress = {
        completion: existingCourse.completion || 0,
        lessonsCompleted: existingCourse.lessonsCompleted || 0,
        timeSpentMinutes: existingCourse.timeSpentMinutes || 0,
        streak: existingCourse.streak || 0,
        started: existingCourse.started || false,
        status: existingCourse.status || 'Not Started',
        addedToLibrary: true,
        paid: price > 0,
        purchasedAt: new Date().toISOString(),
        courseTitle: course.title || 'Course',
        courseType: course.courseType || 'General',
        teacherId: course.teacherId || '',
        teacherName: course.teacherName || ''
      }

      await setDoc(progressRef, {
        courses: {
          ...(progressData.courses || {}),
          [courseId]: nextCourseProgress
        },
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
        learnerId: user.uid,
        teacherId: course.teacherId || '',
        studentName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email || 'Learner',
        studentEmail: user.email || '',
        courseId,
        courseTitle: course.title || 'Course',
        completion: nextCourseProgress.completion,
        paid: price > 0,
        amountPaid: price,
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      navigate('/course-content', { state: { courseId } })
    } catch (error) {
      console.log('Failed to acquire course from preview:', error)
      setToast({ type: 'info', message: 'Could not add this course right now. Please try again.' })
      setTimeout(() => setToast(null), 2200)
    } finally {
      setPreviewActionLoading(false)
    }
  }

  return (
    <>
      <Navbar solid />

      <div className='cc-dashboard-back-row'>
        <button className='cc-dashboard-back-btn' onClick={() => navigate('/learner')}>
          {'<- Back to Learner Dashboard'}
        </button>
      </div>

      {toast && (
        <div className={`cc-toast cc-toast-${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaUndoAlt />}
          <span>{toast.message}</span>
        </div>
      )}

      {isPreviewMode && (
        <div className='cc-preview-cta'>
          <div>
            <h3>Interested in this course?</h3>
            <p>Review the full curriculum first, then add or buy to unlock progress tracking.</p>
          </div>
          <button onClick={handlePreviewAcquire} disabled={previewActionLoading}>
            {previewOwned
              ? 'Continue Course'
              : previewActionLoading
                ? 'Processing...'
                : (getCoursePrice() > 0 ? `Buy This Course ($${getCoursePrice()})` : 'Add This Course')}
          </button>
        </div>
      )}

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
        onQuizClick={isPreviewMode ? undefined : handleQuizClick}
        completedLessonIds={completedLessonIds}
        onToggleLessonComplete={isPreviewMode ? undefined : handleToggleLessonComplete}
        isPreviewMode={isPreviewMode}
      />

      {/* Quiz section — ref attached so we can scroll to it */}
      {showQuiz && !isPreviewMode && (
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
              <MdQuiz style={{ marginRight: '8px', verticalAlign: 'middle' }} /> No quizzes available for this course yet.
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

      {!isPreviewMode && (
      <div className='cc-review-section'>
        <h2>Rate This Course</h2>
        <form onSubmit={handleSubmitReview} className='cc-review-form'>
          <div className='cc-review-stars'>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type='button'
                key={star}
                className={`cc-star-btn ${star <= reviewRating ? 'active' : ''}`}
                onClick={() => setReviewRating(star)}
              >
                <FaStar />
              </button>
            ))}
          </div>

          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder='Share your learning experience...'
            rows={4}
          />

          <button type='submit' disabled={reviewSaving || reviewRating < 1}>
            {reviewSaving ? 'Saving...' : 'Submit Review'}
          </button>
        </form>
      </div>
      )}
    </>
  )
}

export default CourseContentPage