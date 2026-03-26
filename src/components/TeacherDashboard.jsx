import React, { useMemo, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../context/AuthContext'
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  updateDoc
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import '../styles/teacher-dashboard.css'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('courses')
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [announcementText, setAnnouncementText] = useState('')
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)

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
      const coursesQuery = query(
        collection(db, 'courses'),
        where('teacherId', '==', auth.currentUser?.uid),
        orderBy('createdAt', 'desc')
      )

      const [coursesSnapshot, enrollmentSnapshot, announcementSnapshot] = await Promise.allSettled([
        getDocs(coursesQuery),
        getDocs(collection(db, 'enrollments')),
        getDocs(collection(db, 'announcements'))
      ])

      const myCourses = coursesSnapshot.status === 'fulfilled'
        ? coursesSnapshot.value.docs.map(d => ({ id: d.id, ...d.data() }))
        : []
      setCourses(myCourses)

      const myCourseIds = new Set(myCourses.map(course => course.id))
      const enrollmentDocs = enrollmentSnapshot.status === 'fulfilled'
        ? enrollmentSnapshot.value.docs
        : []
      const announcementDocs = announcementSnapshot.status === 'fulfilled'
        ? announcementSnapshot.value.docs
        : []

      const myEnrollments = enrollmentDocs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => item.teacherId === auth.currentUser?.uid || myCourseIds.has(item.courseId))

      const teacherAnnouncements = announcementDocs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => item.teacherId === auth.currentUser?.uid)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

      setEnrollments(myEnrollments)
      setAnnouncements(teacherAnnouncements)
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

  const handleEdit = (courseId) => {
    navigate('/teacher', { state: { editCourseId: courseId } })
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
    localStorage.removeItem('currentCourseId')
    navigate('/teacher')
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

  return (
    <>
      <Navbar solid />

      <div className='td-dashboard'>
        <div className='td-back-row'>
          <button className='td-back-btn' onClick={() => navigate('/')}>
            {'<- Back to Website'}
          </button>
        </div>

        <div className='td-layout'>
          <aside className='td-sidebar'>
            <h2>Tutor Dashboard</h2>
            <button className={activeSection === 'courses' ? 'active' : ''} onClick={() => setActiveSection('courses')}>Courses</button>
            <button className={activeSection === 'builder' ? 'active' : ''} onClick={() => setActiveSection('builder')}>Course Builder</button>
            <button className={activeSection === 'students' ? 'active' : ''} onClick={() => setActiveSection('students')}>Students</button>
            <button className={activeSection === 'analytics' ? 'active' : ''} onClick={() => setActiveSection('analytics')}>Analytics</button>
            <button className={activeSection === 'quizzes' ? 'active' : ''} onClick={() => setActiveSection('quizzes')}>Quizzes & Assessments</button>
            <button className={activeSection === 'culture' ? 'active' : ''} onClick={() => setActiveSection('culture')}>Cultural Content</button>
            <button className={activeSection === 'language' ? 'active' : ''} onClick={() => setActiveSection('language')}>Language Tools</button>
            <button className={activeSection === 'messages' ? 'active' : ''} onClick={() => setActiveSection('messages')}>Messages</button>
            <button className={activeSection === 'reviews' ? 'active' : ''} onClick={() => setActiveSection('reviews')}>Reviews</button>
            <button className={activeSection === 'earnings' ? 'active' : ''} onClick={() => setActiveSection('earnings')}>Earnings</button>
          </aside>

          <main className='td-main'>
            {loading && <p>Loading dashboard...</p>}

            {!loading && activeSection === 'courses' && (
              <section>
                <div className='td-header'>
                  <h1>Courses</h1>
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
                      <button className='td-edit-btn' onClick={() => handleEdit(course.id)}>Edit</button>
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
                <div className='td-quick-grid'>
                  <article>
                    <h3>Structured Modules & Lessons</h3>
                    <p>Build modules, add lessons, and arrange content for professional flow.</p>
                    <button onClick={() => navigate('/curriculum')}>Open Curriculum</button>
                  </article>
                  <article>
                    <h3>Upload Content</h3>
                    <p>Add video lessons, written notes, and language audio resources.</p>
                    <button onClick={() => navigate('/lesson')}>Open Lesson Builder</button>
                  </article>
                  <article>
                    <h3>Draft / Published Workflow</h3>
                    <p>Control release quality by reviewing each course before publishing.</p>
                    <button onClick={() => setActiveSection('courses')}>Manage Status</button>
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
                <p className='td-empty-text'>Ratings and comments will appear here as learners review your courses.</p>
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
    </>
  )
}

export default TeacherDashboard
