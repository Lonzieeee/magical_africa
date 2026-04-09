import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { FiAlertCircle, FiArrowLeft, FiBookOpen, FiClock, FiMessageSquare, FiPlayCircle, FiStar, FiUserCheck } from 'react-icons/fi'
import { FaChalkboardTeacher, FaGlobeAfrica, FaLanguage, FaListUl, FaQuoteLeft, FaRegCalendarAlt, FaUserGraduate } from 'react-icons/fa'
import { db } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import '../styles/tutor-profile.css'

const toTimestamp = (value) => {
  if (!value) return 0
  if (typeof value === 'object') {
    if (typeof value.toDate === 'function') return value.toDate().getTime()
    if (typeof value.seconds === 'number') return value.seconds * 1000
  }
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

const toTextList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean)
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean)
  }
  return []
}

const TutorProfilePage = () => {
  const navigate = useNavigate()
  const { tutorId } = useParams()
  const location = useLocation()
  const { userData } = useAuth()

  const normalizeRole = (role) => {
    const value = String(role || '').trim().toLowerCase()
    if (value.includes('teacher') || value.includes('tutor') || value.includes('educator')) return 'teacher'
    if (value.includes('learner') || value.includes('student')) return 'learner'
    return ''
  }

  const currentRole = normalizeRole(userData?.role)
  const isTeacherPreview = currentRole === 'teacher' || location.pathname.startsWith('/tutor-preview/')

  const stateCourseId = location.state?.courseId || ''
  const queryCourseId = new URLSearchParams(location.search).get('courseId') || ''
  const selectedCourseId = stateCourseId || queryCourseId

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tutorProfile, setTutorProfile] = useState(null)
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [learnersTaught, setLearnersTaught] = useState(0)
  const [reloadCount, setReloadCount] = useState(0)

  // ── CACHE: store fetched data per tutorId so navigating back costs 0 reads ──
  const cachedDataRef = useRef(null)

  useEffect(() => {
    const loadTutorData = async () => {
      if (!tutorId) {
        navigate(isTeacherPreview ? '/teacher-dashboard' : '/learner')
        return
      }

      // ── If we already fetched this tutor and it's not a manual reload, use cache ──
      if (cachedDataRef.current?.id === tutorId && reloadCount === 0) {
        setTutorProfile(cachedDataRef.current.tutorProfile)
        setCourses(cachedDataRef.current.courses)
        setReviews(cachedDataRef.current.reviews)
        setLearnersTaught(cachedDataRef.current.learnersTaught)
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setTutorProfile(null)
      setCourses([])
      setReviews([])
      setLearnersTaught(0)

      try {
        const [tutorDocResult, coursesResult, reviewsResult, enrollmentsResult] = await Promise.allSettled([
          getDoc(doc(db, 'users', tutorId)),
          getDocs(query(collection(db, 'courses'), where('teacherId', '==', tutorId))),
          getDocs(query(collection(db, 'reviews'), where('teacherId', '==', tutorId))),
          getDocs(query(collection(db, 'enrollments'), where('teacherId', '==', tutorId)))
        ])

        const tutorDocData = tutorDocResult.status === 'fulfilled' && tutorDocResult.value.exists()
          ? tutorDocResult.value.data()
          : {}

        const fetchedCourses = coursesResult.status === 'fulfilled'
          ? coursesResult.value.docs
              .map((courseDoc) => ({ id: courseDoc.id, ...courseDoc.data() }))
              .sort((a, b) => toTimestamp(b.publishedAt || b.updatedAt || b.createdAt) - toTimestamp(a.publishedAt || a.updatedAt || a.createdAt))
          : []

        const publishedCourses = fetchedCourses.filter((course) => String(course.status || '').toLowerCase() === 'published')
        const displayCourses = publishedCourses.length > 0 ? publishedCourses : fetchedCourses

        const fetchedReviews = reviewsResult.status === 'fulfilled'
          ? reviewsResult.value.docs
              .map((reviewDoc) => ({ id: reviewDoc.id, ...reviewDoc.data() }))
              .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
          : []

        const uniqueLearners = new Set(
          (enrollmentsResult.status === 'fulfilled' ? enrollmentsResult.value.docs : [])
            .map((item) => item.data()?.learnerId)
            .filter(Boolean)
        )

        const fallbackCourse = displayCourses[0] || fetchedCourses[0] || {}
        const tutorProfileData = tutorDocData?.tutorProfile || {}
        const firstName = tutorDocData?.firstName || ''
        const lastName = tutorDocData?.lastName || tutorDocData?.secondName || ''
        const fallbackName = [firstName, lastName].join(' ').trim()
        const fallbackTutorName = location.state?.tutorName || ''

        if (!fallbackName && !fallbackTutorName && displayCourses.length === 0) {
          setError('This tutor has not set up a public profile yet.')
          setLoading(false)
          return
        }

        const nextProfile = {
          id: tutorId,
          name: tutorProfileData.displayName || tutorDocData?.displayName || fallbackName || fallbackCourse.teacherName || fallbackTutorName || 'Tutor',
          headline: tutorProfileData.headline || `${fallbackCourse.courseType || 'Culture'} Tutor`,
          photoUrl: tutorProfileData.photoUrl || tutorDocData?.photoURL || fallbackCourse.featuredImage || '',
          coverImageUrl: tutorProfileData.coverImageUrl || fallbackCourse.featuredImage || '',
          bio: tutorProfileData.bio || tutorDocData?.bio || 'I guide learners through practical, culturally rooted lessons with clear outcomes and supportive feedback.',
          teachingStyle: tutorProfileData.teachingStyle || 'Interactive, example-driven, and learner-paced sessions with practical assignments.',
          languages: toTextList(tutorProfileData.languages).length > 0
            ? toTextList(tutorProfileData.languages)
            : ['English', 'Swahili'],
          expertiseTags: toTextList(tutorProfileData.expertiseTags).length > 0
            ? toTextList(tutorProfileData.expertiseTags)
            : Array.from(new Set(displayCourses.map((course) => course.courseType).filter(Boolean))).slice(0, 6),
          timezone: tutorProfileData.timezone || 'Africa/Nairobi',
          availabilityText: tutorProfileData.availabilityText || 'Weekday evenings and Saturday mornings',
          responseTimeLabel: tutorProfileData.responseTimeLabel || 'Usually responds within 12 hours'
        }

        // ── Save to cache so back-navigation costs 0 reads ──
        cachedDataRef.current = {
          id: tutorId,
          tutorProfile: nextProfile,
          courses: displayCourses,
          reviews: fetchedReviews,
          learnersTaught: uniqueLearners.size
        }

        setTutorProfile(nextProfile)
        setCourses(displayCourses)
        setReviews(fetchedReviews)
        setLearnersTaught(uniqueLearners.size)
      } catch (fetchError) {
        console.log('Failed to load tutor profile:', fetchError)
        setError('Could not load tutor profile right now. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadTutorData()
  }, [tutorId, navigate, location.state?.tutorName, isTeacherPreview, reloadCount])

  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null
    return courses.find((course) => course.id === selectedCourseId) || null
  }, [courses, selectedCourseId])

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
    return Math.round((total / reviews.length) * 10) / 10
  }, [reviews])

  const highlightedReviews = useMemo(() => {
    return reviews
      .filter((review) => Number(review.rating || 0) > 0 && String(review.comment || '').trim())
      .slice(0, 4)
  }, [reviews])

  const handleBookTutor = () => {
    if (selectedCourse?.id) {
      navigate('/course-content', { state: { courseId: selectedCourse.id, fromResume: true } })
      return
    }
    const firstCourse = courses[0]
    if (firstCourse?.id) {
      navigate('/course-content', { state: { courseId: firstCourse.id, preview: true } })
      return
    }
    navigate('/learner')
  }

  if (loading) {
    return (
      <div className='tutor-profile-page tutor-profile-page--loading'>
        <div className='tutor-profile-loader tutor-profile-loader--loading'>
          <div className='tutor-loading-text' role='status' aria-live='polite' aria-label='Loading tutor profile'>
            <span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tutorProfile) {
    return (
      <div className='tutor-profile-page tutor-profile-page--loading'>
        <div className='tutor-profile-loader tutor-profile-empty-card'>
          <div className='tutor-profile-empty-icon-wrap'>
            <FiAlertCircle className='tutor-profile-empty-icon' />
          </div>
          <h2>Profile Unavailable</h2>
          <p>{error || 'Tutor profile not found.'}</p>
          <div className='tutor-profile-empty-actions'>
            <button type='button' onClick={() => setReloadCount((prev) => prev + 1)}>Try again</button>
            <button type='button' onClick={() => navigate(isTeacherPreview ? '/teacher-dashboard' : '/learner')}>
              Back to {isTeacherPreview ? 'tutor dashboard' : 'learner dashboard'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='tutor-profile-page'>
      <div className='tutor-profile-shell'>
        <div className='tutor-profile-topbar'>
          <button type='button' className='tutor-back-btn' onClick={() => navigate(isTeacherPreview ? '/teacher-dashboard' : '/learner')}>
            <FiArrowLeft /> Back to {isTeacherPreview ? 'Tutor Dashboard' : 'Learner Dashboard'}
          </button>
          {selectedCourseId && (
            <button
              type='button'
              className='tutor-back-btn tutor-back-btn--ghost'
              onClick={() => navigate('/course-content', { state: { courseId: selectedCourseId, preview: true } })}
            >
              <FiBookOpen /> Back to Course
            </button>
          )}
        </div>

        <section className='tutor-hero'>
          <div className='tutor-hero-media'>
            {tutorProfile.photoUrl
              ? <img src={tutorProfile.photoUrl} alt={tutorProfile.name} />
              : <div className='tutor-hero-avatar-fallback'>{String(tutorProfile.name || 'T').charAt(0).toUpperCase()}</div>}
            <div className='tutor-hero-badges'>
              <span><FiUserCheck /> Verified Tutor</span>
              <span><FiClock /> {tutorProfile.responseTimeLabel}</span>
            </div>
          </div>

          <div className='tutor-hero-content'>
            <p className='tutor-kicker'>Tutor Profile</p>
            <h1>{tutorProfile.name}</h1>
            <p className='tutor-headline'>{tutorProfile.headline}</p>

            <div className='tutor-stats-grid'>
              <article className='tutor-stat-card'>
                <strong>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</strong>
                <span><FiStar /> Rating</span>
              </article>
              <article className='tutor-stat-card'>
                <strong>{reviews.length}</strong>
                <span>Reviews</span>
              </article>
              <article className='tutor-stat-card'>
                <strong>{learnersTaught}</strong>
                <span>Learners</span>
              </article>
              <article className='tutor-stat-card'>
                <strong>{courses.length}</strong>
                <span>Courses</span>
              </article>
            </div>

            <div className='tutor-hero-actions'>
              <button type='button' className='tutor-primary-btn' onClick={handleBookTutor} disabled={isTeacherPreview}>
                <FiPlayCircle /> {isTeacherPreview ? 'Preview Mode' : 'Book Tutor'}
              </button>
              <button
                type='button'
                className='tutor-secondary-btn'
                onClick={() => window.location.href = `mailto:?subject=Learning with ${encodeURIComponent(tutorProfile.name)}`}
                disabled={isTeacherPreview}
              >
                <FiMessageSquare /> Message Tutor
              </button>
            </div>
          </div>
        </section>

        {selectedCourse && (
          <section className='tutor-course-context'>
            <p>You came from:</p>
            <h2>{selectedCourse.title || 'Selected Course'}</h2>
            <span>This tutor is connected to this course and can guide you from introduction to completion.</span>
          </section>
        )}

        <div className='tutor-layout'>
          <div className='tutor-main-stack'>
            <section className='tutor-panel'>
              <h3><FaChalkboardTeacher /> About This Tutor</h3>
              <p>{tutorProfile.bio}</p>
            </section>

            <section className='tutor-panel'>
              <h3><FaGlobeAfrica /> Teaching Style</h3>
              <p>{tutorProfile.teachingStyle}</p>
            </section>

            <section className='tutor-panel'>
              <div className='tutor-panel-head'>
                <h3><FaListUl /> Courses By {tutorProfile.name}</h3>
                <span>{courses.length} available</span>
              </div>
              <div className='tutor-course-grid'>
                {courses.length === 0 && (
                  <p className='tutor-empty-note'>No published courses from this tutor yet.</p>
                )}
                {courses.slice(0, 6).map((course) => {
                  const coursePrice = Number(course.salePrice || course.regularPrice || 0)
                  return (
                    <article key={course.id} className='tutor-course-card'>
                      {course.featuredImage
                        ? <img src={course.featuredImage} alt={course.title || 'Course'} />
                        : <div className='tutor-course-image-fallback'>Course</div>}
                      <div>
                        <h4>{course.title || 'Untitled Course'}</h4>
                        <p>{course.description ? String(course.description).slice(0, 120) : 'Explore this practical course with guided lessons.'}</p>
                        <div className='tutor-course-meta'>
                          <span><FiBookOpen /> {course.courseType || 'General'}</span>
                          <span>{coursePrice > 0 ? `$${coursePrice}` : 'Free'}</span>
                        </div>
                        <div className='tutor-course-actions'>
                          <button type='button' disabled={isTeacherPreview} onClick={() => navigate('/course-content', { state: { courseId: course.id, preview: true } })}>
                            {isTeacherPreview ? 'Learner Action' : 'View Course'}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className='tutor-panel'>
              <div className='tutor-panel-head'>
                <h3><FaQuoteLeft /> Learner Reviews</h3>
                <span>{reviews.length} total</span>
              </div>
              {highlightedReviews.length === 0 ? (
                <p className='tutor-review-empty'>No detailed reviews yet. This tutor is building a learner community.</p>
              ) : (
                <div className='tutor-review-grid'>
                  {highlightedReviews.map((review) => (
                    <article key={review.id} className='tutor-review-card'>
                      <FaQuoteLeft className='tutor-review-icon' />
                      <div className='tutor-review-head'>
                        <strong>{review.learnerName || 'Learner'}</strong>
                        <span>{Number(review.rating || 0).toFixed(1)} / 5</span>
                      </div>
                      <p>{review.comment}</p>
                      <small>{review.courseTitle || 'Course review'}</small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className='tutor-side-stack'>
            <section className='tutor-panel'>
              <h3><FaListUl /> Expertise</h3>
              <div className='tutor-chip-list'>
                {(tutorProfile.expertiseTags || []).length > 0
                  ? tutorProfile.expertiseTags.map((tag) => <span key={tag}>{tag}</span>)
                  : <span>Culture</span>}
              </div>
            </section>

            <section className='tutor-panel'>
              <h3><FaLanguage /> Languages & Availability</h3>
              <ul className='tutor-info-list'>
                <li><strong><FaLanguage /> Languages:</strong> {(tutorProfile.languages || []).join(', ')}</li>
                <li><strong><FiClock /> Timezone:</strong> {tutorProfile.timezone}</li>
                <li><strong><FaRegCalendarAlt /> Availability:</strong> {tutorProfile.availabilityText}</li>
              </ul>
            </section>

            <section className='tutor-panel tutor-panel-cta'>
              <h3><FaUserGraduate /> Ready to Learn?</h3>
              <p>Book this tutor and start with a guided learning plan built around your level.</p>
              <button type='button' className='tutor-primary-btn' onClick={handleBookTutor} disabled={isTeacherPreview}>
                <FiPlayCircle /> {isTeacherPreview ? 'Preview Mode' : 'Book Tutor'}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default TutorProfilePage