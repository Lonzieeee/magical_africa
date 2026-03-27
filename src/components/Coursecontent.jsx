import React, { useState, useRef } from 'react'
import {
  FaCertificate,
  FaChevronLeft,
  FaClipboardList,
  FaDownload,
  FaFileAlt,
  FaMobileAlt,
  FaPlayCircle
} from 'react-icons/fa'
import '../styles/courseContent.css'
import CourseCard from '../components/Coursecard'
import { useNavigate } from 'react-router-dom'

const CourseContent = ({
  topics = [],
  title,
  description,
  difficulty,
  teacherName,
  regularPrice,
  maxStudents,
  salePrice,
  featuredImage,
  courseType,
  onQuizClick,
  completedLessonIds = [],
  onToggleLessonComplete,
  isPreviewMode = false,
  onBackToDashboard,
  previewPrice = 0,
  previewOwned = false,
  previewActionLoading = false,
  onPreviewAction
}) => {
  const [expanded, setExpanded] = useState({})
  const [showNotes, setShowNotes] = useState(false)

  const notesRef = useRef(null)
  const contentSectionRef = useRef(null)
  const navigate = useNavigate()

  const toggleTopic = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalLessons = topics.reduce((acc, t) => acc + (t.lessons ? t.lessons.length : 0), 0)
  const completionPercent = totalLessons > 0
    ? Math.round((completedLessonIds.length / totalLessons) * 100)
    : 0

  const lessonSequence = topics.flatMap((topic, topicIndex) =>
    (topic.lessons || []).map((lesson, lessonIndex) => ({
      id: String(lesson.id || `${topic.id || `topic-${topicIndex}`}-${lessonIndex}`),
      title: lesson.title || `Lesson ${lessonIndex + 1}`
    }))
  )

  const completedSet = new Set((completedLessonIds || []).map(String))
  const nextLesson = lessonSequence.find((lesson) => !completedSet.has(lesson.id))

  const jumpToLessons = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Collect all notes lessons that have an uploaded file across all topics
  const allNotes = topics.flatMap(topic =>
    (topic.lessons || [])
      .filter(l => l.type === 'notes' && l.fileData)
      .map(l => ({ ...l, topicTitle: topic.title }))
  )

  // Clicking "Course notes & articles" — reveal panel and scroll to it
  const handleNotesClick = () => {
    setShowNotes(true)
    setTimeout(() => {
      notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className={`cc-page ${isPreviewMode ? 'is-preview-mode' : ''}`}>

      {/* ══ SECTION 1: Hero banner ══ */}
      <div className='cc-hero'>
        <div className='cc-hero-inner'>

          <div className='cc-hero-topbar'>
            <button className='cc-hero-back-btn' onClick={onBackToDashboard} type='button'>
              <FaChevronLeft aria-hidden='true' />
              <span>Back to Learner Dashboard</span>
            </button>
            <span className={`cc-hero-mode-badge ${isPreviewMode ? 'is-preview' : 'is-learning'}`}>
              {isPreviewMode ? 'Preview Mode' : 'Learning Mode'}
            </span>
          </div>

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
            Created by <span onClick={() => navigate(isPreviewMode ? '/teacher-dashboard' : '/learner')}>{teacherName || 'magical.africa Academy'}</span>
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
            isPreviewMode={isPreviewMode}
            completionPercent={completionPercent}
            nextLessonTitle={nextLesson?.title || ''}
            previewPrice={previewPrice}
            previewOwned={previewOwned}
            previewActionLoading={previewActionLoading}
            onPreviewAction={onPreviewAction}
          />
        </div>

      </div>

      {!isPreviewMode && (
        <div className='cc-learning-focus'>
          <div className='cc-learning-focus-text'>
            <h3>Continue Learning</h3>
            <p>
              {nextLesson
                ? `Next lesson: ${nextLesson.title}`
                : 'All lessons completed. Great work!'}
            </p>
          </div>

          <div className='cc-learning-focus-stats'>
            <span>{completedLessonIds.length}/{totalLessons} lessons completed</span>
            <strong>{completionPercent}%</strong>
          </div>
        </div>
      )}

      {/* ══ SECTION 2: What this course includes ══ */}
      <div className='cc-includes-section'>
        <h2 className='cc-section-title'>This course includes:</h2>
        <div className='cc-includes-grid'>

          <div className='cc-include-item'>
            <span className='cc-include-icon'><FaPlayCircle /></span>
            <span>On-demand video lessons</span>
          </div>

          <div className='cc-include-item'>
            <span className='cc-include-icon'><FaDownload /></span>
            <span>Downloadable materials</span>
          </div>

          <div className='cc-include-item' onClick={onQuizClick} style={{ cursor: onQuizClick ? 'pointer' : 'default' }}>
            <span className='cc-include-icon'><FaClipboardList /></span>
            <span>Quizzes &amp; assignments</span>
          </div>

          <div className='cc-include-item'>
            <span className='cc-include-icon'><FaMobileAlt /></span>
            <span>Access on mobile &amp; desktop</span>
          </div>

          {/*  Clicking this reveals the notes download panel */}
          <div
            className='cc-include-item'
            onClick={handleNotesClick}
            style={{ cursor: 'pointer' }}
          >
            <span className='cc-include-icon'><FaFileAlt /></span>
            <span>Course notes &amp; articles</span>
          </div>

          <div className='cc-include-item'>
            <span className='cc-include-icon'><FaCertificate /></span>
            <span>Certificate of completion</span>
          </div>

        </div>
      </div>

     



      {/* ══ SECTION 3: Course content ══ */}
      <div className='cc-content-section' ref={contentSectionRef}>

        {!isPreviewMode && (
          <div className='cc-learning-sticky'>
            <div className='cc-learning-sticky-left'>
              <p className='cc-learning-sticky-label'>Learning Mode</p>
              <span>{nextLesson ? `Up next: ${nextLesson.title}` : 'You have completed all current lessons.'}</span>
            </div>
            <div className='cc-learning-sticky-actions'>
              <button className='cc-learning-btn' onClick={jumpToLessons} type='button'>Jump to Lessons</button>
              {onQuizClick && (
                <button className='cc-learning-btn cc-learning-btn-secondary' onClick={onQuizClick} type='button'>Open Quiz</button>
              )}
            </div>
          </div>
        )}

        {isPreviewMode && (
          <div className='cc-preview-ribbon'>
            Preview only: lesson progress and quiz attempts are available after you start the course.
          </div>
        )}

        {isPreviewMode ? (
          <div className='cc-progress-strip'>
            <div className='cc-progress-strip-top'>
              <h3>Course Preview</h3>
              <span>Explore full details before adding or buying.</span>
            </div>
          </div>
        ) : (
          <div className='cc-progress-strip'>
            <div className='cc-progress-strip-top'>
              <h3>Your Progress</h3>
              <span>{completedLessonIds.length}/{totalLessons} lessons completed</span>
            </div>
            <div className='cc-progress-strip-bar'>
              <span
                style={{
                  width: `${totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0}%`
                }}
              />
            </div>
          </div>
        )}

        <div className='cc-overview-grid'>
          <article className='cc-overview-card'>
            <h3>Course Info</h3>
            <p>{topics.length} sections, {totalLessons} lessons, level: {difficulty || 'Beginner'}.</p>
          </article>
          <article className='cc-overview-card'>
            <h3>{isPreviewMode ? 'Preview Path' : 'Learning Path'}</h3>
            <p>
              {isPreviewMode
                ? 'Review lessons, notes, and structure before adding this course to your learning dashboard.'
                : (nextLesson ? `Next up: ${nextLesson.title}. Keep moving to complete your certificate path.` : 'Everything is completed. You can now revisit notes, quizzes, and downloads.')}
            </p>
          </article>
        </div>

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

                          {(() => {
                            const lessonId = String(lesson.id || `${topic.id}-${li}`)
                            const isCompleted = completedLessonIds.includes(lessonId)

                            return (
                              <>

                                <div className='cc-lesson-left'>
                                  <span className='cc-lesson-title'>
                                    {/*  If notes type with file — clicking the title downloads the PDF */}
                                    {lesson.type === 'notes' && lesson.fileData ? (
                                      <a
                                        href={lesson.fileData}
                                        download={lesson.fileName || 'course-notes'}
                                        className='cc-lesson-download'
                                        onClick={() => onToggleLessonComplete && onToggleLessonComplete(lessonId, { action: 'complete', source: 'notes-download' })}
                                      >
                                        <FaFileAlt className='cc-inline-file-icon' /> {lesson.title || `Lesson ${li + 1}`}
                                      </a>
                                    ) : (
                                      //  Video or notes without file — just show the title
                                      <span>{lesson.title || `Lesson ${li + 1}`}</span>
                                    )}
                                  </span>
                                </div>

                                <div className='cc-lesson-right'>
                                  {isPreviewMode && (
                                    <span className='cc-preview-lock'>Preview only</span>
                                  )}
                                  {/*  Video preview link */}
                                  {lesson.type === 'video' && lesson.videoURL && (
                                    <a
                                      href={lesson.videoURL}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='cc-lesson-preview'
                                      onClick={() => onToggleLessonComplete && onToggleLessonComplete(lessonId, { action: 'complete', source: 'video-preview' })}
                                    >
                                      &#9654; Preview
                                    </a>
                                  )}
                                  {/*  Notes download tag in the right side too */}
                                  {lesson.type === 'notes' && lesson.fileData && (
                                    <a
                                      href={lesson.fileData}
                                      download={lesson.fileName || 'course-notes'}
                                      className='cc-lesson-preview'
                                      onClick={() => onToggleLessonComplete && onToggleLessonComplete(lessonId, { action: 'complete', source: 'notes-download' })}
                                    >
                                      &#8659; Download
                                    </a>
                                  )}
                                  <span className='cc-lesson-duration'>
                                    {lesson.duration || '—'}
                                  </span>
                                  {onToggleLessonComplete && (
                                    <button
                                      className={`cc-complete-btn ${isCompleted ? 'cc-complete-btn-done' : ''}`}
                                      onClick={() => onToggleLessonComplete(lessonId, { action: isCompleted ? 'undo' : 'complete', source: 'manual' })}
                                    >
                                      {isCompleted ? 'Undo Completion' : 'Mark Complete'}
                                    </button>
                                  )}
                                </div>

                              </>
                            )
                          })()}

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



 {/* NOTES PANEL — shown when "Course notes & articles" is clicked */}
      {showNotes && (

      
        <div className='cc-notes-section' ref={notesRef}>
          <div className='cc-content-header2'>
            <h2 className='cc-section-title2'><FaFileAlt className='cc-inline-file-icon' /> Course Notes &amp; Articles</h2>
            <button className='cc-expand-all' onClick={() => setShowNotes(false)}>Hide</button>
          </div>

          {allNotes.length === 0 ? (
            <p className='cc-no-lessons'>No notes have been uploaded for this course yet.</p>
          ) : (
            <div className='cc-notes-list'>
              {allNotes.map((note, i) => (
                <div key={note.id || i} className='cc-note-item'>
                  <div className='cc-note-info'>
                    <span className='cc-note-icon'><FaFileAlt /></span>
                    <div>
                      <p className='cc-note-title'>{note.title || `Note ${i + 1}`}</p>
                      {note.topicTitle && (
                        <p className='cc-note-topic'>From: {note.topicTitle}</p>
                      )}
                    </div>
                  </div>
                  {/*  Download button */}
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