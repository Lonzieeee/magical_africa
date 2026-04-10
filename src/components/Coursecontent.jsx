import React, { useState, useEffect } from 'react'
import {
  FaCertificate,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaDownload,
  FaFileAlt,
  FaPlayCircle,
  FaChevronDown,
  FaLock
} from 'react-icons/fa'
import '../styles/courseContent.css'
import { downloadCourseCertificate } from '../utils/certificate'

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
    }
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`
    }
    if (url.includes('youtube.com/embed/')) {
      return url.replace('https://www.youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/')
    }
    if (url.includes('embed') || url.includes('vimeo')) return url
  } catch { /* not a valid URL */ }
  return null
}

const isDirectVideoUrl = (url) => {
  if (!url) return false
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')
}

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
  learnerName = '',
  persistedTabState,
  onPersistTabState,
  // Review props passed from CourseContentPage
  reviewRating = 0,
  reviewComment = '',
  reviewImprovement = '',
  reviewSubmitted = false,
  reviewSaving = false,
  onReviewRatingChange,
  onReviewCommentChange,
  onReviewImprovementChange,
  onReviewSubmit,
  courseCompletionPercent = 0,
  onViewTutorProfile
}) => {
    const [activeTab, setActiveTab] = useState('overview')
  const [sidebarExpanded, setSidebarExpanded] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeVideo, setActiveVideo] = useState(null) 

 
  const [localCompletedIds, setLocalCompletedIds] = useState(completedLessonIds || [])
  useEffect(() => {
    setLocalCompletedIds(completedLessonIds || [])
  }, [completedLessonIds])

  const totalLessons = topics.reduce((acc, t) => acc + (t.lessons ? t.lessons.length : 0), 0)
  const completionPercent = totalLessons > 0
    ? Math.round((localCompletedIds.length / totalLessons) * 100)
    : 0

  const certificateReadyToDownload = Boolean(certificateDownloadUrl)
  const certificateLocked = completionPercent < 100
  const certificateFallbackReady = !certificateReadyToDownload && !isPreviewMode && completionPercent >= 100

  const handleDownloadCompletionCertificate = () => {
    downloadCourseCertificate({
      learnerName: learnerName || 'Learner',
      courseTitle: title || 'Course',
      completedAt: new Date().toLocaleDateString(),
      tutorName: teacherName || 'Tutor'
    })
  }

  const lessonSequence = topics.flatMap((topic, topicIndex) =>
    (topic.lessons || []).map((lesson, lessonIndex) => ({
      id: String(lesson.id || `${topic.id || `topic-${topicIndex}`}-${lessonIndex}`),
      title: lesson.title || `Lesson ${lessonIndex + 1}`,
      videoURL: lesson.videoURL || ''
    }))
  )

  const completedSet = new Set((localCompletedIds || []).map(String))
  const nextLesson = lessonSequence.find(l => !completedSet.has(l.id))

  const allNotes = topics.flatMap(topic =>
    (topic.lessons || [])
      .filter(l => l.type === 'notes' && l.fileData)
      .map(l => ({ ...l, topicTitle: topic.title }))
  )

  const topicsWithQuiz = topics.filter(t => t.quiz && t.quiz.length > 0)

  const normalizeList = (value) => {
    if (!Array.isArray(value)) return []
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean)
  }

  const normalizedOutcomes = normalizeList(learningOutcomes)
  const normalizedSkills = normalizeList(courseSkills)
  const normalizedTools = normalizeList(courseTools)

  const toggleSidebarTopic = (id) => {
    setSidebarExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLessonClick = (lesson, lessonId) => {
    if (lesson.videoURL) {
      setActiveVideo({ url: lesson.videoURL, title: lesson.title || 'Lesson', lessonId })
    }
  }

 
  const handleToggle = (lessonId, meta) => {
    if (!onToggleLessonComplete) return
    const action = meta?.action || 'complete'
    setLocalCompletedIds(prev => {
      if (action === 'undo') return prev.filter(id => id !== lessonId)
      if (prev.includes(lessonId)) return prev
      return [...prev, lessonId]
    })
    onToggleLessonComplete(lessonId, meta)
  }

  // For direct mp4/webm — onEnded fires reliably
  const handleVideoEnded = () => {
    if (!activeVideo?.lessonId || !onToggleLessonComplete || isPreviewMode) return
    handleToggle(activeVideo.lessonId, { action: 'complete', source: 'video-ended' })
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'quiz', label: 'Quizzes' },
    { id: 'certificate', label: 'Certificate' },
    { id: 'reviews', label: 'Reviews' },
  ]

  const renderVideoArea = () => {
    if (activeVideo) {
      const embedUrl = getYouTubeEmbedUrl(activeVideo.url)
      const isDirect = isDirectVideoUrl(activeVideo.url)
      const isLessonDone = activeVideo.lessonId
        ? localCompletedIds.includes(activeVideo.lessonId)
        : false

      return (
        <>
          <div className='cc-video-area'>
            {isDirect ? (
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className='cc-video-player'
                onEnded={handleVideoEnded}
              />
            ) : embedUrl ? (
              <iframe
                src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}rel=0&modestbranding=1`}
                title={activeVideo.title}
                className='cc-video-iframe'
                loading='lazy'
                referrerPolicy='strict-origin-when-cross-origin'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            ) : (
              <div className='cc-video-placeholder'>
                <FaPlayCircle className='cc-video-play-icon' />
                <p>Cannot play this video inline.</p>
              </div>
            )}
            <button
              className='cc-video-close-btn'
              type='button'
              onClick={() => setActiveVideo(null)}
            >
              ✕
            </button>
          </div>

          {/* Mark complete bar shown below video */}
          {!isPreviewMode && activeVideo.lessonId && onToggleLessonComplete && (
            <div className='cc-video-complete-bar'>
              <span className='cc-video-lesson-name'>{activeVideo.title}</span>
              <button
                className={`cc-video-complete-btn ${isLessonDone ? 'is-done' : ''}`}
                type='button'
                onClick={() => handleToggle(
                  activeVideo.lessonId,
                  { action: isLessonDone ? 'undo' : 'complete', source: 'manual' }
                )}
              >
                {isLessonDone ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>
          )}
        </>
      )
    }

    return (
      <div className='cc-video-area'>
        {featuredImage
          ? <img src={featuredImage} alt={title} className='cc-video-thumb' />
          : (
            <div className='cc-video-placeholder'>
              <FaPlayCircle className='cc-video-play-icon' />
              <p>Select a lesson from the sidebar to start watching</p>
            </div>
          )}
        {isPreviewMode && (
          <div className='cc-preview-overlay'>
            <span>Preview Mode — Add this course to start learning</span>
            <button onClick={onPreviewAction} disabled={previewActionLoading} type='button'>
              {previewActionLoading ? 'Processing...' : previewOwned ? 'Go to Course' : previewPrice > 0 ? `Buy ($${previewPrice})` : 'Add Free Course'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='cc-page'>
      <div className={`cc-player-layout ${sidebarOpen ? '' : 'cc-sidebar-collapsed'}`}>

        {/* ── LEFT ── */}
        <div className='cc-player-left'>

          {renderVideoArea()}

          {!isPreviewMode && (
            <div className='cc-next-strip'>
              <span className='cc-next-label'>Up next:</span>
              <span className='cc-next-title'>{nextLesson ? nextLesson.title : 'All lessons completed!'}</span>
            </div>
          )}

          <div className='cc-tabs-bar'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`cc-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type='button'
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='cc-tab-content'>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className='cc-tab-panel'>
                <h2>About this course</h2>
                <p className='cc-about-copy'>{description || 'No description available.'}</p>

                {(normalizedOutcomes.length > 0 || normalizedSkills.length > 0 || normalizedTools.length > 0) && (
                  <div className='cc-overview-meta'>
                    {normalizedOutcomes.length > 0 && (
                      <section className='cc-overview-card'>
                        <h3>Learning Outcomes</h3>
                        <ul>
                          {normalizedOutcomes.map((outcome, idx) => (
                            <li key={`outcome-${idx}`}>{outcome}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {normalizedSkills.length > 0 && (
                      <section className='cc-overview-card'>
                        <h3>Skills Learners Gain</h3>
                        <ul>
                          {normalizedSkills.map((skill, idx) => (
                            <li key={`skill-${idx}`}>{skill}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {normalizedTools.length > 0 && (
                      <section className='cc-overview-card'>
                        <h3>Tools Learners Use</h3>
                        <ul>
                          {normalizedTools.map((tool, idx) => (
                            <li key={`tool-${idx}`}>{tool}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* NOTES */}
            {activeTab === 'notes' && (
              <div className='cc-tab-panel'>
                <h2>Course Notes & Downloads</h2>
                <p className='cc-tab-sub'>Access printable notes and reading materials for offline study.</p>
                {allNotes.length === 0 ? (
                  <div className='cc-empty-state'>
                    <FaFileAlt className='cc-empty-icon' />
                    <p>No notes have been uploaded for this course yet.</p>
                  </div>
                ) : (
                  <div className='cc-notes-list'>
                    {allNotes.map((note, i) => (
                      <div key={note.id || i} className='cc-note-item'>
                        <div className='cc-note-info'>
                          <span className='cc-note-icon'><FaFileAlt /></span>
                          <div>
                            <p className='cc-note-title'>{note.title || `Note ${i + 1}`}</p>
                            {note.topicTitle && <p className='cc-note-topic'>From: {note.topicTitle}</p>}
                          </div>
                        </div>
                        <a href={note.fileData} download={note.fileName || 'course-notes'} className='cc-note-download-btn'>
                          <FaDownload /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* QUIZ */}
            {activeTab === 'quiz' && (
              <div className='cc-tab-panel'>
                <h2>Quizzes & Assessments</h2>
                <p className='cc-tab-sub'>Test your knowledge after completing each topic.</p>
                {topicsWithQuiz.length === 0 ? (
                  <div className='cc-empty-state'>
                    <FaClipboardList className='cc-empty-icon' />
                    <p>No quizzes available for this course yet.</p>
                  </div>
                ) : (
                  <div className='cc-quiz-list'>
                    {topicsWithQuiz.map((topic) => (
                      <div key={topic.id} className='cc-quiz-item'>
                        <div className='cc-quiz-item-info'>
                          <FaClipboardList className='cc-quiz-item-icon' />
                          <div>
                            <p className='cc-quiz-item-title'>{topic.title || 'Topic Quiz'}</p>
                            <p className='cc-quiz-item-sub'>{topic.quiz.length} question{topic.quiz.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <button
                          className='cc-quiz-start-btn'
                          type='button'
                          onClick={isPreviewMode ? onPreviewAction : onQuizClick}
                          disabled={!onQuizClick && !isPreviewMode}
                        >
                          {isPreviewMode ? 'Add Course to Attempt' : 'Start Quiz'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATE */}
            {activeTab === 'certificate' && (
              <div className='cc-tab-panel'>
                <h2>Your Certificate</h2>
                <p className='cc-tab-sub'>Complete 100% of this course to unlock your certificate.</p>
                <div className='cc-cert-card'>
                  <FaCertificate className='cc-cert-big-icon' />
                  <div className='cc-cert-info'>
                    <h3>{title || 'Course'} — Certificate of Completion</h3>
                    <p>Awarded to: <strong>{learnerName || 'Learner'}</strong></p>
                    <p>Instructor: {teacherName || 'Tutor'}</p>
                    <div className='cc-cert-progress'>
                      <span>Progress: {completionPercent}%</span>
                      <div className='cc-cert-bar'>
                        <div style={{ width: `${completionPercent}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className='cc-cert-actions'>
                    {certificateReadyToDownload ? (
                      <a
                        href={certificateDownloadUrl}
                        download={certificateFileName || `${title || 'course'}-certificate`}
                        className={`cc-cert-btn ${certificateLocked ? 'is-disabled' : ''}`}
                        onClick={(e) => { if (certificateLocked) e.preventDefault() }}
                        target='_blank' rel='noreferrer'
                      >
                        {certificateLocked ? <><FaLock /> Locked</> : <><FaDownload /> Download Certificate</>}
                      </a>
                    ) : certificateFallbackReady ? (
                      <button className='cc-cert-btn' type='button' onClick={handleDownloadCompletionCertificate}>
                        <FaDownload /> Download Certificate
                      </button>
                    ) : (
                      <button className='cc-cert-btn is-disabled' type='button' disabled>
                        <FaLock /> Complete course to unlock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div className='cc-tab-panel'>
                <h2>Rate This Course</h2>
                <p className='cc-tab-sub'>Share your experience after completing the full course.</p>

                {isPreviewMode ? (
                  <div className='cc-empty-state'>
                    <FaCheckCircle className='cc-empty-icon' />
                    <p>Add this course to your library to leave a review.</p>
                  </div>
                ) : courseCompletionPercent < 100 ? (
                  <div className='cc-review-gate'>
                    <p>Complete 100% of this course to unlock your review.</p>
                    <div className='cc-review-gate-bar'>
                      <div style={{ width: `${courseCompletionPercent}%` }} />
                    </div>
                    <span>{courseCompletionPercent}% complete — keep going!</span>
                  </div>
                ) : (
                  <>
                    {reviewSubmitted && (
                      <div className='cc-review-submitted-note'>
                        ✓ Your review has been submitted. Thank you!
                      </div>
                    )}

                    <form onSubmit={onReviewSubmit} className='cc-review-form'>
                      {/* Stars */}
                      <div className='cc-review-stars'>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type='button'
                            key={star}
                            className={`cc-star-btn ${star <= reviewRating ? 'active' : ''}`}
                            onClick={() => onReviewRatingChange && onReviewRatingChange(star)}
                            disabled={reviewSubmitted}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={reviewComment}
                        onChange={(e) => onReviewCommentChange && onReviewCommentChange(e.target.value)}
                        placeholder='Share your learning experience...'
                        rows={4}
                        disabled={reviewSubmitted}
                        className='cc-review-textarea'
                      />

                      {reviewRating > 0 && reviewRating < 3 && (
                        <>
                          <label className='cc-review-improve-label'>What can we improve?</label>
                          <textarea
                            value={reviewImprovement}
                            onChange={(e) => onReviewImprovementChange && onReviewImprovementChange(e.target.value)}
                            placeholder='Tell us where this course can be improved.'
                            rows={3}
                            disabled={reviewSubmitted}
                            className='cc-review-textarea'
                          />
                        </>
                      )}

                      <button
                        type='submit'
                        className='cc-review-submit-btn'
                        disabled={
                          reviewSaving ||
                          reviewRating < 1 ||
                          !String(reviewComment || '').trim() ||
                          reviewSubmitted ||
                          (reviewRating < 3 && !String(reviewImprovement || '').trim())
                        }
                      >
                        {reviewSubmitted ? 'Review Submitted' : reviewSaving ? 'Saving...' : 'Submit Review'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <div className='cc-player-sidebar'>

          <div className='cc-sidebar-course-info'>
            <button className='cc-sidebar-back-btn' onClick={onBackToDashboard} type='button'>
              <FaChevronLeft /> Back to Dashboard
            </button>
            <div className='cc-sidebar-course-title'>{title || 'Course'}</div>
            {teacherName && <div className='cc-sidebar-course-teacher'>by {teacherName}</div>}
            {teacherName && onViewTutorProfile && (
              <button className='cc-sidebar-back-btn cc-sidebar-tutor-btn' type='button' onClick={onViewTutorProfile}>
                View Tutor Profile
              </button>
            )}
            <div className='cc-sidebar-course-progress'>
              <div className='cc-sidebar-progress-row'>
                <span>{completionPercent}% complete</span>
                <span>{localCompletedIds.length}/{totalLessons} lessons</span>
              </div>
              <div className='cc-sidebar-bar'>
                <div style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          </div>

          <div className='cc-sidebar-header'>
            <span>Course content</span>
          </div>

          <div className='cc-sidebar-topics'>
            {topics.length === 0 ? (
              <p className='cc-sidebar-empty'>No lessons added yet.</p>
            ) : (
              topics.map((topic, ti) => {
                const isOpen = sidebarExpanded[topic.id] !== false
                const topicLessons = topic.lessons || []
                const completedInTopic = topicLessons.filter(l => {
                  const lid = String(l.id || `${topic.id}-${topicLessons.indexOf(l)}`)
                  return completedSet.has(lid)
                }).length

                return (
                  <div key={topic.id} className='cc-sidebar-topic'>
                    <button
                      className='cc-sidebar-topic-header'
                      onClick={() => toggleSidebarTopic(topic.id)}
                      type='button'
                    >
                      <div className='cc-sidebar-topic-left'>
                        {isOpen
                          ? <FaChevronDown className='cc-sidebar-chevron' />
                          : <FaChevronRight className='cc-sidebar-chevron' />}
                        <span className='cc-sidebar-topic-name'>{topic.title || `Section ${ti + 1}`}</span>
                      </div>
                      <span className='cc-sidebar-topic-meta'>{completedInTopic}/{topicLessons.length}</span>
                    </button>

                    {isOpen && topicLessons.length > 0 && (
                      <div className='cc-sidebar-lessons'>
                        {topicLessons.map((lesson, li) => {
                          const lessonId = String(lesson.id || `${topic.id}-${li}`)
                          const isDone = completedSet.has(lessonId)
                          const hasVideo = Boolean(lesson.videoURL)
                          const isActive = activeVideo && activeVideo.url === lesson.videoURL

                          return (
                            <div
                              key={lessonId}
                              className={`cc-sidebar-lesson ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}
                            >
                              <div className='cc-sidebar-lesson-check'>
                                <input
                                  type='checkbox'
                                  className='cc-sidebar-checkbox'
                                  checked={isDone}
                                  readOnly
                                  tabIndex={-1}
                                />
                              </div>
                              <div
                                className='cc-sidebar-lesson-info'
                                onClick={() => hasVideo && handleLessonClick(lesson, lessonId)}
                                style={{ cursor: hasVideo ? 'pointer' : 'default' }}
                              >
                                <span className='cc-sidebar-lesson-title'>{lesson.title || `Lesson ${li + 1}`}</span>
                                <div className='cc-sidebar-lesson-meta'>
                                  {lesson.type === 'video' && <FaPlayCircle className='cc-sidebar-lesson-type-icon' />}
                                  {lesson.type === 'notes' && <FaFileAlt className='cc-sidebar-lesson-type-icon' />}
                                  <span>{lesson.duration || ''}</span>
                                  {hasVideo && <span className='cc-sidebar-play-hint'>▶ Play</span>}
                                </div>
                              </div>
                              {onToggleLessonComplete && !isPreviewMode && (
                                <button
                                  className={`cc-sidebar-complete-btn ${isDone ? 'done' : ''}`}
                                  type='button'
                                  onClick={() => handleToggle(lessonId, { action: isDone ? 'undo' : 'complete', source: 'manual' })}
                                  title={isDone ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  {isDone ? '↩' : '✓'}
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CourseContent