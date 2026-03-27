import React from 'react'
import '../styles/curriculum.css'
import '../styles/teacher-dashboard.css'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'


const Curriculum = () => {
  const navigate = useNavigate()

  return (
    <div className='td-dashboard curriculum-dashboard'>
      <div className='td-layout'>
        <aside className='td-sidebar'>
          <button className='td-back-btn' onClick={() => navigate('/teacher-dashboard')}>
            <FaChevronLeft aria-hidden='true' />
            <span>Back to Tutor Dashboard</span>
          </button>

          <div className='td-sidebar-brand'>
            <img src='/images/magicaal-logo1-removebg-preview.png' alt='Magical Africa logo' />
            <h2>Tutor Dashboard</h2>
          </div>

          <div className='td-nav-groups'>
            <div className='td-nav-group'>
              <button className='td-nav-group-title expanded' type='button' aria-expanded='true'>
                Teaching Hub
              </button>
              <div className='td-nav-submenu'>
                <button className='td-nav-subitem' onClick={() => navigate('/teacher-dashboard')} type='button'>
                  Courses
                </button>
                <button className='td-nav-subitem active' type='button'>
                  Curriculum
                </button>
                <button className='td-nav-subitem' onClick={() => navigate('/lesson')} type='button'>
                  Lesson Builder
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className='td-main curriculum-main'>
          <section className='curriculum-stage td-view-stage'>
            <h1>Curriculum Builder</h1>
            <p className='curriculum-lead'>
              Structure your course into focused modules, lessons, and quizzes. Build clearly and publish with confidence.
            </p>

            <div className='curriculum-focus'>
              <img src='/images/Adobe%20Express%20-%20file(1).png' alt='Curriculum illustration' />
              <h2>Start Building Your Course</h2>
              <p>Add topics, lessons, and quizzes to create a complete learning journey.</p>

              <div className='curriculum-actions'>
                <button className='td-status-btn curriculum-next-btn' onClick={() => navigate('/lesson')} type='button'>
                  Next
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Curriculum