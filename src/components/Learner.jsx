import React, { useEffect, useMemo, useState } from 'react'
import { FaBell, FaBolt, FaClock, FaFire, FaGraduationCap, FaStore } from 'react-icons/fa'
import '../styles/learner.css'
import { db } from '../context/AuthContext'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Learner = () => {
  const navigate = useNavigate()
  const { user, userData, getFullName } = useAuth()

  const [activeSection, setActiveSection] = useState('store')
  const [courses, setCourses] = useState([])
  const [progressMap, setProgressMap] = useState({})
  const [achievements, setAchievements] = useState({
    certificates: 0,
    badges: ['Swahili Beginner', 'Storytelling Explorer'],
    milestones: ['First Course Started']
  })
  const [announcements, setAnnouncements] = useState([])

  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)
  const [showPublishedOnly, setShowPublishedOnly] = useState(true)
  const [actionToast, setActionToast] = useState(null)
  const [acquiringCourseId, setAcquiringCourseId] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) {
          setLoading(false)
          return
        }

        const [courseSnapshotResult, progressDocResult, announcementSnapshotResult, enrollmentSnapshotResult] = await Promise.allSettled([
          getDocs(collection(db, 'courses')),
          getDoc(doc(db, 'learnerProgress', user.uid)),
          getDocs(collection(db, 'announcements')),
          getDocs(query(collection(db, 'enrollments'), where('learnerId', '==', user.uid)))
        ])

        const teacherCourseList = courseSnapshotResult.status === 'fulfilled'
          ? courseSnapshotResult.value.docs
              .map(courseDoc => ({ id: courseDoc.id, ...courseDoc.data() }))
          : []

        setCourses(teacherCourseList)

        const savedProgressData = progressDocResult.status === 'fulfilled' && progressDocResult.value.exists()
          ? progressDocResult.value.data()
          : {}

        const savedCourses = savedProgressData.courses || {}
        const enrollmentDocs = enrollmentSnapshotResult.status === 'fulfilled'
          ? enrollmentSnapshotResult.value.docs.map(item => item.data())
          : []

        const enrollmentCourses = enrollmentDocs.reduce((acc, enrollment) => {
          if (!enrollment.courseId) return acc
          acc[enrollment.courseId] = {
            ...(savedCourses[enrollment.courseId] || {}),
            addedToLibrary: true,
            paid: Boolean(enrollment.paid),
            completion: enrollment.completion || savedCourses[enrollment.courseId]?.completion || 0,
            courseTitle: enrollment.courseTitle || savedCourses[enrollment.courseId]?.courseTitle || 'Course',
            teacherId: enrollment.teacherId || savedCourses[enrollment.courseId]?.teacherId || '',
            status: savedCourses[enrollment.courseId]?.status || 'Not Started'
          }
          return acc
        }, {})

        const mergedCourses = {
          ...savedCourses,
          ...enrollmentCourses
        }

        setProgressMap(mergedCourses)
        setAchievements(savedProgressData.achievements || achievements)

        if (!(progressDocResult.status === 'fulfilled' && progressDocResult.value.exists())) {
          await setDoc(doc(db, 'learnerProgress', user.uid), {
            courses: mergedCourses,
            achievements: {
              certificates: 0,
              badges: ['Swahili Beginner', 'Storytelling Explorer'],
              milestones: ['First Course Started']
            },
            updatedAt: new Date().toISOString()
          }, { merge: true })
        }

        const announcementList = announcementSnapshotResult.status === 'fulfilled'
          ? announcementSnapshotResult.value.docs
              .map(announcementDoc => ({ id: announcementDoc.id, ...announcementDoc.data() }))
              .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
          : []

        setAnnouncements(announcementList)
      } catch (err) {
        console.log('Error fetching learner dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const categories = ['Language', 'Culture', 'History', 'Artisan', 'Pottery', 'Woodwork']

  const allCourses = useMemo(() => {
    const map = new Map()

    courses.forEach((course) => {
      map.set(course.id, course)
    })

    Object.entries(progressMap).forEach(([courseId, progress]) => {
      if (map.has(courseId)) {
        const existing = map.get(courseId)
        map.set(courseId, {
          ...existing,
          title: existing.title || progress.courseTitle || 'Untitled Course',
          teacherName: existing.teacherName || progress.teacherName || 'Tutor',
          courseType: existing.courseType || progress.courseType || 'General'
        })
        return
      }

      map.set(courseId, {
        id: courseId,
        title: progress.courseTitle || 'Previously Added Course',
        description: 'A course already linked to your learning profile.',
        courseType: progress.courseType || 'General',
        teacherId: progress.teacherId || '',
        teacherName: progress.teacherName || 'Tutor',
        status: 'Published',
        pricingModel: progress.paid ? 'paid' : 'free',
        salePrice: progress.amountPaid || 0,
        regularPrice: progress.amountPaid || 0
      })
    })

    return Array.from(map.values())
  }, [courses, progressMap])

  const filteredCourses = useMemo(() => {
    if (!activeFilter) return allCourses
    return allCourses.filter(course =>
      course.courseType?.trim().toLowerCase() === activeFilter.trim().toLowerCase()
    )
  }, [activeFilter, allCourses])

  const ownedCourseIds = useMemo(() => {
    const ids = new Set()
    Object.entries(progressMap).forEach(([courseId, progress]) => {
      if (progress.addedToLibrary || progress.paid || progress.started || (progress.completion || 0) > 0) {
        ids.add(courseId)
      }
    })
    return ids
  }, [progressMap])

  const ownedCourses = useMemo(() => {
    return allCourses.filter(course => ownedCourseIds.has(course.id))
  }, [allCourses, ownedCourseIds])

  const myCourses = useMemo(() => {
    const toTimestamp = (value) => {
      if (!value) return 0
      const parsed = new Date(value).getTime()
      return Number.isNaN(parsed) ? 0 : parsed
    }

    const getActivityTime = (course) => {
      const progress = progressMap[course.id] || {}
      return Math.max(
        toTimestamp(progress.lastActiveAt),
        toTimestamp(progress.updatedAt),
        toTimestamp(progress.purchasedAt)
      )
    }

    return [...ownedCourses].sort((a, b) => getActivityTime(b) - getActivityTime(a))
  }, [ownedCourses, progressMap])

  const suggestedCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => {
      if (myCourseIds.has(course.id)) return false
      if (!showPublishedOnly) return true
      return course.status === 'Published' || !course.status
    })
  }, [filteredCourses, ownedCourses, showPublishedOnly])

  const totalStoreCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => !myCourseIds.has(course.id)).length
  }, [filteredCourses, ownedCourses])

  const publishedStoreCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => {
      if (myCourseIds.has(course.id)) return false
      return course.status === 'Published' || !course.status
    }).length
  }, [filteredCourses, ownedCourses])

  const myTeacherIds = useMemo(() => {
    return new Set(ownedCourses.map(course => course.teacherId).filter(Boolean))
  }, [ownedCourses])

  const teacherNameById = useMemo(() => {
    const map = {}
    allCourses.forEach(course => {
      if (course.teacherId && course.teacherName && !map[course.teacherId]) {
        map[course.teacherId] = course.teacherName
      }
    })
    return map
  }, [allCourses])

  const learnerAnnouncements = useMemo(() => {
    if (announcements.length === 0) return []
    if (myTeacherIds.size === 0) return announcements.slice(0, 12)
    return announcements.filter(item => myTeacherIds.has(item.teacherId)).slice(0, 20)
  }, [announcements, myTeacherIds])

  const summary = useMemo(() => {
    const values = ownedCourses.map(course => progressMap[course.id] || {})

    if (values.length === 0) {
      return {
        completion: 0,
        lessonsCompleted: 0,
        streak: 0,
        timeSpentMinutes: 0
      }
    }

    const completion = Math.round(
      values.reduce((acc, item) => acc + (item.completion || 0), 0) / values.length
    )

    return {
      completion,
      lessonsCompleted: values.reduce((acc, item) => acc + (item.lessonsCompleted || 0), 0),
      streak: Math.max(...values.map(item => item.streak || 0), 0),
      timeSpentMinutes: values.reduce((acc, item) => acc + (item.timeSpentMinutes || 0), 0)
    }
  }, [ownedCourses, progressMap])

  const learnerName = useMemo(() => {
    const fullName = getFullName ? getFullName() : ''
    if (fullName && fullName.trim()) return fullName.trim()
    if (userData?.firstName) return userData.firstName
    if (user?.displayName) return user.displayName
    return user?.email?.split('@')[0] || 'Learner'
  }, [getFullName, userData, user])

  const handleFilter = (type) => {
    setActiveFilter(prev => (prev === type ? null : type))
  }

  const openSection = (section) => {
    setActiveSection(section)
    if (section === 'courses') {
      setActiveFilter(null)
    }
  }

  const getCoursePrice = (course) => {
    if (course.pricingModel === 'free') return 0
    const sale = Number(course.salePrice || 0)
    const regular = Number(course.regularPrice || 0)
    return sale > 0 ? sale : regular
  }

  const handleAcquireCourse = async (course) => {
    if (!user || acquiringCourseId) return
    setAcquiringCourseId(course.id)

    const price = getCoursePrice(course)
    const courseProgress = progressMap[course.id] || {}

    const updatedCourseProgress = {
      completion: courseProgress.completion || 0,
      lessonsCompleted: courseProgress.lessonsCompleted || 0,
      timeSpentMinutes: courseProgress.timeSpentMinutes || 0,
      streak: courseProgress.streak || 0,
      started: courseProgress.started || false,
      status: courseProgress.status || 'Not Started',
      addedToLibrary: true,
      paid: price > 0,
      purchasedAt: new Date().toISOString(),
      courseTitle: course.title || 'Course',
      teacherId: course.teacherId || '',
      teacherName: course.teacherName || ''
    }

    const nextProgressMap = {
      ...progressMap,
      [course.id]: updatedCourseProgress
    }

    setProgressMap(nextProgressMap)

    try {
      await setDoc(doc(db, 'learnerProgress', user.uid), {
        courses: nextProgressMap,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await setDoc(doc(db, 'enrollments', `${user.uid}_${course.id}`), {
        learnerId: user.uid,
        teacherId: course.teacherId || '',
        studentEmail: user.email || '',
        courseId: course.id,
        courseTitle: course.title || 'Course',
        completion: updatedCourseProgress.completion,
        paid: price > 0,
        amountPaid: price,
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      setActionToast(
        price > 0
          ? `Purchase successful. ${course.title || 'Course'} added to My Courses.`
          : `${course.title || 'Course'} added to My Courses.`
      )
      setTimeout(() => setActionToast(null), 2600)
    } finally {
      setAcquiringCourseId('')
    }
  }

  const handleResumeCourse = async (courseId) => {
    localStorage.setItem('lastLearnerCourseId', courseId)
    if (user) {
      await setDoc(doc(db, 'learnerProgress', user.uid), {
        lastActiveCourseId: courseId,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    }
    navigate('/course-content', { state: { courseId } })
  }

  const handleViewCourseDetails = (courseId) => {
    navigate('/course-content', { state: { courseId, preview: true } })
  }

  const buildCourseLessonSequence = (course) => {
    if (!course?.topics || !Array.isArray(course.topics)) return []

    return course.topics.flatMap((topic, topicIndex) =>
      (topic.lessons || []).map((lesson, lessonIndex) => ({
        id: String(lesson.id || `${topic.id || `topic-${topicIndex}`}-${lessonIndex}`),
        title: lesson.title || `Lesson ${lessonIndex + 1}`
      }))
    )
  }

  const getNextLessonLabel = (course, progress) => {
    const lessons = buildCourseLessonSequence(course)
    if (lessons.length === 0) return 'Next lesson available inside course content.'

    const completedIds = new Set((progress.completedLessonIds || []).map(String))
    const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id))

    if (!nextLesson) return 'All lessons completed. Great job!'
    return `Continue from: ${nextLesson.title}`
  }

  const formatLastOpened = (progress) => {
    const dateValue = progress.lastActiveAt || progress.updatedAt || progress.purchasedAt
    if (!dateValue) return 'Last opened: not yet'

    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return 'Last opened: not yet'
    return `Last opened: ${parsed.toLocaleString()}`
  }

  return (
    <div className='learner-dashboard'>
      <div className='learner-shell'>
        <aside className='learner-sidebar'>
          <button className='learner-back-btn' onClick={() => navigate('/')}>
            {'<- Back to Website'}
          </button>

          <div className='learner-sidebar-brand'>
            <img src='/images/magicaal-logo1-removebg-preview.png' alt='Magical Africa logo' />
            <h2>Learner Dashboard</h2>
          </div>

          <button className={`learner-nav-btn ${activeSection === 'store' ? 'active' : ''}`} onClick={() => openSection('store')}>
            Course Store
          </button>
          <button className={`learner-nav-btn ${activeSection === 'courses' ? 'active' : ''}`} onClick={() => openSection('courses')}>
            My Courses
          </button>
          <button className={`learner-nav-btn ${activeSection === 'progress' ? 'active' : ''}`} onClick={() => openSection('progress')}>
            Progress Overview
          </button>
          <button className={`learner-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => openSection('notifications')}>
            Notifications
          </button>
          <button className={`learner-nav-btn ${activeSection === 'achievements' ? 'active' : ''}`} onClick={() => openSection('achievements')}>
            Certifications & Achievements
          </button>
          <button className={`learner-nav-btn ${activeSection === 'culture' ? 'active' : ''}`} onClick={() => openSection('culture')}>
            Cultural Exploration Hub
          </button>
          <button className={`learner-nav-btn ${activeSection === 'language' ? 'active' : ''}`} onClick={() => openSection('language')}>
            Language Practice
          </button>
        </aside>

        <main className='learner-main'>
          {actionToast && <div className='learner-toast'>{actionToast}</div>}

          {!loading && (
            <div className='learner-greeting'>
              <h3>Welcome, {learnerName}</h3>
              <p>Your courses and progress are saved automatically whenever you come back.</p>
            </div>
          )}

          {loading && <p className='learner-loading'>Loading your dashboard...</p>}

          {!loading && activeSection === 'store' && (
            <section className='learner-panel'>
              <h1><FaStore /> Course Store</h1>
              <div className='learner-store-badges'>
                <button
                  className={showPublishedOnly ? 'active' : ''}
                  onClick={() => setShowPublishedOnly(true)}
                >
                  {publishedStoreCourses} Published
                </button>
                <button
                  className={!showPublishedOnly ? 'active' : ''}
                  onClick={() => setShowPublishedOnly(false)}
                >
                  {totalStoreCourses} All In Store
                </button>
              </div>

              <div className='learner-categories'>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={activeFilter === cat ? 'active' : ''}
                    onClick={() => handleFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className='learner-suggested-header'>
                <label className='learner-toggle'>
                  <input
                    type='checkbox'
                    checked={showPublishedOnly}
                    onChange={(e) => setShowPublishedOnly(e.target.checked)}
                  />
                  <span>Only Published</span>
                </label>
              </div>

              {suggestedCourses.length === 0 && (
                <p className='learner-empty'>No available courses to buy right now.</p>
              )}

              <div className='learner-store-grid'>
                {suggestedCourses.map(course => {
                  const price = getCoursePrice(course)
                  const isPaid = price > 0
                  const isOwned = Boolean(progressMap[course.id]?.addedToLibrary || progressMap[course.id]?.paid)
                  const isAcquiring = acquiringCourseId === course.id

                  return (
                    <article key={course.id} className='learner-store-card'>
                      <div className='learner-store-image'>
                        {course.featuredImage
                          ? <img src={course.featuredImage} alt={course.title || 'Course image'} />
                          : <div className='learner-store-image-placeholder'>No Image</div>}
                      </div>

                      <div className='learner-store-body'>
                        <h3>{course.title || 'Untitled Course'}</h3>
                        <p>{course.description || 'No description yet.'}</p>
                        <div className='learner-course-meta'>
                          <span>{course.courseType || 'General'}</span>
                          <span>{isPaid ? `Price: $${price}` : 'Free Course'}</span>
                          <span>Offered by {course.teacherName || 'Tutor'}</span>
                        </div>

                        <div className='learner-suggested-actions'>
                          <button
                            className='learner-details-btn'
                            onClick={() => handleViewCourseDetails(course.id)}
                          >
                            View Details
                          </button>
                          <button
                            className='learner-buy-btn'
                            disabled={isOwned || isAcquiring}
                            onClick={() => handleAcquireCourse(course)}
                          >
                            {isOwned
                              ? 'In My Courses'
                              : isAcquiring
                                ? 'Processing...'
                                : (isPaid ? `Buy Course ($${price})` : 'Add Course')}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {!loading && activeSection === 'progress' && (
            <section className='learner-panel'>
              <h1>Progress Overview</h1>
              <div className='learner-metrics-grid'>
                <article className='learner-metric-card'>
                  <h3><FaGraduationCap /> Course Completion</h3>
                  <p>{summary.completion}%</p>
                </article>
                <article className='learner-metric-card'>
                  <h3><FaBolt /> Lessons Completed</h3>
                  <p>{summary.lessonsCompleted}</p>
                </article>
                <article className='learner-metric-card'>
                  <h3><FaFire /> Streak</h3>
                  <p>{summary.streak} days</p>
                </article>
                <article className='learner-metric-card'>
                  <h3><FaClock /> Time Spent Learning</h3>
                  <p>{summary.timeSpentMinutes} mins</p>
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'courses' && (
            <section className='learner-panel'>
              <h1>My Courses</h1>

              {myCourses.length === 0 && (
                <p className='learner-empty'>You have not added or bought any course yet.</p>
              )}

              <div className='learner-store-grid'>
                {myCourses.map(course => {
                  const progress = progressMap[course.id] || {}
                  const completion = progress.completion || 0
                  const nextLessonLabel = getNextLessonLabel(course, progress)
                  const lastOpenedLabel = formatLastOpened(progress)

                  return (
                    <article key={course.id} className='learner-store-card learner-mycourse-card'>
                      <div className='learner-store-image'>
                        {course.featuredImage
                          ? <img src={course.featuredImage} alt={course.title || 'Course image'} />
                          : <div className='learner-store-image-placeholder'>No Image</div>}
                      </div>

                      <div className='learner-store-body'>
                        <div>
                          <h3>{course.title || 'Untitled Course'}</h3>
                          <p>{course.description || 'No description yet.'}</p>
                          <div className='learner-course-meta'>
                            <span>{course.courseType || 'General'}</span>
                            <span>{progress.paid ? 'Paid' : 'Free'}</span>
                            <span>{progress.started ? 'In Progress' : 'Ready to Start'}</span>
                          </div>
                        </div>

                        <div className='learner-progress-row'>
                          <p>Progress: {completion}%</p>
                          <div className='learner-progress-bar'>
                            <div style={{ width: `${completion}%` }} />
                          </div>
                        </div>

                        <p className='learner-last-opened'>{lastOpenedLabel}</p>
                        <p className='learner-next-lesson'>{nextLessonLabel}</p>

                        <button className='learner-resume-btn' onClick={() => handleResumeCourse(course.id)}>
                          Resume
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {!loading && activeSection === 'notifications' && (
            <section className='learner-panel'>
              <h1><FaBell /> Notifications</h1>
              {learnerAnnouncements.length === 0 ? (
                <p className='learner-empty'>No announcements yet from your tutors.</p>
              ) : (
                <div className='learner-notification-list'>
                  {learnerAnnouncements.map(item => (
                    <article key={item.id} className='learner-notification-card'>
                      <h3>{teacherNameById[item.teacherId] || 'Tutor Announcement'}</h3>
                      <p>{item.message || 'No message content.'}</p>
                      <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}</small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {!loading && activeSection === 'achievements' && (
            <section className='learner-panel'>
              <h1>Certifications & Achievements</h1>
              <div className='learner-metrics-grid'>
                <article className='learner-metric-card'>
                  <h3>Certificates Earned</h3>
                  <p>{achievements.certificates || 0}</p>
                </article>
                <article className='learner-metric-card'>
                  <h3>Badges</h3>
                  <p>{(achievements.badges || []).length}</p>
                </article>
                <article className='learner-metric-card'>
                  <h3>Milestones</h3>
                  <p>{(achievements.milestones || []).length}</p>
                </article>
              </div>
              <div className='learner-tag-list'>
                {(achievements.badges || []).map(badge => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </section>
          )}

          {!loading && activeSection === 'culture' && (
            <section className='learner-panel'>
              <h1>Cultural Exploration Hub</h1>
              <div className='learner-feature-grid'>
                <article>
                  <h3>Featured Community of the Week</h3>
                  <p>Maasai oral storytelling and age-set traditions.</p>
                </article>
                <article>
                  <h3>Cultural Practices</h3>
                  <p>Music, food, clothing, and ceremony spotlights from active courses.</p>
                </article>
                <article>
                  <h3>Interactive Stories</h3>
                  <p>Short story-based learning moments connected to your enrolled lessons.</p>
                </article>
                <article>
                  <h3>Did You Know?</h3>
                  <p>Did you know Swahili has words borrowed from Arabic, Persian, and Portuguese?</p>
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'language' && (
            <section className='learner-panel'>
              <h1>Language Practice</h1>
              <div className='learner-feature-grid'>
                <article>
                  <h3>Daily Phrases</h3>
                  <p>Habari yako? • Asante sana • Karibu</p>
                </article>
                <article>
                  <h3>Pronunciation Practice</h3>
                  <p>Use lesson audio and tutor uploads to repeat and self-check.</p>
                </article>
                <article>
                  <h3>Vocabulary Lists</h3>
                  <p>Build your list from active courses and revise every day.</p>
                </article>
                <article>
                  <h3>Mini Quizzes</h3>
                  <p>Take topic quizzes from course content to reinforce retention.</p>
                </article>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default Learner
