import React, { useState, useRef } from 'react'
import {
  FaCertificate,
  FaChevronLeft,
  FaClipboardList,
  FaDownload,
  FaFileAlt,
  FaMobileAlt,
  FaPlayCircle,
  FaCheckCircle
} from 'react-icons/fa'
import '../styles/courseContent.css'
import CourseCard from '../components/Coursecard'
import { useNavigate } from 'react-router-dom'
import { downloadCourseCertificate } from '../utils/certificate'

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
  learningOutcomes = [],
  courseSkills = [],
  courseTools = [],
  courseLanguage = 'English',
  courseSubtitlesLabel = 'Video subtitles available',
  courseUpdatedAtLabel = '',
  certificateDownloadUrl = '',
  certificateFileName = '',
  learnerName = ''
}) => {
  const [expanded, setExpanded] = useState({})

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
  const normalizedOutcomes = Array.isArray(learningOutcomes)
    ? learningOutcomes
        .map(item => String(item || '').trim())
        .filter(Boolean)
    : String(learningOutcomes || '')
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)

  const fallbackOutcomes = [
    `Understand core ${courseType || 'course'} concepts and vocabulary.`,
    'Apply what you learn through guided lessons and practice activities.',
    'Finish with practical confidence to continue independently.'
  ]
  const resolvedOutcomes = normalizedOutcomes.length > 0 ? normalizedOutcomes : fallbackOutcomes
  const resolvedSkills = Array.isArray(courseSkills)
    ? courseSkills.map(item => String(item || '').trim()).filter(Boolean)
    : []
  const resolvedTools = Array.isArray(courseTools)
    ? courseTools.map(item => String(item || '').trim()).filter(Boolean)
    : []
  const certificateReadyToDownload = Boolean(certificateDownloadUrl)
  const certificateLocked = !isPreviewMode && completionPercent < 100
  const certificateFallbackReady = !certificateReadyToDownload && !isPreviewMode && completionPercent >= 100

  const handleDownloadCompletionCertificate = () => {
    const learnerDisplayName = learnerName || 'Learner'
    const completionDate = new Date().toLocaleDateString()

    downloadCourseCertificate({
      learnerName: learnerDisplayName,
      courseTitle: title || 'Course',
      completedAt: completionDate,
      tutorName: teacherName || 'Tutor'
    })
  }

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

  const scrollToSection = (sectionRef) => {
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

      <section className='cc-course-insight-shell'>
        <div className='cc-page-divider-head'>
          <h2>Course Overview</h2>
          <p>Start here to see what this course is about, what you will use, and what you unlock when you finish.</p>
        </div>

        <div className='cc-insight-layout'>
          <div className='cc-insight-main'>
            <div className='cc-outcomes-block cc-about-block'>
              <h2>About this course</h2>
              <p className='cc-about-copy'>{description || 'Course description will appear here.'}</p>
              <div className='cc-chip-wrap'>
                <span className='cc-insight-chip'>{difficulty || 'Beginner'} level</span>
                <span className='cc-insight-chip'>{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
                <span className='cc-insight-chip'>{totalLessons} lesson{totalLessons !== 1 ? 's' : ''}</span>
                <span className='cc-insight-chip'>{courseType || 'General'} track</span>
              </div>
            </div>

            <div className='cc-outcomes-block'>
              <h2>How to use this course</h2>
              <p className='cc-outcomes-note'>Follow these three simple steps to move through the course without feeling lost.</p>
              <div className='cc-flow-card cc-flow-card-actions'>
                <button className='cc-flow-btn' onClick={() => scrollToSection(contentSectionRef)} type='button'>1. Learn with lessons</button>
                <button className='cc-flow-btn cc-flow-btn-alt' onClick={handleNotesClick} type='button'>2. Read or download notes</button>
                <button className='cc-flow-btn cc-flow-btn-alt' onClick={onQuizClick} type='button' disabled={!onQuizClick}>3. Take the quiz</button>
              </div>
            </div>

            <div className='cc-insight-horizontal'>
              <div className='cc-outcomes-block cc-skills-block'>
                <h2>Skills you'll gain</h2>
                {resolvedSkills.length > 0 ? (
                  <ul className='cc-skill-list'>
                    {resolvedSkills.map((skill, index) => (
                      <li key={`${skill}-${index}`}>
                        <FaCheckCircle className='cc-skill-icon' />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='cc-outcomes-note'>Tutor has not added course skills yet.</p>
                )}
              </div>

              <div className='cc-outcomes-block'>
                <h2>Tools you'll learn</h2>
                {resolvedTools.length > 0 ? (
                  <ul className='cc-skill-list'>
                    {resolvedTools.map((tool, index) => (
                      <li key={`${tool}-${index}`}>
                        <FaCheckCircle className='cc-skill-icon' />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='cc-outcomes-note'>Tutor has not added tools for this course yet.</p>
                )}
              </div>

              <div className='cc-outcomes-block'>
                <h2>Details to know</h2>
                <div className='cc-details-grid'>
                  <article className='cc-detail-card'>
                    <FaCertificate className='cc-detail-icon' />
                    <h4>Downloadable certificate</h4>
                    {certificateReadyToDownload ? (
                      <a
                        href={certificateDownloadUrl}
                        download={certificateFileName || `${title || 'course'}-certificate`}
                        className={`cc-certificate-download-btn ${certificateLocked ? 'is-disabled' : ''}`}
                        onClick={(event) => {
                          if (certificateLocked) event.preventDefault()
                        }}
                        aria-disabled={certificateLocked}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <FaDownload /> Download Certificate
                      </a>
                    ) : certificateFallbackReady ? (
                      <button className='cc-certificate-download-btn' type='button' onClick={handleDownloadCompletionCertificate}>
                        <FaDownload /> Download Certificate
                      </button>
                    ) : (
                      <button className='cc-certificate-download-btn is-disabled' type='button' disabled>
                        <FaDownload /> Certificate available upon completion of course
                      </button>
                    )}
                  </article>

                  <article className='cc-detail-card'>
                    <FaMobileAlt className='cc-detail-icon' />
                    <h4>Taught in {courseLanguage || 'English'}</h4>
                    <p>{courseSubtitlesLabel || 'Video subtitles available'}</p>
                  </article>

                  <article className='cc-detail-card'>
                    <FaClipboardList className='cc-detail-icon' />
                    <h4>Recently updated</h4>
                    <p>{courseUpdatedAtLabel || 'Tutor will post update timeline soon.'}</p>
                  </article>
                </div>
                {!isPreviewMode && certificateLocked && (
                  <p className='cc-outcomes-note'>
                    Complete all lessons to unlock your certificate download ({completionPercent}% complete).
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2: What this course includes ══ */}
      <div className='cc-includes-section cc-spacious-section'>
        <div className='cc-page-divider-head'>
          <h2>Course Includes</h2>
          <p>Everything included in this course is listed here so learners can plan their journey clearly.</p>
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
        </div>
      </div>
      {/* ══ SECTION 3: Course content ══ */}
      <div className='cc-content-section cc-spacious-section' ref={contentSectionRef}>
        <div className='cc-page-divider-head'>
          <h2>Lessons & Sections</h2>
          <p>Expanded lesson content with room to study comfortably and track progress across the full page.</p>
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
      

      {/* NOTES PANEL */}
      <div className='cc-notes-section cc-spacious-section' ref={notesRef}>
          <div className='cc-page-divider-head'>
            <h2>Notes & Downloads</h2>
            <p>Access printable notes and reading materials for revision and offline study.</p>
          </div>
          <div className='cc-content-header2'>
            <h2 className='cc-section-title2'><FaFileAlt className='cc-inline-file-icon' /> Course Notes &amp; Articles</h2>
            <button className='cc-expand-all' onClick={() => scrollToSection(contentSectionRef)}>Back to Content</button>
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





    </div>
  )
}

export default CourseContent