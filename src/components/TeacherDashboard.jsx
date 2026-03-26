import React, { useMemo, useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import '../styles/teacher-dashboard.css'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const { userData } = useAuth()
  const [activeSection, setActiveSection] = useState('courses')
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [reviews, setReviews] = useState([])
  const [announcementText, setAnnouncementText] = useState('')
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const [builderMode, setBuilderMode] = useState('create')
  const [editingCourseId, setEditingCourseId] = useState('')
  const [builderSaving, setBuilderSaving] = useState(false)
  const [builderMessage, setBuilderMessage] = useState('')
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

      const [coursesSnapshot, enrollmentSnapshot, announcementSnapshot, reviewSnapshot] = await Promise.allSettled([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'enrollments')),
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
        .filter(item => item.teacherId === currentTeacherId || myCourseIds.has(item.courseId))
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

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
    setBuilderMessage('')
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
    setActiveSection('builder')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFeaturedImage(reader.result || '')
    }
    reader.readAsDataURL(file)
  }

  const saveCourse = async () => {
    if (!auth.currentUser) {
      setBuilderMessage('You must be logged in to save a course.')
      return null
    }

    if (!title.trim() || !description.trim()) {
      setBuilderMessage('Please add at least course title and description.')
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
        regularPrice: regularPrice || '0',
        salePrice: salePrice || '0',
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
    if (!announcementText.trim()) return
    try {
      const createdAt = new Date().toISOString()
      const docRef = await addDoc(collection(db, 'announcements'), {
        teacherId: auth.currentUser?.uid,
        message: announcementText.trim(),
        createdAt
      })
      setAnnouncements(prev => [
        { id: docRef.id, teacherId: auth.currentUser?.uid, message: announcementText.trim(), createdAt },
        ...prev
      ])
      setAnnouncementText('')
    } catch (err) {
      console.log('Failed to post announcement:', err)
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
    return courses.find(course => course.id === editingCourseId) || null
  }, [courses, editingCourseId])

  const builderOutline = useMemo(() => {
    if (!activeBuilderCourse) {
      return {
        topics: [],
        totalLessons: 0,
        totalQuizzes: 0
      }
    }

    const topics = Array.isArray(activeBuilderCourse.topics) ? activeBuilderCourse.topics : []
    const totalLessons = topics.reduce((count, topic) => {
      const lessons = Array.isArray(topic.lessons) ? topic.lessons.length : 0
      return count + lessons
    }, 0)
    const totalQuizzes = topics.reduce((count, topic) => {
      const quizzes = Array.isArray(topic.quizzes) ? topic.quizzes.length : 0
      return count + quizzes
    }, 0)

    return {
      topics,
      totalLessons,
      totalQuizzes
    }
  }, [activeBuilderCourse])

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

  return (
    <div className='td-dashboard'>
      <div className='td-layout'>
        <aside className='td-sidebar'>
          <button className='td-back-btn' onClick={() => navigate('/')}>
            {'<- Back to Website'}
          </button>

          <div className='td-sidebar-brand'>
            <img src='/images/magicaal-logo1-removebg-preview.png' alt='Magical Africa logo' />
            <h2>Tutor Dashboard</h2>
          </div>

          <button className={`td-nav-btn ${activeSection === 'courses' ? 'active' : ''}`} onClick={() => setActiveSection('courses')}>Courses</button>
          <button className={`td-nav-btn ${activeSection === 'builder' ? 'active' : ''}`} onClick={() => setActiveSection('builder')}>Course Builder</button>
          <button className={`td-nav-btn ${activeSection === 'students' ? 'active' : ''}`} onClick={() => setActiveSection('students')}>Students</button>
          <button className={`td-nav-btn ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => setActiveSection('analytics')}>Analytics</button>
          <button className={`td-nav-btn ${activeSection === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveSection('quizzes')}>Quizzes & Assessments</button>
          <button className={`td-nav-btn ${activeSection === 'culture' ? 'active' : ''}`} onClick={() => setActiveSection('culture')}>Cultural Content</button>
          <button className={`td-nav-btn ${activeSection === 'language' ? 'active' : ''}`} onClick={() => setActiveSection('language')}>Language Tools</button>
          <button className={`td-nav-btn ${activeSection === 'messages' ? 'active' : ''}`} onClick={() => setActiveSection('messages')}>Messages</button>
          <button className={`td-nav-btn ${activeSection === 'reviews' ? 'active' : ''}`} onClick={() => setActiveSection('reviews')}>Reviews</button>
          <button className={`td-nav-btn ${activeSection === 'earnings' ? 'active' : ''}`} onClick={() => setActiveSection('earnings')}>Earnings</button>
        </aside>

        <main className='td-main'>
          {loading && <p>Loading dashboard...</p>}

          {!loading && activeSection === 'courses' && (
            <section>
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

              {courses.map(course => (
                <article key={course.id} className='td-course-card'>
                  <div className='td-course-info'>
                    <h3>{course.title || 'Untitled Course'}</h3>
                    <p>{course.description?.slice(0, 100) || 'No description yet.'}</p>
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
                </article>
              ))}
            </section>
          )}

          {!loading && activeSection === 'builder' && (
            <section>
              <h1>Course Builder</h1>
              <div className='td-builder-layout'>
                <article className='td-builder-form'>
                  <h3>{builderMode === 'edit' ? 'Edit Course' : 'Create Course'}</h3>
                  {builderMessage && <p className='td-builder-message'>{builderMessage}</p>}

                  <label>Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Course title...' />

                  <label>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Course description...' />

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
                    </div>
                    <div>
                      <label>Pricing Model</label>
                      <select value={pricingModel} onChange={(e) => setPricingModel(e.target.value)}>
                        <option value='free'>Free</option>
                        <option value='paid'>Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className='td-builder-grid-two'>
                    <div>
                      <label>Regular Price ($)</label>
                      <input value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} placeholder='64.99' />
                    </div>
                    <div>
                      <label>Sale Price ($)</label>
                      <input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder='11.99' />
                    </div>
                  </div>

                  <label>Featured Image</label>
                  <input type='file' accept='image/*' onChange={handleImageUpload} />

                  {featuredImage && (
                    <div className='td-builder-image-preview'>
                      <img src={featuredImage} alt='Course preview' />
                    </div>
                  )}

                  <div className='td-builder-actions'>
                    <button className='td-create-btn td-builder-primary' onClick={saveCourse} disabled={builderSaving}>
                      {builderSaving ? 'Saving...' : 'Save Course'}
                    </button>
                    <button className='td-status-btn td-builder-secondary' onClick={() => handleSaveAndGo('/curriculum')} disabled={builderSaving}>
                      Save & Open Curriculum
                    </button>
                    <button className='td-edit-btn td-builder-secondary' onClick={() => handleSaveAndGo('/lesson')} disabled={builderSaving}>
                      Save & Open Lesson Builder
                    </button>
                    <button className='td-delete-btn' onClick={() => setActiveSection('courses')}>
                      Manage My Courses
                    </button>
                  </div>
                </article>

                <article className='td-builder-preview'>
                  <h3>Builder Overview</h3>
                  <p>Keep working here for a uniform dashboard experience, or jump into the original pages when needed.</p>

                  {activeBuilderCourse ? (
                    <>
                      <div className='td-builder-stats'>
                        <span>{builderOutline.topics.length} Modules</span>
                        <span>{builderOutline.totalLessons} Lessons</span>
                        <span>{builderOutline.totalQuizzes} Quizzes</span>
                      </div>

                      {builderOutline.topics.length === 0 ? (
                        <p className='td-empty-text'>No curriculum added yet. Save and open Curriculum to start structuring modules.</p>
                      ) : (
                        <ul className='td-builder-outline'>
                          {builderOutline.topics.slice(0, 4).map((topic, index) => (
                            <li key={topic.id || `${topic.title || 'topic'}-${index}`}>
                              <strong>{topic.title || `Module ${index + 1}`}</strong>
                              <span>
                                {(Array.isArray(topic.lessons) ? topic.lessons.length : 0)} lessons · {(Array.isArray(topic.quizzes) ? topic.quizzes.length : 0)} quizzes
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className='td-empty-text'>Create or edit a course to unlock curriculum preview and classic workflow shortcuts.</p>
                  )}

                  <div className='td-builder-classic-actions'>
                    <button className='td-status-btn td-classic-action' onClick={openClassicCoursePage} disabled={builderSaving}>
                      Open Classic Course Page
                    </button>
                    <button className='td-edit-btn td-classic-action' onClick={openClassicCurriculum} disabled={builderSaving}>
                      Open Classic Curriculum
                    </button>
                    <button className='td-edit-btn td-classic-action' onClick={openClassicLessonBuilder} disabled={builderSaving}>
                      Open Classic Lesson Builder
                    </button>
                  </div>
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'students' && (
            <section>
              <h1>Students</h1>
              {enrollments.length === 0 ? (
                <p className='td-empty-text'>No enrolled students yet.</p>
              ) : (
                <div className='td-table-wrap'>
                  <table className='td-table'>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Completion %</th>
                        <th>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map(item => (
                        <tr key={item.id}>
                          <td>{item.studentName || item.studentEmail || 'Learner'}</td>
                          <td>{item.courseTitle || 'Course'}</td>
                          <td>{item.completion || 0}%</td>
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
            <section>
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
            </section>
          )}

          {!loading && activeSection === 'quizzes' && (
            <section>
              <h1>Quizzes & Assessments</h1>
              <div className='td-quick-grid'>
                <article>
                  <h3>Create Quiz Per Lesson</h3>
                  <p>Use the lesson builder to add multiple choice questions with auto grading.</p>
                  <button onClick={() => navigate('/lesson')}>Open Quiz Builder</button>
                </article>
                <article>
                  <h3>Results Overview</h3>
                  <p>Track performance and identify weak areas from learner submissions.</p>
                </article>
              </div>
            </section>
          )}

          {!loading && activeSection === 'culture' && (
            <section>
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
            <section>
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
            <section>
              <h1>Messages & Announcements</h1>
              <div className='td-message-box'>
                <textarea
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder='Write an update to your learners...'
                />
                <button onClick={handlePostAnnouncement}>Post Announcement</button>
              </div>

              <div className='td-announcement-list'>
                {announcements.map(item => (
                  <article key={item.id}>
                    <p>{item.message}</p>
                    <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}</small>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!loading && activeSection === 'reviews' && (
            <section>
              <h1>Reviews & Feedback</h1>
              <div className='td-review-summary'>
                <article>
                  <h3>Average Rating</h3>
                  <p>{reviewSummary.averageRating}/5</p>
                </article>
                <article>
                  <h3>Total Reviews</h3>
                  <p>{reviewSummary.totalReviews}</p>
                </article>
              </div>
              {reviews.length === 0 ? (
                <p className='td-empty-text'>No reviews yet. Learner reviews will appear here.</p>
              ) : (
                <div className='td-review-list'>
                  {reviews.map(review => (
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
            <section>
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
