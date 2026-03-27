import React from 'react'
import '../styles/courseCard.css'

const CourseCard = ({
  title,
  description,
  difficulty,
  regularPrice,
  salePrice,
  featuredImage,
  teacherName,
  maxStudents,
  courseType,
  isPreviewMode = false,
  completionPercent = 0,
  nextLessonTitle = '',
  previewPrice = 0,
  previewOwned = false,
  previewActionLoading = false,
  onPreviewAction
}) => {
  const effectivePrice = Number(salePrice || regularPrice || 0)

  return (
    <div className='course-card course-card-hero'>

      {/* Thumbnail */}
      <div className='course-card-image'>
        {featuredImage
          ? <img src={featuredImage} alt="Course thumbnail" />
          : <div className='course-card-image-placeholder'>
              <span>&#128444;</span>
              <p>Image</p>
            </div>
        }
      </div>

      {/* Card body */}
      <div className='course-card-body'>

        <h2 className='course-card-title'>
          {title || 'Your Course Title'}
        </h2>

        <p className='course-card-desc'>
          {description
            ? description.length > 100 ? description.slice(0, 100) + '...' : description
            : 'Your course description will appear here.'}
        </p>

        <p className='course-card-author'>
          <span>Created By</span>
          {teacherName || 'magical.africa Academy'}
        </p>

        <div className='course-card-meta'>
          <span className={`course-card-badge ${difficulty === 'Hard' ? 'badge-hard' : 'badge-beginner'}`}>
            {difficulty || 'Beginner'}
          </span>
          <span className='course-card-meta-text2'>
            {maxStudents ? `${maxStudents} Students` : 'No Students'}
          </span>
          {/* ✅ Dynamic course type */}
          <span className='course-card-type'>
            &#183; {courseType || 'General'}
          </span>
          <span className='course-card-meta-text'>&#183; All Levels</span>
        </div>

        <div className='course-card-footer course-card-footer-hero'>
          <div className='course-card-prices'>
            <span className='course-card-sale-price'>
              {effectivePrice > 0 ? `$${effectivePrice}` : 'Free'}
            </span>
            {effectivePrice > 0 && regularPrice && Number(regularPrice) > effectivePrice && (
              <span className='course-card-reg-price'>${regularPrice}</span>
            )}
          </div>

          <div className='course-card-hero-status'>
            <span className='course-card-status-pill'>Tutor curated</span>
            <span className='course-card-status-note'>Content-ready experience</span>
          </div>
        </div>

        <div className='course-card-mode-panel'>
          {isPreviewMode ? (
            <>
              <span className='course-card-mode-chip is-preview'>Preview Only</span>
              <p className='course-card-mode-copy'>Explore topics and lesson structure. Progress tracking starts once you begin learning.</p>
              <button
                className='course-card-preview-btn'
                type='button'
                onClick={onPreviewAction}
                disabled={previewActionLoading}
              >
                {previewOwned
                  ? 'Continue Course'
                  : previewActionLoading
                    ? 'Processing...'
                    : (previewPrice > 0 ? `Buy Course ($${previewPrice})` : 'Add Course')}
              </button>
            </>
          ) : (
            <>
              <span className='course-card-mode-chip is-learning'>Learning Active</span>
              <p className='course-card-mode-copy'>
                {nextLessonTitle ? `Next lesson: ${nextLessonTitle}` : 'You are caught up on lessons. Continue with quizzes and revision.'}
              </p>
              <div className='course-card-mode-progress'>
                <span>Progress</span>
                <strong>{completionPercent}%</strong>
              </div>
              <div className='course-card-mode-progress-bar'>
                <span style={{ width: `${completionPercent}%` }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard