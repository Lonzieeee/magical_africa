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
  const fromResume = Boolean(location.state?.fromResume)

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [completedLessonIds, setCompletedLessonIds] = useState([])
  const [toast, setToast] = useState(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewImprovement, setReviewImprovement] = useState('')
  const [reviewSaving, setReviewSaving] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [courseCompletionPercent, setCourseCompletionPercent] = useState(0)
  const [previewOwned, setPreviewOwned] = useState(false)
  const [previewActionLoading, setPreviewActionLoading] = useState(false)
  const [persistedTabState, setPersistedTabState] = useState(null)

  // Ref to scroll to quiz section
  const quizRef = useRef(null)
  const sessionStartedAtRef = useRef(Date.now())
  const resumeToastShownRef = useRef(false)

  useEffect(() => {
    if (!fromResume || resumeToastShownRef.current) return

    resumeToastShownRef.current = true
    setToast({ type: 'info', message: 'Opening your course. Welcome back!' })

    const timeout = setTimeout(() => {
      setToast(null)
    }, 1800)

    return () => clearTimeout(timeout)
  }, [fromResume])

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
        const resolvedTeacherId = course.teacherId || course.tutorId || course.createdBy || course.authorId || ''
        const resolvedTeacherName = course.teacherName || course.tutorName || course.authorName || 'Tutor'

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
        setCourseCompletionPercent(completion)

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
          teacherId: resolvedTeacherId,
          teacherName: resolvedTeacherName
        }
      })

      const resolvedTeacherId = course.teacherId || course.tutorId || course.createdBy || course.authorId || ''
      const resolvedLearnerName = `${userData?.firstName || ''} ${userData?.lastName || userData?.secondName || ''}`.trim() || user.email || 'Learner'

      await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
        learnerId: user.uid,
        teacherId: resolvedTeacherId,
        studentName: resolvedLearnerName,
        studentEmail: user.email || '',
        courseId,
        courseTitle: course.title || 'Course',
        completion: totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0,
        enrolledAt: new Date().toISOString(),
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
        setReviewImprovement(reviewData.improvementSuggestion || '')
        setReviewSubmitted(true)
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

  useEffect(() => {
    const loadPersistedTabState = async () => {
      if (!user || !courseId) return

      try {
        const progressDoc = await getDoc(doc(db, 'learnerProgress', user.uid))
        if (!progressDoc.exists()) {
          setPersistedTabState(null)
          return
        }

        const savedTabState = progressDoc.data()?.courses?.[courseId]?.tabState || null
        setPersistedTabState(savedTabState)
      } catch (error) {
        console.log('Error loading persisted tab state:', error)
      }
    }

    loadPersistedTabState()
  }, [user, courseId])

  const handlePersistTabState = async (tabState) => {
    if (!user || !courseId || !course || isPreviewMode) return
    if (!tabState || typeof tabState !== 'object') return

    setPersistedTabState(tabState)

    try {
      await upsertCourseProgress((existing) => ({
        ...existing,
        tabState,
        lastActiveAt: new Date().toISOString()
      }))
    } catch (error) {
      console.log('Error persisting tab state:', error)
    }
  }

  if (loading) return (
    <>
      <Navbar solid />
      <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px' }}>Loading course...</div>
    </>
  )

  if (!course) return null

  const learnerDisplayName = `${userData?.firstName || ''} ${userData?.lastName || userData?.secondName || ''}`.trim()
    || user?.displayName
    || user?.email?.split('@')[0]
    || 'Learner'

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
    setCourseCompletionPercent(completion)

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
    setCourseCompletionPercent(nextCompletion)

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
    if (courseCompletionPercent < 100 || reviewSubmitted) return

    const shouldCollectImprovement = reviewRating > 0 && reviewRating < 3
    if (shouldCollectImprovement && !reviewImprovement.trim()) {
      setToast({ type: 'info', message: 'Please tell us what we can improve before submitting.' })
      setTimeout(() => setToast(null), 2400)
      return
    }

    setReviewSaving(true)
    try {
      const resolvedTeacherId = course.teacherId || course.tutorId || course.createdBy || course.authorId || ''
      const resolvedLearnerName = `${userData?.firstName || ''} ${userData?.lastName || userData?.secondName || ''}`.trim() || user.email || 'Learner'

      await setDoc(doc(db, 'reviews', `${user.uid}_${courseId}`), {
        learnerId: user.uid,
        learnerEmail: user.email || '',
        learnerName: resolvedLearnerName,
        teacherId: resolvedTeacherId,
        courseId,
        courseTitle: course.title || 'Course',
        completionPercent: courseCompletionPercent,
        rating: reviewRating,
        comment: reviewComment,
        improvementSuggestion: shouldCollectImprovement ? reviewImprovement.trim() : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      setReviewSubmitted(true)
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
    if (!course || !courseId || previewActionLoading) return
    if (!user) {
      setToast({ type: 'info', message: 'Sign in as learner to add or buy this course.' })
      setTimeout(() => setToast(null), 2200)
      return
    }

    if (previewOwned) {
      navigate('/course-content', { state: { courseId, fromResume: true } })
      return
    }

    setPreviewActionLoading(true)
    const price = getCoursePrice()
    const resolvedTeacherId = course.teacherId || course.tutorId || course.createdBy || course.authorId || ''
    const resolvedTeacherName = course.teacherName || course.tutorName || course.authorName || 'Tutor'
    const resolvedLearnerName = `${userData?.firstName || ''} ${userData?.lastName || userData?.secondName || ''}`.trim() || user.email || 'Learner'

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
        teacherId: resolvedTeacherId,
        teacherName: resolvedTeacherName
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
        teacherId: resolvedTeacherId,
        studentName: resolvedLearnerName,
        studentEmail: user.email || '',
        courseId,
        courseTitle: course.title || 'Course',
        completion: nextCourseProgress.completion,
        paid: price > 0,
        amountPaid: price,
        enrolledAt: existingCourse.enrolledAt || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      navigate('/course-content', { state: { courseId, fromResume: true } })
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

      {toast && (
        <div className={`cc-toast cc-toast-${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaUndoAlt />}
          <span>{toast.message}</span>
        </div>
      )}

      <CourseContent
        topics={course.topics || []}
        courseId={courseId}
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
        onBackToDashboard={() => navigate('/learner')}
        previewPrice={getCoursePrice()}
        previewOwned={previewOwned}
        previewActionLoading={previewActionLoading}
        onPreviewAction={handlePreviewAcquire}
        learningOutcomes={course.learningOutcomes || []}
        courseSkills={course.courseSkills || []}
        courseTools={course.courseTools || []}
        courseLanguage={course.courseLanguage || 'English'}
        courseSubtitlesLabel={course.courseSubtitlesLabel || 'Video subtitles available'}
        courseUpdatedAtLabel={course.courseUpdatedAtLabel || ''}
        certificateDownloadUrl={course.certificateDownloadUrl || ''}
        certificateFileName={course.certificateFileName || ''}
        learnerName={learnerDisplayName}
        persistedTabState={persistedTabState}
        onPersistTabState={handlePersistTabState}
      />

      {/* Quiz section — ref attached so we can scroll to it */}
      {showQuiz && !isPreviewMode && (
        <div ref={quizRef} className='cc-quiz-wrap'>

          {topicsWithQuiz.length === 0 ? (
            <div className='cc-quiz-empty'>
              <MdQuiz className='cc-quiz-empty-icon' /> No quizzes available for this course yet.
            </div>
          ) : (
            <>
              {topicsWithQuiz.length > 1 && (
                <div className='cc-quiz-topic-switch'>
                  <p className='cc-quiz-topic-label'>
                    Select topic quiz:
                  </p>
                  {topicsWithQuiz.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopic(t)}
                      className={`cc-quiz-topic-btn ${selectedTopic?.id === t.id ? 'active' : ''}`}
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

      {!isPreviewMode && courseCompletionPercent < 100 && (
        <div className='cc-review-gate-note'>
          Complete 100% of this course to unlock reviews. Current progress: {courseCompletionPercent}%.
        </div>
      )}

      {!isPreviewMode && (
      <div className='cc-review-section'>
        <h2>Rate This Course</h2>
        <p className='cc-review-help'>Share your experience after completing the full course.</p>
        {reviewSubmitted && (
          <p className='cc-review-submitted-note'>
            Your review has been submitted. Editing is now locked for this course.
          </p>
        )}
        <form onSubmit={handleSubmitReview} className='cc-review-form'>
          <div className='cc-review-stars'>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type='button'
                key={star}
                className={`cc-star-btn ${star <= reviewRating ? 'active' : ''}`}
                onClick={() => setReviewRating(star)}
                disabled={reviewSubmitted || courseCompletionPercent < 100}
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
            disabled={reviewSubmitted || courseCompletionPercent < 100}
          />

          {reviewRating > 0 && reviewRating < 3 && (
            <>
              <label className='cc-review-improve-label'>What can we improve?</label>
              <textarea
                value={reviewImprovement}
                onChange={(e) => setReviewImprovement(e.target.value)}
                placeholder='Tell us where this course can be improved.'
                rows={3}
                disabled={reviewSubmitted || courseCompletionPercent < 100}
              />
            </>
          )}

          <button type='submit' disabled={reviewSaving || reviewRating < 1 || reviewSubmitted || courseCompletionPercent < 100 || (reviewRating < 3 && !reviewImprovement.trim())}>
            {reviewSubmitted ? 'Review Submitted' : reviewSaving ? 'Saving...' : 'Submit Review'}
          </button>
        </form>
      </div>
      )}
    </>
  )
}

export default CourseContentPage