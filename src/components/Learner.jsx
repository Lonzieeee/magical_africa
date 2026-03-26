import React, { useEffect, useMemo, useState } from 'react'
import '../styles/learner.css'
import Navbar from '../components/Navbar'
import { db } from '../context/AuthContext'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Learner = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [activeSection, setActiveSection] = useState('progress')
  const [courses, setCourses] = useState([])
  const [progressMap, setProgressMap] = useState({})
  const [achievements, setAchievements] = useState({
    certificates: 0,
    badges: ['Swahili Beginner', 'Storytelling Explorer'],
    milestones: ['First Course Started']
  })

  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [courseSnapshot, progressDoc] = await Promise.all([
          getDocs(collection(db, 'courses')),
          user ? getDoc(doc(db, 'learnerProgress', user.uid)) : Promise.resolve(null)
        ])

        const courseList = courseSnapshot.docs.map(courseDoc => ({
          id: courseDoc.id,
          ...courseDoc.data()
        }))
        setCourses(courseList)

        if (progressDoc?.exists()) {
          const saved = progressDoc.data()
          setProgressMap(saved.courses || {})
          setAchievements(saved.achievements || achievements)
        } else if (user) {
          const initialCourses = courseList.reduce((acc, course) => {
            acc[course.id] = {
              completion: 0,
              lessonsCompleted: 0,
              timeSpentMinutes: 0,
              streak: 0,
              started: false,
              paid: false,
              status: 'Not Started'
            }
            return acc
          }, {})

          setProgressMap(initialCourses)
          await setDoc(doc(db, 'learnerProgress', user.uid), {
            courses: initialCourses,
            achievements: {
              certificates: 0,
              badges: ['Swahili Beginner', 'Storytelling Explorer'],
              milestones: ['First Course Started']
            },
            updatedAt: new Date().toISOString()
          }, { merge: true })
        }
      } catch (err) {
        console.log('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const categories = ['Language', 'Culture', 'History', 'Artisan', 'Pottery', 'Woodwork']

  const filteredCourses = useMemo(() => {
    if (!activeFilter) return courses
    return courses.filter(course =>
      course.courseType?.trim().toLowerCase() === activeFilter.trim().toLowerCase()
    )
  }, [activeFilter, courses])

  const summary = useMemo(() => {
    const values = Object.values(progressMap)
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
  }, [progressMap])

  const handleFilter = (type) => {
    setActiveFilter(prev => (prev === type ? null : type))
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

  return (
    <>
      <Navbar solid />

      <div className='learner-dashboard'>
        <div className='learner-back-row'>
          <button className='learner-back-btn' onClick={() => navigate('/')}>
            ← Back to Website
          </button>
        </div>

        <div className='learner-shell'>
          <aside className='learner-sidebar'>
            <h2>Learner Dashboard</h2>
            <button className={activeSection === 'progress' ? 'active' : ''} onClick={() => setActiveSection('progress')}>
              Progress Overview
            </button>
            <button className={activeSection === 'courses' ? 'active' : ''} onClick={() => setActiveSection('courses')}>
              My Courses
            </button>
            <button className={activeSection === 'achievements' ? 'active' : ''} onClick={() => setActiveSection('achievements')}>
              Certifications & Achievements
            </button>
            <button className={activeSection === 'culture' ? 'active' : ''} onClick={() => setActiveSection('culture')}>
              Cultural Exploration Hub
            </button>
            <button className={activeSection === 'language' ? 'active' : ''} onClick={() => setActiveSection('language')}>
              Language Practice
            </button>
          </aside>

          <main className='learner-main'>
            {loading && <p className='learner-loading'>Loading your dashboard...</p>}

            {!loading && activeSection === 'progress' && (
              <section className='learner-panel'>
                <h1>Progress Overview</h1>
                <div className='learner-metrics-grid'>
                  <article className='learner-metric-card'>
                    <h3>% Course Completion</h3>
                    <p>{summary.completion}%</p>
                  </article>
                  <article className='learner-metric-card'>
                    <h3>Lessons Completed</h3>
                    <p>{summary.lessonsCompleted}</p>
                  </article>
                  <article className='learner-metric-card'>
                    <h3>Streak 🔥</h3>
                    <p>{summary.streak} days</p>
                  </article>
                  <article className='learner-metric-card'>
                    <h3>Time Spent Learning</h3>
                    <p>{summary.timeSpentMinutes} mins</p>
                  </article>
                </div>
              </section>
            )}

            {!loading && activeSection === 'courses' && (
              <section className='learner-panel'>
                <h1>My Courses</h1>

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

                {filteredCourses.length === 0 && (
                  <p className='learner-empty'>No courses found for this category yet.</p>
                )}

                <div className='learner-course-list'>
                  {filteredCourses.map(course => {
                    const progress = progressMap[course.id] || {}
                    const completion = progress.completion || 0

                    return (
                      <article key={course.id} className='learner-course-card'>
                        <div>
                          <h3>{course.title || 'Untitled Course'}</h3>
                          <p>{course.description || 'No description yet.'}</p>
                          <div className='learner-course-meta'>
                            <span>{course.courseType || 'General'}</span>
                            <span>{progress.paid ? 'Paid' : 'Available'}</span>
                            <span>{progress.started ? 'Started' : 'Not Started'}</span>
                          </div>
                        </div>

                        <div>
                          <div className='learner-progress-row'>
                            <p>Progress: {completion}%</p>
                            <div className='learner-progress-bar'>
                              <div style={{ width: `${completion}%` }} />
                            </div>
                          </div>

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
    </>
  )
}

export default Learner