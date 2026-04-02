import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FiActivity, FiBell, FiBookOpen, FiCheckCircle, FiChevronLeft, FiClock, FiLogOut, FiPlayCircle, FiSearch, FiShoppingBag, FiTrash2, FiUpload, FiX } from 'react-icons/fi'
import '../styles/learner.css'
import { auth, db } from '../context/AuthContext'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const getLocalProgressKey = (uid) => `learnerProgressBackup_${uid}`
const getAnnouncementSeenKey = (uid) => `learnerAnnouncementSeenAt_${uid}`
const getDisplayPrefsKey = (uid) => `learnerDisplayPrefs_${uid}`
const getStorePrefsKey = (uid) => `learnerStorePrefs_${uid}`
const getSettingsPrefsKey = (uid) => `learnerSettingsPrefs_${uid}`
const getProfilePhotoKey = (uid) => `learnerProfilePhoto_${uid}`

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
  const { user, userData, getFullName, getInitials, logout } = useAuth()

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
    badges: [],
    milestones: []
  })
  const [announcements, setAnnouncements] = useState([])

  const [loading, setLoading] = useState(true)
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [storeSortBy, setStoreSortBy] = useState('newest')
  const [activeFilter, setActiveFilter] = useState(null)
  const [actionToast, setActionToast] = useState(null)
  const [acquiringCourseId, setAcquiringCourseId] = useState('')
  const [liveEnrollmentCourseIds, setLiveEnrollmentCourseIds] = useState([])
  const [liveEnrollmentTeacherIds, setLiveEnrollmentTeacherIds] = useState([])
  const [announcementSeenAt, setAnnouncementSeenAt] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [quickResumeClosed, setQuickResumeClosed] = useState(false)
  const [displayPrefs, setDisplayPrefs] = useState({
    compactCards: false,
    reduceMotion: false
  })
  const [settingsPrefs, setSettingsPrefs] = useState({
    darkMode: false,
    biometricAuth: false,
    notifications: true,
    cloudSync: true
  })
  const [profileDraft, setProfileDraft] = useState({
    firstName: '',
    lastName: '',
    photoURL: ''
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const profileMenuRef = useRef(null)
  const profilePhotoInputRef = useRef(null)
  const previousCloudSyncRef = useRef(true)

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
        setAchievements(savedProgressData.achievements || {
          certificates: 0,
          badges: [],
          milestones: []
        })
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
              badges: [],
              milestones: []
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

  useEffect(() => {
    if (!user?.uid) return
    const stored = localStorage.getItem(getAnnouncementSeenKey(user.uid)) || ''
    setAnnouncementSeenAt(stored)
  }, [user?.uid])

  useEffect(() => {
    if (!user?.uid) return

    const stored = localStorage.getItem(getDisplayPrefsKey(user.uid))
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      setDisplayPrefs({
        compactCards: Boolean(parsed?.compactCards),
        reduceMotion: Boolean(parsed?.reduceMotion)
      })
    } catch (error) {
      localStorage.removeItem(getDisplayPrefsKey(user.uid))
    }
  }, [user?.uid])

  useEffect(() => {
    if (!user?.uid) return
    localStorage.setItem(getDisplayPrefsKey(user.uid), JSON.stringify(displayPrefs))
  }, [displayPrefs, user?.uid])

  useEffect(() => {
    const cloudPrefs = userData?.preferences?.learnerDashboard
    if (!cloudPrefs) return

    if (cloudPrefs.displayPrefs) {
      setDisplayPrefs((prev) => ({
        compactCards: typeof cloudPrefs.displayPrefs.compactCards === 'boolean'
          ? cloudPrefs.displayPrefs.compactCards
          : prev.compactCards,
        reduceMotion: typeof cloudPrefs.displayPrefs.reduceMotion === 'boolean'
          ? cloudPrefs.displayPrefs.reduceMotion
          : prev.reduceMotion
      }))
    }

    if (cloudPrefs.settingsPrefs) {
      setSettingsPrefs((prev) => ({
        darkMode: typeof cloudPrefs.settingsPrefs.darkMode === 'boolean'
          ? cloudPrefs.settingsPrefs.darkMode
          : prev.darkMode,
        biometricAuth: typeof cloudPrefs.settingsPrefs.biometricAuth === 'boolean'
          ? cloudPrefs.settingsPrefs.biometricAuth
          : prev.biometricAuth,
        notifications: typeof cloudPrefs.settingsPrefs.notifications === 'boolean'
          ? cloudPrefs.settingsPrefs.notifications
          : prev.notifications,
        cloudSync: typeof cloudPrefs.settingsPrefs.cloudSync === 'boolean'
          ? cloudPrefs.settingsPrefs.cloudSync
          : prev.cloudSync
      }))
    }
  }, [userData?.preferences])

  useEffect(() => {
    if (!user?.uid) return

    const stored = localStorage.getItem(getSettingsPrefsKey(user.uid))
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      setSettingsPrefs({
        darkMode: Boolean(parsed?.darkMode),
        biometricAuth: Boolean(parsed?.biometricAuth),
        notifications: parsed?.notifications !== false,
        cloudSync: parsed?.cloudSync !== false
      })
    } catch (error) {
      localStorage.removeItem(getSettingsPrefsKey(user.uid))
    }
  }, [user?.uid])

  useEffect(() => {
    if (!user?.uid) return
    localStorage.setItem(getSettingsPrefsKey(user.uid), JSON.stringify(settingsPrefs))
  }, [settingsPrefs, user?.uid])

  useEffect(() => {
    if (!user?.uid) return

    const turnedOffCloudSync = previousCloudSyncRef.current && !settingsPrefs.cloudSync
    const shouldSyncToCloud = settingsPrefs.cloudSync || turnedOffCloudSync
    previousCloudSyncRef.current = settingsPrefs.cloudSync

    if (!shouldSyncToCloud) return

    setDoc(doc(db, 'users', user.uid), {
      preferences: {
        learnerDashboard: {
          displayPrefs,
          settingsPrefs,
          updatedAt: new Date().toISOString()
        }
      }
    }, { merge: true }).catch((error) => {
      console.log('Could not sync learner settings to cloud:', error)
    })
  }, [displayPrefs, settingsPrefs, user?.uid])

  useEffect(() => {
    if (!user?.uid) return

    const stored = localStorage.getItem(getStorePrefsKey(user.uid))
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      setCourseSearchTerm(String(parsed?.courseSearchTerm || ''))
      setActiveFilter(parsed?.activeFilter || null)
      setStoreSortBy(parsed?.storeSortBy || 'newest')
    } catch (error) {
      localStorage.removeItem(getStorePrefsKey(user.uid))
    }
  }, [user?.uid])

  useEffect(() => {
    if (!user?.uid) return

    localStorage.setItem(getStorePrefsKey(user.uid), JSON.stringify({
      courseSearchTerm,
      activeFilter,
      storeSortBy
    }))
  }, [courseSearchTerm, activeFilter, storeSortBy, user?.uid])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!profileMenuRef.current) return
      if (!profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

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
    const query = courseSearchTerm.trim().toLowerCase()

    return allCourses.filter((course) => {
      const categoryMatch = !activeFilter ||
        course.courseType?.trim().toLowerCase() === activeFilter.trim().toLowerCase()

      if (!categoryMatch) return false
      if (!query) return true

      const haystack = [
        course.title,
        course.description,
        course.courseType,
        course.teacherName
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [activeFilter, allCourses, courseSearchTerm])

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
    return filteredCourses.filter(course => {
      return isCoursePublished(course)
    })
  }, [filteredCourses])

  const freeStoreCourses = useMemo(() => {
    return filteredCourses.filter((course) => {
      if (!isCoursePublished(course)) return false
      return getCoursePrice(course) === 0
    })
  }, [filteredCourses])

  const publishedNowWindowDays = 30

  const publishedNowCourses = useMemo(() => {
    const now = Date.now()
    const windowMs = publishedNowWindowDays * 24 * 60 * 60 * 1000

    return filteredCourses.filter((course) => {
      const isPublished = isCoursePublished(course)
      if (!isPublished) return false

      const publishedAt = getPublishedTimestamp(course)
      if (!publishedAt) return false
      return now - publishedAt <= windowMs
    })
  }, [filteredCourses])

  const suggestedCoursesForView = useMemo(() => {
    if (storeView === 'free') {
      return freeStoreCourses
    }
    if (storeView === 'paid') {
      return suggestedCourses.filter(course => getCoursePrice(course) > 0)
    }
    if (storeView === 'published') {
      return publishedNowCourses
    }
    return suggestedCourses
  }, [storeView, suggestedCourses, publishedNowCourses, freeStoreCourses])

  const hasActiveStoreFilters = useMemo(() => {
    return Boolean(courseSearchTerm.trim() || activeFilter || storeSortBy !== 'newest')
  }, [courseSearchTerm, activeFilter, storeSortBy])

  const sortedSuggestedCoursesForView = useMemo(() => {
    const list = [...suggestedCoursesForView]

    if (storeSortBy === 'price-low') {
      return list.sort((a, b) => getCoursePrice(a) - getCoursePrice(b))
    }

    if (storeSortBy === 'price-high') {
      return list.sort((a, b) => getCoursePrice(b) - getCoursePrice(a))
    }

    if (storeSortBy === 'popular') {
      return list.sort((a, b) => {
        const bPopularity = Number(b.enrollmentCount || b.totalStudents || b.students || 0)
        const aPopularity = Number(a.enrollmentCount || a.totalStudents || a.students || 0)
        return bPopularity - aPopularity
      })
    }

    return list.sort((a, b) => getPublishedTimestamp(b) - getPublishedTimestamp(a))
  }, [suggestedCoursesForView, storeSortBy])

  const publishedStoreCourses = useMemo(() => {
    return filteredCourses.filter(course => {
      return isCoursePublished(course)
    }).length
  }, [filteredCourses])

  const totalFreeStoreCourses = useMemo(() => {
    return freeStoreCourses.length
  }, [freeStoreCourses])

  const publishedFreeStoreCourses = useMemo(() => {
    return freeStoreCourses.length
  }, [freeStoreCourses])

  const totalPaidStoreCourses = useMemo(() => {
    return filteredCourses.filter(course => {
      return getCoursePrice(course) > 0
    }).length
  }, [filteredCourses])

  const publishedPaidStoreCourses = useMemo(() => {
    return filteredCourses.filter(course => {
      if (getCoursePrice(course) === 0) return false
      return isCoursePublished(course)
    }).length
  }, [filteredCourses])

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

  const notificationGroups = useMemo(() => {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const weekMs = 7 * dayMs

    const groups = {
      today: [],
      week: [],
      older: []
    }

    learnerAnnouncements.forEach((item) => {
      const createdAt = toMs(item.createdAt)
      const age = now - createdAt

      if (createdAt && age <= dayMs) {
        groups.today.push(item)
        return
      }

      if (createdAt && age <= weekMs) {
        groups.week.push(item)
        return
      }

      groups.older.push(item)
    })

    return groups
  }, [learnerAnnouncements])

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

  const avatarInitials = useMemo(() => {
    const first = (profileDraft.firstName || userData?.firstName || '').trim()
    const last = (profileDraft.lastName || userData?.lastName || userData?.secondName || '').trim()
    const customInitials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase().trim()
    if (customInitials) return customInitials
    return getInitials ? getInitials() : 'L'
  }, [profileDraft.firstName, profileDraft.lastName, userData, getInitials])

  useEffect(() => {
    const localPhoto = user?.uid ? (localStorage.getItem(getProfilePhotoKey(user.uid)) || '') : ''
    setProfileDraft({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || userData?.secondName || '',
      photoURL: localPhoto || userData?.photoURL || user?.photoURL || ''
    })
  }, [userData, user?.uid, user?.photoURL])

  const handleProfilePhotoUpload = async (event) => {
    if (!user?.uid) return

    const selectedFile = event.target.files?.[0]
    event.target.value = ''
    if (!selectedFile) return

    const maxBytes = 2 * 1024 * 1024
    if (selectedFile.size > maxBytes) {
      setProfileMessage('Please choose an image smaller than 2MB for local storage.')
      return
    }

    try {
      setProfileSaving(true)
      const photoURL = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('file-read-failed'))
        reader.readAsDataURL(selectedFile)
      })

      const resolvedPhoto = String(photoURL || '')
      localStorage.setItem(getProfilePhotoKey(user.uid), resolvedPhoto)
      setProfileDraft((prev) => ({ ...prev, photoURL: resolvedPhoto }))
      setProfileMessage('Profile picture saved on this device.')
    } catch (error) {
      console.log('Could not upload profile picture:', error)
      setProfileMessage('Could not save profile picture locally. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleProfilePhotoDelete = async () => {
    if (!user?.uid) return

    const confirmed = window.confirm('Remove your profile picture and keep initials avatar instead?')
    if (!confirmed) return

    try {
      setProfileSaving(true)
      localStorage.removeItem(getProfilePhotoKey(user.uid))

      await setDoc(doc(db, 'users', user.uid), {
        photoURL: '',
        updatedAt: new Date().toISOString()
      }, { merge: true })

      await updateProfile(auth.currentUser, { photoURL: '' })
      setProfileDraft((prev) => ({ ...prev, photoURL: '' }))
      setProfileMessage('Profile picture removed.')
    } catch (error) {
      console.log('Could not remove profile picture:', error)
      setProfileMessage('Could not remove profile picture right now. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleProfileSave = async () => {
    if (!user?.uid) return

    const firstName = profileDraft.firstName.trim()
    const lastName = profileDraft.lastName.trim()

    if (!firstName) {
      setProfileMessage('First name is required.')
      return
    }

    try {
      setProfileSaving(true)
      const isLocalPhoto = String(profileDraft.photoURL || '').startsWith('data:')
      const cloudSafePhoto = isLocalPhoto ? '' : (profileDraft.photoURL || '')

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        secondName: lastName,
        photoURL: cloudSafePhoto,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      const displayName = `${firstName} ${lastName}`.trim()
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: cloudSafePhoto
      })

      setProfileMessage('Profile updated successfully.')
    } catch (error) {
      console.log('Could not save profile:', error)
      setProfileMessage('Could not save profile details right now.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!auth.currentUser) return

    const providerId = auth.currentUser.providerData?.[0]?.providerId || ''
    if (providerId !== 'password') {
      setSecurityMessage('Password updates are only available for email/password accounts.')
      return
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setSecurityMessage('Enter both current and new password.')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setSecurityMessage('New password should be at least 6 characters.')
      return
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email || '', passwordForm.currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, passwordForm.newPassword)
      setPasswordForm({ currentPassword: '', newPassword: '' })
      setSecurityMessage('Password updated successfully.')
    } catch (error) {
      console.log('Could not update password:', error)
      setSecurityMessage('Password update failed. Confirm your current password and try again.')
    }
  }

  const handleLogoutClick = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (!confirmed) return

    await logout()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    if (!user?.uid || !auth.currentUser) return

    const confirmed = window.confirm('Are you sure you want to delete your account permanently? This cannot be undone.')
    if (!confirmed) return

    const secondConfirmation = window.confirm('Final confirmation: delete your account and all learner data from Firebase?')
    if (!secondConfirmation) return

    try {
      const enrollmentSnapshot = await getDocs(query(collection(db, 'enrollments'), where('learnerId', '==', user.uid)))
      await Promise.all(enrollmentSnapshot.docs.map((item) => deleteDoc(doc(db, 'enrollments', item.id))))

      await Promise.all([
        deleteDoc(doc(db, 'users', user.uid)).catch(() => null),
        deleteDoc(doc(db, 'learnerProgress', user.uid)).catch(() => null)
      ])

      localStorage.removeItem(getProfilePhotoKey(user.uid))
      await deleteUser(auth.currentUser)
      navigate('/')
    } catch (error) {
      console.log('Could not delete account:', error)
      setSecurityMessage('Delete failed. You may need to log in again before deleting your account.')
    }
  }

  const updateBiometricPreference = async (enabled) => {
    if (!enabled) {
      setSettingsPrefs((prev) => ({ ...prev, biometricAuth: false }))
      return
    }

    try {
      if (!window.PublicKeyCredential) {
        setSecurityMessage('Biometric authentication is not supported on this device/browser.')
        return
      }

      const isPlatformAuthenticatorAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!isPlatformAuthenticatorAvailable) {
        setSecurityMessage('Biometric authentication is unavailable on this device.')
        return
      }

      setSettingsPrefs((prev) => ({ ...prev, biometricAuth: true }))
      setSecurityMessage('Biometric preference enabled. You can use it when secure unlock flow is configured.')
    } catch (error) {
      setSecurityMessage('Could not enable biometric preference right now.')
    }
  }

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

  const quickResumeCourses = useMemo(() => {
    return myCourses
      .filter((course) => {
        const completion = progressMap[course.id]?.completion || 0
        return completion < 100
      })
      .slice(0, 3)
  }, [myCourses, progressMap])

  const completedCourseTitles = useMemo(() => {
    return myCourses
      .filter((course) => (progressMap[course.id]?.completion || 0) >= 100)
      .map((course) => course.title || 'Untitled Course')
  }, [myCourses, progressMap])

  const completedCourses = useMemo(() => {
    return myCourses
      .filter((course) => (progressMap[course.id]?.completion || 0) >= 100)
      .map((course) => ({
        id: course.id,
        title: course.title || 'Untitled Course',
        teacherName: course.teacherName || course.tutorName || 'Tutor',
        completedAt: progressMap[course.id]?.updatedAt || progressMap[course.id]?.lastActiveAt || new Date().toISOString()
      }))
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
    const hasStartedAnyCourse = Object.values(progressMap).some((item) => Boolean(item.started) || (item.completion || 0) > 0)
    const derivedBadges = []
    const derivedMilestones = []

    if (hasStartedAnyCourse) {
      derivedMilestones.push('First Course Started')
    }

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

  }

  // Language Practice is temporarily disabled while the section is being redesigned.
  useEffect(() => {
    if (activeSection === 'language') {
      setActiveSection('culture')
    }
  }, [activeSection])

  const markAllNotificationsRead = () => {
    if (!user?.uid) return

    const now = new Date().toISOString()
    setAnnouncementSeenAt(now)
    localStorage.setItem(getAnnouncementSeenKey(user.uid), now)
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

  function isCoursePublished(course) {
    return String(course?.status || '').trim().toLowerCase() === 'published'
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
          ? {
              tone: 'success',
              title: 'Purchase successful',
              message: `${course.title || 'Course'} is now in your library. You can continue from the store anytime.`
            }
          : {
              tone: 'success',
              title: 'Course added',
              message: `${course.title || 'Course'} is now in your courses and still visible in the store.`
            }
      )
      setTimeout(() => setActionToast(null), 2600)
    } catch (error) {
      console.log('Could not sync enrollment to cloud, keeping local backup:', error)
      setActionToast({
        tone: 'warning',
        title: 'Saved offline',
        message: `${course.title || 'Course'} was saved locally and will sync when the connection stabilizes.`
      })
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

      setDoc(doc(db, 'learnerProgress', user.uid), {
        courses: nextProgressMap,
        lastActiveCourseId: courseId,
        updatedAt: nowIso
      }, { merge: true }).catch((error) => {
        console.log('Could not sync resume progress immediately:', error)
      })
    }
    navigate('/course-content', { state: { courseId, fromResume: true } })
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

  const unseenAnnouncementsCount = useMemo(() => {
    if (!announcementSeenAt) return learnerAnnouncements.length
    const seenTime = toMs(announcementSeenAt)
    return learnerAnnouncements.filter((item) => toMs(item.createdAt) > seenTime).length
  }, [learnerAnnouncements, announcementSeenAt])

  const handleDownloadCertificate = (courseTitle, completedAt, tutorName) => {
    const learnerDisplayName = learnerName || 'Learner'
    const completionDate = (() => {
      const parsed = new Date(completedAt || new Date().toISOString())
      if (Number.isNaN(parsed.getTime())) return new Date().toLocaleDateString()
      return parsed.toLocaleDateString()
    })()

    const safeName = learnerDisplayName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safeCourse = (courseTitle || 'Course').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safeTutorName = (tutorName || 'Tutor').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safeAuthorityName = 'Kombo Steve'
    const logoHref = `${window.location.origin}/images/magicaal-logo1-removebg-preview.png`

    const certificateSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1130" viewBox="0 0 1600 1130">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8f4ea" />
      <stop offset="100%" stop-color="#e7f0e8" />
    </linearGradient>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d4a24f" />
      <stop offset="100%" stop-color="#b18233" />
    </linearGradient>
  </defs>
  <rect width="1600" height="1130" fill="url(#bg)" />
  <rect x="34" y="34" width="1532" height="1062" fill="none" stroke="#1f6f43" stroke-width="4" />
  <rect x="58" y="58" width="1484" height="1014" fill="none" stroke="#d4a24f" stroke-width="2" />
  <image href="${logoHref}" x="700" y="70" width="200" height="116" preserveAspectRatio="xMidYMid meet" />
  <text x="800" y="242" text-anchor="middle" font-family="Georgia, serif" font-size="68" letter-spacing="6" fill="#1f6f43">CERTIFICATE</text>
  <text x="800" y="292" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="25" letter-spacing="7" fill="#485047">OF COMPLETION</text>
  <text x="800" y="354" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="28" fill="#5a6058">proudly presented to</text>
  <line x1="430" y1="450" x2="1170" y2="450" stroke="#9a9f97" stroke-width="1.5" />
  <text x="800" y="438" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="88" fill="#2f3f36">${safeName}</text>
  <text x="800" y="520" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="30" fill="#4f564f">for successfully completing</text>
  <text x="800" y="594" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#a3070c">${safeCourse}</text>
  <text x="800" y="650" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="25" fill="#596159">offered by ${safeTutorName}</text>
  <text x="800" y="706" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="24" fill="#596159">Completion date: ${completionDate}</text>
  <line x1="210" y1="894" x2="650" y2="894" stroke="#8b918a" stroke-width="1.8" />
  <text x="430" y="872" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="54" fill="#1f6f43">${safeAuthorityName}</text>
  <text x="430" y="938" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="21" fill="#555d55">Magical Africa Academy</text>
  <line x1="950" y1="894" x2="1390" y2="894" stroke="#8b918a" stroke-width="1.8" />
  <text x="1170" y="872" text-anchor="middle" font-family="Brush Script MT, Segoe Script, cursive" font-size="54" fill="#1f6f43">${safeTutorName}</text>
  <text x="1170" y="938" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="21" fill="#555d55">Course Tutor</text>
  <text x="130" y="1012" text-anchor="start" font-family="Poppins, Arial, sans-serif" font-size="19" fill="#667065">Certificate ID: MA-${Date.now()}</text>
</svg>`

    const blob = new Blob([certificateSvg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(courseTitle || 'course').replace(/\s+/g, '-').toLowerCase()}-certificate.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`learner-dashboard ${displayPrefs.compactCards ? 'learner-dashboard--compact' : ''} ${displayPrefs.reduceMotion ? 'learner-dashboard--reduced-motion' : ''} ${settingsPrefs.darkMode ? 'learner-dashboard--dark' : ''}`}>
      <div className='learner-shell'>
        <aside className='learner-sidebar'>
          <button className='learner-back-btn' onClick={() => navigate('/')}>
            <FiChevronLeft aria-hidden='true' />
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
                  <button className={`learner-nav-subitem ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => openSection('profile')}>
                    Profile & Settings
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => openSection('settings')}>
                    Settings
                  </button>
                  <button className={`learner-nav-subitem ${activeSection === 'culture' ? 'active' : ''}`} onClick={() => openSection('culture')}>
                    Cultural Exploration Hub
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className='learner-main'>
          {!loading && (
            <div className='learner-greeting'>
              <div className='learner-greeting-top'>
                <div>
                  <h3>Welcome, <span className='learner-name-highlight'>{learnerName}</span></h3>
                </div>
                <div className='learner-top-actions'>
                  <span className='learner-top-stat'>{myCourses.length} course{myCourses.length === 1 ? '' : 's'} in your library</span>
                  <button className='learner-alert-bell' type='button' onClick={() => openSection('notifications')}>
                    <FiBell aria-hidden='true' />
                    {unseenAnnouncementsCount > 0 && <span>{unseenAnnouncementsCount}</span>}
                  </button>

                  <div className='learner-profile-menu' ref={profileMenuRef}>
                    <button
                      className='Account-icon learner-profile-trigger'
                      type='button'
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      aria-expanded={profileMenuOpen}
                    >
                      {profileDraft.photoURL
                        ? <img src={profileDraft.photoURL} alt='Profile avatar' className='learner-avatar-thumb' />
                        : <span className='learner-avatar-fallback'>{avatarInitials || 'L'}</span>}
                    </button>

                    {profileMenuOpen && (
                      <div className='learner-profile-dropdown'>
                        <p className='learner-profile-name'>{learnerName}</p>
                        <p className='learner-profile-email'>{user?.email || 'No email on file'}</p>
                        <button type='button' onClick={() => { openSection('profile'); setProfileMenuOpen(false) }}>
                          <strong>Profile</strong>
                          <small>View your account details</small>
                        </button>
                        <button type='button' onClick={() => { openSection('settings'); setProfileMenuOpen(false) }}>
                          <strong>Settings</strong>
                          <small>Security, sync, notifications, and appearance</small>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

          {!loading && quickResumeCourses.length > 0 && activeSection === 'store' && !quickResumeClosed && (
            <section className='learner-panel learner-quick-resume'>
              <div className='learner-quick-resume-head'>
                <h1><FiPlayCircle /> Quick Resume</h1>
                <button
                  type='button'
                  className='learner-quick-resume-close'
                  onClick={() => setQuickResumeClosed(true)}
                  aria-label='Close quick resume'
                >
                  <FiX aria-hidden='true' />
                </button>
              </div>
              <div className='learner-quick-resume-row'>
                {quickResumeCourses.map((course) => {
                  const progress = progressMap[course.id] || {}
                  const completion = progress.completion || 0

                  return (
                    <article key={course.id} className='learner-quick-resume-card'>
                      <h3>{course.title || 'Untitled Course'}</h3>
                      <p>{getNextLessonLabel(course, progress)}</p>
                      <div className='learner-progress-row'>
                        <p>Progress: {completion}%</p>
                        <div className={`learner-progress-bar ${completion > 0 && completion < 100 ? 'in-progress' : ''}`}>
                          <div style={{ width: `${completion}%` }} />
                        </div>
                      </div>
                      <button className='learner-resume-btn' type='button' onClick={() => handleResumeCourse(course.id)}>
                        Continue
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {!loading && activeSection === 'store' && (
            <section className={`learner-panel learner-panel--store ${storeView === 'free' ? 'learner-panel--store-free' : ''}`}>
              {storeView !== 'free' && <h1><FiShoppingBag /> Course Store</h1>}
              {storeView === 'all' ? (
                <div className='learner-store-badges'>
                  <button
                    className='active'
                  >
                    {publishedStoreCourses} Published
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
                  <span className='learner-store-free-pill'>{sortedSuggestedCoursesForView.length} Published Now</span>
                  <span className='learner-store-free-pill'>Last {publishedNowWindowDays} Days</span>
                </div>
              )}

              {actionToast && (
                <article className={`learner-inline-toast learner-inline-toast--${actionToast.tone || 'success'}`}>
                  <h3>{actionToast.title}</h3>
                  <p>{actionToast.message}</p>
                </article>
              )}

              <div className='learner-store-controls'>
                <label className='learner-store-search' htmlFor='learner-store-search'>
                  <FiSearch aria-hidden='true' />
                  <input
                    id='learner-store-search'
                    type='text'
                    value={courseSearchTerm}
                    onChange={(e) => setCourseSearchTerm(e.target.value)}
                    placeholder='Search by course title, tutor, or keyword'
                  />
                </label>

                <label className='learner-store-filter' htmlFor='learner-store-filter'>
                  <span>Filter by</span>
                  <select
                    id='learner-store-filter'
                    value={activeFilter || ''}
                    onChange={(e) => setActiveFilter(e.target.value || null)}
                  >
                    <option value=''>All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>

                <label className='learner-store-filter' htmlFor='learner-store-sort'>
                  <span>Sort by</span>
                  <select
                    id='learner-store-sort'
                    value={storeSortBy}
                    onChange={(e) => setStoreSortBy(e.target.value)}
                  >
                    <option value='newest'>Newest</option>
                    <option value='popular'>Most Popular</option>
                    <option value='price-low'>Price: Low to High</option>
                    <option value='price-high'>Price: High to Low</option>
                  </select>
                </label>

                <button
                  className='learner-reset-filters-btn'
                  type='button'
                  disabled={!hasActiveStoreFilters}
                  onClick={() => {
                    setCourseSearchTerm('')
                    setActiveFilter(null)
                    setStoreSortBy('newest')
                  }}
                >
                  Reset Filters
                </button>
              </div>

              {storeView !== 'published' ? (
                <div className='learner-suggested-header learner-suggested-header-note'>
                  <span>{storeView === 'free' ? 'Showing published free courses only.' : storeView === 'paid' ? 'Showing published premium courses only.' : 'Showing published courses only.'} {courseSearchTerm.trim() || activeFilter ? `Matched ${sortedSuggestedCoursesForView.length} result${sortedSuggestedCoursesForView.length === 1 ? '' : 's'}.` : ''}</span>
                </div>
              ) : (
                <div className='learner-suggested-header learner-suggested-header-note'>
                  <span>Showing newly published courses only. {courseSearchTerm.trim() || activeFilter ? `Matched ${sortedSuggestedCoursesForView.length} result${sortedSuggestedCoursesForView.length === 1 ? '' : 's'}.` : ''}</span>
                </div>
              )}

              <div
                className='learner-store-view-stage'
                key={`store-${storeView}-${activeFilter || 'all'}-published`}
              >
                {storeView === 'free' && (
                  <div className='learner-free-strip'>
                    <h2>Free Learning Picks</h2>
                    <p>
                      {sortedSuggestedCoursesForView.length > 0
                        ? `${sortedSuggestedCoursesForView.length} free course${sortedSuggestedCoursesForView.length > 1 ? 's' : ''} ready for you right now.`
                        : 'No free courses are available right now.'}
                    </p>
                  </div>
                )}

                {storeView === 'paid' && (
                  <div className='learner-free-strip'>
                    <h2>Premium Learning Picks</h2>
                    <p>
                      {sortedSuggestedCoursesForView.length > 0
                        ? `${sortedSuggestedCoursesForView.length} premium course${sortedSuggestedCoursesForView.length > 1 ? 's' : ''} available with deeper guided content.`
                        : 'No premium courses are available in this filter yet.'}
                    </p>
                  </div>
                )}

                {storeView === 'published' && (
                  <div className='learner-free-strip'>
                    <h2>Published Now</h2>
                    <p>
                      {sortedSuggestedCoursesForView.length > 0
                        ? `${sortedSuggestedCoursesForView.length} course${sortedSuggestedCoursesForView.length > 1 ? 's' : ''} published in the last ${publishedNowWindowDays} days.`
                        : `No newly published courses in the last ${publishedNowWindowDays} days for this filter.`}
                    </p>
                  </div>
                )}

                {sortedSuggestedCoursesForView.length === 0 && (
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
                  {sortedSuggestedCoursesForView.map(course => {
                  const price = getCoursePrice(course)
                  const isPaid = price > 0
                  const courseProgress = progressMap[course.id] || {}
                  const isOwned = Boolean(courseProgress.addedToLibrary || courseProgress.paid)
                  const isCompleted = (courseProgress.completion || 0) >= 100
                  const hasStarted = Boolean(courseProgress.started || (courseProgress.completion || 0) > 0)
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
                        {isOwned && (
                          <span className='learner-course-state-pill'>
                            {isCompleted ? 'Completed' : hasStarted ? 'In Progress' : 'Already Purchased'}
                          </span>
                        )}
                        {isOwned && hasStarted && !isCompleted && (
                          <span className='learner-continue-pill'>Continue where you left off</span>
                        )}
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
                            disabled={isAcquiring}
                            onClick={() => {
                              if (isOwned) {
                                if (isCompleted) {
                                  handleViewCourseDetails(course.id)
                                  return
                                }
                                handleResumeCourse(course.id)
                                return
                              }

                              handleAcquireCourse(course)
                            }}
                          >
                            {isOwned
                              ? (isCompleted ? 'Review Course' : hasStarted ? 'Continue Course' : 'Start Course')
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
                  <h3><FiBookOpen /> Course Completion</h3>
                  <p>{summary.completion}%</p>
                </article>
                <article className='learner-metric-card'>
                  <h3><FiCheckCircle /> Lessons Completed</h3>
                  <p>{summary.lessonsCompleted}</p>
                </article>
                <article className='learner-metric-card'>
                  <h3><FiActivity /> Streak</h3>
                  <p>{summary.streak} days</p>
                </article>
                <article className='learner-metric-card'>
                  <h3><FiClock /> Time Spent Learning</h3>
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
                  const hasStarted = Boolean(
                    progress.started ||
                    completion > 0 ||
                    (progress.completedLessonIds || []).length > 0
                  )
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
                            <span>{completion >= 100 ? 'Completed successfully' : progress.started ? 'In Progress' : 'Ready to Start'}</span>
                          </div>
                          {courseView === 'in-progress' && (
                            <p className='learner-inprogress-note'>
                              Lessons in progress: {progress.lessonsCompleted || 0} • Completion: {completion}%
                            </p>
                          )}
                          {courseView === 'ready' && (
                            <p className='learner-inprogress-note'>
                              Not started yet. Progress: 0%.
                            </p>
                          )}
                        </div>

                        <div className='learner-progress-row'>
                          <p>Progress: {completion}%</p>
                          <div className={`learner-progress-bar ${completion > 0 && completion < 100 ? 'in-progress' : ''}`}>
                            <div style={{ width: `${completion}%` }} />
                          </div>
                        </div>

                        <p className='learner-last-opened'>{lastOpenedLabel}</p>
                        <p className='learner-next-lesson'>{nextLessonLabel}</p>

                        {(courseView === 'completed' || isCompleted) ? (
                          <button className='learner-resume-btn learner-resume-btn-secondary' onClick={() => handleViewCourseDetails(course.id)}>
                            Review Course
                          </button>
                        ) : (
                          <button className='learner-resume-btn' onClick={() => handleResumeCourse(course.id)}>
                            {hasStarted ? 'Resume' : 'Start Course'}
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
              <h1><FiBell /> Notifications</h1>
              {learnerAnnouncements.length === 0 ? (
                <p className='learner-empty'>No announcements yet from your tutors.</p>
              ) : (
                <>
                  <div className='learner-notification-topbar'>
                    <span aria-live='polite'>{unseenAnnouncementsCount} unread</span>
                    <button type='button' onClick={markAllNotificationsRead}>Mark all as read</button>
                  </div>

                  <div className='learner-notification-list'>
                    {[
                      { id: 'today', label: 'Today', items: notificationGroups.today },
                      { id: 'week', label: 'This Week', items: notificationGroups.week },
                      { id: 'older', label: 'Older', items: notificationGroups.older }
                    ].map((group) => {
                      if (group.items.length === 0) return null

                      return (
                        <div key={group.id} className='learner-notification-group'>
                          <h3>{group.label}</h3>
                          {group.items.map((item) => {
                            const isUnread = toMs(item.createdAt) > toMs(announcementSeenAt)

                            return (
                              <article
                                key={item.id}
                                className={`learner-notification-card ${isUnread ? 'unread' : ''}`}
                                tabIndex={0}
                                aria-label={`${teacherNameById[item.teacherId] || 'Tutor Announcement'} update for ${item.courseTitle || 'general update'}`}
                              >
                                <h3>
                                  {teacherNameById[item.teacherId] || 'Tutor Announcement'}
                                  {isUnread && <span className='learner-unread-dot'>New</span>}
                                </h3>
                                <span className='learner-notification-course'>{item.courseTitle || 'General update'}</span>
                                <p>{item.message || 'No message content.'}</p>
                                <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}</small>
                              </article>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </section>
          )}

          {!loading && activeSection === 'profile' && (
            <section className='learner-panel'>
              <h1>Profile</h1>

              {profileMessage && <p className='learner-profile-message'>{profileMessage}</p>}
              {securityMessage && <p className='learner-profile-message learner-profile-message-warning'>{securityMessage}</p>}

              <div className='learner-account-wrap'>
                <div className='learner-account-row'>
                  <div className='learner-account-avatar'>
                    {profileDraft.photoURL
                      ? <img src={profileDraft.photoURL} alt='Profile' />
                      : <span>{avatarInitials || 'L'}</span>}
                  </div>
                  <div className='learner-account-avatar-copy'>
                    <h3>Profile picture</h3>
                    <p>PNG, JPEG or WEBP under 2MB (saved on this device)</p>
                  </div>
                  <div className='learner-account-avatar-actions'>
                    <input
                      ref={profilePhotoInputRef}
                      type='file'
                      accept='image/png,image/jpeg,image/webp'
                      onChange={handleProfilePhotoUpload}
                      hidden
                    />
                    <button type='button' onClick={() => profilePhotoInputRef.current?.click()} disabled={profileSaving}>
                      <FiUpload aria-hidden='true' /> Upload new picture
                    </button>
                    <button type='button' onClick={handleProfilePhotoDelete} disabled={profileSaving}>Delete</button>
                  </div>
                </div>

                <div className='learner-account-group'>
                  <h3>Full name</h3>
                  <div className='learner-account-grid'>
                    <label>
                      <span>First name</span>
                      <input
                        type='text'
                        value={profileDraft.firstName}
                        onChange={(e) => setProfileDraft((prev) => ({ ...prev, firstName: e.target.value }))}
                        placeholder='First name'
                      />
                    </label>
                    <label>
                      <span>Last name</span>
                      <input
                        type='text'
                        value={profileDraft.lastName}
                        onChange={(e) => setProfileDraft((prev) => ({ ...prev, lastName: e.target.value }))}
                        placeholder='Last name'
                      />
                    </label>
                  </div>
                  <button type='button' className='learner-account-save-btn' onClick={handleProfileSave} disabled={profileSaving}>
                    Save profile
                  </button>
                </div>

                <div className='learner-account-group'>
                  <h3>Contact email</h3>
                  <p>Manage your account email used for receipts and communication.</p>
                  <div className='learner-account-email'>{user?.email || 'No email on file'}</div>
                </div>

                <div className='learner-account-group'>
                  <h3>Password</h3>
                  <p>Modify your current password.</p>
                  <div className='learner-account-grid'>
                    <label>
                      <span>Current password</span>
                      <input
                        type='password'
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder='Current password'
                      />
                    </label>
                    <label>
                      <span>New password</span>
                      <input
                        type='password'
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        placeholder='New password'
                      />
                    </label>
                  </div>
                  <button type='button' className='learner-account-save-btn' onClick={handlePasswordUpdate}>Update password</button>
                </div>

                <div className='learner-account-group'>
                  <h3>Account security</h3>
                  <p>Manage your account security.</p>
                  <div className='learner-account-danger-zone'>
                    <button type='button' className='learner-security-btn' onClick={handleLogoutClick}>
                      <FiLogOut aria-hidden='true' /> Logout
                    </button>
                    <button type='button' className='learner-security-btn learner-security-btn-danger' onClick={handleDeleteAccount}>
                      <FiTrash2 aria-hidden='true' /> Delete my account
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'settings' && (
            <section className='learner-panel'>
              <h1>Settings</h1>
              <div className='learner-settings-grid'>
                <article className='learner-settings-card'>
                  <h3>Security</h3>
                  <label className='learner-setting-row'>
                    <div>
                      <strong>Biometric authentication</strong>
                      <p>Allow this device to use biometrics for secure unlock on supported mobile devices.</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={settingsPrefs.biometricAuth}
                      onChange={(e) => updateBiometricPreference(e.target.checked)}
                    />
                  </label>
                </article>

                <article className='learner-settings-card'>
                  <h3>Notifications</h3>
                  <label className='learner-setting-row'>
                    <div>
                      <strong>Notifications</strong>
                      <p>Receive course updates and account alerts.</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={settingsPrefs.notifications}
                      onChange={(e) => setSettingsPrefs((prev) => ({ ...prev, notifications: e.target.checked }))}
                    />
                  </label>
                </article>

                <article className='learner-settings-card'>
                  <h3>Sync</h3>
                  <label className='learner-setting-row'>
                    <div>
                      <strong>Cloud sync</strong>
                      <p>Sync your dashboard data across all devices.</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={settingsPrefs.cloudSync}
                      onChange={(e) => setSettingsPrefs((prev) => ({ ...prev, cloudSync: e.target.checked }))}
                    />
                  </label>
                </article>

                <article className='learner-settings-card'>
                  <h3>Appearance</h3>
                  <label className='learner-setting-row'>
                    <div>
                      <strong>Dark mode</strong>
                      <p>Switch learner dashboard between light and dark mode.</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={settingsPrefs.darkMode}
                      onChange={(e) => setSettingsPrefs((prev) => ({ ...prev, darkMode: e.target.checked }))}
                    />
                  </label>

                  <label className='learner-setting-row'>
                    <div>
                      <strong>Compact cards</strong>
                      <p>Reduce card height to show more content on screen.</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={displayPrefs.compactCards}
                      onChange={(e) => setDisplayPrefs((prev) => ({ ...prev, compactCards: e.target.checked }))}
                    />
                  </label>

                  <label className='learner-setting-row'>
                    <div>
                      <strong>Reduce motion</strong>
                      <p>Minimize dashboard animations and transitions.</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={displayPrefs.reduceMotion}
                      onChange={(e) => setDisplayPrefs((prev) => ({ ...prev, reduceMotion: e.target.checked }))}
                    />
                  </label>
                </article>
              </div>
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
                  : completedCourses.map((course) => (
                    <span key={course.id} className='learner-certificate-item'>
                      <strong>Certificate:</strong> {course.title}
                      <button
                        className='learner-certificate-btn'
                        type='button'
                        onClick={() => handleDownloadCertificate(course.title, course.completedAt, course.teacherName)}
                      >
                        Download Certificate
                      </button>
                    </span>
                  ))}
              </div>
            </section>
          )}

          {!loading && activeSection === 'culture' && (
            <section className='learner-panel learner-panel--culture'>
              <h1>Cultural Exploration Hub</h1>
              <div className='learner-culture-grid'>
                <article className='learner-culture-card'>
                  <img src='/images/maasai-land2.jpg' alt='Maasai community and landscape' className='learner-culture-card-image' />
                  <div className='learner-culture-card-content'>
                    <h3>Featured Community of the Week</h3>
                    <p>Maasai oral storytelling and age-set traditions.</p>
                  </div>
                </article>

                <article className='learner-culture-card'>
                  <img src='/images/african-music.jpeg' alt='African cultural performance with music and dance' className='learner-culture-card-image' />
                  <div className='learner-culture-card-content'>
                    <h3>Cultural Practices</h3>
                    <p>Music, food, clothing, and ceremony spotlights from active courses.</p>
                  </div>
                </article>

                <article className='learner-culture-card'>
                  <img src='/images/African-storytelling2.jpg' alt='African storytelling gathering' className='learner-culture-card-image' />
                  <div className='learner-culture-card-content'>
                    <h3>Interactive Stories</h3>
                    <p>Short story-based learning moments connected to your enrolled lessons.</p>
                  </div>
                </article>

                <article className='learner-culture-card'>
                  <img src='/images/african-pattern6.jpg' alt='African pattern and heritage artwork' className='learner-culture-card-image' />
                  <div className='learner-culture-card-content'>
                    <h3>Did You Know?</h3>
                    <p>Did you know Swahili has words borrowed from Arabic, Persian, and Portuguese?</p>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/*
            Language Practice is temporarily hidden until the redesign is complete.
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
          */}
        </main>
      </div>
    </div>
  )
}

export default Learner
