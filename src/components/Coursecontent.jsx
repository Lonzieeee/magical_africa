import React, { useEffect, useState, useRef } from 'react'
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
  courseId,
  courseType,
  onQuizClick,
  completedLessonIds = [],
  onToggleLessonComplete,
  isPreviewMode = false,
  onBackToDashboard,
  previewPrice = 0,
  previewOwned = false,
  previewActionLoading = false,
  onPreviewAction,
  persistedTabState = null,
  onPersistTabState
}) => {
  const [expanded, setExpanded] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [visitedTabs, setVisitedTabs] = useState({ overview: true })

  const notesRef = useRef(null)
  const includesRef = useRef(null)
  const flowRef = useRef(null)
  const contentSectionRef = useRef(null)
  const lastSyncedTabStateRef = useRef('')
  const navigate = useNavigate()
  const courseIdentity = String(courseId || title || 'default-course').trim().toLowerCase().replace(/\s+/g, '-')
  const tabStateStorageKey = `ma-course-tab-state:${courseIdentity}`

  useEffect(() => {
    try {
      const stored = localStorage.getItem(tabStateStorageKey)
      if (!stored) return
      const parsed = JSON.parse(stored)
      if (parsed?.activeTab) {
        setActiveTab(parsed.activeTab)
      }
      if (parsed?.visitedTabs && typeof parsed.visitedTabs === 'object') {
        setVisitedTabs((prev) => ({ ...prev, ...parsed.visitedTabs, overview: true }))
      }
    } catch {
      setActiveTab('overview')
      setVisitedTabs({ overview: true })
    }
  }, [tabStateStorageKey])

  useEffect(() => {
    if (!persistedTabState || typeof persistedTabState !== 'object') return

    const allowedTabs = ['overview', 'workflow', 'content', 'notes']
    const incomingTab = allowedTabs.includes(persistedTabState.activeTab)
      ? persistedTabState.activeTab
      : null
    const incomingVisited = persistedTabState.visitedTabs && typeof persistedTabState.visitedTabs === 'object'
      ? persistedTabState.visitedTabs
      : null

    if (!incomingTab && !incomingVisited) return

    if (incomingTab) {
      setActiveTab((prev) => (prev === incomingTab ? prev : incomingTab))
    }

    if (incomingVisited) {
      setVisitedTabs((prev) => {
        const next = { ...prev, ...incomingVisited, overview: true }
        const prevSerialized = JSON.stringify(prev)
        const nextSerialized = JSON.stringify(next)
        return prevSerialized === nextSerialized ? prev : next
      })
    }

    lastSyncedTabStateRef.current = JSON.stringify({
      activeTab: incomingTab || activeTab,
      visitedTabs: { ...visitedTabs, ...(incomingVisited || {}), overview: true }
    })
  }, [persistedTabState])

  useEffect(() => {
    try {
      const stateToStore = JSON.stringify({
        activeTab,
        visitedTabs
      })
      localStorage.setItem(tabStateStorageKey, stateToStore)
    } catch {
      // Ignore storage write errors (private mode, quota, etc.)
    }
  }, [activeTab, visitedTabs, tabStateStorageKey])

  useEffect(() => {
    if (typeof onPersistTabState !== 'function') return

    const payload = {
      activeTab,
      visitedTabs
    }
    const serialized = JSON.stringify(payload)

    if (lastSyncedTabStateRef.current === serialized) return
    lastSyncedTabStateRef.current = serialized

    onPersistTabState(payload)
  }, [activeTab, visitedTabs, onPersistTabState])

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

  const markTabVisited = (tabKey) => {
    setVisitedTabs((prev) => ({ ...prev, [tabKey]: true }))
  }

  const jumpToSection = (tabKey, sectionRef) => {
    setActiveTab(tabKey)
    markTabVisited(tabKey)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Collect all notes lessons that have an uploaded file across all topics
  const allNotes = topics.flatMap(topic =>
    (topic.lessons || [])
      .filter(l => l.type === 'notes' && l.fileData)
      .map(l => ({ ...l, topicTitle: topic.title }))
  )

  // Clicking "Course notes & articles" — reveal panel and scroll to it
  const handleNotesClick = () => {
    setActiveTab('notes')
    markTabVisited('notes')
    setTimeout(() => {
      notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const contentTabCompleted = totalLessons > 0 && completedLessonIds.length >= totalLessons
  const tabMeta = {
    overview: { done: Boolean(visitedTabs.overview) },
    workflow: { done: Boolean(visitedTabs.workflow) },
    content: { done: contentTabCompleted },
    notes: { done: Boolean(visitedTabs.notes) }
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

      <div className='cc-page-nav'>
        <button className={`cc-page-tab ${activeTab === 'overview' ? 'active' : ''} ${tabMeta.overview.done ? 'is-done' : ''}`} type='button' onClick={() => jumpToSection('overview', includesRef)}>
          <span>Page 1: Overview</span>
          {tabMeta.overview.done && <strong>✓</strong>}
        </button>
        <button className={`cc-page-tab ${activeTab === 'workflow' ? 'active' : ''} ${tabMeta.workflow.done ? 'is-done' : ''}`} type='button' onClick={() => jumpToSection('workflow', flowRef)}>
          <span>Page 2: Workflow</span>
          {tabMeta.workflow.done && <strong>✓</strong>}
        </button>
        <button className={`cc-page-tab ${activeTab === 'content' ? 'active' : ''} ${tabMeta.content.done ? 'is-done' : ''}`} type='button' onClick={() => jumpToSection('content', contentSectionRef)}>
          <span>Page 3: Content</span>
          {tabMeta.content.done && <strong>✓</strong>}
        </button>
        <button className={`cc-page-tab ${activeTab === 'notes' ? 'active' : ''} ${tabMeta.notes.done ? 'is-done' : ''}`} type='button' onClick={handleNotesClick}>
          <span>Page 4: Notes</span>
          {tabMeta.notes.done && <strong>✓</strong>}
        </button>
      </div>

      {/* ══ SECTION 2: What this course includes ══ */}
      {activeTab === 'overview' && (
      <div className='cc-includes-section cc-tab-panel' ref={includesRef}>
        <div className='cc-page-divider-head'>
          <span className='cc-page-step'>Page 1</span>
          <h2>Overview & Includes</h2>
          <p>Start here to understand what you get in this course before moving into the learning flow.</p>
        </div>
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
      )}

      {activeTab === 'workflow' && (
      <div className='cc-flow-strip cc-tab-panel' ref={flowRef}>
        <div className='cc-page-divider-head'>
          <span className='cc-page-step'>Page 2</span>
          <h2>Learning Workflow</h2>
          <p>Use these direct actions to move quickly through lessons, notes, and quiz checkpoints.</p>
        </div>
        <article className='cc-flow-card'>
          <h3>{isPreviewMode ? 'Start Here' : 'Continue Here'}</h3>
          <p>
            {isPreviewMode
              ? 'Scan section structure first, then open details or notes to evaluate the course quickly.'
              : (nextLesson ? `Pick up directly from ${nextLesson.title} and keep your momentum.` : 'You are done with all current lessons. Revisit notes and quizzes anytime.')}
          </p>
        </article>
        <article className='cc-flow-card cc-flow-card-actions'>
          <button className='cc-flow-btn' onClick={() => jumpToSection('content', contentSectionRef)} type='button'>Go to Lessons</button>
          <button className='cc-flow-btn cc-flow-btn-alt' onClick={handleNotesClick} type='button'>Open Notes</button>
          <button className='cc-flow-btn cc-flow-btn-alt' onClick={onQuizClick} type='button' disabled={!onQuizClick}>Open Quiz</button>
        </article>
      </div>
      )}

     



      {/* ══ SECTION 3: Course content ══ */}
      {activeTab === 'content' && (
      <div className='cc-content-section cc-tab-panel' ref={contentSectionRef}>
        <div className='cc-page-divider-head'>
          <span className='cc-page-step'>Page 3</span>
          <h2>Lessons & Sections</h2>
          <p>Expand each section and complete lessons in sequence to keep progress moving.</p>
        </div>

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
      )}



 {/* NOTES PANEL — shown when "Course notes & articles" is clicked */}
      {activeTab === 'notes' && (

      
        <div className='cc-notes-section cc-tab-panel' ref={notesRef}>
          <div className='cc-page-divider-head'>
            <span className='cc-page-step'>Page 4</span>
            <h2>Notes & Downloads</h2>
            <p>Access printable notes and reading materials for revision and offline study.</p>
          </div>
          <div className='cc-content-header2'>
            <h2 className='cc-section-title2'><FaFileAlt className='cc-inline-file-icon' /> Course Notes &amp; Articles</h2>
            <button className='cc-expand-all' onClick={() => jumpToSection('content', contentSectionRef)}>Back to Content</button>
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