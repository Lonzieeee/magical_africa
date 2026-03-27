import React, { useMemo, useState, useEffect } from 'react'
import { FaChevronLeft, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import '../styles/teacher-dashboard.css'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const { userData } = useAuth()
  const [activeSection, setActiveSection] = useState('courses')
  const [menuOpen, setMenuOpen] = useState({
    teaching: true,
    learners: true,
    insights: false,
    content: false
  })
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
  const [authReady, setAuthReady] = useState(false)
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => setAuthReady(true))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!authReady) return
    fetchDashboardData()
  }, [authReady])

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

  const fetchDashboardData = async () => {
    try {
      const currentTeacherId = auth.currentUser?.uid
      if (!currentTeacherId) {
        setCourses([])
        setEnrollments([])
        setAnnouncements([])
        setReviews([])
        setLoading(false)
        return
      }

      const resolveCourseTeacherId = (course) => (
        course.teacherId ||
        course.tutorId ||
        course.createdBy ||
        course.authorId ||
        ''
      )

      const resolveReviewTeacherId = (review) => (
        review.teacherId ||
        review.tutorId ||
        review.createdBy ||
        review.authorId ||
        ''
      )

      const [coursesSnapshot, enrollmentSnapshot, announcementSnapshot, reviewSnapshot] = await Promise.allSettled([
        getDocs(collection(db, 'courses')),
        getDocs(query(collection(db, 'enrollments'), where('teacherId', '==', currentTeacherId))),
        getDocs(collection(db, 'announcements')),
        getDocs(collection(db, 'reviews'))
      ])

      const myCourses = coursesSnapshot.status === 'fulfilled'
        ? coursesSnapshot.value.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter((course) => resolveCourseTeacherId(course) === currentTeacherId)
            .sort((a, b) => {
              const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
              const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()
              return bTime - aTime
            })
        : []
      setCourses(myCourses)

      const myCourseIds = new Set(myCourses.map(course => course.id))
      const enrollmentDocs = enrollmentSnapshot.status === 'fulfilled' ? enrollmentSnapshot.value.docs : []
      const announcementDocs = announcementSnapshot.status === 'fulfilled' ? announcementSnapshot.value.docs : []
      const reviewDocs = reviewSnapshot.status === 'fulfilled' ? reviewSnapshot.value.docs : []

      const myEnrollments = enrollmentDocs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => item.teacherId === currentTeacherId || myCourseIds.has(item.courseId))

      const teacherAnnouncements = announcementDocs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => item.teacherId === currentTeacherId)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

      const myReviews = reviewDocs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => resolveReviewTeacherId(item) === currentTeacherId || myCourseIds.has(item.courseId))
        .sort((a, b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''))

      setEnrollments(myEnrollments)
      setAnnouncements(teacherAnnouncements)
      setReviews(myReviews)
    } catch (err) {
      console.log('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

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
    const normalizedMaxStudents = String(maxStudents || '').trim()
    const normalizedRegularPrice = Number(regularPrice || 0)
    const normalizedSalePrice = Number(salePrice || 0)

    if (trimmedTitle.length < 3) {
      nextErrors.title = 'Course title should be at least 3 characters.'
    }

    if (trimmedDescription.length < 12) {
      nextErrors.description = 'Description should be at least 12 characters.'
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
        setAnnouncementStatus({
          type: 'error',
          text: 'Firebase permission denied. Check Firestore rules for announcements write access.'
        })
      } else if (errorCode === 'unauthenticated') {
        setAnnouncementStatus({
          type: 'error',
          text: 'Firebase reports unauthenticated session. Sign in again and retry.'
        })
      } else if (errorCode === 'unavailable') {
        setAnnouncementStatus({
          type: 'error',
          text: 'Firestore service unavailable right now. Check network and retry in a moment.'
        })
      } else {
        setAnnouncementStatus({
          type: 'error',
          text: 'Check your internet connection.'
        })
      }
    } finally {
      setAnnouncementPosting(false)
    }
  }

  const analytics = useMemo(() => {
    const totalCourses = courses.length
    const published = courses.filter(course => course.status === 'Published').length
    const totalStudents = enrollments.length

    const avgCompletion = totalStudents === 0
      ? 0
      : Math.round(
          enrollments.reduce((acc, item) => acc + (item.completion || 0), 0) / totalStudents
        )

    return {
      totalCourses,
      published,
      totalStudents,
      avgCompletion,
      engagementRate: Math.min(100, avgCompletion + (published * 5))
    }
  }, [courses, enrollments])

  const coursePerformance = useMemo(() => {
    return courses.map(course => {
      const courseEnrollments = enrollments.filter(item => item.courseId === course.id)
      const avgCompletion = courseEnrollments.length > 0
        ? Math.round(courseEnrollments.reduce((acc, item) => acc + (item.completion || 0), 0) / courseEnrollments.length)
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

  const learnerCompletionLinePoints = useMemo(() => {
    if (chartCourses.length === 0) return ''

    const width = 520
    const height = 180
    const maxLearners = Math.max(...chartCourses.map(item => item.learners), 1)

    return chartCourses.map((item, index) => {
      const x = chartCourses.length === 1
        ? width / 2
        : (index / (chartCourses.length - 1)) * width
      const learnerRatio = item.learners / maxLearners
      const completionRatio = (item.avgCompletion || 0) / 100
      const combined = (learnerRatio * 0.45) + (completionRatio * 0.55)
      const y = height - (combined * height)
      return `${x},${y}`
    }).join(' ')
  }, [chartCourses])

  const reviewSummary = useMemo(() => {
    const totalReviews = reviews.length
    const averageRating = totalReviews === 0
      ? 0
      : (reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews)

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1))
    }
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

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1))
    }
  }, [filteredReviews])

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
    const defaultSettings = {
      passMark: 70,
      attemptsAllowed: 3,
      feedbackMode: 'after-submit'
    }

    const courseRows = courses.map((course) => {
      const topics = Array.isArray(course.topics) ? course.topics : []

      let quizTopics = 0
      let totalQuestions = 0
      let configuredTopics = 0
      let customRuleTopics = 0

      topics.forEach((topic) => {
        const questions = Array.isArray(topic.quiz) ? topic.quiz.length : 0
        const hasQuiz = questions > 0
        if (!hasQuiz) return

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

        const hasCustomRules =
          timeLimit !== '' ||
          randomizeQuestions ||
          passMark !== defaultSettings.passMark ||
          attemptsAllowed !== defaultSettings.attemptsAllowed ||
          feedbackMode !== defaultSettings.feedbackMode

        if (hasCustomRules) customRuleTopics += 1
      })

      return {
        id: course.id,
        title: course.title || 'Untitled Course',
        topicCount: topics.length,
        quizTopics,
        totalQuestions,
        configuredTopics,
        customRuleTopics
      }
    })

    const totals = courseRows.reduce((acc, row) => ({
      coursesWithQuizzes: acc.coursesWithQuizzes + (row.quizTopics > 0 ? 1 : 0),
      quizTopics: acc.quizTopics + row.quizTopics,
      totalQuestions: acc.totalQuestions + row.totalQuestions,
      configuredTopics: acc.configuredTopics + row.configuredTopics,
      customRuleTopics: acc.customRuleTopics + row.customRuleTopics
    }), {
      coursesWithQuizzes: 0,
      quizTopics: 0,
      totalQuestions: 0,
      configuredTopics: 0,
      customRuleTopics: 0
    })

    const topCourseRows = [...courseRows]
      .filter((row) => row.quizTopics > 0)
      .sort((a, b) => b.totalQuestions - a.totalQuestions)

    return {
      ...totals,
      courseRows,
      topCourseRows
    }
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
    <div className='td-dashboard'>
      <div className='td-layout'>
        <aside className='td-sidebar'>
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
              <button
                className={`td-nav-group-title ${menuOpen.teaching ? 'expanded' : ''}`}
                onClick={() => toggleMenu('teaching')}
                aria-expanded={menuOpen.teaching}
              >
                Teaching Hub
              </button>
              {menuOpen.teaching && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'courses' ? 'active' : ''}`} onClick={() => setActiveSection('courses')}>Courses</button>
                  <button className={`td-nav-subitem ${activeSection === 'builder' ? 'active' : ''}`} onClick={() => setActiveSection('builder')}>Course Builder</button>
                  <button className={`td-nav-subitem ${activeSection === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveSection('quizzes')}>Quizzes & Assessments</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button
                className={`td-nav-group-title ${menuOpen.learners ? 'expanded' : ''}`}
                onClick={() => toggleMenu('learners')}
                aria-expanded={menuOpen.learners}
              >
                Learners
              </button>
              {menuOpen.learners && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'students' ? 'active' : ''}`} onClick={() => setActiveSection('students')}>Students</button>
                  <button className={`td-nav-subitem ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>Messages</button>
                  <button className={`td-nav-subitem ${activeSection === 'reviews' ? 'active' : ''}`} onClick={() => setActiveSection('reviews')}>Reviews</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button
                className={`td-nav-group-title ${menuOpen.insights ? 'expanded' : ''}`}
                onClick={() => toggleMenu('insights')}
                aria-expanded={menuOpen.insights}
              >
                Insights
              </button>
              {menuOpen.insights && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => setActiveSection('analytics')}>Analytics</button>
                  <button className={`td-nav-subitem ${activeSection === 'earnings' ? 'active' : ''}`} onClick={() => setActiveSection('earnings')}>Earnings</button>
                </div>
              )}
            </div>

            <div className='td-nav-group'>
              <button
                className={`td-nav-group-title ${menuOpen.content ? 'expanded' : ''}`}
                onClick={() => toggleMenu('content')}
                aria-expanded={menuOpen.content}
              >
                Cultural & Language
              </button>
              {menuOpen.content && (
                <div className='td-nav-submenu'>
                  <button className={`td-nav-subitem ${activeSection === 'culture' ? 'active' : ''}`} onClick={() => setActiveSection('culture')}>Cultural Content</button>
                  <button className={`td-nav-subitem ${activeSection === 'language' ? 'active' : ''}`} onClick={() => setActiveSection('language')}>Language Tools</button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className='td-main'>
          {loading && (
            <div className='td-loading-wrap'>
              <div className='td-coffee' role='img' aria-label='Coffee cup spinning and stretching from side to side'>
                <div className='td-coffee__cup'>
                  <div className='td-coffee__cup-part td-coffee__cup-part--a' />
                  <div className='td-coffee__cup-part td-coffee__cup-part--b' />
                  <div className='td-coffee__cup-part td-coffee__cup-part--c' />
                  <div className='td-coffee__cup-part td-coffee__cup-part--d' />
                  <div className='td-coffee__cup-part td-coffee__cup-part--e' />
                  <svg className='td-coffee__cup-part td-coffee__cup-part--f' width='96' height='60' viewBox='0 0 96 60' aria-hidden='true'>
                    <g fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                      <path className='td-coffee__cup-handle' d='M64,4.413s6.64-2.913,11-2.913c11.739,0,19.5,10.759,19.5,22.497,0,23.475-45,22.497-45,22.497' />
                    </g>
                  </svg>
                </div>

                <svg className='td-coffee__steam' width='56' height='56' viewBox='0 0 56 56' aria-hidden='true'>
                  <g fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                    <path className='td-coffee__steam-part td-coffee__steam-part--a' d='M13.845,54s-5.62-10.115-4.496-16.859,6.83-11.497,8.992-17.983c1.037-3.11,.161-6.937-1.083-10.158' />
                    <path className='td-coffee__steam-part td-coffee__steam-part--b' d='M27.844,54s-5.652-10.174-4.522-16.957,6.869-11.564,9.043-18.087c2.261-6.783-4.522-16.957-4.522-16.957' />
                    <path className='td-coffee__steam-part td-coffee__steam-part--c' d='M40.434,50.999c-1.577-3.486-3.818-9.462-3.071-13.944,1.121-6.723,6.809-11.462,8.964-17.928,1.033-3.1,.161-6.916-1.08-10.127' />
                  </g>
                </svg>

                <svg className='td-coffee__steam td-coffee__steam--right' width='56' height='56' viewBox='0 0 56 56' aria-hidden='true'>
                  <g fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                    <path className='td-coffee__steam-part td-coffee__steam-part--d' d='M19.845,54s-5.62-10.115-4.496-16.859,6.83-11.497,8.992-17.983c1.037-3.11,.161-6.937-1.083-10.158' />
                    <path className='td-coffee__steam-part td-coffee__steam-part--e' d='M34.434,44c-1.577-3.486-3.818-9.462-3.071-13.944,1.121-6.723,6.809-11.462,8.964-17.928,1.033-3.1,.161-6.916-1.08-10.127' />
                  </g>
                </svg>
              </div>
            </div>
          )}

          {!loading && activeSection === 'courses' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>TH</span>
                  Teaching Hub
                </span>
                <p>Manage your active catalog, publish updates, and keep course quality consistent.</p>
              </div>
              <div className='td-header'>
                <h1>
                  Courses
                  <span className='td-published-badge'>{analytics.published} Published</span>
                </h1>
                <button className='td-create-btn' onClick={handleCreateNew}>
                  + Create Course
                </button>
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
                      <span className={`td-course-status-chip ${(course.status || 'Draft') === 'Published' ? 'is-published' : 'is-draft'}`}>
                        {course.status || 'Draft'}
                      </span>
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
                          <span className='td-tag-price'>
                            {course.pricingModel === 'free' ? 'Free' : `$${course.salePrice || course.regularPrice || '0'}`}
                          </span>
                          <span className='td-tag-topics'>{course.topics?.length || 0} modules</span>
                          <span className='td-tag-status'>{course.status || 'Draft'}</span>
                        </div>
                      </div>

                      <div className='td-course-actions'>
                        <button className='td-edit-btn' onClick={() => handleEdit(course)}>Edit</button>
                        <button className='td-status-btn' onClick={() => handleToggleStatus(course)}>
                          {course.status === 'Published' ? 'Move to Draft' : 'Publish'}
                        </button>
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
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>CS</span>
                  Creation Studio
                </span>
                <p>Design modules, pricing, and media in one flow before opening classic builders.</p>
              </div>
              <h1>Course Builder</h1>
              <div className='td-builder-layout'>
                <article className='td-builder-form'>
                  <h3>{builderMode === 'edit' ? 'Edit Course' : 'Create Course'}</h3>
                  {builderMessage && <p className='td-builder-message'>{builderMessage}</p>}
                  <p className='td-builder-help'>Follow the guided flow: save draft, structure curriculum, then publish.</p>

                  <div className='td-builder-stepper' role='tablist' aria-label='Course builder steps'>
                    <button
                      className={`td-builder-step ${builderStep === 'basics' ? 'is-active' : ''} ${basicsCompleted ? 'is-complete' : ''}`}
                      onClick={() => handleBuilderStepChange('basics')}
                      role='tab'
                      aria-selected={builderStep === 'basics'}
                      type='button'
                    >
                      <span className='td-builder-step-index'>{basicsCompleted ? '✓' : '1'}</span>
                      <span>Basics</span>
                    </button>
                    <button
                      className={`td-builder-step ${builderStep === 'curriculum' ? 'is-active' : ''} ${curriculumCompleted ? 'is-complete' : ''} ${canAccessAdvancedBuilderSteps ? '' : 'is-locked'}`}
                      onClick={() => handleBuilderStepChange('curriculum')}
                      role='tab'
                      aria-selected={builderStep === 'curriculum'}
                      type='button'
                      disabled={!canAccessAdvancedBuilderSteps}
                    >
                      <span className='td-builder-step-index'>{curriculumCompleted ? '✓' : '2'}</span>
                      <span>Curriculum</span>
                    </button>
                    <button
                      className={`td-builder-step ${builderStep === 'publish' ? 'is-active' : ''} ${publishCompleted ? 'is-complete' : ''} ${canAccessAdvancedBuilderSteps ? '' : 'is-locked'}`}
                      onClick={() => handleBuilderStepChange('publish')}
                      role='tab'
                      aria-selected={builderStep === 'publish'}
                      type='button'
                      disabled={!canAccessAdvancedBuilderSteps}
                    >
                      <span className='td-builder-step-index'>{publishCompleted ? '✓' : '3'}</span>
                      <span>Publish</span>
                    </button>
                  </div>

                  <div className='td-builder-milestones'>
                    {builderMilestones.map((milestone) => (
                      <span key={milestone.label} className={`td-builder-milestone ${milestone.done ? 'is-done' : ''}`}>
                        <span aria-hidden='true'>{milestone.done ? '✓' : '•'}</span>
                        {milestone.label}
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
                          <input value={courseType} onChange={(e) => setCourseType(e.target.value)} placeholder='e.g. Pottery' />
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
                            <input
                              value={regularPrice}
                              onChange={(e) => setRegularPrice(e.target.value)}
                              placeholder='64.99'
                            />
                            {builderErrors.regularPrice && <p className='td-field-error'>{builderErrors.regularPrice}</p>}
                          </div>
                          <div>
                            <label>Sale Price ($)</label>
                            <input
                              value={salePrice}
                              onChange={(e) => setSalePrice(e.target.value)}
                              placeholder='11.99'
                            />
                            {builderErrors.salePrice && <p className='td-field-error'>{builderErrors.salePrice}</p>}
                          </div>
                        </div>
                      )}

                      {pricingModel === 'free' && (
                        <p className='td-builder-note'>This course is free. Price fields are disabled.</p>
                      )}

                      <div className='td-builder-grid-two'>
                        <div>
                          <label>Featured Image</label>
                          <input type='file' accept='image/*' onChange={handleImageUpload} />
                        </div>
                      </div>

                      {featuredImage && (
                        <div className='td-builder-image-preview'>
                          <img src={featuredImage} alt='Course preview' />
                        </div>
                      )}

                      <div className='td-builder-actions td-builder-actions--main'>
                        <button className='td-create-btn td-builder-btn-primary' onClick={saveCourse} disabled={builderSaving} type='button'>
                          {builderSaving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button className='td-status-btn td-builder-btn-secondary' onClick={() => handleSaveDraftAndMove('curriculum')} disabled={builderSaving} type='button'>
                          Save and Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {builderStep === 'curriculum' && (
                    <div className='td-builder-step-panel'>
                      <p className='td-empty-text'>Curriculum opens as a dedicated builder screen for a seamless editing experience.</p>
                      <div className='td-builder-actions td-builder-actions--main'>
                        <button className='td-create-btn td-builder-btn-secondary' onClick={() => handleBuilderStepChange('basics')} type='button'>
                          Back to Basics
                        </button>
                        <button className='td-status-btn td-builder-btn-primary' onClick={() => handleBuilderStepChange('publish')} type='button'>
                          Continue to Publish
                        </button>
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

                      {pricingModel === 'free' && (
                        <p className='td-builder-note'>This course is free. Price fields are disabled.</p>
                      )}

                      <div className='td-builder-actions td-builder-actions--main'>
                        <button className='td-create-btn td-builder-btn-primary' onClick={saveCourse} disabled={builderSaving} type='button'>
                          {builderSaving ? 'Saving...' : 'Save Publishing Details'}
                        </button>
                        <button
                          className='td-status-btn td-builder-btn-secondary'
                          onClick={() => activeBuilderCourse && handleToggleStatus(activeBuilderCourse)}
                          disabled={!activeBuilderCourse}
                          type='button'
                        >
                          {(activeBuilderCourse?.status || 'Draft') === 'Published' ? 'Move to Draft' : 'Publish Course'}
                        </button>
                      </div>

                      <details className='td-builder-more'>
                        <summary>More options</summary>
                        <div className='td-builder-actions td-builder-actions--secondary'>
                          <button className='td-status-btn td-classic-action' onClick={openClassicCoursePage} disabled={builderSaving} type='button'>
                            Open Classic Course Page
                          </button>
                          <button className='td-edit-btn td-classic-action' onClick={openClassicCurriculum} disabled={builderSaving} type='button'>
                            Open Classic Curriculum
                          </button>
                          <button className='td-edit-btn td-classic-action' onClick={openClassicLessonBuilder} disabled={builderSaving} type='button'>
                            Open Classic Lesson Builder
                          </button>
                          <button className='td-delete-btn' onClick={() => setActiveSection('courses')} type='button'>
                            Back to My Courses
                          </button>
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
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>LP</span>
                  Learner Pulse
                </span>
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
                        <th>Student</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Payment</th>
                        <th>Completion %</th>
                        <th>Enrolled</th>
                        <th>Last Active</th>
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
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>IN</span>
                  Insights
                </span>
                <p>Understand completion trends, engagement health, and top-performing course experiences.</p>
              </div>
              <h1>Analytics & Insights</h1>
              <div className='td-stat-grid'>
                <article>
                  <h3>Total Courses</h3>
                  <p>{analytics.totalCourses}</p>
                </article>
                <article>
                  <h3>Published</h3>
                  <p>{analytics.published}</p>
                </article>
                <article>
                  <h3>Students</h3>
                  <p>{analytics.totalStudents}</p>
                </article>
                <article>
                  <h3>Avg Completion</h3>
                  <p>{analytics.avgCompletion}%</p>
                </article>
              </div>
              <div className='td-engagement'>
                <p>Student Engagement</p>
                <div>
                  <span style={{ width: `${analytics.engagementRate}%` }} />
                </div>
                <strong>{analytics.engagementRate}%</strong>
              </div>

              <div className='td-performance-list'>
                <h2>Course Performance</h2>
                {coursePerformance.length === 0 && (
                  <p className='td-empty-text'>Create courses to see analytics here.</p>
                )}

                {coursePerformance.map(item => (
                  <article key={item.id} className='td-performance-item'>
                    <div className='td-performance-head'>
                      <h3>{item.title}</h3>
                      <span>{item.learners} learners</span>
                    </div>
                    <div className='td-performance-bar'>
                      <span style={{ width: `${item.avgCompletion}%` }} />
                    </div>
                    <p>{item.avgCompletion}% average completion</p>
                  </article>
                ))}
              </div>

              <div className='td-chart-grid'>
                <article className='td-chart-card'>
                  <h3>Completion by Course (Bar)</h3>
                  {chartCourses.length === 0 ? (
                    <p className='td-empty-text'>Bar chart appears once courses and learner activity exist.</p>
                  ) : (
                    <div className='td-bar-chart'>
                      {chartCourses.map((item) => (
                        <div key={item.id} className='td-bar-row'>
                          <span className='td-bar-label'>{item.title}</span>
                          <div className='td-bar-track'>
                            <span style={{ width: `${item.avgCompletion}%` }} />
                          </div>
                          <strong>{item.avgCompletion}%</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                <article className='td-chart-card'>
                  <h3>Learner Reach + Completion (Line)</h3>
                  {chartCourses.length === 0 ? (
                    <p className='td-empty-text'>Line chart appears after your first enrollments.</p>
                  ) : (
                    <div className='td-line-chart-wrap'>
                      <svg viewBox='0 0 520 180' className='td-line-chart' role='img' aria-label='Learner reach and completion trend line'>
                        <polyline points='0,180 520,180' className='td-line-axis' />
                        <polyline points={learnerCompletionLinePoints} className='td-line-path' />
                      </svg>
                    </div>
                  )}
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'quizzes' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>AL</span>
                  Assessment Lab
                </span>
                <p>Build formative checks and improve learning outcomes with structured quiz feedback loops.</p>
              </div>
              <h1>Quizzes & Assessments</h1>
              <div className='td-stat-grid td-quiz-stat-grid'>
                <article>
                  <h3>Courses with Quizzes</h3>
                  <p>{quizInsights.coursesWithQuizzes}</p>
                </article>
                <article>
                  <h3>Quiz-Ready Topics</h3>
                  <p>{quizInsights.quizTopics}</p>
                </article>
                <article>
                  <h3>Total Questions</h3>
                  <p>{quizInsights.totalQuestions}</p>
                </article>
                <article>
                  <h3>Custom Assessment Rules</h3>
                  <p>{quizInsights.customRuleTopics}</p>
                </article>
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

                {quizInsights.courseRows.length === 0 && (
                  <p className='td-empty-text'>No courses found yet. Create a course first, then build quizzes.</p>
                )}

                {quizInsights.courseRows.length > 0 && (
                  <div className='td-table-wrap'>
                    <table className='td-table'>
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Quiz Topics</th>
                          <th>Total Questions</th>
                          <th>Settings Applied</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizInsights.courseRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.title}</td>
                            <td>{row.quizTopics}/{row.topicCount}</td>
                            <td>{row.totalQuestions}</td>
                            <td>{row.configuredTopics}/{row.quizTopics || 0}</td>
                            <td>
                              <button
                                className='td-status-btn td-quiz-inline-btn'
                                onClick={() => openQuizBuilderFromQuizzes(row.id)}
                                type='button'
                              >
                                Open
                              </button>
                            </td>
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
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>CA</span>
                  Cultural Archive
                </span>
                <p>Preserve local stories and practices with lessons that center authenticity and context.</p>
              </div>
              <h1>Cultural Content</h1>
              <div className='td-quick-grid'>
                <article>
                  <h3>Cultural Stories</h3>
                  <p>Create stories and traditions content that preserves local knowledge.</p>
                </article>
                <article>
                  <h3>Community Highlights</h3>
                  <p>Feature tribes and practices through lessons and media-rich modules.</p>
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'language' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>LS</span>
                  Language Studio
                </span>
                <p>Blend vocabulary, pronunciation, and daily-use phrases for practical language confidence.</p>
              </div>
              <h1>Language Tools</h1>
              <div className='td-quick-grid'>
                <article>
                  <h3>Pronunciation Audio</h3>
                  <p>Attach language audio files in lesson content to improve speaking confidence.</p>
                </article>
                <article>
                  <h3>Vocabulary & Daily Phrases</h3>
                  <p>Provide bite-sized vocabulary and daily phrase practice within each module.</p>
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'messages' && (
            <section className='td-panel td-view-stage'>
              <div className='td-section-lead'>
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>CD</span>
                  Communication Desk
                </span>
                <p>Keep learners aligned through timely announcements, reminders, and learning nudges.</p>
              </div>
              <h1>Messages & Announcements</h1>
              {announcementStatus.text && (
                <p className={`td-builder-message ${announcementStatus.type === 'error' ? 'is-error' : ''}`}>
                  {announcementStatus.text}
                </p>
              )}
              <div className='td-message-controls'>
                <label htmlFor='announcement-course'>Target Course</label>
                <select
                  id='announcement-course'
                  value={announcementCourseId}
                  onChange={(e) => {
                    setAnnouncementCourseId(e.target.value)
                    if (announcementStatus.text) setAnnouncementStatus({ type: '', text: '' })
                  }}
                >
                  <option value=''>Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title || 'Untitled Course'}
                    </option>
                  ))}
                </select>
              </div>

              <div className='td-message-box'>
                <textarea
                  value={announcementText}
                  onChange={(e) => {
                    setAnnouncementText(e.target.value)
                    if (announcementStatus.text) setAnnouncementStatus({ type: '', text: '' })
                  }}
                  placeholder='Write an update to learners in this selected course...'
                />
                <button
                  onClick={handlePostAnnouncement}
                  disabled={announcementPosting || (courses.length > 0 && !announcementCourseId)}
                >
                  {announcementPosting ? 'Posting...' : 'Post Announcement'}
                </button>
              </div>

              {courses.length > 0 && !announcementCourseId && (
                <p className='td-empty-text'>Choose a course first so this message reaches the right learners.</p>
              )}

              <div className='td-announcement-list'>
                {announcements.length === 0 && (
                  <p className='td-empty-text'>No announcements posted yet.</p>
                )}
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
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>FR</span>
                  Feedback Radar
                </span>
                <p>Read learner sentiment quickly and use ratings to prioritize your next improvements.</p>
              </div>
              <h1>Reviews & Feedback</h1>
              <div className='td-review-controls'>
                <label htmlFor='review-course-filter'>Filter by course</label>
                <div className='td-review-controls-row'>
                  <select
                    id='review-course-filter'
                    value={reviewCourseFilter}
                    onChange={(e) => setReviewCourseFilter(e.target.value)}
                  >
                    <option value=''>All courses</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title || 'Untitled Course'}
                      </option>
                    ))}
                  </select>
                  <button
                    className='td-review-clear-btn'
                    type='button'
                    onClick={() => setReviewCourseFilter('')}
                    disabled={!reviewCourseFilter}
                  >
                    Clear filter
                  </button>
                </div>
              </div>

              <div className='td-review-summary'>
                <article>
                  <h3>Average Rating</h3>
                  <p>{filteredReviewSummary.averageRating}/5</p>
                </article>
                <article>
                  <h3>Total Reviews</h3>
                  <p>{filteredReviewSummary.totalReviews}</p>
                </article>
              </div>
              {filteredReviews.length === 0 ? (
                <p className='td-empty-text'>No reviews yet. Learner reviews will appear here.</p>
              ) : (
                <div className='td-review-list'>
                  {filteredReviews.map(review => (
                    <article key={review.id} className='td-review-card'>
                      <div className='td-review-head'>
                        <h3>{review.courseTitle || 'Course Review'}</h3>
                        <span>{review.learnerName || review.learnerEmail || 'Learner'}</span>
                      </div>
                      <div className='td-review-rating'>
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar key={star} className={star <= (review.rating || 0) ? 'active' : ''} />
                        ))}
                      </div>
                      <p>{review.comment || 'No comment provided.'}</p>
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
                <span className='td-section-badge'>
                  <span className='td-badge-icon' aria-hidden='true'>MO</span>
                  Monetization
                </span>
                <p>Track payout readiness and prepare your premium catalog for sustainable revenue.</p>
              </div>
              <h1>Earnings</h1>
              <p className='td-empty-text'>Revenue and payouts can be enabled once monetization is activated.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default TeacherDashboard
