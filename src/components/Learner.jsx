import React, { useEffect, useMemo, useState } from 'react'
import { FaBell, FaBolt, FaChevronLeft, FaClock, FaFire, FaGraduationCap, FaStore } from 'react-icons/fa'
import '../styles/learner.css'
import { db } from '../context/AuthContext'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const getLocalProgressKey = (uid) => `learnerProgressBackup_${uid}`

const toMs = (value) => {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

const pickLatestProgress = (serverProgress = {}, localProgress = {}) => {
  const serverTime = Math.max(
    toMs(serverProgress.updatedAt),
    toMs(serverProgress.lastActiveAt),
    toMs(serverProgress.purchasedAt)
  )
  const localTime = Math.max(
    toMs(localProgress.updatedAt),
    toMs(localProgress.lastActiveAt),
    toMs(localProgress.purchasedAt)
  )

  return localTime > serverTime
    ? { ...serverProgress, ...localProgress }
    : { ...localProgress, ...serverProgress }
}

const mergeCourseMaps = (serverMap = {}, localMap = {}) => {
  const merged = {}
  const allCourseIds = new Set([...Object.keys(serverMap), ...Object.keys(localMap)])

  allCourseIds.forEach((courseId) => {
    merged[courseId] = pickLatestProgress(serverMap[courseId], localMap[courseId])
  })

  return merged
}

const calculateStreak = (previousDate, currentStreak = 0) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (!previousDate) return 1

  const parsed = new Date(previousDate)
  if (Number.isNaN(parsed.getTime())) return 1
  const previous = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())

  const diffDays = Math.floor((today.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays <= 0) return Math.max(1, currentStreak || 1)
  if (diffDays === 1) return Math.max(1, currentStreak + 1)
  return 1
}

const Learner = () => {
  const navigate = useNavigate()
  const { user, userData, getFullName } = useAuth()

  const [activeSection, setActiveSection] = useState('store')
  const [storeView, setStoreView] = useState('all')
  const [courseView, setCourseView] = useState('all')
  const [menuOpen, setMenuOpen] = useState({
    discover: true,
    learning: true,
    growth: false,
    community: false
  })
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
  const [liveEnrollmentCourseIds, setLiveEnrollmentCourseIds] = useState([])
  const [liveEnrollmentTeacherIds, setLiveEnrollmentTeacherIds] = useState([])

  const persistLocalProgressMap = (nextProgressMap) => {
    if (!user?.uid) return
    localStorage.setItem(
      getLocalProgressKey(user.uid),
      JSON.stringify({
        courses: nextProgressMap,
        updatedAt: new Date().toISOString()
      })
    )
  }

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

        const localBackupRaw = localStorage.getItem(getLocalProgressKey(user.uid))
        let localBackupCourses = {}
        if (localBackupRaw) {
          try {
            const parsedLocalBackup = JSON.parse(localBackupRaw)
            localBackupCourses = parsedLocalBackup?.courses || {}
          } catch (parseError) {
            localStorage.removeItem(getLocalProgressKey(user.uid))
          }
        }

        const mergedWithLocal = mergeCourseMaps(mergedCourses, localBackupCourses)

        setProgressMap(mergedWithLocal)
        setAchievements(savedProgressData.achievements || achievements)
        persistLocalProgressMap(mergedWithLocal)

        const mergedSnapshot = JSON.stringify(mergedWithLocal)
        const savedSnapshot = JSON.stringify(mergedCourses)
        if (mergedSnapshot !== savedSnapshot) {
          await setDoc(doc(db, 'learnerProgress', user.uid), {
            courses: mergedWithLocal,
            updatedAt: new Date().toISOString()
          }, { merge: true })
        }

        if (!(progressDocResult.status === 'fulfilled' && progressDocResult.value.exists())) {
          await setDoc(doc(db, 'learnerProgress', user.uid), {
            courses: mergedWithLocal,
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

  useEffect(() => {
    if (!user?.uid) return

    const announcementUnsubscribe = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        const announcementList = snapshot.docs
          .map((announcementDoc) => ({ id: announcementDoc.id, ...announcementDoc.data() }))
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

        setAnnouncements(announcementList)
      },
      (error) => {
        console.log('Announcement listener error:', error)
      }
    )

    const enrollmentUnsubscribe = onSnapshot(
      query(collection(db, 'enrollments'), where('learnerId', '==', user.uid)),
      (snapshot) => {
        const docs = snapshot.docs.map((item) => item.data())
        const nextCourseIds = docs
          .map((item) => item.courseId)
          .filter(Boolean)
        const nextTeacherIds = docs
          .map((item) => item.teacherId)
          .filter(Boolean)

        setLiveEnrollmentCourseIds(nextCourseIds)
        setLiveEnrollmentTeacherIds(nextTeacherIds)
      },
      (error) => {
        console.log('Enrollment listener error:', error)
      }
    )

    return () => {
      announcementUnsubscribe()
      enrollmentUnsubscribe()
    }
  }, [user?.uid])

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

  const publishedNowWindowDays = 30

  const publishedNowCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    const now = Date.now()
    const windowMs = publishedNowWindowDays * 24 * 60 * 60 * 1000

    return filteredCourses.filter((course) => {
      if (myCourseIds.has(course.id)) return false
      const isPublished = course.status === 'Published' || !course.status
      if (!isPublished) return false

      const publishedAt = getPublishedTimestamp(course)
      if (!publishedAt) return false
      return now - publishedAt <= windowMs
    })
  }, [filteredCourses, ownedCourses])

  const suggestedCoursesForView = useMemo(() => {
    if (storeView === 'free') {
      return suggestedCourses.filter(course => getCoursePrice(course) === 0)
    }
    if (storeView === 'paid') {
      return suggestedCourses.filter(course => getCoursePrice(course) > 0)
    }
    if (storeView === 'published') {
      return publishedNowCourses
    }
    return suggestedCourses
  }, [storeView, suggestedCourses, publishedNowCourses])

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

  const totalFreeStoreCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => {
      if (myCourseIds.has(course.id)) return false
      return getCoursePrice(course) === 0
    }).length
  }, [filteredCourses, ownedCourses])

  const publishedFreeStoreCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => {
      if (myCourseIds.has(course.id)) return false
      if (getCoursePrice(course) > 0) return false
      return course.status === 'Published' || !course.status
    }).length
  }, [filteredCourses, ownedCourses])

  const totalPaidStoreCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => {
      if (myCourseIds.has(course.id)) return false
      return getCoursePrice(course) > 0
    }).length
  }, [filteredCourses, ownedCourses])

  const publishedPaidStoreCourses = useMemo(() => {
    const myCourseIds = new Set(ownedCourses.map(course => course.id))
    return filteredCourses.filter(course => {
      if (myCourseIds.has(course.id)) return false
      if (getCoursePrice(course) === 0) return false
      return course.status === 'Published' || !course.status
    }).length
  }, [filteredCourses, ownedCourses])

  const myTeacherIds = useMemo(() => {
    return new Set(ownedCourses.map(course => course.teacherId).filter(Boolean))
  }, [ownedCourses])

  const myEnrolledCourseIds = useMemo(() => {
    return new Set(ownedCourses.map(course => course.id).filter(Boolean))
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

    const effectiveCourseIds = new Set([...myEnrolledCourseIds, ...liveEnrollmentCourseIds])
    const effectiveTeacherIds = new Set([...myTeacherIds, ...liveEnrollmentTeacherIds])

    if (effectiveTeacherIds.size === 0 && effectiveCourseIds.size === 0) return []

    return announcements
      .filter((item) => {
        const belongsToMyTutor = item.teacherId ? effectiveTeacherIds.has(item.teacherId) : false
        if (item.courseId) {
          return effectiveCourseIds.has(item.courseId)
        }

        return belongsToMyTutor
      })
      .slice(0, 20)
  }, [announcements, myTeacherIds, myEnrolledCourseIds, liveEnrollmentCourseIds, liveEnrollmentTeacherIds])

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

  const myCoursesForView = useMemo(() => {
    if (courseView === 'in-progress') {
      return myCourses.filter((course) => {
        const completion = progressMap[course.id]?.completion || 0
        return completion > 0 && completion < 100
      })
    }
    if (courseView === 'ready') {
      return myCourses.filter((course) => {
        const progress = progressMap[course.id] || {}
        const completion = progress.completion || 0
        return completion === 0 && !progress.started
      })
    }
    if (courseView === 'completed') {
      return myCourses.filter((course) => {
        const completion = progressMap[course.id]?.completion || 0
        return completion >= 100
      })
    }
    return myCourses
  }, [courseView, myCourses, progressMap])

  const completedCourseTitles = useMemo(() => {
    return myCourses
      .filter((course) => (progressMap[course.id]?.completion || 0) >= 100)
      .map((course) => course.title || 'Untitled Course')
  }, [myCourses, progressMap])

  const courseViewMeta = useMemo(() => {
    if (courseView === 'in-progress') {
      return {
        title: 'Continue Learning',
        subtitle: 'Pick up from where you left off and protect your streak.',
        emptyText: 'No in-progress courses yet. Start a course from My Courses to continue learning here.'
      }
    }
    if (courseView === 'ready') {
      return {
        title: 'Ready To Start',
        subtitle: 'These are enrolled courses you have not started yet.',
        emptyText: 'Nothing is waiting to start right now. Add a new course from the store.'
      }
    }
    if (courseView === 'completed') {
      return {
        title: 'Completed Courses',
        subtitle: 'Finished courses stay here for revision and certificate tracking.',
        emptyText: 'No completed courses yet. Finish a course to unlock it here.'
      }
    }
    return {
      title: 'My Courses',
      subtitle: 'Your full personal library of enrolled and purchased courses.',
      emptyText: 'You have not added or bought any course yet.'
    }
  }, [courseView])

  useEffect(() => {
    if (!user?.uid) return

    const completedCourseCount = Object.values(progressMap).filter((item) => (item.completion || 0) >= 100).length
    const derivedBadges = ['Swahili Beginner', 'Storytelling Explorer']
    const derivedMilestones = ['First Course Started']

    if (completedCourseCount >= 1) {
      derivedBadges.push('Course Finisher')
      derivedMilestones.push('First Course Completed')
    }
    if (completedCourseCount >= 3) {
      derivedBadges.push('Consistent Graduate')
      derivedMilestones.push('Three Courses Completed')
    }

    const mergedBadges = Array.from(new Set([...(achievements.badges || []), ...derivedBadges]))
    const mergedMilestones = Array.from(new Set([...(achievements.milestones || []), ...derivedMilestones]))

    const nextAchievements = {
      certificates: completedCourseCount,
      badges: mergedBadges,
      milestones: mergedMilestones
    }

    const isSame = JSON.stringify(nextAchievements) === JSON.stringify(achievements)
    if (isSame) return

    setAchievements(nextAchievements)

    setDoc(doc(db, 'learnerProgress', user.uid), {
      achievements: nextAchievements,
      updatedAt: new Date().toISOString()
    }, { merge: true }).catch((error) => {
      console.log('Could not sync achievements to cloud:', error)
    })
  }, [progressMap, user?.uid])

  const handleFilter = (type) => {
    setActiveFilter(prev => (prev === type ? null : type))
  }

  const openSection = (section, options = {}) => {
    setActiveSection(section)
    if (options.storeView) {
      setStoreView(options.storeView)
    }
    if (options.courseView) {
      setCourseView(options.courseView)
    }
    if (section === 'courses') {
      setActiveFilter(null)
    }
  }

  const toggleMenu = (menu) => {
    setMenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  function getCoursePrice(course) {
    if (course.pricingModel === 'free') return 0
    const sale = Number(course.salePrice || 0)
    const regular = Number(course.regularPrice || 0)
    return sale > 0 ? sale : regular
  }

  function getPublishedTimestamp(course) {
    const candidates = [course.publishedAt, course.updatedAt, course.createdAt]

    for (const value of candidates) {
      if (!value) continue

      if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value).getTime()
        if (!Number.isNaN(parsed) && parsed > 0) return parsed
      }

      if (value && typeof value === 'object') {
        if (typeof value.toDate === 'function') {
          const parsed = value.toDate().getTime()
          if (!Number.isNaN(parsed) && parsed > 0) return parsed
        }

        if (typeof value.seconds === 'number') {
          const parsed = value.seconds * 1000
          if (!Number.isNaN(parsed) && parsed > 0) return parsed
        }
      }
    }

    return 0
  }

  const handleAcquireCourse = async (course) => {
    if (!user || acquiringCourseId) return
    setAcquiringCourseId(course.id)

    const price = getCoursePrice(course)
    const courseProgress = progressMap[course.id] || {}

    const resolvedTeacherId = course.teacherId || course.tutorId || course.createdBy || course.authorId || ''
    const resolvedTeacherName = course.teacherName || course.tutorName || course.authorName || 'Tutor'

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
      teacherId: resolvedTeacherId,
      teacherName: resolvedTeacherName
    }

    const nextProgressMap = {
      ...progressMap,
      [course.id]: updatedCourseProgress
    }

    setProgressMap(nextProgressMap)
    persistLocalProgressMap(nextProgressMap)

    try {
      await setDoc(doc(db, 'learnerProgress', user.uid), {
        courses: nextProgressMap,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await setDoc(doc(db, 'enrollments', `${user.uid}_${course.id}`), {
        learnerId: user.uid,
        teacherId: resolvedTeacherId,
        studentEmail: user.email || '',
        studentName: learnerName,
        courseId: course.id,
        courseTitle: course.title || 'Course',
        completion: updatedCourseProgress.completion,
        paid: price > 0,
        amountPaid: price,
        enrolledAt: courseProgress.enrolledAt || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })

      setActionToast(
        price > 0
          ? `Purchase successful. ${course.title || 'Course'} added to My Courses.`
          : `${course.title || 'Course'} added to My Courses.`
      )
      setTimeout(() => setActionToast(null), 2600)
    } catch (error) {
      console.log('Could not sync enrollment to cloud, keeping local backup:', error)
      setActionToast(`${course.title || 'Course'} saved locally. It will sync when connection is stable.`)
      setTimeout(() => setActionToast(null), 3200)
    } finally {
      setAcquiringCourseId('')
    }
  }

  const handleResumeCourse = async (courseId) => {
    localStorage.setItem('lastLearnerCourseId', courseId)
    if (user) {
      const existingCourse = progressMap[courseId] || {}
      const nowIso = new Date().toISOString()
      const nextStreak = calculateStreak(existingCourse.lastActiveAt, existingCourse.streak || 0)

      const nextProgressMap = {
        ...progressMap,
        [courseId]: {
          ...existingCourse,
          started: true,
          lastActiveAt: nowIso,
          updatedAt: nowIso,
          streak: nextStreak
        }
      }

      setProgressMap(nextProgressMap)
      persistLocalProgressMap(nextProgressMap)

      await setDoc(doc(db, 'learnerProgress', user.uid), {
        courses: nextProgressMap,
        lastActiveCourseId: courseId,
        updatedAt: nowIso
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
            <FaChevronLeft aria-hidden='true' />
            <span>Back to Website</span>
          </button>

          <div className='learner-sidebar-brand'>
            <img src='/images/magicaal-logo1-removebg-preview.png' alt='Magical Africa logo' />
            <h2>Learner Dashboard</h2>
          </div>

          <div className='learner-nav-groups'>
            <div className='learner-nav-group'>
              <button
                className={`learner-nav-group-title ${menuOpen.discover ? 'expanded' : ''}`}
                onClick={() => toggleMenu('discover')}
                aria-expanded={menuOpen.discover}
              >
                Discover
              </button>
              {menuOpen.discover && (
                <div className='learner-nav-submenu'>
                  <button className={`learner-nav-subitem ${activeSection === 'store' && storeView === 'all' ? 'active' : ''}`} onClick={() => openSection('store', { storeView: 'all' })}>
                    Course Store
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'store' && storeView === 'free' ? 'active' : ''}`} onClick={() => openSection('store', { storeView: 'free' })}>
                    Free Courses
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'store' && storeView === 'paid' ? 'active' : ''}`} onClick={() => openSection('store', { storeView: 'paid' })}>
                    Premium Courses
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'store' && storeView === 'published' ? 'active' : ''}`} onClick={() => openSection('store', { storeView: 'published' })}>
                    Published Now
                  </button>
                </div>
              )}
            </div>

            <div className='learner-nav-group'>
              <button
                className={`learner-nav-group-title ${menuOpen.learning ? 'expanded' : ''}`}
                onClick={() => toggleMenu('learning')}
                aria-expanded={menuOpen.learning}
              >
                My Learning
              </button>
              {menuOpen.learning && (
                <div className='learner-nav-submenu'>
                  <button className={`learner-nav-subitem ${activeSection === 'courses' && courseView === 'all' ? 'active' : ''}`} onClick={() => openSection('courses', { courseView: 'all' })}>
                    My Courses
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'courses' && courseView === 'in-progress' ? 'active' : ''}`} onClick={() => openSection('courses', { courseView: 'in-progress' })}>
                    Continue Learning
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'courses' && courseView === 'ready' ? 'active' : ''}`} onClick={() => openSection('courses', { courseView: 'ready' })}>
                    Ready To Start
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'courses' && courseView === 'completed' ? 'active' : ''}`} onClick={() => openSection('courses', { courseView: 'completed' })}>
                    Completed Courses
                  </button>
                </div>
              )}
            </div>

            <div className='learner-nav-group'>
              <button
                className={`learner-nav-group-title ${menuOpen.growth ? 'expanded' : ''}`}
                onClick={() => toggleMenu('growth')}
                aria-expanded={menuOpen.growth}
              >
                Growth
              </button>
              {menuOpen.growth && (
                <div className='learner-nav-submenu'>
                  <button className={`learner-nav-subitem ${activeSection === 'progress' ? 'active' : ''}`} onClick={() => openSection('progress')}>
                    Progress Overview
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'achievements' ? 'active' : ''}`} onClick={() => openSection('achievements')}>
                    Certifications & Achievements
                  </button>
                </div>
              )}
            </div>

            <div className='learner-nav-group'>
              <button
                className={`learner-nav-group-title ${menuOpen.community ? 'expanded' : ''}`}
                onClick={() => toggleMenu('community')}
                aria-expanded={menuOpen.community}
              >
                Community & Practice
              </button>
              {menuOpen.community && (
                <div className='learner-nav-submenu'>
                  <button className={`learner-nav-subitem ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => openSection('notifications')}>
                    Notifications
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'culture' ? 'active' : ''}`} onClick={() => openSection('culture')}>
                    Cultural Exploration Hub
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'language' ? 'active' : ''}`} onClick={() => openSection('language')}>
                    Language Practice
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className='learner-main'>
          {actionToast && <div className='learner-toast'>{actionToast}</div>}

          {!loading && (
            <div className='learner-greeting'>
              <h3>Welcome, {learnerName}</h3>
              <p className='learner-catchy-message'>
                <span className='learner-orbit-signal' aria-hidden='true'>
                  <span className='learner-orbit-core' />
                  <span className='learner-orbit-ring learner-orbit-ring-one' />
                  <span className='learner-orbit-ring learner-orbit-ring-two' />
                </span>
                <span>
                  Your learning pulse is active. Keep your streak alive by continuing one lesson today.
                </span>
              </p>
            </div>
          )}

          {loading && (
            <div className='learner-loading-wrap'>
              <div className='learner-coffee' role='img' aria-label='Coffee cup spinning and stretching from side to side'>
                <div className='learner-coffee__cup'>
                  <div className='learner-coffee__cup-part learner-coffee__cup-part--a' />
                  <div className='learner-coffee__cup-part learner-coffee__cup-part--b' />
                  <div className='learner-coffee__cup-part learner-coffee__cup-part--c' />
                  <div className='learner-coffee__cup-part learner-coffee__cup-part--d' />
                  <div className='learner-coffee__cup-part learner-coffee__cup-part--e' />
                  <svg className='learner-coffee__cup-part learner-coffee__cup-part--f' width='96' height='60' viewBox='0 0 96 60' aria-hidden='true'>
                    <g fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                      <path className='learner-coffee__cup-handle' d='M64,4.413s6.64-2.913,11-2.913c11.739,0,19.5,10.759,19.5,22.497,0,23.475-45,22.497-45,22.497' />
                    </g>
                  </svg>
                </div>

                <svg className='learner-coffee__steam' width='56' height='56' viewBox='0 0 56 56' aria-hidden='true'>
                  <g fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                    <path className='learner-coffee__steam-part learner-coffee__steam-part--a' d='M13.845,54s-5.62-10.115-4.496-16.859,6.83-11.497,8.992-17.983c1.037-3.11,.161-6.937-1.083-10.158' />
                    <path className='learner-coffee__steam-part learner-coffee__steam-part--b' d='M27.844,54s-5.652-10.174-4.522-16.957,6.869-11.564,9.043-18.087c2.261-6.783-4.522-16.957-4.522-16.957' />
                    <path className='learner-coffee__steam-part learner-coffee__steam-part--c' d='M40.434,50.999c-1.577-3.486-3.818-9.462-3.071-13.944,1.121-6.723,6.809-11.462,8.964-17.928,1.033-3.1,.161-6.916-1.08-10.127' />
                  </g>
                </svg>

                <svg className='learner-coffee__steam learner-coffee__steam--right' width='56' height='56' viewBox='0 0 56 56' aria-hidden='true'>
                  <g fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                    <path className='learner-coffee__steam-part learner-coffee__steam-part--d' d='M19.845,54s-5.62-10.115-4.496-16.859,6.83-11.497,8.992-17.983c1.037-3.11,.161-6.937-1.083-10.158' />
                    <path className='learner-coffee__steam-part learner-coffee__steam-part--e' d='M34.434,44c-1.577-3.486-3.818-9.462-3.071-13.944,1.121-6.723,6.809-11.462,8.964-17.928,1.033-3.1,.161-6.916-1.08-10.127' />
                  </g>
                </svg>
              </div>
            </div>
          )}

          {!loading && activeSection === 'store' && (
            <section className={`learner-panel learner-panel--store ${storeView === 'free' ? 'learner-panel--store-free' : ''}`}>
              {storeView !== 'free' && <h1><FaStore /> Course Store</h1>}
              {storeView === 'all' ? (
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
              ) : storeView === 'free' ? (
                <div className='learner-store-free-stats'>
                  <span className='learner-store-free-pill'>{totalFreeStoreCourses} Free Available</span>
                  <span className='learner-store-free-pill'>{publishedFreeStoreCourses} Published Free</span>
                </div>
              ) : storeView === 'paid' ? (
                <div className='learner-store-free-stats'>
                  <span className='learner-store-free-pill'>{totalPaidStoreCourses} Premium Available</span>
                  <span className='learner-store-free-pill'>{publishedPaidStoreCourses} Published Premium</span>
                </div>
              ) : (
                <div className='learner-store-free-stats'>
                  <span className='learner-store-free-pill'>{suggestedCoursesForView.length} Published Now</span>
                  <span className='learner-store-free-pill'>Last {publishedNowWindowDays} Days</span>
                </div>
              )}

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

              {storeView !== 'published' ? (
                <div className='learner-suggested-header'>
                  <label className='learner-toggle'>
                    <input
                      type='checkbox'
                      checked={showPublishedOnly}
                      onChange={(e) => setShowPublishedOnly(e.target.checked)}
                    />
                    <span>{storeView === 'free' ? 'Published Free Only' : storeView === 'paid' ? 'Published Premium Only' : 'Only Published'}</span>
                  </label>
                </div>
              ) : (
                <div className='learner-suggested-header learner-suggested-header-note'>
                  <span>Showing newly published courses only.</span>
                </div>
              )}

              <div
                className='learner-store-view-stage'
                key={`store-${storeView}-${activeFilter || 'all'}-${showPublishedOnly ? 'published' : 'all'}`}
              >
                {storeView === 'free' && (
                  <div className='learner-free-strip'>
                    <h2>Free Learning Picks</h2>
                    <p>
                      {suggestedCoursesForView.length > 0
                        ? `${suggestedCoursesForView.length} free course${suggestedCoursesForView.length > 1 ? 's' : ''} ready for you right now.`
                        : 'No free courses are available right now.'}
                    </p>
                  </div>
                )}

                {storeView === 'paid' && (
                  <div className='learner-free-strip'>
                    <h2>Premium Learning Picks</h2>
                    <p>
                      {suggestedCoursesForView.length > 0
                        ? `${suggestedCoursesForView.length} premium course${suggestedCoursesForView.length > 1 ? 's' : ''} available with deeper guided content.`
                        : 'No premium courses are available in this filter yet.'}
                    </p>
                  </div>
                )}

                {storeView === 'published' && (
                  <div className='learner-free-strip'>
                    <h2>Published Now</h2>
                    <p>
                      {suggestedCoursesForView.length > 0
                        ? `${suggestedCoursesForView.length} course${suggestedCoursesForView.length > 1 ? 's' : ''} published in the last ${publishedNowWindowDays} days.`
                        : `No newly published courses in the last ${publishedNowWindowDays} days for this filter.`}
                    </p>
                  </div>
                )}

                {suggestedCoursesForView.length === 0 && (
                  storeView === 'free'
                    ? (
                      <div className='learner-free-empty'>
                        <div className='scor' aria-hidden='true'>
                          <div className='scor-head'>
                            <div className='scor-face'>
                              <div className='scor-eye scor-eye-left' />
                              <div className='scor-eye scor-eye-right' />
                              <div className='scor-face-lower'>
                                <div className='scor-nose' />
                                <div className='scor-mouth'>
                                  <div className='scor-mouth-outer' />
                                  <div className='scor-mouth-inner' />
                                </div>
                                <div className='scor-mouth-line' />
                              </div>
                              <div className='scor-blush scor-blush-left' />
                              <div className='scor-blush scor-blush-right' />
                            </div>
                            <div className='scor-face-fluff scor-face-fluff-left' />
                            <div className='scor-face-fluff scor-face-fluff-right' />
                            <div className='scor-ear scor-ear-left' />
                            <div className='scor-ear-right-wrap'>
                              <div className='scor-ear scor-ear-right' />
                              <div className='scor-ear-right-fluff' />
                            </div>
                          </div>
                          <div className='scor-body'>
                            <div className='scor-tail' />
                            <div className='scor-torso' />
                            <div className='scor-neck' />
                            <div className='scor-arm scor-arm-left' />
                            <div className='scor-arm scor-arm-right' />
                            <div className='scor-leg scor-leg-left'>
                              <div className='scor-leg-foot'>
                                <div className='scor-leg-foot-pad' />
                              </div>
                            </div>
                            <div className='scor-leg scor-leg-right'>
                              <div className='scor-leg-foot'>
                                <div className='scor-leg-foot-pad' />
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className='learner-free-empty-title'>No free courses available right now</p>
                        <p className='learner-free-empty-text'>New free classes drop often. In the meantime, explore premium options curated for your learning journey.</p>
                        <button
                          className='learner-free-empty-btn'
                          onClick={() => openSection('store', { storeView: 'paid' })}
                        >
                          Check Paid Courses
                        </button>
                      </div>
                      )
                    : storeView === 'paid'
                      ? <p className='learner-empty'>No premium courses match this filter yet.</p>
                      : storeView === 'published'
                        ? <p className='learner-empty'>No newly published courses in the selected category yet.</p>
                        : <p className='learner-empty'>No available courses to buy right now.</p>
                )}

                <div className='learner-store-grid'>
                  {suggestedCoursesForView.map(course => {
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
              <h1>{courseViewMeta.title}</h1>
              <p className='learner-courses-intro'>{courseViewMeta.subtitle}</p>

              {myCoursesForView.length === 0 && (
                <p className='learner-empty'>{courseViewMeta.emptyText}</p>
              )}

              <div className='learner-store-grid'>
                {myCoursesForView.map(course => {
                  const progress = progressMap[course.id] || {}
                  const completion = progress.completion || 0
                  const nextLessonLabel = getNextLessonLabel(course, progress)
                  const lastOpenedLabel = formatLastOpened(progress)
                  const isCompleted = completion >= 100

                  return (
                    <article key={course.id} className={`learner-store-card learner-mycourse-card learner-mycourse-${courseView}`}>
                      <div className='learner-store-image'>
                        {course.featuredImage
                          ? <img src={course.featuredImage} alt={course.title || 'Course image'} />
                          : <div className='learner-store-image-placeholder'>No Image</div>}
                      </div>

                      <div className='learner-store-body'>
                        <div>
                          <h3>{course.title || 'Untitled Course'}</h3>
                          {isCompleted && <span className='learner-completed-badge'>Completed</span>}
                          <p>{course.description || 'No description yet.'}</p>
                          <div className='learner-course-meta'>
                            <span>{course.courseType || 'General'}</span>
                            <span>{progress.paid ? 'Paid' : 'Free'}</span>
                            <span>{completion >= 100 ? 'Completed' : progress.started ? 'In Progress' : 'Ready to Start'}</span>
                          </div>
                        </div>

                        {courseView !== 'ready' && (
                          <div className='learner-progress-row'>
                            <p>Progress: {completion}%</p>
                            <div className='learner-progress-bar'>
                              <div style={{ width: `${completion}%` }} />
                            </div>
                          </div>
                        )}

                        <p className='learner-last-opened'>{lastOpenedLabel}</p>
                        <p className='learner-next-lesson'>{nextLessonLabel}</p>

                        {courseView === 'completed' ? (
                          <button className='learner-resume-btn learner-resume-btn-secondary' onClick={() => handleViewCourseDetails(course.id)}>
                            Review Course
                          </button>
                        ) : (
                          <button className='learner-resume-btn' onClick={() => handleResumeCourse(course.id)}>
                            {courseView === 'ready' ? 'Start Course' : 'Resume'}
                          </button>
                        )}
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
                      <span className='learner-notification-course'>{item.courseTitle || 'General update'}</span>
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

              <div className='learner-tag-list'>
                {completedCourseTitles.length === 0
                  ? <span>No certificates yet. Complete a full course to unlock certificates.</span>
                  : completedCourseTitles.map((title) => <span key={title}>Certificate: {title}</span>)}
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
