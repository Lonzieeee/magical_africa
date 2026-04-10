import React, { useMemo, useState, useEffect, useRef } from 'react'
import { FaBell, FaChevronLeft, FaStar } from 'react-icons/fa'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword, updateProfile } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import '../styles/teacher-dashboard.css'
import { buildTeacherDashboardPath, normalizeTeacherSection } from '../utils/dashboardRoute'

const getTeacherThemeKey = (uid) => `teacherDashboardTheme_${uid}`
const getTeacherSettingsPrefsKey = (uid) => `teacherDashboardSettings_${uid}`
const getTeacherProfilePhotoKey = (uid) => `teacherDashboardProfilePhoto_${uid}`
const courseTypeOptions = ['Language', 'Culture', 'History', 'Artisan', 'Pottery', 'Woodwork', 'Cooking']

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { section: routeSection } = useParams()
  const { user, userData } = useAuth()
  const [activeSection, setActiveSection] = useState('courses')
  const [menuOpen, setMenuOpen] = useState({
    teaching: true,
    learners: true,
    insights: false,
    content: false,
    account: false
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [themeMode, setThemeMode] = useState('light')
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [reviews, setReviews] = useState([])
  const [announcementText, setAnnouncementText] = useState('')
  const [announcementCourseId, setAnnouncementCourseId] = useState('')
  const [announcementStatus, setAnnouncementStatus] = useState({ type: '', text: '' })
  const [announcementPosting, setAnnouncementPosting] = useState(false)
  const [reviewCourseFilter, setReviewCourseFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [builderMode, setBuilderMode] = useState('create')
  const [editingCourseId, setEditingCourseId] = useState('')
  const [builderSaving, setBuilderSaving] = useState(false)
  const [builderStep, setBuilderStep] = useState('basics')
  const [builderMessage, setBuilderMessage] = useState('')
  const [builderErrors, setBuilderErrors] = useState({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [maxStudents, setMaxStudents] = useState('')
  const [courseType, setCourseType] = useState('')
  const [pricingModel, setPricingModel] = useState('free')
  const [regularPrice, setRegularPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [learningOutcomesInput, setLearningOutcomesInput] = useState('')
  const [courseSkillsInput, setCourseSkillsInput] = useState('')
  const [courseToolsInput, setCourseToolsInput] = useState('')
  const [courseLanguage, setCourseLanguage] = useState('English')
  const [courseSubtitlesLabel, setCourseSubtitlesLabel] = useState('Video subtitles available')
  const [courseUpdatedAtLabel, setCourseUpdatedAtLabel] = useState('')
  const [certificateDownloadUrl, setCertificateDownloadUrl] = useState('')
  const [certificateFileName, setCertificateFileName] = useState('')
  const [reviewsSeenAt, setReviewsSeenAt] = useState('')
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
  const [tutorProfileDraft, setTutorProfileDraft] = useState({
    headline: '',
    bio: '',
    teachingStyle: '',
    languages: '',
    expertiseTags: '',
    timezone: 'Africa/Nairobi',
    availabilityText: '',
    responseTimeLabel: ''
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const profilePhotoInputRef = useRef(null)
  const teacherAnnouncementsLoadedRef = useRef(false)
  const teacherReviewsLoadedRef = useRef(false)
  const shouldTrackEnrollments = ['students', 'analytics', 'reviews'].includes(activeSection)

  useEffect(() => {
    const requestedSection = normalizeTeacherSection(routeSection || 'courses')
    setActiveSection((prev) => (prev === requestedSection ? prev : requestedSection))
  }, [routeSection])

  useEffect(() => {
    const desiredPath = buildTeacherDashboardPath(activeSection)
    const currentSection = normalizeTeacherSection(routeSection || 'courses')
    const isCanonicalTeacherPath = location.pathname === desiredPath && currentSection === activeSection
    if (isCanonicalTeacherPath) return
    navigate(desiredPath, { replace: true })
  }, [activeSection, routeSection, location.pathname, navigate])

  useEffect(() => {
    if (!user?.uid) return
    fetchDashboardData()
  }, [user?.uid])

  useEffect(() => {
    const currentTeacherId = user?.uid
    if (!currentTeacherId || !shouldTrackEnrollments) return

    const enrollmentQuery = query(collection(db, 'enrollments'), where('teacherId', '==', currentTeacherId))
    const unsubscribe = onSnapshot(
      enrollmentQuery,
      (snapshot) => {
        const nextEnrollments = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        setEnrollments(nextEnrollments)
      },
      (error) => {
        console.log('Realtime enrollment listener failed:', error)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [shouldTrackEnrollments, user?.uid])

  useEffect(() => {
    teacherAnnouncementsLoadedRef.current = false
    teacherReviewsLoadedRef.current = false
    setAnnouncements([])
    setReviews([])
  }, [user?.uid])

  useEffect(() => {
    const uid = user?.uid
    if (!uid) return
    const seenAt = localStorage.getItem(`teacherReviewsSeenAt_${uid}`) || ''
    setReviewsSeenAt(seenAt)
  }, [user?.uid])

  useEffect(() => {
    const uid = user?.uid
    if (!uid) return
    const stored = localStorage.getItem(getTeacherThemeKey(uid))
    if (stored === 'dark' || stored === 'light') {
      setThemeMode(stored)
      return
    }
    setThemeMode('light')
  }, [user?.uid])

  useEffect(() => {
    const uid = user?.uid
    if (!uid) return
    localStorage.setItem(getTeacherThemeKey(uid), themeMode)
  }, [themeMode, user?.uid])

  useEffect(() => {
    const uid = user?.uid
    if (!uid) return
    const storedTheme = localStorage.getItem(getTeacherThemeKey(uid))
    const resolvedTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light'
    const stored = localStorage.getItem(getTeacherSettingsPrefsKey(uid))
    if (!stored) {
      setSettingsPrefs((prev) => ({ ...prev, darkMode: resolvedTheme === 'dark' }))
      return
    }

    try {
      const parsed = JSON.parse(stored)
      const nextPrefs = {
        darkMode: Boolean(parsed?.darkMode),
        biometricAuth: Boolean(parsed?.biometricAuth),
        notifications: parsed?.notifications !== false,
        cloudSync: parsed?.cloudSync !== false
      }
      setSettingsPrefs(nextPrefs)
      if ((nextPrefs.darkMode ? 'dark' : 'light') !== resolvedTheme) {
        setThemeMode(nextPrefs.darkMode ? 'dark' : 'light')
      }
    } catch {
      setSettingsPrefs((prev) => ({ ...prev, darkMode: resolvedTheme === 'dark' }))
    }
  }, [user?.uid])

  useEffect(() => {
    const uid = user?.uid
    if (!uid) return
    localStorage.setItem(getTeacherSettingsPrefsKey(uid), JSON.stringify(settingsPrefs))
  }, [settingsPrefs, user?.uid])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return undefined
    const handleEscape = (event) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen])

  useEffect(() => {
    setSidebarOpen(false)
  }, [activeSection])

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const localPhoto = localStorage.getItem(getTeacherProfilePhotoKey(uid)) || ''
    setProfileDraft({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || userData?.secondName || '',
      photoURL: localPhoto || userData?.photoURL || auth.currentUser?.photoURL || ''
    })

    const tp = userData?.tutorProfile || {}
    const draftLanguages = Array.isArray(tp.languages)
      ? tp.languages.join(', ')
      : String(tp.languages || '')
    const draftExpertise = Array.isArray(tp.expertiseTags)
      ? tp.expertiseTags.join(', ')
      : String(tp.expertiseTags || '')

    setTutorProfileDraft({
      headline: String(tp.headline || ''),
      bio: String(tp.bio || ''),
      teachingStyle: String(tp.teachingStyle || ''),
      languages: draftLanguages,
      expertiseTags: draftExpertise,
      timezone: String(tp.timezone || 'Africa/Nairobi'),
      availabilityText: String(tp.availabilityText || ''),
      responseTimeLabel: String(tp.responseTimeLabel || '')
    })
  }, [user?.uid, userData])

  useEffect(() => {
    if (courses.length === 0) {
      setAnnouncementCourseId('')
      setReviewCourseFilter('')
      return
    }

    if (!announcementCourseId || !courses.some(course => course.id === announcementCourseId)) {
      setAnnouncementCourseId(courses[0].id)
    }

    if (reviewCourseFilter && !courses.some(course => course.id === reviewCourseFilter)) {
      setReviewCourseFilter('')
    }
  }, [courses, announcementCourseId, reviewCourseFilter])

  // ─── UPDATED fetchDashboardData — scoped queries, no full-collection reads ──
  const fetchDashboardData = async () => {
    try {
      const currentTeacherId = user?.uid
      if (!currentTeacherId) {
        setCourses([])
        setEnrollments([])
        setAnnouncements([])
        setReviews([])
        setLoading(false)
        return
      }

      // FIX: was fetching ALL courses — now scoped to this teacher only
      const coursesSnapshot = await getDocs(
        query(
          collection(db, 'courses'),
          where('teacherId', '==', currentTeacherId)
        )
      )

      const myCourses = coursesSnapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
          const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()
          return bTime - aTime
        })

      setCourses(myCourses)

    } catch (err) {
      console.log('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherAnnouncements = async () => {
    const currentTeacherId = user?.uid
    if (!currentTeacherId) return
    try {
      const announcementSnapshot = await getDocs(
        query(collection(db, 'announcements'), where('teacherId', '==', currentTeacherId))
      )
      const teacherAnnouncements = announcementSnapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      setAnnouncements(teacherAnnouncements)
      teacherAnnouncementsLoadedRef.current = true
    } catch (err) {
      console.log('Error fetching teacher announcements:', err)
    }
  }

  const fetchTeacherReviews = async () => {
    const currentTeacherId = user?.uid
    if (!currentTeacherId) return
    try {
      const myCourseIds = new Set(courses.map((course) => course.id))
      const myCourseIdList = courses.map((course) => course.id).filter(Boolean)
      const chunkBy = (items, size) => {
        const chunks = []
        for (let i = 0; i < items.length; i += size) {
          chunks.push(items.slice(i, i + size))
        }
        return chunks
      }

      const reviewsQueryByTeacher = getDocs(
        query(collection(db, 'reviews'), where('teacherId', '==', currentTeacherId))
      )

      const reviewCourseChunks = chunkBy(myCourseIdList, 10)
      const reviewsQueryByCourse = reviewCourseChunks.length > 0
        ? Promise.all(
          reviewCourseChunks.map((chunk) =>
            getDocs(query(collection(db, 'reviews'), where('courseId', 'in', chunk)))
          )
        )
        : Promise.resolve([])

      const [reviewByTeacherResult, reviewByCourseResult] = await Promise.allSettled([
        reviewsQueryByTeacher,
        reviewsQueryByCourse
      ])

      const reviewMap = new Map()

      if (reviewByTeacherResult.status === 'fulfilled') {
        reviewByTeacherResult.value.docs.forEach((d) => {
          reviewMap.set(d.id, { id: d.id, ...d.data() })
        })
      }

      if (reviewByCourseResult.status === 'fulfilled') {
        reviewByCourseResult.value.forEach((snapshot) => {
          snapshot.docs.forEach((d) => {
            if (!reviewMap.has(d.id)) {
              reviewMap.set(d.id, { id: d.id, ...d.data() })
            }
          })
        })
      }

      const myReviews = Array.from(reviewMap.values())
        .filter((review) => review.teacherId === currentTeacherId || myCourseIds.has(review.courseId))
        .sort((a, b) =>
          (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || '')
        )

      setReviews(myReviews)
      teacherReviewsLoadedRef.current = true
    } catch (err) {
      console.log('Error fetching teacher reviews:', err)
    }
  }

  useEffect(() => {
    if (activeSection !== 'messages' || teacherAnnouncementsLoadedRef.current) return
    fetchTeacherAnnouncements()
  }, [activeSection, user?.uid])

  useEffect(() => {
    if (activeSection !== 'reviews' || teacherReviewsLoadedRef.current) return
    fetchTeacherReviews()
  }, [activeSection, user?.uid, courses])

  const markReviewsSeen = () => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const now = new Date().toISOString()
    setReviewsSeenAt(now)
    localStorage.setItem(`teacherReviewsSeenAt_${uid}`, now)
  }

  useEffect(() => {
    if (activeSection !== 'reviews') return
    markReviewsSeen()
  }, [activeSection])

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await deleteDoc(doc(db, 'courses', courseId))
      setCourses(courses.filter(c => c.id !== courseId))
    } catch (err) {
      console.log('Error deleting course:', err)
    }
  }

  const resetBuilderForm = () => {
    setTitle('')
    setDescription('')
    setDifficulty('Beginner')
    setMaxStudents('')
    setCourseType('')
    setPricingModel('free')
    setRegularPrice('')
    setSalePrice('')
    setFeaturedImage('')
    setLearningOutcomesInput('')
    setCourseSkillsInput('')
    setCourseToolsInput('')
    setCourseLanguage('English')
    setCourseSubtitlesLabel('Video subtitles available')
    setCourseUpdatedAtLabel('')
    setCertificateDownloadUrl('')
    setCertificateFileName('')
    setEditingCourseId('')
    setBuilderMode('create')
    setBuilderStep('basics')
    setBuilderMessage('')
    setBuilderErrors({})
  }

  const populateBuilderForm = (course) => {
    setTitle(course.title || '')
    setDescription(course.description || '')
    setDifficulty(course.difficulty || 'Beginner')
    setMaxStudents(course.maxStudents || '')
    setCourseType(course.courseType || '')
    setPricingModel(course.pricingModel || 'free')
    setRegularPrice(course.regularPrice || '')
    setSalePrice(course.salePrice || '')
    setFeaturedImage(course.featuredImage || '')
    setLearningOutcomesInput(Array.isArray(course.learningOutcomes) ? course.learningOutcomes.join('\n') : '')
    setCourseSkillsInput(Array.isArray(course.courseSkills) ? course.courseSkills.join('\n') : '')
    setCourseToolsInput(Array.isArray(course.courseTools) ? course.courseTools.join('\n') : '')
    setCourseLanguage(course.courseLanguage || 'English')
    setCourseSubtitlesLabel(course.courseSubtitlesLabel || 'Video subtitles available')
    setCourseUpdatedAtLabel(course.courseUpdatedAtLabel || '')
    setCertificateDownloadUrl(course.certificateDownloadUrl || '')
    setCertificateFileName(course.certificateFileName || '')
    setEditingCourseId(course.id)
    setBuilderMode('edit')
    setBuilderMessage(`Editing ${course.title || 'course'}`)
  }

  const handleEdit = (course) => {
    populateBuilderForm(course)
    setBuilderStep('basics')
    setActiveSection('builder')
  }

  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === 'Published' ? 'Draft' : 'Published'
    try {
      await updateDoc(doc(db, 'courses', course.id), {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      })
      setCourses(prev => prev.map(item => (
        item.id === course.id ? { ...item, status: nextStatus } : item
      )))
    } catch (err) {
      console.log('Error updating status:', err)
    }
  }

  const handleCreateNew = () => {
    resetBuilderForm()
    setBuilderStep('basics')
    setActiveSection('builder')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFeaturedImage(reader.result || '')
      setBuilderErrors((prev) => ({ ...prev, featuredImage: '' }))
    }
    reader.readAsDataURL(file)
  }

  const handlePricingModelChange = (value) => {
    setPricingModel(value)
    setBuilderErrors((prev) => ({
      ...prev,
      pricingModel: '',
      regularPrice: '',
      salePrice: ''
    }))
    if (value === 'free') {
      setRegularPrice('0')
      setSalePrice('0')
    }
  }

  const validateBuilderForm = () => {
    const nextErrors = {}

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    const trimmedSkills = courseSkillsInput.trim()
    const trimmedTools = courseToolsInput.trim()
    const normalizedMaxStudents = String(maxStudents || '').trim()
    const normalizedRegularPrice = Number(regularPrice || 0)
    const normalizedSalePrice = Number(salePrice || 0)

    if (trimmedTitle.length < 3) {
      nextErrors.title = 'Course title should be at least 3 characters.'
    }

    if (trimmedDescription.length < 12) {
      nextErrors.description = 'Description should be at least 12 characters.'
    }

    if (!trimmedSkills) {
      nextErrors.courseSkillsInput = 'Add at least one skill learners will gain.'
    }

    if (!trimmedTools) {
      nextErrors.courseToolsInput = 'Add at least one tool learners will use.'
    }

    if (normalizedMaxStudents && normalizedMaxStudents.toLowerCase() !== 'unlimited') {
      const asNumber = Number(normalizedMaxStudents)
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        nextErrors.maxStudents = 'Use a positive number or leave empty for Unlimited.'
      }
    }

    if (pricingModel === 'paid') {
      if (!Number.isFinite(normalizedRegularPrice) || normalizedRegularPrice <= 0) {
        nextErrors.regularPrice = 'Regular price must be greater than 0 for paid courses.'
      }

      if (!Number.isFinite(normalizedSalePrice) || normalizedSalePrice < 0) {
        nextErrors.salePrice = 'Sale price must be 0 or higher.'
      }

      if (Number.isFinite(normalizedRegularPrice) && Number.isFinite(normalizedSalePrice) && normalizedSalePrice > normalizedRegularPrice) {
        nextErrors.salePrice = 'Sale price cannot be greater than regular price.'
      }
    }

    setBuilderErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const saveCourse = async () => {
    if (!auth.currentUser) {
      setBuilderMessage('You must be logged in to save a course.')
      return null
    }

    if (!validateBuilderForm()) {
      setBuilderMessage('Please fix highlighted fields before continuing.')
      return null
    }

    setBuilderSaving(true)
    setBuilderMessage('')

    try {
      const parseListInput = (rawInput) => rawInput
        .split('\n')
        .map((line) => line.replace(/^[-*\u2022]\s*/, '').trim())
        .filter(Boolean)

      const parsedOutcomes = learningOutcomesInput
        .split('\n')
        .map((line) => line.replace(/^[-*\u2022]\s*/, '').trim())
        .filter(Boolean)
      const parsedSkills = parseListInput(courseSkillsInput)
      const parsedTools = parseListInput(courseToolsInput)

      const now = new Date()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const autoUpdatedLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`

      const teacherName = userData
        ? `${userData.firstName || ''} ${userData.secondName || userData.lastName || ''}`.trim()
        : auth.currentUser.displayName || 'Tutor'

      const payload = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        maxStudents: maxStudents || 'Unlimited',
        courseType: courseType || '',
        pricingModel,
        regularPrice: pricingModel === 'free' ? '0' : (regularPrice || '0'),
        salePrice: pricingModel === 'free' ? '0' : (salePrice || '0'),
        featuredImage: featuredImage || '',
        learningOutcomes: parsedOutcomes,
        courseSkills: parsedSkills,
        courseTools: parsedTools,
        courseLanguage: courseLanguage.trim() || 'English',
        courseSubtitlesLabel: courseSubtitlesLabel.trim() || 'Video subtitles available',
        courseUpdatedAtLabel: courseUpdatedAtLabel.trim() || autoUpdatedLabel,
        certificateDownloadUrl: certificateDownloadUrl.trim(),
        certificateFileName: certificateFileName.trim(),
        teacherName,
        teacherId: auth.currentUser.uid,
        updatedAt: new Date().toISOString()
      }

      if (editingCourseId) {
        await updateDoc(doc(db, 'courses', editingCourseId), payload)
        setCourses(prev => prev.map(item => (item.id === editingCourseId ? { ...item, ...payload } : item)))
        localStorage.setItem('currentCourseId', editingCourseId)
        setBuilderMessage('Course updated successfully.')
        return editingCourseId
      }

      const docRef = await addDoc(collection(db, 'courses'), {
        ...payload,
        createdAt: new Date().toISOString(),
        status: 'Draft',
        topics: []
      })

      setCourses(prev => [
        { ...payload, createdAt: new Date().toISOString(), status: 'Draft', topics: [], id: docRef.id },
        ...prev
      ])
      setEditingCourseId(docRef.id)
      setBuilderMode('edit')
      localStorage.setItem('currentCourseId', docRef.id)
      setBuilderMessage('Course created successfully. You can continue with curriculum.')
      return docRef.id
    } catch (err) {
      console.log('Error saving course:', err)
      setBuilderMessage('Failed to save course. Please try again.')
      return null
    } finally {
      setBuilderSaving(false)
    }
  }

  const handleSaveAndGo = async (path) => {
    const courseId = await saveCourse()
    if (!courseId) return
    navigate(path, { state: { courseId } })
  }

  const handlePostAnnouncement = async () => {
    if (announcementPosting) return

    const currentUser = auth.currentUser
    if (!currentUser?.uid) {
      setAnnouncementStatus({ type: 'error', text: 'You are not signed in. Please sign in again and retry.' })
      return
    }

    const message = announcementText.trim()
    if (!message) {
      setAnnouncementStatus({ type: 'error', text: 'Write a message before posting.' })
      return
    }

    if (courses.length > 0 && !announcementCourseId) {
      setAnnouncementStatus({ type: 'error', text: 'Choose a target course before posting.' })
      return
    }

    const selectedCourse = courses.find(course => course.id === announcementCourseId)
    if (courses.length > 0 && !selectedCourse) {
      setAnnouncementStatus({ type: 'error', text: 'Selected course could not be found. Refresh and try again.' })
      return
    }

    try {
      setAnnouncementPosting(true)
      const createdAt = new Date().toISOString()
      const nextAnnouncement = {
        teacherId: currentUser.uid,
        courseId: selectedCourse?.id || '',
        courseTitle: selectedCourse?.title || '',
        message,
        type: 'course-announcement',
        createdAt
      }

      const docRef = await addDoc(collection(db, 'announcements'), {
        ...nextAnnouncement
      })

      setAnnouncements(prev => [
        { id: docRef.id, ...nextAnnouncement },
        ...prev
      ])
      setAnnouncementText('')
      setAnnouncementStatus({
        type: 'success',
        text: selectedCourse
          ? `Announcement posted to ${selectedCourse.title || 'selected course'}.`
          : 'General announcement posted.'
      })
    } catch (err) {
      console.log('Failed to post announcement:', err)
      const errorCode = err?.code || ''

      if (errorCode === 'permission-denied') {
        setAnnouncementStatus({ type: 'error', text: 'Firebase permission denied. Check Firestore rules for announcements write access.' })
      } else if (errorCode === 'unauthenticated') {
        setAnnouncementStatus({ type: 'error', text: 'Firebase reports unauthenticated session. Sign in again and retry.' })
      } else if (errorCode === 'unavailable') {
        setAnnouncementStatus({ type: 'error', text: 'Firestore service unavailable right now. Check network and retry in a moment.' })
      } else {
        setAnnouncementStatus({ type: 'error', text: 'Check your internet connection.' })
      }
    } finally {
      setAnnouncementPosting(false)
    }
  }

  const analytics = useMemo(() => {
    const normalizeCompletion = (value) => {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return 0
      return Math.max(0, Math.min(100, numeric))
    }

    const totalCourses = courses.length
    const published = courses.filter(course => course.status === 'Published').length
    const totalStudents = enrollments.length

    const totalCompletion = enrollments.reduce((acc, item) => {
      return acc + normalizeCompletion(item.completion)
    }, 0)

    const activeLearners = enrollments.reduce((acc, item) => {
      return acc + (normalizeCompletion(item.completion) > 0 ? 1 : 0)
    }, 0)

    const avgCompletion = totalStudents === 0
      ? 0
      : Math.round(totalCompletion / totalStudents)

    const activeRate = totalStudents === 0
      ? 0
      : Math.round((activeLearners / totalStudents) * 100)

    return {
      totalCourses,
      published,
      totalStudents,
      avgCompletion,
      engagementRate: Math.round((avgCompletion * 0.45) + (activeRate * 0.55))
    }
  }, [courses, enrollments])

  const coursePerformance = useMemo(() => {
    const normalizeCompletion = (value) => {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return 0
      return Math.max(0, Math.min(100, numeric))
    }

    return courses.map(course => {
      const courseEnrollments = enrollments.filter(item => item.courseId === course.id)
      const avgCompletion = courseEnrollments.length > 0
        ? Math.round(courseEnrollments.reduce((acc, item) => acc + normalizeCompletion(item.completion), 0) / courseEnrollments.length)
        : 0

      return {
        id: course.id,
        title: course.title || 'Untitled Course',
        learners: courseEnrollments.length,
        avgCompletion
      }
    })
  }, [courses, enrollments])

  const chartCourses = useMemo(() => {
    return [...coursePerformance]
      .sort((a, b) => b.learners - a.learners)
      .slice(0, 6)
  }, [coursePerformance])

  const chartData = useMemo(() => {
    return chartCourses.map((item) => ({
      id: item.id,
      title: item.title,
      shortTitle: (item.title || 'Course').length > 14
        ? `${(item.title || 'Course').slice(0, 14)}...`
        : (item.title || 'Course'),
      learners: Number(item.learners || 0),
      completion: Number(item.avgCompletion || 0)
    }))
  }, [chartCourses])

  const chartScale = useMemo(() => {
    const maxLearners = chartData.reduce((max, item) => Math.max(max, Number(item.learners || 0)), 0)
    const roundedCap = maxLearners <= 10
      ? 10
      : Math.ceil(maxLearners / 5) * 5

    const rightAxisMax = maxLearners === 0
      ? 10
      : Math.max(10, roundedCap)

    const barSize = chartData.length >= 6
      ? 20
      : chartData.length >= 4
        ? 24
        : 30

    const lineType = chartData.length > 2 ? 'monotone' : 'linear'

    return {
      rightAxisDomain: [0, rightAxisMax],
      barSize,
      lineType
    }
  }, [chartData])

  const renderPerformanceTooltip = ({ active, payload }) => {
    if (!active || !Array.isArray(payload) || payload.length === 0) return null

    const row = payload[0]?.payload || {}
    const completionValue = Number(row.completion || 0)
    const learnerValue = Number(row.learners || 0)

    return (
      <div style={{ background: '#ffffff', border: '1px solid #d6dfd2', borderRadius: '10px', padding: '10px 12px', minWidth: '210px', boxShadow: '0 8px 22px rgba(24, 39, 24, 0.12)', lineHeight: 1.35 }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#5f6b5f' }}>Course</p>
        <p style={{ margin: '2px 0 8px 0', fontWeight: 700, color: '#1f2a1f', wordBreak: 'break-word' }}>{row.title || 'Untitled Course'}</p>
        <p style={{ margin: '3px 0', color: '#d5731a', fontWeight: 600 }}>Completion: {completionValue}%</p>
        <p style={{ margin: '3px 0', color: '#a3070c', fontWeight: 600 }}>Learners: {learnerValue}</p>
      </div>
    )
  }

  const renderCompletionPieTooltip = ({ active, payload }) => {
    if (!active || !Array.isArray(payload) || payload.length === 0) return null

    const row = payload[0]?.payload || {}
    const name = row.name || 'Segment'
    const learners = Number(row.value || 0)
    const percent = Number(row.percent || 0)

    return (
      <div style={{ background: '#ffffff', border: '1px solid #d6dfd2', borderRadius: '10px', padding: '10px 12px', minWidth: '185px', boxShadow: '0 8px 22px rgba(24, 39, 24, 0.12)', lineHeight: 1.35 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#1f2a1f' }}>{name}</p>
        <p style={{ margin: '4px 0 2px 0', color: '#324132' }}>Learners: {learners}</p>
        <p style={{ margin: 0, color: '#324132' }}>Share: {percent}%</p>
      </div>
    )
  }

  const completionPie = useMemo(() => {
    const base = { completed: 0, inProgress: 0, notStarted: 0, total: 0 }

    if (enrollments.length === 0) {
      return { ...base, percentages: { completed: 0, inProgress: 0, notStarted: 0 }, pieData: [] }
    }

    const normalizeCompletion = (value) => {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return 0
      return Math.max(0, Math.min(100, numeric))
    }

    const counts = enrollments.reduce((acc, item) => {
      const completion = normalizeCompletion(item.completion)
      if (completion >= 100) { acc.completed += 1 }
      else if (completion > 0) { acc.inProgress += 1 }
      else { acc.notStarted += 1 }
      return acc
    }, { ...base })

    counts.total = enrollments.length

    const toPercent = (value) => {
      if (counts.total === 0) return 0
      return Number(((value / counts.total) * 100).toFixed(1))
    }

    const percentages = {
      completed: toPercent(counts.completed),
      inProgress: toPercent(counts.inProgress),
      notStarted: toPercent(counts.notStarted)
    }

    const normalizedSum = Number((percentages.completed + percentages.inProgress + percentages.notStarted).toFixed(1))
    if (normalizedSum !== 100 && counts.total > 0) {
      percentages.notStarted = Number((percentages.notStarted + (100 - normalizedSum)).toFixed(1))
    }

    const pieData = [
      { name: 'Completed', value: counts.completed, percent: percentages.completed, color: '#1f6f43' },
      { name: 'In Progress', value: counts.inProgress, percent: percentages.inProgress, color: '#d5731a' },
      { name: 'Not Started', value: counts.notStarted, percent: percentages.notStarted, color: '#9aa59a' }
    ]

    return { ...counts, percentages, pieData }
  }, [enrollments])

  const reviewSummary = useMemo(() => {
    const totalReviews = reviews.length
    const averageRating = totalReviews === 0
      ? 0
      : (reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews)
    return { totalReviews, averageRating: Number(averageRating.toFixed(1)) }
  }, [reviews])

  const activeBuilderCourse = useMemo(() => {
    if (!editingCourseId) return null
    return courses.find((course) => course.id === editingCourseId) || null
  }, [courses, editingCourseId])

  const filteredReviews = useMemo(() => {
    if (!reviewCourseFilter) return reviews
    return reviews.filter((review) => review.courseId === reviewCourseFilter)
  }, [reviews, reviewCourseFilter])

  const filteredReviewSummary = useMemo(() => {
    const totalReviews = filteredReviews.length
    const averageRating = totalReviews === 0
      ? 0
      : (filteredReviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews)
    return { totalReviews, averageRating: Number(averageRating.toFixed(1)) }
  }, [filteredReviews])

  const enrollmentByLearnerCourse = useMemo(() => {
    const map = {}
    enrollments.forEach((item) => {
      const learnerId = item.learnerId || ''
      const courseId = item.courseId || ''
      if (!learnerId || !courseId) return
      map[`${learnerId}_${courseId}`] = Number(item.completion || 0)
    })
    return map
  }, [enrollments])

  const reviewRows = useMemo(() => {
    return filteredReviews.map((review) => {
      const key = `${review.learnerId || ''}_${review.courseId || ''}`
      const enrollmentCompletion = enrollmentByLearnerCourse[key]
      const completion = Number(review.completionPercent ?? enrollmentCompletion ?? review.completion ?? 0)
      const completionLabel = completion >= 100 ? 'Completed successfully' : `${completion}% complete`
      return { ...review, completion, completionLabel }
    })
  }, [filteredReviews, enrollmentByLearnerCourse])

  const unseenReviewsCount = useMemo(() => {
    if (!reviewsSeenAt) return reviews.length
    const seenTs = new Date(reviewsSeenAt).getTime()
    if (Number.isNaN(seenTs)) return reviews.length
    return reviews.filter((review) => {
      const ts = new Date(review.updatedAt || review.createdAt || 0).getTime()
      return !Number.isNaN(ts) && ts > seenTs
    }).length
  }, [reviews, reviewsSeenAt])

  const studentRows = useMemo(() => {
    const toTime = (value) => {
      if (!value) return 0
      const parsed = new Date(value).getTime()
      return Number.isNaN(parsed) ? 0 : parsed
    }

    return [...enrollments]
      .sort((a, b) => {
        const bTime = Math.max(toTime(b.updatedAt), toTime(b.lastActiveAt), toTime(b.createdAt), toTime(b.enrolledAt), toTime(b.purchasedAt))
        const aTime = Math.max(toTime(a.updatedAt), toTime(a.lastActiveAt), toTime(a.createdAt), toTime(a.enrolledAt), toTime(a.purchasedAt))
        return bTime - aTime
      })
      .map((item) => ({
        id: item.id,
        studentName: item.studentName || item.learnerName || item.studentEmail || item.learnerEmail || 'Learner',
        studentEmail: item.studentEmail || item.learnerEmail || 'N/A',
        courseTitle: item.courseTitle || 'Course',
        completion: item.completion || 0,
        paid: Boolean(item.paid),
        amountPaid: Number(item.amountPaid || 0),
        enrolledAt: item.enrolledAt || item.createdAt || item.purchasedAt || '',
        lastActiveAt: item.lastActiveAt || item.updatedAt || ''
      }))
  }, [enrollments])

  const quizInsights = useMemo(() => {
    const defaultSettings = { passMark: 70, attemptsAllowed: 3, feedbackMode: 'after-submit' }

    const courseRows = courses.map((course) => {
      const topics = Array.isArray(course.topics) ? course.topics : []
      let quizTopics = 0, totalQuestions = 0, configuredTopics = 0, customRuleTopics = 0

      topics.forEach((topic) => {
        const questions = Array.isArray(topic.quiz) ? topic.quiz.length : 0
        if (!questions) return
        quizTopics += 1
        totalQuestions += questions

        const settings = topic.assessmentSettings
        const hasSettings = Boolean(settings && typeof settings === 'object')
        if (hasSettings) configuredTopics += 1

        const passMark = Number(settings?.passMark ?? defaultSettings.passMark)
        const attemptsAllowed = Number(settings?.attemptsAllowed ?? defaultSettings.attemptsAllowed)
        const timeLimit = String(settings?.timeLimitMinutes ?? '').trim()
        const randomizeQuestions = Boolean(settings?.randomizeQuestions)
        const feedbackMode = settings?.feedbackMode ?? defaultSettings.feedbackMode

        const hasCustomRules = timeLimit !== '' || randomizeQuestions ||
          passMark !== defaultSettings.passMark ||
          attemptsAllowed !== defaultSettings.attemptsAllowed ||
          feedbackMode !== defaultSettings.feedbackMode

        if (hasCustomRules) customRuleTopics += 1
      })

      return { id: course.id, title: course.title || 'Untitled Course', topicCount: topics.length, quizTopics, totalQuestions, configuredTopics, customRuleTopics }
    })

    const totals = courseRows.reduce((acc, row) => ({
      coursesWithQuizzes: acc.coursesWithQuizzes + (row.quizTopics > 0 ? 1 : 0),
      quizTopics: acc.quizTopics + row.quizTopics,
      totalQuestions: acc.totalQuestions + row.totalQuestions,
      configuredTopics: acc.configuredTopics + row.configuredTopics,
      customRuleTopics: acc.customRuleTopics + row.customRuleTopics
    }), { coursesWithQuizzes: 0, quizTopics: 0, totalQuestions: 0, configuredTopics: 0, customRuleTopics: 0 })

    const topCourseRows = [...courseRows].filter((row) => row.quizTopics > 0).sort((a, b) => b.totalQuestions - a.totalQuestions)

    return { ...totals, courseRows, topCourseRows }
  }, [courses])

  const openQuizBuilderFromQuizzes = (courseId) => {
    if (courseId) {
      localStorage.setItem('currentCourseId', courseId)
      navigate('/lesson', { state: { courseId } })
      return
    }
    navigate('/lesson')
  }

  const openClassicCoursePage = async () => {
    const courseId = await saveCourse()
    if (!courseId) return
    navigate('/teacher')
  }

  const openClassicCurriculum = async () => {
    const courseId = await saveCourse()
    if (!courseId) return
    navigate('/curriculum', { state: { courseId } })
  }

  const openClassicLessonBuilder = async () => {
    const courseId = await saveCourse()
    if (!courseId) return
    navigate('/lesson', { state: { courseId } })
  }

  const toggleMenu = (menu) => {
    setMenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  const openTeacherSection = (section) => {
    setActiveSection(section)
    setSidebarOpen(false)
  }

  const toggleThemeMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(nextMode)
    setSettingsPrefs((prev) => ({ ...prev, darkMode: nextMode === 'dark' }))
  }

  const handleProfilePhotoUpload = async (event) => {
    const uid = auth.currentUser?.uid
    if (!uid) return

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
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('file-read-failed'))
        reader.readAsDataURL(selectedFile)
      })

      localStorage.setItem(getTeacherProfilePhotoKey(uid), photoURL)
      setProfileDraft((prev) => ({ ...prev, photoURL }))
      setProfileMessage('Profile picture saved on this device.')
    } catch {
      setProfileMessage('Could not save profile picture locally. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleProfilePhotoDelete = () => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const confirmed = window.confirm('Remove your profile picture and keep initials avatar instead?')
    if (!confirmed) return

    localStorage.removeItem(getTeacherProfilePhotoKey(uid))
    setProfileDraft((prev) => ({ ...prev, photoURL: '' }))
    setProfileMessage('Profile picture removed.')
  }

  const handleProfileSave = async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const firstName = profileDraft.firstName.trim()
    const lastName = profileDraft.lastName.trim()
    const publicDisplayName = `${firstName} ${lastName}`.trim()

    const languages = tutorProfileDraft.languages
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const expertiseTags = tutorProfileDraft.expertiseTags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (!firstName) {
      setProfileMessage('First name is required.')
      return
    }

    try {
      setProfileSaving(true)
      const isLocalPhoto = String(profileDraft.photoURL || '').startsWith('data:')
      const cloudSafePhoto = isLocalPhoto ? '' : (profileDraft.photoURL || '')

      await setDoc(doc(db, 'users', uid), {
        firstName, lastName, secondName: lastName,
        photoURL: cloudSafePhoto,
        tutorProfile: {
          displayName: publicDisplayName,
          headline: tutorProfileDraft.headline.trim(),
          bio: tutorProfileDraft.bio.trim(),
          teachingStyle: tutorProfileDraft.teachingStyle.trim(),
          languages,
          expertiseTags,
          timezone: tutorProfileDraft.timezone.trim() || 'Africa/Nairobi',
          availabilityText: tutorProfileDraft.availabilityText.trim(),
          responseTimeLabel: tutorProfileDraft.responseTimeLabel.trim(),
          photoUrl: cloudSafePhoto,
          updatedAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      }, { merge: true })

      const displayName = `${firstName} ${lastName}`.trim()
      await updateProfile(auth.currentUser, { displayName, photoURL: cloudSafePhoto })
      setProfileMessage('Profile and public tutor page details updated successfully.')
    } catch {
      setProfileMessage('Could not save profile details right now.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePreviewTutorPage = () => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    navigate(`/tutor-preview/${uid}`, { state: { previewFrom: 'teacher' } })
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
    } catch {
      setSecurityMessage('Password update failed. Confirm your current password and try again.')
    }
  }

  const handleLogoutClick = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (!confirmed) return
    await signOut(auth)
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    const uid = auth.currentUser?.uid
    if (!uid || !auth.currentUser) return

    const confirmed = window.confirm('Are you sure you want to delete your account permanently? This cannot be undone.')
    if (!confirmed) return

    const secondConfirmation = window.confirm('Final confirmation: delete your tutor account?')
    if (!secondConfirmation) return

    try {
      await deleteDoc(doc(db, 'users', uid)).catch(() => null)
      localStorage.removeItem(getTeacherProfilePhotoKey(uid))
      await deleteUser(auth.currentUser)
      navigate('/')
    } catch {
      setSecurityMessage('Delete failed. You may need to log in again before deleting your account.')
    }
  }

  const handleSaveDraftAndMove = async (nextStep) => {
    if (nextStep === 'curriculum') {
      await handleSaveAndGo('/curriculum')
      return
    }
    const courseId = await saveCourse()
    if (!courseId) return
    setBuilderStep(nextStep)
  }

  const handleBuilderStepChange = (nextStep) => {
    if (nextStep === 'basics') {
      setBuilderStep(nextStep)
      return
    }
    if (!editingCourseId) {
      setBuilderMessage('Save your draft in Basics first to unlock the next step.')
      return
    }
    setBuilderStep(nextStep)
  }

  const canAccessAdvancedBuilderSteps = Boolean(editingCourseId)
  const basicsCompleted = Boolean(editingCourseId)
  const curriculumCompleted = basicsCompleted && (
    builderStep === 'publish' ||
    (Array.isArray(activeBuilderCourse?.topics) && activeBuilderCourse.topics.length > 0)
  )
  const publishCompleted = basicsCompleted && (activeBuilderCourse?.status === 'Published')

  const builderMilestones = [
    { label: 'Basics Complete', done: basicsCompleted },
    { label: 'Curriculum Ready', done: curriculumCompleted },
    { label: 'Publish Ready', done: publishCompleted }
  ]

  return (
    <div className={`td-dashboard ${themeMode === 'dark' ? 'td-dashboard--dark' : ''}`}>
      <div className='td-mobile-topbar'>
        <button type='button' className='td-mobile-menu-btn' onClick={() => setSidebarOpen(true)} aria-label='Open tutor navigation' aria-expanded={sidebarOpen}>
          <span />
          <span />
          <span />
        </button>
        <div className='td-mobile-topbar-copy'>
          <strong>Tutor Dashboard</strong>
          <span>{userData?.firstName || user?.email || 'Teaching workspace'}</span>
        </div>
      </div>
      {sidebarOpen && <button type='button' className='td-sidebar-overlay' aria-label='Close tutor navigation' onClick={() => setSidebarOpen(false)} />}
      <div className='td-layout'>
        <aside className={`td-sidebar ${sidebarOpen ? 'td-sidebar--open' : ''}`}>
          <div className='td-sidebar-mobile-head'>
            <div className='td-sidebar-mobile-copy'>
              <strong>Navigate</strong>
              <span>Switch dashboard sections</span>
            </div>
            <button type='button' className='td-sidebar-close' onClick={() => setSidebarOpen(false)}>Close</button>
          </div>
          <button className='td-back-btn' onClick={() => navigate('/')}>
            <FaChevronLeft aria-hidden='true' />
            <span>Back to Website</span>
          </button>

          <div className='td-sidebar-brand'>
            <img src='/images/magicaal-logo1-removebg-preview.png' alt='Magical Africa logo' />
            <h2>Tutor Dashboard</h2>
          </div>

          <div className='td-nav-groups'>
            <div className='td-nav-group'>
              <button className={`td-nav-group-title ${menuOpen.teaching ? 'expanded' : ''}`} onClick={() => toggleMenu('teaching')} aria-expanded={menuOpen.teaching}>Teaching Hub</button>
              {menuOpen.teaching && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'courses' ? 'active' : ''}`} onClick={() => openTeacherSection('courses')}>Courses</button>
                  <button className={`td-nav-subitem ${activeSection === 'builder' ? 'active' : ''}`} onClick={() => openTeacherSection('builder')}>Course Builder</button>
                  <button className={`td-nav-subitem ${activeSection === 'quizzes' ? 'active' : ''}`} onClick={() => openTeacherSection('quizzes')}>Quizzes & Assessments</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button className={`td-nav-group-title ${menuOpen.learners ? 'expanded' : ''}`} onClick={() => toggleMenu('learners')} aria-expanded={menuOpen.learners}>Learners</button>
              {menuOpen.learners && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'students' ? 'active' : ''}`} onClick={() => openTeacherSection('students')}>Students</button>
                  <button className={`td-nav-subitem ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => openTeacherSection('messages')}>Messages</button>
                  <button className={`td-nav-subitem ${activeSection === 'reviews' ? 'active' : ''}`} onClick={() => openTeacherSection('reviews')}>Reviews</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button className={`td-nav-group-title ${menuOpen.insights ? 'expanded' : ''}`} onClick={() => toggleMenu('insights')} aria-expanded={menuOpen.insights}>Insights</button>
              {menuOpen.insights && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => openTeacherSection('analytics')}>Analytics</button>
                  <button className={`td-nav-subitem ${activeSection === 'earnings' ? 'active' : ''}`} onClick={() => openTeacherSection('earnings')}>Earnings</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button className={`td-nav-group-title ${menuOpen.content ? 'expanded' : ''}`} onClick={() => toggleMenu('content')} aria-expanded={menuOpen.content}>Cultural & Language</button>
              {menuOpen.content && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'culture' ? 'active' : ''}`} onClick={() => openTeacherSection('culture')}>Cultural Content</button>
                  <button className={`td-nav-subitem ${activeSection === 'language' ? 'active' : ''}`} onClick={() => openTeacherSection('language')}>Language Tools</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button className={`td-nav-group-title ${menuOpen.account ? 'expanded' : ''}`} onClick={() => toggleMenu('account')} aria-expanded={menuOpen.account}>Account</button>
              {menuOpen.account && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => openTeacherSection('profile')}>Profile</button>
                  <button className={`td-nav-subitem ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => openTeacherSection('settings')}>Settings</button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className='td-main'>
          {!loading && (
            <div className='td-top-alert-row'>
              <button className='td-theme-toggle' type='button' onClick={toggleThemeMode}>
                {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className='td-alert-bell' type='button' onClick={() => openTeacherSection('reviews')}>
                <FaBell aria-hidden='true' />
                {unseenReviewsCount > 0 && <span>{unseenReviewsCount}</span>}
              </button>
            </div>
          )}

          {loading && (
            <div className='app-loading-wrap'>
              <div className='app-loading-text' role='status' aria-live='polite' aria-label='Loading tutor dashboard'>
                <span>L</span>
                <span>O</span>
                <span>A</span>
                <span>D</span>
                <span>I</span>
                <span>N</span>
                <span>G</span>
              </div>
            </div>
          )}

          {!loading && activeSection === 'courses' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>TH</span>Teaching Hub</span>
                <p>Manage your active catalog, publish updates, and keep course quality consistent.</p>
              </div>
              <div className='td-header'>
                <h1>Courses<span className='td-published-badge'>{analytics.published} Published</span></h1>
                <button className='td-create-btn' onClick={handleCreateNew}>+ Create Course</button>
              </div>

              {courses.length === 0 && (
                <div className='td-empty'>
                  <p>You have not created any courses yet.</p>
                  <button className='td-empty-btn' onClick={handleCreateNew}>Create Your First Course</button>
                </div>
              )}

              <div className='td-course-grid'>
                {courses.map(course => (
                  <article key={course.id} className='td-course-card'>
                    <div className='td-course-cover'>
                      <span className={`td-course-status-chip ${(course.status || 'Draft') === 'Published' ? 'is-published' : 'is-draft'}`}>{course.status || 'Draft'}</span>
                      {course.featuredImage
                        ? <img src={course.featuredImage} alt={course.title || 'Course cover'} />
                        : <div className='td-course-cover-placeholder'>No Cover</div>}
                    </div>
                    <div className='td-course-content'>
                      <div className='td-course-info'>
                        <h3>{course.title || 'Untitled Course'}</h3>
                        <p>{course.description?.slice(0, 120) || 'No description yet.'}</p>
                        <div className='td-course-tags'>
                          <span className='td-tag-difficulty'>{course.difficulty || 'Beginner'}</span>
                          <span className='td-tag-price'>{course.pricingModel === 'free' ? 'Free' : `$${course.salePrice || course.regularPrice || '0'}`}</span>
                          <span className='td-tag-topics'>{course.topics?.length || 0} modules</span>
                          <span className='td-tag-status'>{course.status || 'Draft'}</span>
                        </div>
                      </div>
                      <div className='td-course-actions'>
                        <button className='td-edit-btn' onClick={() => handleEdit(course)}>Edit</button>
                        <button className='td-status-btn' onClick={() => handleToggleStatus(course)}>{course.status === 'Published' ? 'Move to Draft' : 'Publish'}</button>
                        <button className='td-delete-btn' onClick={() => handleDelete(course.id)}>Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!loading && activeSection === 'builder' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>CS</span>Creation Studio</span>
                <p>Design modules, pricing, and media in one flow before opening classic builders.</p>
              </div>
              <h1>Course Builder</h1>
              <div className='td-builder-layout'>
                <article className='td-builder-form'>
                  <h3>{builderMode === 'edit' ? 'Edit Course' : 'Create Course'}</h3>
                  {builderMessage && <p className='td-builder-message'>{builderMessage}</p>}
                  <p className='td-builder-help'>Follow the guided flow: save draft, structure curriculum, then publish.</p>

                  <div className='td-builder-stepper' role='tablist' aria-label='Course builder steps'>
                    <button className={`td-builder-step ${builderStep === 'basics' ? 'is-active' : ''} ${basicsCompleted ? 'is-complete' : ''}`} onClick={() => handleBuilderStepChange('basics')} role='tab' aria-selected={builderStep === 'basics'} type='button'>
                      <span className='td-builder-step-index'>{basicsCompleted ? '✓' : '1'}</span><span>Basics</span>
                    </button>
                    <button className={`td-builder-step ${builderStep === 'curriculum' ? 'is-active' : ''} ${curriculumCompleted ? 'is-complete' : ''} ${canAccessAdvancedBuilderSteps ? '' : 'is-locked'}`} onClick={() => handleBuilderStepChange('curriculum')} role='tab' aria-selected={builderStep === 'curriculum'} type='button' disabled={!canAccessAdvancedBuilderSteps}>
                      <span className='td-builder-step-index'>{curriculumCompleted ? '✓' : '2'}</span><span>Curriculum</span>
                    </button>
                    <button className={`td-builder-step ${builderStep === 'publish' ? 'is-active' : ''} ${publishCompleted ? 'is-complete' : ''} ${canAccessAdvancedBuilderSteps ? '' : 'is-locked'}`} onClick={() => handleBuilderStepChange('publish')} role='tab' aria-selected={builderStep === 'publish'} type='button' disabled={!canAccessAdvancedBuilderSteps}>
                      <span className='td-builder-step-index'>{publishCompleted ? '✓' : '3'}</span><span>Publish</span>
                    </button>
                  </div>

                  <div className='td-builder-milestones'>
                    {builderMilestones.map((milestone) => (
                      <span key={milestone.label} className={`td-builder-milestone ${milestone.done ? 'is-done' : ''}`}>
                        <span aria-hidden='true'>{milestone.done ? '✓' : '•'}</span>{milestone.label}
                      </span>
                    ))}
                  </div>

                  {builderStep === 'basics' && (
                    <div className='td-builder-step-panel'>
                      <label>Title</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Course title...' />
                      {builderErrors.title && <p className='td-field-error'>{builderErrors.title}</p>}

                      <label>Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Course description...' />
                      {builderErrors.description && <p className='td-field-error'>{builderErrors.description}</p>}

                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Difficulty</label>
                          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value='Beginner'>Beginner</option>
                            <option value='Hard'>Hard</option>
                          </select>
                        </div>
                        <div>
                          <label>Course Type</label>
                          <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                            <option value=''>Select course type</option>
                            {courseTypeOptions.map((type) => (<option key={type} value={type}>{type}</option>))}
                          </select>
                        </div>
                      </div>

                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Maximum Students</label>
                          <input value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} placeholder='Unlimited' />
                          {builderErrors.maxStudents && <p className='td-field-error'>{builderErrors.maxStudents}</p>}
                        </div>
                        <div>
                          <label>Pricing Model</label>
                          <select value={pricingModel} onChange={(e) => handlePricingModelChange(e.target.value)}>
                            <option value='free'>Free</option>
                            <option value='paid'>Paid</option>
                          </select>
                          {builderErrors.pricingModel && <p className='td-field-error'>{builderErrors.pricingModel}</p>}
                        </div>
                      </div>

                      {pricingModel === 'paid' && (
                        <div className='td-builder-grid-two'>
                          <div>
                            <label>Regular Price ($)</label>
                            <input value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} placeholder='64.99' />
                            {builderErrors.regularPrice && <p className='td-field-error'>{builderErrors.regularPrice}</p>}
                          </div>
                          <div>
                            <label>Sale Price ($)</label>
                            <input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder='11.99' />
                            {builderErrors.salePrice && <p className='td-field-error'>{builderErrors.salePrice}</p>}
                          </div>
                        </div>
                      )}

                      {pricingModel === 'free' && <p className='td-builder-note'>This course is free. Price fields are disabled.</p>}

                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Featured Image</label>
                          <input type='file' accept='image/*' onChange={handleImageUpload} />
                        </div>
                      </div>

                      <label>Learning Outcomes (one per line)</label>
                      <textarea value={learningOutcomesInput} onChange={(e) => setLearningOutcomesInput(e.target.value)} placeholder={'At the end of this course, learners will be able to...\nDescribe a key concept\nApply a practical technique'} />

                      <label>Skills Learners Gain (one per line)</label>
                      <textarea value={courseSkillsInput} onChange={(e) => setCourseSkillsInput(e.target.value)} placeholder={'Data Analysis\nStorytelling\nPresentation Skills'} />
                      {builderErrors.courseSkillsInput && <p className='td-field-error'>{builderErrors.courseSkillsInput}</p>}

                      <label>Tools Learners Use (one per line)</label>
                      <textarea value={courseToolsInput} onChange={(e) => setCourseToolsInput(e.target.value)} placeholder={'Python\nSQL\nTableau'} />
                      {builderErrors.courseToolsInput && <p className='td-field-error'>{builderErrors.courseToolsInput}</p>}

                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Course Language</label>
                          <input value={courseLanguage} onChange={(e) => setCourseLanguage(e.target.value)} placeholder='English' />
                        </div>
                        <div>
                          <label>Subtitle Label</label>
                          <input value={courseSubtitlesLabel} onChange={(e) => setCourseSubtitlesLabel(e.target.value)} placeholder='Video subtitles available' />
                        </div>
                      </div>

                      <label>Recently Updated Label (optional – auto-fills when you save)</label>
                      <input value={courseUpdatedAtLabel} onChange={(e) => setCourseUpdatedAtLabel(e.target.value)} placeholder='January 2026' />

                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Certificate Download URL</label>
                          <input value={certificateDownloadUrl} onChange={(e) => setCertificateDownloadUrl(e.target.value)} placeholder='https://... or Firebase file URL' />
                        </div>
                        <div>
                          <label>Certificate File Name (optional)</label>
                          <input value={certificateFileName} onChange={(e) => setCertificateFileName(e.target.value)} placeholder='my-course-certificate.pdf' />
                        </div>
                      </div>

                      {featuredImage && (
                        <div className='td-builder-image-preview'>
                          <img src={featuredImage} alt='Course preview' />
                        </div>
                      )}

                      <div className='td-builder-actions td-builder-actions--main'>
                        <button className='td-create-btn td-builder-btn-primary' onClick={saveCourse} disabled={builderSaving} type='button'>{builderSaving ? 'Saving...' : 'Save Draft'}</button>
                        <button className='td-status-btn td-builder-btn-secondary' onClick={() => handleSaveDraftAndMove('curriculum')} disabled={builderSaving} type='button'>Save and Continue</button>
                      </div>
                    </div>
                  )}

                  {builderStep === 'curriculum' && (
                    <div className='td-builder-step-panel'>
                      <p className='td-empty-text'>Curriculum opens as a dedicated builder screen for a seamless editing experience.</p>
                      <div className='td-builder-actions td-builder-actions--main'>
                        <button className='td-create-btn td-builder-btn-secondary' onClick={() => handleBuilderStepChange('basics')} type='button'>Back to Basics</button>
                        <button className='td-status-btn td-builder-btn-primary' onClick={() => handleBuilderStepChange('publish')} type='button'>Continue to Publish</button>
                      </div>
                    </div>
                  )}

                  {builderStep === 'publish' && (
                    <div className='td-builder-step-panel'>
                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Pricing Model</label>
                          <select value={pricingModel} onChange={(e) => handlePricingModelChange(e.target.value)}>
                            <option value='free'>Free</option>
                            <option value='paid'>Paid</option>
                          </select>
                        </div>
                        <div>
                          <label>Current Status</label>
                          <input value={activeBuilderCourse?.status || 'Draft'} readOnly />
                        </div>
                      </div>

                      {pricingModel === 'paid' && (
                        <div className='td-builder-grid-two'>
                          <div>
                            <label>Regular Price ($)</label>
                            <input value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} placeholder='64.99' />
                            {builderErrors.regularPrice && <p className='td-field-error'>{builderErrors.regularPrice}</p>}
                          </div>
                          <div>
                            <label>Sale Price ($)</label>
                            <input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder='11.99' />
                            {builderErrors.salePrice && <p className='td-field-error'>{builderErrors.salePrice}</p>}
                          </div>
                        </div>
                      )}

                      {pricingModel === 'free' && <p className='td-builder-note'>This course is free. Price fields are disabled.</p>}

                      <div className='td-builder-actions td-builder-actions--main'>
                        <button className='td-create-btn td-builder-btn-primary' onClick={saveCourse} disabled={builderSaving} type='button'>{builderSaving ? 'Saving...' : 'Save Publishing Details'}</button>
                        <button className='td-status-btn td-builder-btn-secondary' onClick={() => activeBuilderCourse && handleToggleStatus(activeBuilderCourse)} disabled={!activeBuilderCourse} type='button'>
                          {(activeBuilderCourse?.status || 'Draft') === 'Published' ? 'Move to Draft' : 'Publish Course'}
                        </button>
                      </div>

                      <details className='td-builder-more'>
                        <summary>More options</summary>
                        <div className='td-builder-actions td-builder-actions--secondary'>
                          <button className='td-status-btn td-classic-action' onClick={openClassicCoursePage} disabled={builderSaving} type='button'>Open Classic Course Page</button>
                          <button className='td-edit-btn td-classic-action' onClick={openClassicCurriculum} disabled={builderSaving} type='button'>Open Classic Curriculum</button>
                          <button className='td-edit-btn td-classic-action' onClick={openClassicLessonBuilder} disabled={builderSaving} type='button'>Open Classic Lesson Builder</button>
                          <button className='td-delete-btn' onClick={() => setActiveSection('courses')} type='button'>Back to My Courses</button>
                        </div>
                      </details>
                    </div>
                  )}
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'students' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>LP</span>Learner Pulse</span>
                <p>Track learner activity, completion momentum, and who may need additional support.</p>
              </div>
              <h1>Students</h1>
              {studentRows.length === 0 ? (
                <p className='td-empty-text'>No enrolled students yet.</p>
              ) : (
                <div className='td-table-wrap'>
                  <table className='td-table'>
                    <thead>
                      <tr>
                        <th>Student</th><th>Email</th><th>Course</th><th>Payment</th><th>Completion %</th><th>Enrolled</th><th>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentRows.map(item => (
                        <tr key={item.id}>
                          <td>{item.studentName}</td>
                          <td>{item.studentEmail}</td>
                          <td>{item.courseTitle}</td>
                          <td>{item.paid ? `Paid ($${item.amountPaid || 0})` : 'Free'}</td>
                          <td>{item.completion}%</td>
                          <td>{item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString() : 'N/A'}</td>
                          <td>{item.lastActiveAt ? new Date(item.lastActiveAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {!loading && activeSection === 'analytics' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>IN</span>Insights</span>
                <p>Understand completion trends, engagement health, and top-performing course experiences.</p>
              </div>
              <h1>Analytics & Insights</h1>
              <div className='td-stat-grid'>
                <article><h3>Total Courses</h3><p>{analytics.totalCourses}</p></article>
                <article><h3>Published</h3><p>{analytics.published}</p></article>
                <article><h3>Students</h3><p>{analytics.totalStudents}</p></article>
                <article><h3>Avg Completion</h3><p>{analytics.avgCompletion}%</p></article>
              </div>
              <div className='td-engagement'>
                <p>Student Engagement</p>
                <div><span style={{ width: `${analytics.engagementRate}%` }} /></div>
                <strong>{analytics.engagementRate}%</strong>
              </div>

              <div className='td-performance-list'>
                <h2>Course Performance</h2>
                {coursePerformance.length === 0 && <p className='td-empty-text'>Create courses to see analytics here.</p>}
                {coursePerformance.map(item => (
                  <article key={item.id} className='td-performance-item'>
                    <div className='td-performance-head'><h3>{item.title}</h3><span>{item.learners} learners</span></div>
                    <div className='td-performance-bar'><span style={{ width: `${item.avgCompletion}%` }} /></div>
                    <p>{item.avgCompletion}% average completion</p>
                  </article>
                ))}
              </div>

              <div className='td-chart-grid'>
                <article className='td-chart-card td-chart-card-wide'>
                  <h3>Course Performance (Bar + Line)</h3>
                  <p className='td-chart-subtitle'>X-axis: courses, left Y-axis: completion %, right Y-axis: learner count.</p>
                  {chartData.length === 0 ? (
                    <p className='td-empty-text'>Chart appears once courses and learner activity exist.</p>
                  ) : (
                    <div className='td-recharts-wrap'>
                      <ResponsiveContainer width='100%' height={320}>
                        <ComposedChart data={chartData} margin={{ top: 14, right: 20, left: 8, bottom: 16 }}>
                          <CartesianGrid strokeDasharray='3 3' stroke='rgba(145,165,133,0.24)' />
                          <XAxis dataKey='shortTitle' tick={{ fontSize: 11 }} interval={chartData.length > 5 ? 1 : 0} minTickGap={14} angle={-24} textAnchor='end' height={64} />
                          <YAxis yAxisId='left' domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(value) => `${value}%`} />
                          <YAxis yAxisId='right' orientation='right' tick={{ fontSize: 11 }} allowDecimals={false} domain={chartScale.rightAxisDomain} />
                          <Tooltip content={renderPerformanceTooltip} wrapperStyle={{ outline: 'none' }} />
                          <Legend />
                          <Bar yAxisId='left' dataKey='completion' name='Completion %' fill='#d5731a' radius={[3, 3, 0, 0]} barSize={chartScale.barSize} />
                          <Line yAxisId='right' type={chartScale.lineType} dataKey='learners' name='Learners' stroke='#a3070c' strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </article>

                <article className='td-chart-card'>
                  <h3>Completion Distribution</h3>
                  <p className='td-chart-subtitle'>Pie slices are split by real learner counts, then shown as percentages.</p>
                  {completionPie.total === 0 ? (
                    <p className='td-empty-text'>Pie chart appears after your first enrollments.</p>
                  ) : (
                    <div className='td-pie-layout'>
                      <div className='td-pie-chart-wrap'>
                        <ResponsiveContainer width='100%' height={260}>
                          <PieChart>
                            <Pie data={completionPie.pieData} dataKey='value' nameKey='name' cx='50%' cy='50%' innerRadius={54} outerRadius={96} paddingAngle={2.4} stroke='#ffffff' strokeWidth={2.2} label={({ name, payload }) => `${name} ${payload?.percent || 0}%`}>
                              {completionPie.pieData.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                            </Pie>
                            <Tooltip content={renderCompletionPieTooltip} wrapperStyle={{ outline: 'none' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <p className='td-pie-center-inline'>Total learners: {completionPie.total}</p>
                        <p className='td-pie-note'>Each slice is proportional to enrollment status share.</p>
                      </div>
                      <div className='td-pie-legend'>
                        <p><span className='td-pie-dot is-completed' /> Completed: {completionPie.completed} learners ({completionPie.percentages.completed}%)</p>
                        <p><span className='td-pie-dot is-progress' /> In Progress: {completionPie.inProgress} learners ({completionPie.percentages.inProgress}%)</p>
                        <p><span className='td-pie-dot is-not-started' /> Not Started: {completionPie.notStarted} learners ({completionPie.percentages.notStarted}%)</p>
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'quizzes' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>AL</span>Assessment Lab</span>
                <p>Build formative checks and improve learning outcomes with structured quiz feedback loops.</p>
              </div>
              <h1>Quizzes & Assessments</h1>
              <div className='td-stat-grid td-quiz-stat-grid'>
                <article><h3>Courses with Quizzes</h3><p>{quizInsights.coursesWithQuizzes}</p></article>
                <article><h3>Quiz-Ready Topics</h3><p>{quizInsights.quizTopics}</p></article>
                <article><h3>Total Questions</h3><p>{quizInsights.totalQuestions}</p></article>
                <article><h3>Custom Assessment Rules</h3><p>{quizInsights.customRuleTopics}</p></article>
              </div>

              <div className='td-quick-grid'>
                <article>
                  <h3>Build Quiz Content</h3>
                  <p>Create questions per topic and configure pass mark, attempts, timing, and feedback behavior.</p>
                  <button onClick={() => openQuizBuilderFromQuizzes(courses[0]?.id || '')}>Open Quiz Builder</button>
                </article>
                <article>
                  <h3>Manage by Course</h3>
                  <p>Review where quizzes already exist and jump straight into editing a specific course.</p>
                  <button onClick={() => setActiveSection('courses')}>Open Courses</button>
                </article>
                <article>
                  <h3>Results Overview</h3>
                  <p>Track learner performance, identify weak topics, and review completion trends in Analytics.</p>
                  <button onClick={() => setActiveSection('analytics')}>View Analytics</button>
                </article>
              </div>

              <div className='td-performance-list td-quiz-course-status'>
                <h2>Course Quiz Status</h2>
                {quizInsights.courseRows.length === 0 && <p className='td-empty-text'>No courses found yet. Create a course first, then build quizzes.</p>}
                {quizInsights.courseRows.length > 0 && (
                  <div className='td-table-wrap'>
                    <table className='td-table'>
                      <thead>
                        <tr><th>Course</th><th>Quiz Topics</th><th>Total Questions</th><th>Settings Applied</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {quizInsights.courseRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.title}</td>
                            <td>{row.quizTopics}/{row.topicCount}</td>
                            <td>{row.totalQuestions}</td>
                            <td>{row.configuredTopics}/{row.quizTopics || 0}</td>
                            <td><button className='td-status-btn td-quiz-inline-btn' onClick={() => openQuizBuilderFromQuizzes(row.id)} type='button'>Open</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {!loading && activeSection === 'culture' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>CA</span>Cultural Archive</span>
                <p>Preserve local stories and practices with lessons that center authenticity and context.</p>
              </div>
              <h1>Cultural Content</h1>
              <div className='td-quick-grid'>
                <article><h3>Cultural Stories</h3><p>Create stories and traditions content that preserves local knowledge.</p></article>
                <article><h3>Community Highlights</h3><p>Feature tribes and practices through lessons and media-rich modules.</p></article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'language' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>LS</span>Language Studio</span>
                <p>Blend vocabulary, pronunciation, and daily-use phrases for practical language confidence.</p>
              </div>
              <h1>Language Tools</h1>
              <div className='td-quick-grid'>
                <article><h3>Pronunciation Audio</h3><p>Attach language audio files in lesson content to improve speaking confidence.</p></article>
                <article><h3>Vocabulary & Daily Phrases</h3><p>Provide bite-sized vocabulary and daily phrase practice within each module.</p></article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'messages' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>CD</span>Communication Desk</span>
                <p>Keep learners aligned through timely announcements, reminders, and learning nudges.</p>
              </div>
              <h1>Messages & Announcements</h1>
              {announcementStatus.text && (
                <p className={`td-builder-message ${announcementStatus.type === 'error' ? 'is-error' : ''}`}>{announcementStatus.text}</p>
              )}
              <div className='td-message-controls'>
                <label htmlFor='announcement-course'>Target Course</label>
                <select id='announcement-course' value={announcementCourseId} onChange={(e) => { setAnnouncementCourseId(e.target.value); if (announcementStatus.text) setAnnouncementStatus({ type: '', text: '' }) }}>
                  <option value=''>Select a course</option>
                  {courses.map((course) => (<option key={course.id} value={course.id}>{course.title || 'Untitled Course'}</option>))}
                </select>
              </div>

              <div className='td-message-box'>
                <textarea value={announcementText} onChange={(e) => { setAnnouncementText(e.target.value); if (announcementStatus.text) setAnnouncementStatus({ type: '', text: '' }) }} placeholder='Write an update to learners in this selected course...' />
                <button onClick={handlePostAnnouncement} disabled={announcementPosting || (courses.length > 0 && !announcementCourseId)}>
                  {announcementPosting ? 'Posting...' : 'Post Announcement'}
                </button>
              </div>

              {courses.length > 0 && !announcementCourseId && <p className='td-empty-text'>Choose a course first so this message reaches the right learners.</p>}

              <div className='td-announcement-list'>
                {announcements.length === 0 && <p className='td-empty-text'>No announcements posted yet.</p>}
                {announcements.map(item => (
                  <article key={item.id}>
                    <h3>{item.courseTitle || 'General Announcement'}</h3>
                    <p>{item.message}</p>
                    <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}</small>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!loading && activeSection === 'reviews' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>FR</span>Feedback Radar</span>
                <p>Read learner sentiment quickly and use ratings to prioritize your next improvements.</p>
              </div>
              <h1>Reviews & Feedback</h1>
              <div className='td-review-controls'>
                <label htmlFor='review-course-filter'>Filter by course</label>
                <div className='td-review-controls-row'>
                  <select id='review-course-filter' value={reviewCourseFilter} onChange={(e) => setReviewCourseFilter(e.target.value)}>
                    <option value=''>All courses</option>
                    {courses.map((course) => (<option key={course.id} value={course.id}>{course.title || 'Untitled Course'}</option>))}
                  </select>
                  <button className='td-review-clear-btn' type='button' onClick={() => setReviewCourseFilter('')} disabled={!reviewCourseFilter}>Clear filter</button>
                </div>
              </div>

              <div className='td-review-summary'>
                <article><h3>Average Rating</h3><p>{filteredReviewSummary.averageRating}/5</p></article>
                <article><h3>Total Reviews</h3><p>{filteredReviewSummary.totalReviews}</p></article>
              </div>

              {reviewRows.length === 0 ? (
                <p className='td-empty-text'>No reviews yet. Learner reviews will appear here.</p>
              ) : (
                <div className='td-review-list'>
                  {reviewRows.map(review => (
                    <article key={review.id} className='td-review-card'>
                      <div className='td-review-head'>
                        <h3>{review.courseTitle || 'Course Review'}</h3>
                        <span>{review.learnerName || review.learnerEmail || 'Learner'}</span>
                      </div>
                      <p className='td-review-completion'>{review.completionLabel}</p>
                      <div className='td-review-rating'>
                        {[1, 2, 3, 4, 5].map(star => (<FaStar key={star} className={star <= (review.rating || 0) ? 'active' : ''} />))}
                      </div>
                      <p>{review.comment || 'No comment provided.'}</p>
                      {review.improvementSuggestion && <p className='td-review-improve'>What can we improve: {review.improvementSuggestion}</p>}
                      <small>{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}</small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {!loading && activeSection === 'earnings' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>MO</span>Monetization</span>
                <p>Track payout readiness and prepare your premium catalog for sustainable revenue.</p>
              </div>
              <h1>Earnings</h1>
              <p className='td-empty-text'>Revenue and payouts can be enabled once monetization is activated.</p>
            </section>
          )}

          {!loading && activeSection === 'profile' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>PR</span>Profile</span>
                <p>Review your account identity and profile details used across your courses.</p>
              </div>
              <h1>Tutor Profile</h1>
              {profileMessage && <p className='td-builder-message'>{profileMessage}</p>}
              {securityMessage && <p className='td-builder-message is-error'>{securityMessage}</p>}

              <div className='td-account-wrap'>
                <div className='td-account-row'>
                  <div className='td-account-avatar'>
                    {profileDraft.photoURL
                      ? <img src={profileDraft.photoURL} alt='Profile' />
                      : <span>{`${(profileDraft.firstName || 'T').charAt(0)}${(profileDraft.lastName || '').charAt(0)}`.toUpperCase() || 'T'}</span>}
                  </div>
                  <div className='td-account-avatar-copy'>
                    <h3>Profile picture</h3>
                    <p>PNG, JPEG or WEBP under 2MB (saved on this device)</p>
                  </div>
                  <div className='td-account-avatar-actions'>
                    <input ref={profilePhotoInputRef} type='file' accept='image/png,image/jpeg,image/webp' onChange={handleProfilePhotoUpload} hidden />
                    <button type='button' onClick={() => profilePhotoInputRef.current?.click()} disabled={profileSaving}>Upload new picture</button>
                    <button type='button' onClick={handleProfilePhotoDelete} disabled={profileSaving}>Delete</button>
                  </div>
                </div>

                <div className='td-account-group'>
                  <h3>Full name</h3>
                  <div className='td-account-grid'>
                    <label><span>First name</span><input type='text' value={profileDraft.firstName} onChange={(e) => setProfileDraft((prev) => ({ ...prev, firstName: e.target.value }))} placeholder='First name' /></label>
                    <label><span>Last name</span><input type='text' value={profileDraft.lastName} onChange={(e) => setProfileDraft((prev) => ({ ...prev, lastName: e.target.value }))} placeholder='Last name' /></label>
                  </div>
                </div>

                <div className='td-account-group'>
                  <h3>Public Tutor Page Details</h3>
                  <p>These details are shown on the learner-facing tutor profile page.</p>
                  <div className='td-account-grid'>
                    <label>
                      <span>Headline</span>
                      <input
                        type='text'
                        value={tutorProfileDraft.headline}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, headline: e.target.value }))}
                        placeholder='Swahili Tutor | Culture & Conversation'
                      />
                    </label>
                    <label>
                      <span>Timezone</span>
                      <input
                        type='text'
                        value={tutorProfileDraft.timezone}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, timezone: e.target.value }))}
                        placeholder='Africa/Nairobi'
                      />
                    </label>
                    <label>
                      <span>Languages (comma separated)</span>
                      <input
                        type='text'
                        value={tutorProfileDraft.languages}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, languages: e.target.value }))}
                        placeholder='English, Swahili'
                      />
                    </label>
                    <label>
                      <span>Expertise tags (comma separated)</span>
                      <input
                        type='text'
                        value={tutorProfileDraft.expertiseTags}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, expertiseTags: e.target.value }))}
                        placeholder='Conversation, Culture, Grammar'
                      />
                    </label>
                    <label>
                      <span>Availability summary</span>
                      <input
                        type='text'
                        value={tutorProfileDraft.availabilityText}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, availabilityText: e.target.value }))}
                        placeholder='Weekday evenings and Saturday mornings'
                      />
                    </label>
                    <label>
                      <span>Response time label</span>
                      <input
                        type='text'
                        value={tutorProfileDraft.responseTimeLabel}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, responseTimeLabel: e.target.value }))}
                        placeholder='Usually responds within 12 hours'
                      />
                    </label>
                  </div>

                  <div className='td-account-grid td-account-grid--single'>
                    <label>
                      <span>Bio</span>
                      <textarea
                        value={tutorProfileDraft.bio}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder='Tell learners how you teach, your background, and what outcomes they should expect.'
                        rows={4}
                      />
                    </label>
                    <label>
                      <span>Teaching style</span>
                      <textarea
                        value={tutorProfileDraft.teachingStyle}
                        onChange={(e) => setTutorProfileDraft((prev) => ({ ...prev, teachingStyle: e.target.value }))}
                        placeholder='Interactive, example-driven, and learner-paced sessions with practical assignments.'
                        rows={3}
                      />
                    </label>
                  </div>

                  <div className='td-account-danger-zone'>
                    <button type='button' className='td-account-save-btn' onClick={handleProfileSave} disabled={profileSaving}>Save profile</button>
                    <button type='button' className='td-account-save-btn' onClick={handlePreviewTutorPage}>Preview learner view</button>
                  </div>
                </div>

                <div className='td-account-group'>
                  <h3>Contact email</h3>
                  <p>Manage your account email used for communication and login.</p>
                  <div className='td-account-email'>{auth.currentUser?.email || 'No email on file'}</div>
                </div>

                <div className='td-account-group'>
                  <h3>Password</h3>
                  <p>Modify your current password.</p>
                  <div className='td-account-grid'>
                    <label><span>Current password</span><input type='password' value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} placeholder='Current password' /></label>
                    <label><span>New password</span><input type='password' value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} placeholder='New password' /></label>
                  </div>
                  <button type='button' className='td-account-save-btn' onClick={handlePasswordUpdate}>Update password</button>
                </div>

                <div className='td-account-group'>
                  <h3>Account security</h3>
                  <p>Manage your account security.</p>
                  <div className='td-account-danger-zone'>
                    <button type='button' className='td-security-btn' onClick={handleLogoutClick}>Logout</button>
                    <button type='button' className='td-security-btn td-security-btn-danger' onClick={handleDeleteAccount}>Delete my account</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading && activeSection === 'settings' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'><span className='td-badge-icon' aria-hidden='true'>ST</span>Settings</span>
                <p>Customize your dashboard experience for focus and readability.</p>
              </div>
              <h1>Dashboard Settings</h1>
              <div className='td-settings-grid'>
                <article className='td-settings-card'>
                  <h3>Security</h3>
                  <label className='td-setting-row'>
                    <div><strong>Biometric authentication</strong><p>Allow this device to use biometrics for secure unlock on supported devices.</p></div>
                    <input type='checkbox' checked={settingsPrefs.biometricAuth} onChange={(e) => setSettingsPrefs((prev) => ({ ...prev, biometricAuth: e.target.checked }))} />
                  </label>
                </article>

                <article className='td-settings-card'>
                  <h3>Sync & Notifications</h3>
                  <label className='td-setting-row'>
                    <div><strong>Cloud sync</strong><p>Sync dashboard settings and preferences across your signed-in sessions.</p></div>
                    <input type='checkbox' checked={settingsPrefs.cloudSync} onChange={(e) => setSettingsPrefs((prev) => ({ ...prev, cloudSync: e.target.checked }))} />
                  </label>
                  <label className='td-setting-row'>
                    <div><strong>Notifications</strong><p>Enable dashboard updates, review alerts, and student activity notifications.</p></div>
                    <input type='checkbox' checked={settingsPrefs.notifications} onChange={(e) => setSettingsPrefs((prev) => ({ ...prev, notifications: e.target.checked }))} />
                  </label>
                </article>

                <article className='td-settings-card'>
                  <h3>Appearance</h3>
                  <label className='td-setting-row'>
                    <div><strong>Dark mode</strong><p>Switch tutor dashboard between light and dark mode.</p></div>
                    <input type='checkbox' checked={themeMode === 'dark'} onChange={toggleThemeMode} />
                  </label>
                </article>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default TeacherDashboard