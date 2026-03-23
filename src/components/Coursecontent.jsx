import React, { useState, useRef } from 'react'
import '../styles/courseContent.css'
import CourseCard from '../components/Coursecard'
import { useNavigate } from 'react-router-dom'

const CourseContent = ({ topics = [], title, description, difficulty, teacherName, regularPrice, maxStudents, salePrice, featuredImage, courseType, onQuizClick, showQuiz }) => {
  const [expanded, setExpanded] = useState({})
  const [showNotes, setShowNotes] = useState(false)

  const notesRef = useRef(null)
  const navigate = useNavigate()

  const toggleTopic = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalLessons = topics.reduce((acc, t) => acc + (t.lessons ? t.lessons.length : 0), 0)

  // ✅ Collect all notes lessons that have an uploaded file across all topics
  const allNotes = topics.flatMap(topic =>
    (topic.lessons || [])
      .filter(l => l.type === 'notes' && l.fileData)
      .map(l => ({ ...l, topicTitle: topic.title }))
  )

  // ✅ Clicking "Course notes & articles" — reveal panel and scroll to it
  const handleNotesClick = () => {
    setShowNotes(true)
    setTimeout(() => {
      notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

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

          <p className='cc-hero-author'>
            Created by <span onClick={() => navigate('/teacher-dashboard')}>{teacherName || 'magical.africa Academy'}</span>
          </p>

          <div className='cc-hero-meta'>
            <span className={`cc-badge ${difficulty === 'Hard' ? 'cc-badge-hard' : 'cc-badge-beginner'}`}>
              {difficulty || 'Beginner'}
            </span>
            <span className='cc-meta-item'>
              {maxStudents ? `${maxStudents} Students` : 'No Students'}
            </span>
            <span className='cc-coursetype'>&#183; {courseType || 'General'}</span>
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
            teacherName={teacherName}
            courseType={courseType}
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

          <div className='cc-include-item' onClick={onQuizClick} style={{ cursor: 'pointer' }}>
            <span className='cc-include-icon'>&#128203;</span>
            <span>Quizzes &amp; assignments</span>
          </div>

          <div className='cc-include-item'>
            <span className='cc-include-icon'>&#128241;</span>
            <span>Access on mobile &amp; desktop</span>
          </div>

          {/* ✅ Clicking this reveals the notes download panel */}
          <div
            className='cc-include-item'
            onClick={handleNotesClick}
            style={{ cursor: 'pointer' }}
          >
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

        <div className='cc-topics-list'>
          {topics.length === 0 ? (
            <div className='cc-empty'>No topics added yet.</div>
          ) : (
            topics.map((topic, ti) => (
              <div key={topic.id} className='cc-topic-block'>

                <div className='cc-topic-header' onClick={() => toggleTopic(topic.id)}>
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

                {expanded[topic.id] && (
                  <div className='cc-topic-body'>

                    {topic.description && (
                      <p className='cc-topic-desc'>{topic.description}</p>
                    )}

                    {topic.lessons && topic.lessons.length > 0 ? (
                      topic.lessons.map((lesson, li) => (
                        <div key={lesson.id} className='cc-lesson-row'>

                          <div className='cc-lesson-left'>
                            <span className='cc-lesson-title'>
                              {/* ✅ If notes type with file — clicking the title downloads the PDF */}
                              {lesson.type === 'notes' && lesson.fileData ? (
                                <a
                                  href={lesson.fileData}
                                  download={lesson.fileName || 'course-notes'}
                                  className='cc-lesson-download'
                                >
                                  📄 {lesson.title || `Lesson ${li + 1}`}
                                </a>
                              ) : (
                                // ✅ Video or notes without file — just show the title
                                <span>{lesson.title || `Lesson ${li + 1}`}</span>
                              )}
                            </span>
                          </div>

                          <div className='cc-lesson-right'>
                            {/* ✅ Video preview link */}
                            {lesson.type === 'video' && lesson.videoURL && (
                              <a
                                href={lesson.videoURL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='cc-lesson-preview'
                              >
                                &#9654; Preview
                              </a>
                            )}
                            {/* ✅ Notes download tag in the right side too */}
                            {lesson.type === 'notes' && lesson.fileData && (
                              <a
                                href={lesson.fileData}
                                download={lesson.fileName || 'course-notes'}
                                className='cc-lesson-preview'
                              >
                                &#8659; Download
                              </a>
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



 {/* ✅ NOTES PANEL — shown when "Course notes & articles" is clicked */}
      {showNotes && (
        <div className='cc-notes-section' ref={notesRef}>
          <div className='cc-content-header2'>
            <h2 className='cc-section-title2'>&#128196; Course Notes &amp; Articles</h2>
            <button className='cc-expand-all' onClick={() => setShowNotes(false)}>Hide</button>
          </div>

          {allNotes.length === 0 ? (
            <p className='cc-no-lessons'>No notes have been uploaded for this course yet.</p>
          ) : (
            <div className='cc-notes-list'>
              {allNotes.map((note, i) => (
                <div key={note.id || i} className='cc-note-item'>
                  <div className='cc-note-info'>
                    <span className='cc-note-icon'>📄</span>
                    <div>
                      <p className='cc-note-title'>{note.title || `Note ${i + 1}`}</p>
                      {note.topicTitle && (
                        <p className='cc-note-topic'>From: {note.topicTitle}</p>
                      )}
                    </div>
                  </div>
                  {/* ✅ Download button */}
                  <a
                    href={note.fileData}
                    download={note.fileName || 'course-notes'}
                    className='cc-note-download-btn'
                  >
                    &#8659; Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}




    </div>
  )
}

export default CourseContent