import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import '../styles/lesson.css'
import { useNavigate, useLocation } from 'react-router-dom'
import CourseContent from '../components/Coursecontent'
import { db } from '../context/AuthContext'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const Lesson = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // ✅ Get courseId from navigation state OR localStorage
  const stateId = location.state?.courseId
  const storedId = localStorage.getItem('currentCourseId')
  const courseId = stateId || storedId

  const [topics, setTopics] = useState([
    { id: Date.now(), title: '', description: '', showDesc: true, lessons: [] }
  ])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [courseInfo, setCourseInfo] = useState({})

  // ✅ Save courseId to localStorage whenever we get a new one from navigation
  useEffect(() => {
    if (stateId) {
      localStorage.setItem('currentCourseId', stateId)
    }
  }, [stateId])

  // ✅ Load existing course data from Firestore on mount

  
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))
        if (courseDoc.exists()) {
          const data = courseDoc.data()
          setCourseInfo(data)
          if (data.topics && data.topics.length > 0) {
            setTopics(data.topics)
          }
        }
      } catch (err) {
        console.log('Error loading course:', err)
      }
    }
    loadData()
  }, [courseId])





  // ── Topic actions ──
  const addTopic = () => {
    setTopics([...topics, {
      id: Date.now(),
      title: '',
      description: '',
      showDesc: true,
      lessons: []
    }])
  }

  const updateTopic = (id, field, value) => {
    setTopics(topics.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const toggleDesc = (id) => {
    setTopics(topics.map(t => t.id === id ? { ...t, showDesc: !t.showDesc } : t))
  }

  const deleteTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id))
  }

  const duplicateTopic = (id) => {
    const topic = topics.find(t => t.id === id)
    const index = topics.indexOf(topic)
    const copy = { ...topic, id: Date.now(), lessons: [...topic.lessons] }
    const updated = [...topics]
    updated.splice(index + 1, 0, copy)
    setTopics(updated)
  }

  // ── Lesson actions ──
  const addLesson = (topicId) => {
    setTopics(topics.map(t => {
      if (t.id !== topicId) return t
      if (t.lessons.length >= 5) return t
      return {
        ...t,
        lessons: [...t.lessons, {
          id: Date.now(),
          title: '',
          type: 'video',
          duration: '',
          videoURL: '',
          editingTitle: true
        }]
      }
    }))
  }

  const updateLesson = (topicId, lessonId, field, value) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, lessons: t.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) }
        : t
    ))
  }

  const deleteLesson = (topicId, lessonId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, lessons: t.lessons.filter(l => l.id !== lessonId) }
        : t
    ))
  }

  const confirmLesson = (topicId, lessonId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, lessons: t.lessons.map(l => l.id === lessonId ? { ...l, editingTitle: false } : l) }
        : t
    ))
  }

  // ── Save to Firestore when Next is clicked ──
  const handleSave = async () => {
    if (!courseId) {
      setSaveMsg('⚠️ No course found. Please go back to Teacher page and create the course first.')
      return
    }

    setSaving(true)
    setSaveMsg('')

    try {
      // Clean topics — strip UI-only fields before saving
      const cleanTopics = topics.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        lessons: t.lessons.map(l => ({
          id: l.id,
          title: l.title,
          type: l.type,
          duration: l.duration,
          videoURL: l.videoURL || ''
        }))
      }))

      // ✅ Update the SAME course document that was created in Teacher.jsx
      await setDoc(doc(db, 'courses', courseId), {
        ...courseInfo,
        topics: cleanTopics,
        updatedAt: new Date().toISOString()
      })

      setSaveMsg('✅ Curriculum saved successfully!')
      setTimeout(() => setSaveMsg(''), 3000)

    } catch (err) {
      console.log('Save error:', err)
      setSaveMsg('❌ Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar solid />

      <div className='lesson-page'>

        {/* Header */}
        <div className='lesson-header'>
          <button className='lesson-back-btn' onClick={() => navigate('/curriculum')}>
            &#8592;
          </button>
          <h2>Curriculum</h2>
        </div>

        {/* Save message */}
        {saveMsg && (
          <div style={{
            textAlign: 'center',
            padding: '10px',
            margin: '10px auto',
            maxWidth: '500px',
            borderRadius: '8px',
            backgroundColor: saveMsg.includes('✅') ? '#d4edda' : '#f8d7da',
            color: saveMsg.includes('✅') ? '#155724' : '#721c24',
            fontWeight: '500'
          }}>
            {saveMsg}
          </div>
        )}

        {/* Outer container */}
        <div className='lesson-div'>
          <div className='lesson-body'>

            {topics.map((topic) => (
              <div key={topic.id} className='lesson-topic-block'>

                {/* Top bar */}
                <div className='lesson-topic-topbar'>
                  <span className='drag-icon'>&#8942;&#8942;</span>
                  <input
                    type='text'
                    className='lesson-topic-title'
                    placeholder='Topic Title...'
                    value={topic.title}
                    onChange={e => updateTopic(topic.id, 'title', e.target.value)}
                  />
                  <div className='lesson-topic-actions'>
                    <button title='Duplicate' onClick={() => duplicateTopic(topic.id)}>&#10697;</button>
                    <button title='Delete' onClick={() => deleteTopic(topic.id)}>&#128465;</button>
                    <button title='Toggle' onClick={() => toggleDesc(topic.id)}>
                      {topic.showDesc ? '∧' : '∨'}
                    </button>
                  </div>
                </div>

                {/* Description */}
                {topic.showDesc && (
                  <div className='lesson-topic-body'>
                    <textarea
                      className='lesson-textarea'
                      placeholder='Add a description for this topic...'
                      value={topic.description}
                      onChange={e => updateTopic(topic.id, 'description', e.target.value)}
                    />
                    <div className='lesson-topic-ok-row'>
                      <button className='lesson-cancel-btn' onClick={() => updateTopic(topic.id, 'showDesc', false)}>Cancel</button>
                      <button className='lesson-ok-btn' onClick={() => updateTopic(topic.id, 'showDesc', false)}>Ok</button>
                    </div>
                  </div>
                )}

                {/* Lessons list */}
                {topic.lessons.length > 0 && (
                  <div className='lesson-items-list'>
                    {topic.lessons.map((lesson, li) => (
                      <div key={lesson.id} className='lesson-item-row'>
                        <span className='lesson-item-icon'>
                          {lesson.type === 'video' ? '▶' : '📄'}
                        </span>

                        {lesson.editingTitle ? (
                          <div className='lesson-item-edit'>

                            <select
                              className='lesson-type-select'
                              value={lesson.type}
                              onChange={e => updateLesson(topic.id, lesson.id, 'type', e.target.value)}
                            >
                              <option value='video'>Video</option>
                              <option value='notes'>Notes / Article</option>
                            </select>

                            <input
                              type='text'
                              className='lesson-item-input'
                              placeholder='Lesson title...'
                              value={lesson.title}
                              onChange={e => updateLesson(topic.id, lesson.id, 'title', e.target.value)}
                            />

                            <input
                              type='text'
                              className='lesson-item-input lesson-item-duration'
                              placeholder='Duration e.g. 5:30'
                              value={lesson.duration}
                              onChange={e => updateLesson(topic.id, lesson.id, 'duration', e.target.value)}
                            />

                            {/* ✅ YouTube/Vimeo URL — only for video type */}
                            {lesson.type === 'video' && (
                              <input
                                type='text'
                                className='lesson-item-input lesson-item-url'
                                placeholder='Paste YouTube or Vimeo URL...'
                                value={lesson.videoURL}
                                onChange={e => updateLesson(topic.id, lesson.id, 'videoURL', e.target.value)}
                              />
                            )}

                            <button
                              className='lesson-item-ok'
                              onClick={() => confirmLesson(topic.id, lesson.id)}
                            >
                              Ok
                            </button>
                            <button
                              className='lesson-item-cancel'
                              onClick={() => deleteLesson(topic.id, lesson.id)}
                            >
                              &#128465;
                            </button>

                          </div>
                        ) : (
                          <div className='lesson-item-confirmed'>
                            <span className='lesson-item-name'>
                              {lesson.title || `Lesson ${li + 1}`}
                            </span>
                            <span className='lesson-item-dur'>{lesson.duration}</span>
                            {lesson.videoURL && (
                              <span className='lesson-item-video-tag'>🎬 Video linked</span>
                            )}
                            <button
                              className='lesson-item-edit-btn'
                              onClick={() => updateLesson(topic.id, lesson.id, 'editingTitle', true)}
                            >
                              Edit
                            </button>
                            <button
                              className='lesson-item-del'
                              onClick={() => deleteLesson(topic.id, lesson.id)}
                            >
                              &#128465;
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {topic.lessons.length >= 5 && (
                      <p className='lesson-max-note'>Maximum 5 lessons per topic reached.</p>
                    )}
                  </div>
                )}

                {/* Bottom action buttons */}
                <div className='lesson-topic-footer'>
                  <div className='lesson-footer-left'>
                    <button
                      className='lesson-action-btn'
                      onClick={() => addLesson(topic.id)}
                      disabled={topic.lessons.length >= 5}
                    >
                      &#43; Lesson
                    </button>
                    <button className='lesson-action-btn'>&#43; Quiz</button>
                    <button className='lesson-action-btn'>&#43; Certificate</button>
                  </div>
                  <div className='lesson-footer-right'>
                    <button className='lesson-import-btn'>&#8659; Import Quiz</button>
                  </div>
                </div>

              </div>
            ))}

            <button className='lesson-add-topic-btn' onClick={addTopic}>
              &#43; Add Topic
            </button>

          </div>

          {/* Footer nav — Next saves to Firestore */}
          <div className='lesson-footer-nav'>
            <button className='lesson-prev-btn' onClick={() => navigate('/curriculum')}>
              &#8249;
            </button>
            <button
              className='lesson-next-btn'
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Next ›'}
            </button>
          </div>

        </div>

        {/* Course Content Preview */}
        <div className='lesson-preview-label'>
          <h3>Course Content Preview</h3>
          <p>This is how your curriculum will appear to students.</p>
        </div>

        <CourseContent
          topics={topics}
          title={courseInfo.title}
          description={courseInfo.description}
          difficulty={courseInfo.difficulty}
          teacherName={courseInfo.teacherName}
        />

      </div>
    </>
  )
}

export default Lesson