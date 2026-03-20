import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import '../styles/lesson.css'
import { useNavigate, useLocation } from 'react-router-dom'
import CourseContent from '../components/Coursecontent'
import { db, auth } from '../context/AuthContext'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const Lesson = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const stateId = location.state?.courseId
  const storedId = localStorage.getItem('currentCourseId')
  const courseId = stateId || storedId

  const [topics, setTopics] = useState([
    { id: Date.now(), title: '', description: '', showDesc: true, lessons: [], quiz: [], showQuizBuilder: false }
  ])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [courseInfo, setCourseInfo] = useState({})
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => setAuthReady(true))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (stateId) localStorage.setItem('currentCourseId', stateId)
  }, [stateId])

  useEffect(() => {
    if (!authReady || !courseId) return
    const loadData = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))
        if (courseDoc.exists()) {
          const data = courseDoc.data()
          setCourseInfo(data)
          if (data.topics && data.topics.length > 0) {
            setTopics(data.topics.map(t => ({ ...t, showDesc: false, showQuizBuilder: false })))
          }
        }
      } catch (err) {
        console.log('Error loading course:', err)
      }
    }
    loadData()
  }, [authReady, courseId])

  // ── Topic actions ──
  const addTopic = () => {
    setTopics([...topics, {
      id: Date.now(), title: '', description: '',
      showDesc: true, lessons: [], quiz: [], showQuizBuilder: false
    }])
  }

  const updateTopic = (id, field, value) => {
    setTopics(topics.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const toggleDesc = (id) => {
    setTopics(topics.map(t => t.id === id ? { ...t, showDesc: !t.showDesc } : t))
  }

  const deleteTopic = (id) => setTopics(topics.filter(t => t.id !== id))

  const duplicateTopic = (id) => {
    const topic = topics.find(t => t.id === id)
    const index = topics.indexOf(topic)
    const copy = { ...topic, id: Date.now(), lessons: [...topic.lessons], quiz: [...(topic.quiz || [])] }
    const updated = [...topics]
    updated.splice(index + 1, 0, copy)
    setTopics(updated)
  }

  // ── Lesson actions ──
  const addLesson = (topicId) => {
    setTopics(topics.map(t => {
      if (t.id !== topicId || t.lessons.length >= 5) return t
      return {
        ...t,
        lessons: [...t.lessons, {
          id: Date.now(), title: '', type: 'video',
          duration: '', videoURL: '', editingTitle: true
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

  // ── Quiz actions ──
  const toggleQuizBuilder = (topicId) => {
    setTopics(topics.map(t =>
      t.id === topicId ? { ...t, showQuizBuilder: !t.showQuizBuilder } : t
    ))
  }

  const addQuestion = (topicId) => {
    setTopics(topics.map(t => {
      if (t.id !== topicId) return t
      if ((t.quiz || []).length >= 5) return t
      return {
        ...t,
        quiz: [...(t.quiz || []), {
          id: Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          editing: true
        }]
      }
    }))
  }

  const updateQuestion = (topicId, questionId, field, value) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? {
            ...t, quiz: t.quiz.map(q =>
              q.id === questionId ? { ...q, [field]: value } : q
            )
          }
        : t
    ))
  }

  const updateOption = (topicId, questionId, optionIndex, value) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? {
            ...t, quiz: t.quiz.map(q => {
              if (q.id !== questionId) return q
              const newOptions = [...q.options]
              newOptions[optionIndex] = value
              return { ...q, options: newOptions }
            })
          }
        : t
    ))
  }

  const confirmQuestion = (topicId, questionId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, quiz: t.quiz.map(q => q.id === questionId ? { ...q, editing: false } : q) }
        : t
    ))
  }

  const deleteQuestion = (topicId, questionId) => {
    setTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, quiz: t.quiz.filter(q => q.id !== questionId) }
        : t
    ))
  }

  // ── Save to Firestore ──
  const handleSave = async () => {
    if (!courseId) {
      setSaveMsg('⚠️ No course found. Please go back to Teacher page and create the course first.')
      return
    }
    setSaving(true)
    setSaveMsg('')
    try {
      const cleanTopics = topics.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        lessons: t.lessons.map(l => ({
          id: l.id, title: l.title, type: l.type,
          duration: l.duration, videoURL: l.videoURL || ''
        })),
        // ✅ Save quiz questions
        quiz: (t.quiz || []).map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex
        }))
      }))

      await setDoc(doc(db, 'courses', courseId), {
        ...courseInfo,
        topics: cleanTopics,
        updatedAt: new Date().toISOString()
      })
    
      /*
      setSaveMsg('✅ Curriculum saved successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
      */

      setSaveMsg('✅ Curriculum saved successfully!')
      setTimeout(() => {
      navigate('/teacher-dashboard')
      }, 1500)
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

        <div className='lesson-header'>
          <button className='lesson-back-btn' onClick={() => navigate('/curriculum')}>&#8592;</button>
          <h2>Curriculum</h2>
        </div>

        {saveMsg && (
          <div style={{
            textAlign: 'center', padding: '10px', margin: '10px auto',
            maxWidth: '500px', borderRadius: '8px',
            backgroundColor: saveMsg.includes('✅') ? '#d4edda' : '#f8d7da',
            color: saveMsg.includes('✅') ? '#155724' : '#721c24',
            fontWeight: '500'
          }}>
            {saveMsg}
          </div>
        )}

        <div className='lesson-div'>
          <div className='lesson-body'>
            {topics.map((topic) => (
              <div key={topic.id} className='lesson-topic-block'>

                {/* Top bar */}
                <div className='lesson-topic-topbar'>
                  <span className='drag-icon'>&#8942;&#8942;</span>
                  <input
                    type='text' className='lesson-topic-title'
                    placeholder='Topic Title...' value={topic.title}
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
                        <span className='lesson-item-icon'>{lesson.type === 'video' ? '▶' : '📄'}</span>
                        {lesson.editingTitle ? (
                          <div className='lesson-item-edit'>
                            <select className='lesson-type-select' value={lesson.type}
                              onChange={e => updateLesson(topic.id, lesson.id, 'type', e.target.value)}>
                              <option value='video'>Video</option>
                              <option value='notes'>Notes / Article</option>
                            </select>
                            <input type='text' className='lesson-item-input' placeholder='Lesson title...'
                              value={lesson.title} onChange={e => updateLesson(topic.id, lesson.id, 'title', e.target.value)} />
                            <input type='text' className='lesson-item-input lesson-item-duration' placeholder='Duration e.g. 5:30'
                              value={lesson.duration} onChange={e => updateLesson(topic.id, lesson.id, 'duration', e.target.value)} />
                            {lesson.type === 'video' && (
                              <input type='text' className='lesson-item-input lesson-item-url'
                                placeholder='Paste YouTube or Vimeo URL...'
                                value={lesson.videoURL} onChange={e => updateLesson(topic.id, lesson.id, 'videoURL', e.target.value)} />
                            )}
                            <button className='lesson-item-ok' onClick={() => confirmLesson(topic.id, lesson.id)}>Ok</button>
                            <button className='lesson-item-cancel' onClick={() => deleteLesson(topic.id, lesson.id)}>&#128465;</button>
                          </div>
                        ) : (
                          <div className='lesson-item-confirmed'>
                            <span className='lesson-item-name'>{lesson.title || `Lesson ${li + 1}`}</span>
                            <span className='lesson-item-dur'>{lesson.duration}</span>
                            {lesson.videoURL && <span className='lesson-item-video-tag'>🎬 Video linked</span>}
                            <button className='lesson-item-edit-btn' onClick={() => updateLesson(topic.id, lesson.id, 'editingTitle', true)}>Edit</button>
                            <button className='lesson-item-del' onClick={() => deleteLesson(topic.id, lesson.id)}>&#128465;</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {topic.lessons.length >= 5 && <p className='lesson-max-note'>Maximum 5 lessons per topic reached.</p>}
                  </div>
                )}

                {/* ✅ Quiz builder */}
                {topic.showQuizBuilder && (
                  <div className='quiz-builder'>
                    <div className='quiz-builder-header'>
                      <span>📝 Quiz Builder — {topic.title || 'This Topic'}</span>
                      <span className='quiz-count'>{(topic.quiz || []).length}/5 questions</span>
                    </div>

                    {(topic.quiz || []).map((q, qi) => (
                      <div key={q.id} className='quiz-question-block'>
                        {q.editing ? (
                          <>
                            <div className='quiz-question-row'>
                              <span className='quiz-q-num'>Q{qi + 1}.</span>
                              <input
                                type='text'
                                className='quiz-question-input'
                                placeholder='Type your question here...'
                                value={q.question}
                                onChange={e => updateQuestion(topic.id, q.id, 'question', e.target.value)}
                              />
                            </div>

                            <div className='quiz-options'>
                              {q.options.map((opt, oi) => (
                                <div key={oi} className='quiz-option-row'>
                                  <input
                                    type='radio'
                                    name={`correct-${q.id}`}
                                    checked={q.correctIndex === oi}
                                    onChange={() => updateQuestion(topic.id, q.id, 'correctIndex', oi)}
                                  />
                                  <input
                                    type='text'
                                    className='quiz-option-input'
                                    placeholder={`Option ${oi + 1}...`}
                                    value={opt}
                                    onChange={e => updateOption(topic.id, q.id, oi, e.target.value)}
                                  />
                                  {q.correctIndex === oi && (
                                    <span className='quiz-correct-tag'>✅ Correct</span>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className='quiz-question-actions'>
                              <button className='lesson-cancel-btn' onClick={() => deleteQuestion(topic.id, q.id)}>Delete</button>
                              <button className='lesson-ok-btn' onClick={() => confirmQuestion(topic.id, q.id)}>Save Question</button>
                            </div>
                          </>
                        ) : (
                          <div className='quiz-confirmed-row'>
                            <span className='quiz-confirmed-text'>Q{qi + 1}. {q.question || 'Untitled question'}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className='lesson-item-edit-btn' onClick={() => updateQuestion(topic.id, q.id, 'editing', true)}>Edit</button>
                              <button className='lesson-item-del' onClick={() => deleteQuestion(topic.id, q.id)}>&#128465;</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {(topic.quiz || []).length < 5 && (
                      <button className='quiz-add-question-btn' onClick={() => addQuestion(topic.id)}>
                        &#43; Add Question
                      </button>
                    )}
                    {(topic.quiz || []).length >= 5 && (
                      <p className='lesson-max-note'>Maximum 5 questions per topic reached.</p>
                    )}
                  </div>
                )}

                {/* Bottom action buttons */}
                <div className='lesson-topic-footer'>
                  <div className='lesson-footer-left'>
                    <button className='lesson-action-btn'
                      onClick={() => addLesson(topic.id)} disabled={topic.lessons.length >= 5}>
                      &#43; Lesson
                    </button>
                    <button
                      className={`lesson-action-btn ${topic.showQuizBuilder ? 'quiz-btn-active' : ''}`}
                      onClick={() => toggleQuizBuilder(topic.id)}
                    >
                      &#43; Quiz {topic.quiz && topic.quiz.length > 0 ? `(${topic.quiz.length})` : ''}
                    </button>
                    <button className='lesson-action-btn'>&#43; Certificate</button>
                  </div>
                  <div className='lesson-footer-right'>
                    <button className='lesson-import-btn'>&#8659; Import Quiz</button>
                  </div>
                </div>

              </div>
            ))}

            <button className='lesson-add-topic-btn' onClick={addTopic}>&#43; Add Topic</button>
          </div>

          <div className='lesson-footer-nav'>
            <button className='lesson-prev-btn' onClick={() => navigate('/curriculum')}>&#8249;</button>
            <button className='lesson-next-btn' onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Next ›'}
            </button>
          </div>
        </div>

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
          courseType={courseInfo.courseType}
        />

      </div>
    </>
  )
}

export default Lesson