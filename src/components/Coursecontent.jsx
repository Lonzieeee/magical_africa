import React, { useState } from 'react'
import '../styles/courseContent.css'
import CourseCard from '../components/Coursecard'

const CourseContent = ({ topics = [], title, description, difficulty, teacherName, regularPrice, maxStudents, salePrice, featuredImage,  }) => {
  // Track which topic sections are expanded
  const [expanded, setExpanded] = useState({})

  const toggleTopic = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Count total lessons across all topics
  const totalLessons = topics.reduce((acc, t) => acc + (t.lessons ? t.lessons.length : 0), 0)

  return (
    <div className='cc-page'>

      {/* ══ SECTION 1: Hero banner ══ */}
      <div className='cc-hero'>
        <div className='cc-hero-inner'>

          <div className='cc-breadcrumb'>
            <span>Academy</span>
            <span className='cc-chevron'>&#8250;</span>
            <span>{difficulty || 'All Levels'}</span>
            <span className='cc-chevron'>&#8250;</span>
            <span className='cc-breadcrumb-active'>{title || 'Course'}</span>
          </div>

          <h1 className='cc-hero-title'>{title || 'Course Title'}</h1>
          <p className='cc-hero-desc'>
            {description || 'Course description will appear here.'}
          </p>

           
           {/* 
          <p className='cc-hero-author'>
            Created by <span>magical.africa Academy</span>
          </p>
          */}

        
     <p className='cc-hero-author'>
     Created by <span>{teacherName || 'magical.africa Academy'}</span>
     </p>

          <div className='cc-hero-meta'>
            <span className={`cc-badge ${difficulty === 'Hard' ? 'cc-badge-hard' : 'cc-badge-beginner'}`}>
              {difficulty || 'Beginner'}
            </span>
            {/* 
            <span className='cc-meta-item'>&#9733; 0.0 &nbsp;&#183;&nbsp; 0 ratings</span>
            */}
           
            <span className='cc-meta-item'>
     {maxStudents ? `${maxStudents} Students` : 'No Students'}
     </span>
            <span className='cc-meta-item'>&#183; {totalLessons} lessons</span>
            <span className='cc-meta-item'>&#183; {topics.length} topics</span>
          </div>

        </div>

       
        <div className='cc-hero-card'>
          <CourseCard
            title={title}
            description={description}
            difficulty={difficulty}
            regularPrice={regularPrice}
            salePrice={salePrice}
            maxStudents={maxStudents}
            featuredImage={featuredImage}
          />
        </div>
        


      </div>

      {/* ══ SECTION 2: What this course includes ══ */}
      <div className='cc-includes-section'>
        <h2 className='cc-section-title'>This course includes:</h2>
        <div className='cc-includes-grid'>
          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#9654;</span>
            <span>On-demand video lessons</span>
          </div>
          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#8681;</span>
            <span>Downloadable materials</span>
          </div>
          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#128203;</span>
            <span>Quizzes &amp; assignments</span>
          </div>
          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#128241;</span>
            <span>Access on mobile &amp; desktop</span>
          </div>
          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#128196;</span>
            <span>Course notes &amp; articles</span>
          </div>
          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#127942;</span>
            <span>Certificate of completion</span>
          </div>
        </div>
      </div>

      {/* ══ SECTION 3: Course content ══ */}
      <div className='cc-content-section'>

        <div className='cc-content-header'>
          <h2 className='cc-section-title'>Course content</h2>
          <button
            className='cc-expand-all'
            onClick={() => {
              const allExpanded = topics.every(t => expanded[t.id])
              const next = {}
              topics.forEach(t => { next[t.id] = !allExpanded })
              setExpanded(next)
            }}
          >
            {topics.every(t => expanded[t.id]) ? 'Collapse all sections' : 'Expand all sections'}
          </button>
        </div>

        <p className='cc-content-summary'>
          {topics.length} section{topics.length !== 1 ? 's' : ''} &nbsp;&#183;&nbsp; {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
        </p>

        {/* Topics list */}
        <div className='cc-topics-list'>
          {topics.length === 0 ? (
            <div className='cc-empty'>No topics added yet.</div>
          ) : (
            topics.map((topic, ti) => (
              <div key={topic.id} className='cc-topic-block'>

                {/* Topic header row — click to expand */}
                <div
                  className='cc-topic-header'
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div className='cc-topic-left'>
                    <span className={`cc-topic-chevron ${expanded[topic.id] ? 'cc-chevron-open' : ''}`}>
                      &#8249;
                    </span>
                    <span className='cc-topic-name'>
                      {topic.title || `Topic ${ti + 1}`}
                    </span>
                  </div>
                  <div className='cc-topic-right'>
                    <span className='cc-topic-meta'>
                      {topic.lessons ? topic.lessons.length : 0} lesson{(topic.lessons ? topic.lessons.length : 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Topic description if expanded */}
                {expanded[topic.id] && (
                  <div className='cc-topic-body'>

                    {topic.description && (
                      <p className='cc-topic-desc'>{topic.description}</p>
                    )}

                    {/* Lessons list */}
                    {topic.lessons && topic.lessons.length > 0 ? (
                      topic.lessons.map((lesson, li) => (
                        <div key={lesson.id} className='cc-lesson-row'>
                          <div className='cc-lesson-left'>
                            {/* 
                            <span className='cc-lesson-icon'>
                              {lesson.type === 'video' ? '&#9654;' : '&#128196;'}
                            </span>
                            */}

                            <span className='cc-lesson-title'>
                              {lesson.title || `Lesson ${li + 1}`}
                            </span>
                          </div>
                          <div className='cc-lesson-right'>
                            {lesson.type === 'video' && (
                              <span className='cc-lesson-preview'>&#9654; Preview</span>
                            )}
                            <span className='cc-lesson-duration'>
                              {lesson.duration || '—'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className='cc-no-lessons'>No lessons added to this topic yet.</p>
                    )}

                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  )
}

export default CourseContent